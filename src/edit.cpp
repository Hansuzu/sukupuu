#include <bits/stdc++.h>
using namespace std;
#include "tree.cpp"

Forest forest;

int main() {
  ios_base::sync_with_stdio(0);cin.tie(0);
  forest.load("forest");
  
  Node* a = forest.addPerson("Heikki", "", 1);
  Node* b = forest.addPerson("Helka", "", 0);
  Node* c = forest.addPerson("Jaakoppi", "", 1);
  forest.addChild(a, b, c);
  
  while (1) {
    string type;
    cout << "Give type: " << endl;
    cout << "1) find persons by name" << endl;
    cout << "2) find information of person by id" << endl;
    cout << "3) find relation of two persons" << endl;
    cin >> type;
    
    
    forest.save("forest");
  }
}