#include <bits/stdc++.h>
using namespace std;
#include "tree.cpp"

Forest forest;



Node* getPerson() {
  string a;
  while (1) {
    cout << ">> " << flush;
    getline(cin, a);
    if (a.size()==0) {
      cout << "return null" << endl;
      return 0;
    }
    
    vector<Node*> rs=forest.findPersons(a);
    if (rs.size()==0) {
    } else if (rs.size()==1) {
      cout << "return " << rs[0]->person->name() << " <" << rs[0]->person->id << ">" << endl;
      return rs[0];
    } else {
      for (int i=0;i<rs.size();++i) {
        cout << i << ")" << endl;
        rs[i]->person->print();
        cout << endl;
      }
      int v;
      cin >> v;
      getline(cin, a);
      if (v>=0 && v<rs.size()) {
        cout << "return " << rs[v]->person->name() << " <" << rs[v]->person->id << ">" << endl;
        return rs[v];
      }
    }
    cout << "try again" << endl;
  }
  return 0;
}

int main() {
  ios_base::sync_with_stdio(0);cin.tie(0);
  string fname="forest_server";
  forest.load(fname);
  
  while (1) {
    string type;
    cout << "Give type: " << endl;
    cout << "1) find persons by name" << endl;
    cout << "2) find information of person" << endl;
    cout << "3) find relation of two persons" << endl;
    cout << "4) add person" << endl;
    cout << "5) add children" << endl;
    cout << "6) marry" << endl;
    cout << "7) divorce" << endl;
    cout << "8) export dot" << endl;
    cout << "9) export json" << endl;
    cout << "10) save" << endl;
    cout << "11) print all lonely persons" << endl;
    cout << "12) fix marriages" << endl;
    cout << "13) Print all persons without born data" << endl;
    cout << "14) Delete person" << endl;
    cout << "15) Information about components" << endl;
    cout << "16) Search for duplicates" << endl;
    cin >> type;
    
    if (type=="1") {
      string a;
      getline(cin, a);
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
      getline(cin, a);
      Node* n = getPerson();
      if (!n) {
        cout << "no person found" << endl << endl;
      } else {
        forest.printDetails(n);
      }
    } else if (type=="3") {
      string s;
      getline(cin, s);
      Node* a=getPerson();
      Node* b=getPerson();
      forest.findRelation(a, b);
    } else if (type=="4") {
      cout << "Name: " << endl;
      string name;
      getline(cin, name);
      getline(cin, name);
      while (name.size() && (name.back()=='\n' || name.back()=='\r')) name.pop_back();
      cout << "Male?: " << endl;
      bool ml;
      cin >> ml;
      string mdnm;
      if (!ml) {
        cout << "Maiden name: " << endl;
        getline(cin, mdnm);
        getline(cin, mdnm);
      }
      cout << "Born: " << endl;
      int born;
      cin >> born;
      cout << "Died: " << endl;
      int died;
      cin >> died;
      cout << "Details: " << endl;
      string details;
      getline(cin, details);
      getline(cin, details);
      while (details.size() && (details.back()=='\n' || details.back()=='\r')) details.pop_back();
      while (name.size() && (name.back()=='\n' || name.back()=='\r')) name.pop_back();
      while (mdnm.size() && (mdnm.back()=='\n' || mdnm.back()=='\r')) mdnm.pop_back();
      Node* n = forest.addPerson(name, mdnm, ml, born, died, details);
      cout << "added person <" << n->person->id << ">" << endl;
    } else if (type=="5") {
      Node* f,* m,* c;
      string s;
      getline(cin, s);
      cout << "Father: " << endl;
      f=getPerson();
      cout << "Mother: " << endl;
      m=getPerson();
      cout << "Children: " << endl;
      
      while (1) {
        c=getPerson();
        if (c==0) break;
        forest.addChild(f, m, c);
      }
    } else if (type=="6") {
      cout << "Give persons: " << endl;
      string t;
      getline(cin, t);
      
      Node* f, * m, * c;
      cout << "Husband: " << endl;
      f=getPerson();
      cout << "Wife: " << endl;
      m=getPerson();
      forest.marry(f, m);
      cout << "Children: " << endl;
      
      while (1) {
        c=getPerson();
        if (c==0) break;
        forest.addChild(f, m, c);
      }
    } else if (type=="7") {
      cout << "Give person: " << endl;
      string t;
      getline(cin, t);
      Node* n = getPerson();
      forest.divorce(n);
    } else if (type=="8") {
      cout << "Filename: " << endl;
      string fn;
      cin >> fn;
      forest.exportDot(fn);
    } else if (type=="9") {
      string fn="/var/www/html/st/data.json";
      vector<Node*> nodes;
      string t;
      getline(cin, t);
      while (1) {
        cout << "Give a person: " << endl;
        Node* n = getPerson();
        if (!n) break;
        nodes.push_back(n);
      }
      forest.extendBloodRelations(nodes, 1);
      cout << "nodes.size()=" << nodes.size() << endl;
      forest.exportJson(fn, nodes);
    } else if (type=="10") {
      forest.save(fname);
      cout << "saved!" << endl;
    } else if (type=="11") {
      vector<Node*> persons=forest.findForeverAlone();
      for (int i=0;i<persons.size();++i) {
        persons[i]->person->print();
      }
    } else if (type=="12") {
      vector<Node*> persons=forest.getPersons();
      for (int i=0;i<persons.size();++i) {
        if (persons[i]->father && persons[i]->mother) {
          bool married=0;
          for (int j=0;j<persons[i]->father->married.size();++j) {
            if (persons[i]->father->married[j].first==persons[i]->mother) {married=1; break;}
          }
          if (!married) {
            persons[i]->person->print();
            cout << " Father: " << endl;
            persons[i]->father->person->print();
            cout << " Mother: " << endl;
            persons[i]->mother->person->print();
            char t;
            cin >> t;
            if (t=='3' || t=='4' || t=='x') forest.marry( persons[i]->father, persons[i]->mother, t);
            else if (t=='q') break;
          }
        }
      }
    } else if (type=="13") {
      vector<Node*> persons=forest.getPersons();
      for (int i=0;i<persons.size();++i) {
        if (persons[i]->person->born<1000) {
          persons[i]->person->print();
        }
      }
    } else if (type=="14") {
      string t;
      getline(cin, t);
      Node* n = getPerson();
      if (n) forest.removePerson(n);
    } else if (type=="15") {
      vector<pair<int, int> > cmps;
      forest.countComponentInfo(cmps);
      cout << cmps.size() << endl;
      for (int i=0;i<cmps.size();++i) {
        cout << cmps[i].F << " " << cmps[i].S << endl;
      }
    } else if (type=="16") {
      vector<Node*> persons=forest.getPersons();
      for (int i=0;i<persons.size();++i) {
        for (int j=i+1;j<persons.size();++j) {
          if (persons[i]->person->gender != persons[j]->person->gender) continue;
          if (!Person::overLappingTConv(persons[i]->person->born, persons[j]->person->born)) continue;
          if (!Person::overLappingTConv(persons[i]->person->died, persons[j]->person->died)) continue;
          if (persons[i]->person->firstnames==persons[j]->person->firstnames){
            if (persons[i]->person->firstnames=="Herra" || persons[i]->person->firstnames=="Rouva") continue;
            if (persons[i]->person->surname!=persons[j]->person->surname) continue;
            cout << "DUPLICATE???" << endl;
            persons[i]->person->print();
            persons[j]->person->print();
          }
        }
      }
    }
  }
}
