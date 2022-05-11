#include <bits/stdc++.h>
#include "connectionhandler.cpp"
#include "listener.cpp"
using namespace std;

  
int open_server(string filename, int port) { 
  ConnectionHandler c;
  c.useForest(filename);
  
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