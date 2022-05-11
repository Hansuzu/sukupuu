#include <vector>
#include <string>
#include <fstream>
#include <sstream>
#include "person.cpp"
#include "sermap.cpp"
#include "defs.h"
using namespace std;


#ifndef TREE_CPP
#define TREE_CPP
#define F first
#define S second

#define EPARAM_TYPE_LONG    "type"
#define EPARAM_ID_LONG      "id"
#define EPARAM_A_LONG       "person_a"
#define EPARAM_B_LONG       "person_b"
#define EPARAM_DATE0_LONG   "date_0"
#define EPARAM_DATE1_LONG   "date_1"
#define EPARAM_DETAILS_LONG "details"

#define EPARAM_TYPE_SHORT    "t"
#define EPARAM_ID_SHORT      "i"
#define EPARAM_A_SHORT       "a"
#define EPARAM_B_SHORT       "b"
#define EPARAM_DATE0_SHORT   "x"
#define EPARAM_DATE1_SHORT   "y"
#define EPARAM_DETAILS_SHORT "D"

struct Edge {
  char type;
  int id;
  int date0;
  int date1;
  int a, b;
  string details;
  
  string serialize(bool unc = false) {
    map<string, string> vls;
    vls[unc?EPARAM_TYPE_LONG:EPARAM_TYPE_SHORT]=type;
    vls[unc?EPARAM_ID_LONG:EPARAM_ID_SHORT]=to_string(id);
    vls[unc?EPARAM_A_LONG:EPARAM_A_SHORT]=to_string(a);
    vls[unc?EPARAM_B_LONG:EPARAM_B_SHORT]=to_string(b);
    if (date0)  vls[unc?EPARAM_DATE0_LONG:EPARAM_DATE0_SHORT]=to_string(date0);
    if (date1)  vls[unc?EPARAM_DATE1_LONG:EPARAM_DATE1_SHORT]=to_string(date1);
    if (details.size()) vls[unc?EPARAM_DETAILS_LONG:EPARAM_DETAILS_SHORT]=details;
    
    string rv;
    sermap::serialize(vls, rv);
    return rv;
  }
  
  int deserialize(string& s) {
    map<string, string> vls;
    if (sermap::deserialize(s, vls)) {
      cerr << "deserialization failed!";
      return 1;
    }
    if (     !(vls.count(EPARAM_ID_SHORT) || vls.count(EPARAM_ID_LONG))
         ||  !(vls.count(EPARAM_TYPE_SHORT) || vls.count(EPARAM_TYPE_LONG))
         ||  !(vls.count(EPARAM_A_SHORT) || vls.count(EPARAM_A_LONG))
         ||  !(vls.count(EPARAM_B_SHORT) || vls.count(EPARAM_B_LONG))
       ) {
      cerr << "invalid data";
      return 1;
    }
    if (vls.count(EPARAM_ID_SHORT)) id=stoi(vls[EPARAM_ID_SHORT]);
    else id=stoi(vls[EPARAM_ID_LONG]);
    
    if (vls.count(EPARAM_TYPE_SHORT)) type=vls[EPARAM_TYPE_SHORT][0];
    else type=vls[EPARAM_TYPE_LONG][0];
    
    if (vls.count(EPARAM_A_SHORT)) a=stoi(vls[EPARAM_A_SHORT]);
    else a=stoi(vls[EPARAM_A_LONG]);
    
    if (vls.count(EPARAM_B_SHORT)) b=stoi(vls[EPARAM_B_SHORT]);
    else b=stoi(vls[EPARAM_B_LONG]);
    
    date0=0;
    if (vls.count(EPARAM_DATE0_SHORT)) date0=stoi(vls[EPARAM_DATE0_SHORT]);
    else if (vls.count(EPARAM_DATE0_LONG))date0=stoi(vls[EPARAM_DATE0_LONG]);
    
    date1=0;
    if (vls.count(EPARAM_DATE1_SHORT)) date1=stoi(vls[EPARAM_DATE1_SHORT]);
    else if (vls.count(EPARAM_DATE1_LONG)) date1=stoi(vls[EPARAM_DATE1_LONG]);
    
    if (vls.count(EPARAM_DETAILS_SHORT)) details=vls[EPARAM_DETAILS_SHORT];
    else if (vls.count(EPARAM_DETAILS_LONG)) details=vls[EPARAM_DETAILS_LONG];
    
    return 0;
  }
  
  bool operator<(const Edge& o) {
    // current marriage is largest
    if (type=='3' && o.type!='3') return 0;
    if (o.type=='3' && type!='3') return 1;
    // otherwise sort by value of date0
    return Person::tconv(date0)<Person::tconv(o.date0);
  }
};


struct Node {
  Person* person;
  Node* father; Edge* fe;
  Node* mother; Edge* me;
  vector<pair<Node*, Edge*> > children;
  vector<pair<Node*, Edge*> > married;
  Node() : person(0),father(0),fe(0),mother(0),me(0),u(0) { }
  
  // tmp values...
  // used for dfs
  int u;
  Node* prev;
  bool operator<(const Node& o) {
    return *person<*(o.person);
  }
  bool lonely(){
    return !(father || mother || children.size() || married.size());
  }
  
  void addMarriage(Node* o, Edge* e) {
    married.push_back({0, 0});
    int i;
    for (i=married.size()-2;i>=0 && *(married[i].S)<*e;--i) swap(married[i], married[i+1]);
    married[i+1]={o, e};
  }
  void removeMarriage(Node* o) {
    int i=0;
    for (i=0;i<married.size();++i) {
      if (married[i].F==o) break;
    }
    for (;i+1<married.size();++i) swap(married[i], married[i+1]);
    married.pop_back();
  }
};


bool compareNodeEdgePairs(const pair<Node*, Edge*>& a, const pair<Node*, Edge*>& b) {
  if (!a.F) return 1;
  if (!b.F) return 0;
  return *(a.F)<*(b.F);
} 

// Forest: contains list of all nodes
// can be saved and loaded
// supports queries: finding details, modifying data etc.

class Forest {
private:
  vector<Node*> nodes;
  map<int, Node*> uids; // map identifier of person to node.
  map<int, Edge*> eids;
  vector<Edge*> edges;
  // DEPRECATED
  vector<pair<pair<int, int>, int> > es;
  
  void removeEdge(int eid) { // ONLY REMOVES THE EDGE, NOT REFERENCES TO IT!!!, REFERENCES MUST BE HANDLED SEPARATELY
    if (!eids.count(eid)) return;
    Edge* e=eids[eid];
    for (int i=0;i<edges.size();++i){
      if (edges[i]==e) {
        swap(edges[i], edges[edges.size()-1]);
        edges.pop_back();
        break;
      }
    }
    eids.erase(eid);
  }
  void removeChild(Node* parent, int child) { // FINDS THE REFERENCE TO CHILD IN PARENT AND REMOVES IT, DOESN'T DO ANYTHING ELSE, EDGE MUST BE REMOVED SEPARATELY, ALSO CHILDS REFERENCE TO PARENT MUST BE REMOVED SEPARATELY
    for (int i=0;i<parent->children.size();++i) {
      if (parent->children[i].F->person->id == child) {
        swap(parent->children[i], parent->children[parent->children.size()-1]);
        parent->children.pop_back();
        break;
      }
    }
  }
public:
  
  Node* createPerson() {
    Person* p = new Person();
    p->id=rand();
    while (uids.count(p->id) || !p->id) p->id=rand();
    Node* n = new Node();
    n->person = p;
    nodes.push_back(n);
    uids[p->id]=n;
    return n;
  }
  
  Edge* createEdge() {
    Edge* e = new Edge();
    e->id=rand();
    while (!e->id || eids.count(e->id)) e->id=rand();
    edges.push_back(e);
    eids[e->id]=e;
    return e;
  }
  
  void load(string fname) {
    ifstream f(fname);
    string line;
    int ph=0;
    while(getline(f, line)) {
      int a=0;
      int b=line.size()-1;
      while (a+1<line.size() && (line[a]==' ' || line[a]=='\t' || line[a]=='\n' || line[a]=='\r')) ++a;
      while (b-1>=0 && (line[b]==' ' || line[b]=='\t' || line[b]=='\n' || line[b]=='\r')) --b;
      line = line.substr(a, max(b-a+1, 0));
      if (!line.size()) continue;
      
      if (line=="PERSONS{") ph=1;
      else if (line=="}") ph=0;
      else if (line=="RELATIONS{") ph=2;
      else if (line=="}") ph=0;
      else if (line=="EDGES{") ph=3;
      else if (line=="}") ph=0;
      else if (ph==1) {
        Person* p = new Person();
        if (p->deserialize(line)) {
          delete p;
          continue;
        }
        Node* n = new Node();
        n->person = p;
        uids[p->id]=n;
        nodes.push_back(n);
      } else if (ph==2) {
        Edge* e = new Edge();
        if (e->deserialize(line)) {
          delete e;
          continue;
        }
        eids[e->id]=e;
        edges.push_back(e);
      } else if (ph==3) {
        stringstream ss(line);
        int a, b;
        char e;
        ss >> a >> e >> b;
        es.push_back({{a, b}, e});
      }
    }
    f.close();
    // handle edges
    // DEPRECATED
    for (int i=0;i<es.size();++i) {
      int ida = es[i].first.first;
      int idb = es[i].first.second;
      
      char tp=es[i].second;
      Edge* e = createEdge();
      e->type=tp;
      e->a=ida;
      e->b=idb;
    }
    
    for (int i=0;i<edges.size();++i) {
      Edge* e = edges[i];
      if (!uids.count(e->a) || !uids.count(e->b) || !eids.count(e->id)) {
        cerr << "invalid edge " << edges[i]->id << endl;
        continue;
      }
      
      char tp=e->type;
      
      Node* a = uids[e->a];
      Node* b = uids[e->b];
      if (tp == 'F' && a->father) {
        cerr << "lol, cannot set father for " << e->a << " " << tp << " " << e->b << endl;
        continue;
      }
      if (tp == 'M' && a->mother) {
        cerr << "lol, cannot set another mother for " << e->a << " " << tp << " " << e->b << endl;
        continue;
      }
      if (tp=='F' && !b->person->gender) {
        cerr << "lol, father must be male " << e->a << " " << tp << " " << e->b << endl;
        continue;
      }
      if (tp=='M' && b->person->gender) {
        cerr << "lol, mother must be female " << e->a << " " << tp << " " << e->b << endl;
        continue;
      }
      if ((tp=='x' || tp=='3' || tp=='4') && b->person->gender==a->person->gender) {
        cerr << "lol, marriage is between man and woman only " << e->a << " " << tp << " " << e->b << endl;
        continue;
      }
      
      
      if (tp=='F') {
        a->father = b; a->fe=e;
        b->children.push_back({a, e});
      } else if (tp=='M') {
        a->mother = b; a->me=e;
        b->children.push_back({a, e});
      } else if (tp=='x' || tp=='3' || tp=='4') {
        a->addMarriage(b, e);
        b->addMarriage(a, e);
      } else {
        cerr << "Invalid edge type, tp='" << tp << "'" << endl;
      }
    }
  }
  
  void save(string fname) {
    ofstream f(fname);
    f << "PERSONS{" << endl;
    for (int i=0;i<nodes.size();++i) {
      f << "\t" << nodes[i]->person->serialize() << endl;
    }
    f << "}" << endl;
    f << endl;
    f << "RELATIONS{" << endl;
    for (int i=0;i<edges.size();++i) {
      if (!uids.count(edges[i]->a) || !uids.count(edges[i]->b) || !eids.count(edges[i]->id)) {
        cerr << "invalid edge " << edges[i]->id << endl;
        continue;
      }
      f << "\t" << edges[i]->serialize() << endl;
    }
    f << "}" << endl;
    f << endl;
    /* DEPRECATED
    f << "EDGES{" << endl;
    for (int i=0;i<nodes.size();++i) {
      if (nodes[i]->father) f << "\t" << nodes[i]->person->id << " " << nodes[i]->fe->id << " " << nodes[i]->father->person->id << endl;
      if (nodes[i]->mother) f << "\t" << nodes[i]->person->id << " " << nodes[i]->me->id <<" " << nodes[i]->mother->person->id << endl;
      
      if (nodes[i]->person->gender) {
        for (int j=0;j<nodes[i]->married.size();++j) {
          Node* o = nodes[i]->married[j].F;
          if (!o) continue;
          f << "\t" << nodes[i]->person->id << " " << nodes[i]->married[j].S->id << " " << o->person->id << endl;
        }
      }
    }
    f << "}" << endl;
    */
    f.close();
  }
  
  
  
  Node* addPerson(string name, string mdnm, bool male, int born, int died, string details) {
    Node* n = createPerson();
    
    Person* p = n->person;
    p->setName(name);
    p->maidenname=mdnm;
    p->gender = male;
    p->born = born;
    p->died = died;
    p->details = details;
    return n;
  }
  
  void removePerson(Node* person) {
    removeAllChildren(person);
    removeAllMarriages(person);
    int id=person->person->id;
    for (int i=0;i<nodes.size();++i) {
      if (nodes[i]==person) {
        swap(nodes[i], nodes[nodes.size()-1]);
        nodes.pop_back();
        break;
      }
    }
    uids.erase(id);
    
  }
  
  
  void removeAllChildren(Node* person) {
    for (int i=0;i<person->children.size();++i) {
      if (person->children[i].F->father == person) {
        person->children[i].F->father=nullptr;
        person->children[i].F->fe=nullptr;
      }
      if (person->children[i].F->mother == person) {
        person->children[i].F->mother=nullptr;
        person->children[i].F->me=nullptr;
      }
      removeEdge(person->children[i].S->id);
    }
    person->children.clear();
  }
  
  void removeAllMarriages(Node* person) {
    for (int i=0;i<person->married.size();++i) {
      person->married[i].F->removeMarriage(person);
      removeEdge(person->married[i].S->id);
    }
    person->married.clear();
  }
  
  
  int addChild(Node* father, Node* mother, Node* child, bool overriding=false) {
    if (!father && !mother && !overriding) return 0;
    if (!child) return 1;
    if (father && !father->person->gender) {
      cerr << "cannot add child, father must be male" << endl;
      return 2;
    }
    if (mother && mother->person->gender) {
      cerr << "cannot add child, mother must be female" << endl;
      return 3;
    }
    if (child->father) {
      if (!overriding && father) {
        cerr << "cannot add child, father already exists" << endl;
        return 4;
      } else if (overriding) {
        removeChild(child->father, child->person->id);
        child->father=nullptr;
        removeEdge(child->fe->id);
        child->fe=nullptr;
      }
    }
    if (child->mother) {
      if (!overriding && mother) {
        cerr << "cannot add child, mother already exists" << endl;
        return 5;
      } else if (overriding) {
        removeChild(child->mother, child->person->id);
        child->mother=nullptr;
        removeEdge(child->me->id);
        child->me=nullptr;
      }
    }
    if (father) {
      Edge* e=createEdge();
      e->type='F';
      e->a=child->person->id;
      e->b=father->person->id;
      father->children.push_back({child, e});
      child->father = father; child->fe=e;
    }
    if (mother) {
      Edge* e=createEdge();
      e->type='M';
      e->a=child->person->id;
      e->b=mother->person->id;
      mother->children.push_back({child, e});
      child->mother = mother; child->me=e;
    }
    return 0;
  }
  
  void divorce(Node* a) { // TODO: reimplement...
    if (a->married.size() && a->married.back().S->type=='3') {
      a->married.back().S->type='x';
      a->married.back().F->married.back().S->type='x';
    } else {
      cerr << "cannot divorce, not married";
    }
  }
  
  void marry(Node* a, Node* b) {
    if (a->person->gender==b->person->gender) {
      cerr << "cannot marry, same gender" << endl;
      return;
    }
    if (!a->person->gender) swap(a, b);
    if ((a->married.size() && a->married.back().S->type=='3') || (b->married.size() && b->married.back().S->type=='3')) {
      cerr << "cannot marry, one of them is already married" << endl;
      return;
    }
    Edge* e=createEdge();
    e->a=a->person->id;
    e->b=b->person->id;
    e->type='3';
    a->addMarriage(b, e);
    b->addMarriage(a, e);
    cout << "married!" << endl;
  }
  void marry(Node* a, Node* b, char type) {
    if (a->person->gender==b->person->gender) {
      cerr << "cannot marry, same gender" << endl;
      return;
    }
    if (!a->person->gender) swap(a, b);
    if (type=='3') marry(a, b);
    else if (type=='4') {
      Edge* e=createEdge();
      e->type='4';
      e->a=a->person->id;
      e->b=b->person->id;
      a->addMarriage(b, e);
      b->addMarriage(a, e);
    } else if (type=='x') {
      Edge* e=createEdge();
      e->type='x';
      e->a=a->person->id;
      e->b=b->person->id;
      a->addMarriage(b, e);
      b->addMarriage(a, e);
    } else {
      cerr << "cannot marry, invalid type '" << type << "'" << endl;
    }
  }
  
  bool match(char a, char b) {
    if ('a'<=a && a<='z') a+='A'-'a';
    if ('a'<=b && b<='z') b+='A'-'a';
    return a==b;
  }
  bool match(string a, string& b) {
    for (int i=0;i<=(int)a.size()-(int)b.size();++i) {
      bool ok=1;
      for (int j=0;j<b.size();++j) {
        if (!match(a[i+j], b[j])) {ok=0;break;}
      }
      if (ok) return 1;
    }
    return 0;
  }
  
  void printDetails(Node* node) {
    node->person->print();
    cout << endl;
    cout << "Father: " << endl;
    if (node->father) node->father->person->print();
    else cout << "unknown" << endl;
    cout << endl;
    cout << "Mother: " << endl;
    if (node->mother) node->mother->person->print();
    else cout << "unknown" << endl;
    cout << endl;
    cout << "Children: " << endl;
    for (int i=0;i<node->children.size();++i) {
      node->children[i].F->person->print();
      cout << endl;
    }
  }
  
  bool dobfs(Node* a, Node* t) {
    vector<Node*> bfs;
    a->u=1;
    bfs.push_back(a);
    bool f=0;
    for (int i=0;i<bfs.size() && !f;++i) {
      Node* c=bfs[i];
      if (c->father && !c->father->u) {
        c->father->u=1;
        c->father->prev=c;
        if (c->father == t) f=1;
        bfs.push_back(c->father);
      }
      if (c->mother && !c->mother->u) {
        c->mother->u=1;
        c->mother->prev=c;
        if (c->mother == t) f=1;
        bfs.push_back(c->mother);
      }
      for (int j=0;j<c->married.size();++j) {
        Node* w = c->married[j].F;
        if (!w) continue;
        if (w->u) continue;
        w->u=1;
        w->prev=c;
        if (w==t) f=1;
        bfs.push_back(w);
      }
      for (int j=0;j<c->children.size();++j) {
        Node* w = c->children[j].F;
        if (w->u) continue;
        w->u=1;
        w->prev=c;
        if (w==t) f=1;
        bfs.push_back(w);
      }
    }
    for (int i=0;i<bfs.size();++i) bfs[i]->u=0;
    return f;
  }
  void findRelation(Node* a, Node* b) {
    if (!dobfs(b, a)) {
      cout << "no relation found." << endl;
    }
    cout << "Found relation: " << endl;
    Node* c = a;
    while (c!=b) {
      Node* w = c->prev;
      cout << c->person->name() << " -> " << w->person->name();
      if (w==c->father) cout << " father" << endl;
      else if (w==c->mother) cout << " mother" << endl;
      else {
        bool f=0;
        for (int i=0;i<c->married.size();++i) {
          Node* ww = c->married[i].F;
          if (!ww) continue;
          if (ww==w) {
            if (i==c->married.size()-1) {
              if (ww->person->gender) cout << " husband" << endl;
              else cout << " wife" << endl;
            } else {
              if (ww->person->gender) cout << " ex-husband" << endl;
              else cout << " ex-wife" << endl;
            }
            f=1;
            break;
          }
        }
        if (!f) cout << " child" << endl;
      }  
      c=w;
    }
  }
  
  void exportDot(string fn) {
    ofstream f(fn);
    f << "digraph {" << endl;
    
    for (int i=0;i<nodes.size();++i) {
      f << "\t" << nodes[i]->person->id << "[label=\""+nodes[i]->person->name()+"\"];" << endl;
    }
    set<string> mr;
    for (int i=0;i<nodes.size();++i) {
      if (nodes[i]->father && nodes[i]->mother) {
        string s="\""+to_string(nodes[i]->father->person->id)+"a"+to_string(nodes[i]->mother->person->id)+"\"";
        if (!mr.count(s)) {
          f << "\t" << s << "[label=\"\"];" << endl;
          f << "\t" << nodes[i]->father->person->id << " -> " << s << ";" << endl;
          f << "\t" << nodes[i]->mother->person->id << " -> " << s << ";" << endl;
          mr.insert(s);
        }
        f << "\t" << s << " -> " << nodes[i]->person->id << endl;
      } else if (nodes[i]->father) f << "\t" << nodes[i]->father->person->id << " -> " << nodes[i]->person->id  << ";" << endl;
      else if (nodes[i]->mother) f << "\t" << nodes[i]->mother->person->id << " -> " << nodes[i]->person->id << ";" << endl;
      
      
      if (nodes[i]->person->gender) {
        for (int j=0;j<nodes[i]->married.size();++j) {
          Node* o = nodes[i]->married[j].F;
          if (!o) continue;
          string s="\""+to_string(nodes[i]->person->id)+"a"+to_string(o->person->id)+"\"";
          if (!mr.count(s)) {
            f << "\t" << s << "[label=\"\"];" << endl;
            f << "\t" << nodes[i]->person->id << " -> " << s << ";" << endl;
            f << "\t" << o->person->id << " -> " << s << ";" << endl;
            mr.insert(s);
          }
        }
      }
    }
    f << "}" << endl;
    f.close();
  }
  
  void writeJson(ostream& f, const vector<Node*>& nodes) {
    unordered_set<int> cuids;
    for (int i=0; i<nodes.size(); ++i) cuids.insert(nodes[i]->person->id);
    f << "{";
    
    for (int i=0;i<nodes.size();++i) {
      f << "\"" << nodes[i]->person->id << "\":{";
      f << "\"" << KEY_GENDER << "\":\"" << (nodes[i]->person->gender?VALUE_GENDER_MALE:VALUE_GENDER_FEMALE) << "\",";
      f << "\"" << KEY_FIRSTNAMES << "\":\"" << nodes[i]->person->getFirstnames() << "\",";
      f << "\"" << KEY_NICKNAME << "\":\"" << nodes[i]->person->getNicknames() << "\",";
      f << "\"" << KEY_SURNAME << "\":\"" << nodes[i]->person->getSurname() << "\",";
      f << "\"" << KEY_MAIDENNAME << "\":\"" << nodes[i]->person->getMaidenName() << "\",";
      f << "\"" << KEY_BORN << "\":\"" << nodes[i]->person->getBorn() << "\",";
      f << "\"" << KEY_BORN_RAW << "\":" << nodes[i]->person->born << ",";
      f << "\"" << KEY_DIED<< "\":\"" << nodes[i]->person->getDied() << "\",";
      f << "\"" << KEY_DIED_RAW << "\":" << nodes[i]->person->died << ",";
      f << "\"" << KEY_DETAILS << "\":\"" << nodes[i]->person->getDetails() << "\",";
      f << "\"" << KEY_GENI_ID << "\":\"" << nodes[i]->person->getGeniId() << "\",";
      f << "\"" << KEY_BIRTH_LOCATION << "\":\"" << nodes[i]->person->getBirthLocation() << "\",";
      f << "\"" << KEY_DEATH_LOCATION << "\":\"" << nodes[i]->person->getDeathLocation() << "\",";
      f << "\"" << KEY_SOURCES << "\":" << nodes[i]->person->getSources() << ",";
      f << "\"" << KEY_MARRIED << "\":[";
      bool t=0;
      for (int j=0;j<nodes[i]->married.size();++j) {
        if (!cuids.count(nodes[i]->married[j].F->person->id)) continue;
        
        if (t) f << ","; t=1;
        f << "[\"" << nodes[i]->married[j].F->person->id << "\",\"";
        if (nodes[i]->married[j].S->type=='3') f << VALUE_MARRIAGE_CURRENT;
        else if (nodes[i]->married[j].S->type=='x') f << VALUE_MARRIAGE_DIVORCED;
        else if (nodes[i]->married[j].S->type=='4') f << VALUE_MARRIAGE_DIED;
        f << "\"]";
      }
      f << "],";
      if (nodes[i]->mother && cuids.count(nodes[i]->mother->person->id)) f << "\"" << KEY_MOTHER << "\":\"" << nodes[i]->mother->person->id << "\",";
      if (nodes[i]->father && cuids.count(nodes[i]->father->person->id)) f << "\"" << KEY_FATHER << "\":\"" << nodes[i]->father->person->id << "\",";
      f << "\"" << KEY_CHILDREN << "\":[";
      sort(nodes[i]->children.begin(), nodes[i]->children.end(), compareNodeEdgePairs);
      t=0;
      for (int j=0;j<nodes[i]->children.size();++j) {
        if (!cuids.count(nodes[i]->children[j].F->person->id)) continue;
        if (t) f<< ","; t=1;
        f << "\"" << nodes[i]->children[j].F->person->id << "\"";
      }
      f << "]";
      f<<"}";
      if (i+1<nodes.size()) f << ",";
    }
    f << "}" << endl;
  }
  void exportJson(string fn, const vector<Node*>& nodes) {
    ofstream f(fn);
    writeJson(f, nodes);
    f.close();
  }
  void exportJson(string fn) {
    ofstream f(fn);
    writeJson(f, nodes);
    f.close();
  }
  void getJson(string& s){
    stringstream ss;
    writeJson(ss, nodes);
    s=ss.str();
  }
  void getJson(string& s, const vector<Node*>& nodes){
    stringstream ss;
    writeJson(ss, nodes);
    s=ss.str();
  }
  
  Node* findById(int id) {
    return uids[id];
  }
  vector<Node*> findPersons(string name) {
    vector<Node*> rv;
    for (int i=0;i<nodes.size();++i) {
      if (match(nodes[i]->person->firstnames+" "+nodes[i]->person->surname, name)) rv.push_back(nodes[i]);
    }
    return rv;
  }
  vector<Node*> getPersons() {
    vector<Node*> rv;
    for (int i=0;i<nodes.size();++i) {
      rv.push_back(nodes[i]);
    }
    return rv;
  }
  vector<Node*> findForeverAlone() {
    vector<Node*> rv;
    for (int i=0;i<nodes.size();++i) {
      if (nodes[i]->lonely()) rv.push_back(nodes[i]);
    }
    return rv;
  }
  
  int dodfs(Node* c) {
    if (!c || c->u) return 0;
    c->u=1;
    int rv=1+dodfs(c->father)+dodfs(c->mother);
    for (int j=0;j<c->married.size();++j) {
      rv+=dodfs(c->married[j].F);
    }
    for (int j=0;j<c->children.size();++j) {
      rv+=dodfs(c->children[j].F);
    }
    return rv;
  }
  
  void extendBloodRelations(vector<Node*>& nodes, bool spouses) {
    vector<Node*> extra;
    const int UP=2;
    const int DOWN=4;
    for (int i=0; i<nodes.size(); ++i) nodes[i]->u = UP|DOWN;
    
    for (int i=0; i<nodes.size(); ++i) {
      if (nodes[i]->u & UP) {
        if (nodes[i]->father && !nodes[i]->father->u) {
          nodes[i]->father->u = UP;
          nodes.push_back(nodes[i]->father);
        }
        if (nodes[i]->mother && !nodes[i]->mother->u) {
          nodes[i]->mother->u = UP;
          nodes.push_back(nodes[i]->mother);
        }
      }
      
      if (spouses && nodes[i]->married.size()) {
        for (int j=0; j<nodes[i]->married.size(); ++j) {
          if (nodes[i]->married[j].S->type=='3') {
            if (!nodes[i]->married[j].F->u) {
              nodes.push_back(nodes[i]->married[j].F);
              nodes[i]->married[j].F->u = 1;
              break;
            }
          }
        }
      }
      
      if (nodes[i]->u & DOWN) {
        for (int j=0; j<nodes[i]->children.size(); ++j) {
          if (nodes[i]->children[j].F->u) continue;
          nodes[i]->children[j].F->u = DOWN;
          nodes.push_back(nodes[i]->children[j].F);
        }
      }
    }
    for (int i=0; i<nodes.size(); ++i) nodes[i]->u=0;
  }
  
  
  void clearu(){
    for (int i=0;i<nodes.size();++i) {
      nodes[i]->u=0;
    }
  }
  
  void countComponentInfo(vector<pair<int, int> >& cmps) {
    clearu();
    for (int i=0;i<nodes.size();++i) {
      int v=dodfs(nodes[i]);
      if (v) cmps.push_back({nodes[i]->person->id, v});
    }
    clearu();
  }
};

#endif
