#include "connectionhandler.cpp"


#ifdef WIN32
    #include <winsock.h>
#else
    #include <sys/socket.h>
    #include <netinet/in.h>
#endif


#include <unistd.h>
#include <iostream>
using namespace std;

class Connection {
private:
  ConnectionHandler* connection_handler;
  bool active;
  int sock;
  
  int bin_size;
  int bout_size;
  char* buffer_in;
  char* buffer_out;
  
  char* in_ptr;
  char* out_ptr;
  
  int a200;
  int a404;
  
  map<string, string> response;
  string responseStr;
  
  
  void httpok() {
    strcpy(out_ptr, "HTTP/1.1 200 OK\n");
    out_ptr+=16;
  }
  
  void http404() {
    strcpy(out_ptr, "HTTP/1.1 404 Not Found\n");
    out_ptr+=23;
  }
  void acao() {
    strcpy(out_ptr, "Access-Control-Allow-Origin: *\n");
    out_ptr+=31;
  }
  
  void prepare_out_header() {
    httpok();
    acao();
    out_ptr++[0]='\n';
  }
  void clear_response() {
    response.clear();
    responseStr.clear();
  }
  
  void write_out_response_from_map(){
    out_ptr++[0]='{';
    int p=0;
    for (auto& t : response) {
      if (p++) {
        out_ptr++[0]=',';
      }
      
      out_ptr++[0]='"';
      
      for (int i=0;i<t.first.size();++i){
        if (t.first[i]=='"') {
          out_ptr++[0]='\\';
          out_ptr++[0]='"';
        } else if (t.first[i]=='\\'){
          out_ptr++[0]='\\';
          out_ptr++[0]='\\';
        } else {
          out_ptr++[0]=t.first[i];
        }
      }
      out_ptr++[0]='"';
      
      out_ptr++[0]=':';
      
      strcpy(out_ptr, t.second.c_str());
      out_ptr+=t.second.size();
    }
    out_ptr++[0]='}';
  }
  
  void write_out_response() {
    if (responseStr.size()){
      //TODO: optimize...
      for (int i=0;i<responseStr.size();++i)out_ptr++[0]=responseStr[i];
    } else write_out_response_from_map();
  }
  
  void prepare_out_failure_header() {
    http404();
    acao();
    out_ptr++[0]='\n';
  }
  
  struct HTTP {
    enum Method {
      GET, HEAD, POST, PUT, _DELETE, CONNECT, OPTIONS, TRACE, PATCH, UNKNOWN
    };
    Method method;
    vector<string> path;
  };
  
  HTTP details;
  
  
  void parse_input() {
    
    details.method = HTTP::Method::UNKNOWN;
    details.path.clear();
    
    string word="";
    int state = 0;
    bool llbr = false;
    in_ptr=buffer_in;
    for (int i=0;i<bin_size && buffer_in[i];++i, ++in_ptr) {
      if (buffer_in[i]==' ') {
        if (word.size() == 0) continue;
        if (state == 0) {
          if (word == "GET") {
            details.method = HTTP::Method::GET;
          } else if (word == "HEAD") {
            details.method = HTTP::Method::HEAD;
          } else if (word == "POST") {
            details.method = HTTP::Method::POST;
          } else if (word == "PUT") {
            details.method = HTTP::Method::PUT;
          } else if (word == "DELETE") {
            details.method = HTTP::Method::_DELETE;
          } else if (word == "CONNECT") {
            details.method = HTTP::Method::CONNECT;
          } else if (word == "OPTIONS") {
            details.method = HTTP::Method::OPTIONS;
          } else if (word == "TRACE") {
            details.method = HTTP::Method::TRACE;
          } else if (word == "PATCH") {
            details.method = HTTP::Method::PATCH;
          } else {
            details.method = HTTP::Method::UNKNOWN;
          }
        } else if (state == 1) {
          stringstream ss(word);
          string w;
          while (getline(ss, w, '/')) {
            if (w.size()) {
              details.path.push_back(w);
            }
          }
        }
        word = "";
        ++state;
      } else if (buffer_in[i]=='\n') {
        if (llbr) break;
        llbr = true;
      } else if (buffer_in[i]!='\r'){
        word.push_back(buffer_in[i]);
        llbr = false;
      }
    }
    ++in_ptr;
  }
  
public:
  
  void set_socket(int sock) {
    this->sock = sock;
    active = sock;
  }
  
  void ok() {
    
  }
  
  void handle() {
    cout << "handle" << endl;
    int valread = read(sock, buffer_in, bin_size);
    buffer_in[valread] = 0;
//     cout << buffer_in << endl << endl;
    
    parse_input();
    out_ptr = buffer_out;
    if (details.method == HTTP::Method::GET || details.method == HTTP::Method::POST) {
      clear_response();
      if (details.method == HTTP::Method::GET ? connection_handler -> handle_get_request(details.path, response, responseStr) : connection_handler -> handle_post_request(details.path, in_ptr, response, responseStr)) {
        prepare_out_failure_header();
        out_ptr[0]='\0';
        ++a404;
      } else {
        prepare_out_header();
        write_out_response();
        out_ptr[0]='\0';
        ++a200;
      }
    } else {
      prepare_out_failure_header();
      out_ptr[0]='\0';
      ++a404;
    }
    
    cout << "send" << endl;
    send(sock, buffer_out, strlen(buffer_out), 0); 
    cout << "close" << endl;
    close(sock);
    active = 0;
    cout << "handle done" << endl;
  }
  
  
  bool is_active() {
    return active;
  }
  
  int c200(){return a200;}
  int c404(){return a404;}
  
  Connection(ConnectionHandler* ch):connection_handler(ch), active(0),a200(0),a404(0) {
    bin_size = 65536;
    bout_size = 100111222;
    buffer_in = new char[bin_size+1];
    buffer_out = new char[bout_size+1];
  }
};
