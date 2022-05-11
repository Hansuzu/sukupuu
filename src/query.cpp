#include <bits/stdc++.h>
using namespace std;
#include "tree.cpp"

Forest forest;

int main() {
  ios_base::sync_with_stdio(0);cin.tie(0);
  fores.load("forest");
  
  while (1) {
    string type;
    cout << "Give type: " << endl;
    cout << "1) find persons by name" << endl;
    cout << "2) find information of person by id" << endl;
    cout << "3) find relation of two persons" << endl;
    cout << "4) add person" << endl;
    cout << "5) add relation of persons" << endl;
    cout << "6) save" << endl;
    cin >> type;
    
    if (type=="1") {
      string a;
      getline(cin, a);
      vector<Node*> rs=forest.findPersons(a);
      if (rs.size()==0) {
        cout << "nothing" << endl << endl;
      } else {
        for (int i=0;i<rs.size();++i) {
          rs[i]->person->print();
          cout << endl;
        }
        cout << endl;
      }
    } else if (type=="2") {
      string a;
      cin >> a;
      int t=stoi(a);
      Node* n = forest.findById(t);
      if (!n) {
        cout << "invalid id" << endl << endl;
      } else {
        forest.printDetails(n);
      }
    } else if (type=="3") {
      string a, b;
      cin >> a >> b;
      int t=stoi(a);
      int v=stoi(b);
      forest.findRelation(forest.findById(t), forest.findById(v));
    } else if (type=="4") {
      cout << "Name: " << endl;
      string name;
      getline(cin, name);s
      getline(cin, name);
      while (name.size() && (name.back()=='\n' || name.back()=='\r')) name.pop_back();
      cout << "Male?: " << endl;
      bool ml;
      cin >> ml;
      cout << "Details: " << endl;
      string details;
      getline(cin, details);
      getline(cin, details);
      while (details.size() && (details.back()=='\n' || details.back()=='\r')) details.pop_back();
      forest.addPerson();
    } else if (type=="5") {
      
    } else if (type=="6") {
      fores.save("forest");
      cout << "saved!" << endl;
    }
  }
}