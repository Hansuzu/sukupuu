#include "src/server.cpp"
#include <fstream>
using namespace std;

string datafile;
string command_frontend;
int port=12345;

void configure(string key, istream& s) {
  if (key=="data") {
    s>>datafile;
  } else if (key=="port") {
    s>>port;
  }
}

int main() {
  ifstream f("config");
  string key;
  string eq;
  while (f>>key) {
    f >> eq;
    if (eq!="=") {
      cout << "ERROR IN CONFIG FILE! \n";
      return 1;
    }
    configure(key, f);
  }
  open_server(datafile, port);
}
