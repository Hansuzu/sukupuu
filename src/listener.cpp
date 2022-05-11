#include "connection.cpp"
#include "connectionhandler.cpp"
#include <sys/socket.h>
#include <netinet/in.h>
#include <iostream>
using namespace std;

class Listener {
private:
  ConnectionHandler* connection_handler;
  bool created;
  int sock;
  int opt;
  struct sockaddr_in address;
  struct sockaddr_in address_client;
  int addrlen;
  
  vector<Connection*> connections;
  
  Connection* connection() {
    for (int i=0; i<connections.size(); ++i) {
      if (!connections[i]->is_active()) {
        return connections[i];
      }
    }
    connections.push_back(new Connection(connection_handler));
    cout << "new connection created, connections.size = " << connections.size() << endl;
    return connections.back();
  }
  
  int c200(){int a=0;for (auto t:connections)a+=t->c200();return a;}
  int c404(){int a=0;for (auto t:connections)a+=t->c404();return a;}
  
  int aq;
  int acf;
public:
  
  int create(int port) {
    sock = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
    if (!sock) {
      cerr << "socket creation failed" << endl;
      return 1;
    }
    
    opt = 1; 
    if (setsockopt(sock, SOL_SOCKET, SO_REUSEADDR | SO_REUSEPORT, &opt, sizeof(opt))) { 
      cerr << "setsocketopt failed" << endl;
      return 1;
    }
    
    address.sin_family = AF_INET; 
    address.sin_addr.s_addr = INADDR_ANY; 
    address.sin_port = htons(port);
    addrlen = sizeof(address);
    
    if (bind(sock, (struct sockaddr *)&address, addrlen)<0) { 
      cerr << "binding socket failed" << endl;
      return 1;
    }
    
    created = 1;
    return 0;
  }
  
  int start_listening(int max_connections, int stop_after) {
    if (!created) {
      cerr << "cannot start listening when socket is not succesfully created!" << endl;
      return 1;
    }
    if (listen(sock, max_connections) < 0) { 
      cerr << "starting listening failed" << endl;
      return 1;
    }
    
    int j=0;
    while (j++ < stop_after) {
      int new_socket = accept(sock, (struct sockaddr *)&address_client,  (socklen_t*)&addrlen);
      cout << "accept" << endl;
      if (new_socket >= 0) {
        Connection* c = connection();
        c->set_socket(new_socket);
        c->handle();
        ++aq;
      } else  {
        cerr << "accepting connection failed" << endl;
        ++acf;
      }
      if (j%10==0) {
        cout << j << " connections " << aq << " OK, " << acf << " FAILURES, " << connections.size() << " conns, " << c200() << " OK, " << c404() << " 404" << endl;
      }
      cout << "done" << endl;
    }
    return 0;
  }
  
  Listener(ConnectionHandler* ch):connection_handler(ch), created(0),aq(0),acf(0) {
  }
};