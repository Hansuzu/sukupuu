#include <bits/stdc++.h>
#include "connectionhandler.cpp"
#include "listener.cpp"
using namespace std;

const int port = 12345;
  
int main() {
  ConnectionHandler c;
  c.useForest("forest_server");
  
  Listener l(&c);
  if (l.create(port)) {
    cerr << "socket creation failed" << endl;
    return 1;
  }
  cout << "socket creation successfully completed, port " << port << endl;
  if (l.start_listening(SOMAXCONN, 1000000000)) {
    cerr << "error while listening" << endl;
    return 1;
  }
  
}