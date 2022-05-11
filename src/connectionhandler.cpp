#include <bits/stdc++.h>
#include "defs.h"
#include "escape.cpp"
#include "tree.cpp"
using namespace std;

#ifndef CONNECTIONHANDLER_CPP
#define CONNECTIONHANDLER_CPP





class ConnectionHandler {
  string fname;
  Forest forest;
  
  int _stoi(string& v) {
    try {
      return stoi(v);
    } catch (const std::invalid_argument& ia) {
      return -1;
    } catch (const std::out_of_range& oo) {
      return -1;
    }
  }
  
  int value(char hx) {
    if ('0' <= hx && hx <= '9') return hx - '0';
    if ('a' <= hx && hx <= 'f') return hx - 'a' + 10;
    if ('A' <= hx && hx <= 'F') return hx - 'A' + 10;
    return 0;
  }
  
  map<string, string> data;
  void parse_data(char* raw) {
    data.clear();
    int ph=0;
    char f=0;
    char s=0;
    string key;
    string word;
    for (int i=0;raw[i];++i){
      if (raw[i]=='%') ph=1;
      else if (ph==1) f=raw[i], ++ph;
      else if (ph==2) word.push_back((char)((value(f) << 4) | value(raw[i]))), ph=0;
      else if (raw[i]=='+') {
        word.push_back(' ');
      } else if (raw[i]=='&') {
        data[key] = word;
        word = "";
        key = "";
      } else if (raw[i]=='=') {
        key = word;
        word = "";
      } else {
        word.push_back(raw[i]);
      }
    }
    if (key.size()) data[key] = word;
    //for (auto& w : data) cout << w.first << "->" << w.second << ", "; cout << endl;
  }
  
  void split(string& data, vector<string>& result, char delimeter) {
    result.emplace_back("");
    for (int i=0;i<data.size();++i) {
      if (data[i]!=delimeter) result[result.size()-1].push_back(data[i]);
      else result.emplace_back("");
    }
  }
  
  
  
  // GET handler functions
  
  int get_json(string& response) {
    forest.getJson(response);
    return 0;
  }
  
  
  // POST handler functions
  int search_users(char* body_data, string& response) {
    parse_data(body_data);
    if (data.count(PARAM_SEARCH_WORD)) {
      vector<Node*> nodes;
      nodes=forest.findPersons(data[PARAM_SEARCH_WORD]);
      response="[";
      for (int i=0;i<nodes.size();++i) {
        if (nodes[i]!=nullptr) {
          if (response.size()>1) response.push_back(',');
          response+=to_string(nodes[i]->person->id);
        }
      }
      response.push_back(']');
    } else return 1;
    return 0;
  }
  
  struct ProtoUser {
    int id;
    bool gender;
    string firstnames;
    string nickname;
    string surname;
    string maidenname;
    int born;
    int died;
    string details;
    string geniId;
    string birthLocation;
    string deathLocation;
    string sources;
  };
  
  int parse_proto_user(ProtoUser& u, bool requireID) {
    if (requireID) {
      if (data.count(PARAM_ID)) {
        u.id=_stoi(data[PARAM_ID]);
      } else {
        cout << "missing param ID" << endl;
        return 1;
      }
    }
    if (data.count(PARAM_GENDER)) {
      u.gender=_stoi(data[PARAM_GENDER]);
    } else {
      cout << "missing param GENDER" << endl;
      return 1;
    }
    if (data.count(PARAM_NICKNAME)) {
      u.nickname=data[PARAM_NICKNAME];
    } else {
      cout << "missing param NICKNAME" << endl;
      return 1;
    }
    if (data.count(PARAM_FIRSTNAMES)) {
      u.firstnames=data[PARAM_FIRSTNAMES];
    } else {
      cout << "missing param FIRSTNAME" << endl;
      return 1;
    }
    if (data.count(PARAM_SURNAME)) {
      u.surname=data[PARAM_SURNAME];
    } else {
      cout << "missing param SURNAME" << endl;
      return 1;
    }
    if (data.count(PARAM_MAIDEN_NAME)) {
      u.maidenname = data[PARAM_MAIDEN_NAME];
    } else {
      cout << "missing param MAIDEN_NAME" << endl;
      return 1;
    }
    if (data.count(PARAM_BORN)) {
      u.born = _stoi(data[PARAM_BORN]);
    } else {
      cout << "missing param BORN" << endl;
      return 1;
    }
    if (data.count(PARAM_DIED)) {
      u.died = _stoi(data[PARAM_DIED]);
    } else {
      cout << "missing param DIED" << endl;
      return 1;
    }
    if (data.count(PARAM_DETAILS)) {
      u.details = data[PARAM_DETAILS];
    } else {
      cout << "missing param DETAILS" << endl;
      return 1;
    }
    if (data.count(PARAM_GENI_ID)) {
      u.geniId = data[PARAM_GENI_ID];
    } else {
      cout << "missing param GENI_ID" << endl;
      return 1;
    }
    if (data.count(PARAM_BIRTH_LOCATION)) {
      u.birthLocation = data[PARAM_BIRTH_LOCATION];
    } else {
      cout << "missing param BIRTH_LOCATION" << endl;
      return 1;
    }
    if (data.count(PARAM_DEATH_LOCATION)) {
      u.deathLocation = data[PARAM_DEATH_LOCATION];
    } else {
      cout << "missing param DEATH_LOCATION" << endl;
      return 1;
    }
    if (data.count(PARAM_SOURCES)) {
      u.sources = data[PARAM_SOURCES];
    } else {
      cout << "missing param SOURCES" << endl;
      return 1;
    }
    return 0;
  }
  
  void apply_proto_to_node(Node* node, ProtoUser& u) {
    node->person->firstnames=u.firstnames;
    node->person->nicknames=u.nickname;
    node->person->surname=u.surname;
    node->person->maidenname=u.maidenname;
    node->person->gender=u.gender;
    node->person->born=u.born;
    node->person->died=u.died;
    node->person->details=u.details;
    // geniId, parse non-integers...
    node->person->geniId=u.geniId;
    node->person->birthLocation=u.birthLocation;
    node->person->deathLocation=u.deathLocation;
    node->person->sources.clear();
    split(u.sources, node->person->sources, ';');
  }
  
  int apply_parents(int id, int fid, int mid) {
    cout << "apply_parents " << id << ", " << fid << ", " << mid << endl;
    Node* u = forest.findById(id);
    if (u==nullptr){
      cout << "couldn't find person with given id" << endl;
      return 1;
    }
    Node* f = forest.findById(fid);
    Node* m = forest.findById(mid);
    int v=forest.addChild(f, m, u, true);
    if (v) cout << "setting parents failed with error " << v << endl;
    return v;
  }
  
  
  int handle_parents(Node* node) {
    if (data.count(PARAM_FATHER) && data.count(PARAM_MOTHER)) {
      int id=node->person->id;
      int fid=_stoi(data[PARAM_FATHER]);
      int mid=_stoi(data[PARAM_MOTHER]);
      int v=apply_parents(id, fid, mid);
      
      if (v) {
        cout << "setting parets failed :(" << endl;
        return v;
      }
    }
    return 0;
  }
  int handle_children(Node* node) {
    if (data.count(PARAM_CHILDREN)) {
      vector<string> children;
      split(data[PARAM_CHILDREN], children, ',');
      forest.removeAllChildren(node);
      for (int i=0;i<children.size();++i) {
        Node* child=forest.findById(_stoi(children[i]));
        if (!child) {
          cout << "adding child " << children[i] << " failed, node does not exist..." << endl;
          continue;
        }
        if (node->person->gender && child->father) {
          cout << "adding child " << children[i] << " failed, has father already..." << endl;
          continue;
        }
        if (!node->person->gender && child->mother) {
          cout << "adding child " << children[i] << " failed, has mother already..." << endl;
          continue;
        }
        int v=0;
        if (node->person->gender) {
          v=forest.addChild(node, child->mother, child, true);
        } else {
          v=forest.addChild(child->father, node, child, true);
        }
        if (v) {
          cout << "adding child " << children[i] << " failed..." << endl;
        }
      }
    }
    return 0;
  }
  int handle_marriages(Node* node) {
    if (data.count(PARAM_MARRIED)) {
      vector<string> married;
      split(data[PARAM_MARRIED], married, ',');
      forest.removeAllMarriages(node);
      vector<string> marriage;
      for (int i=0;i<married.size();++i) {
        marriage.clear();
        split(married[i], marriage, '.');
        if (marriage.size()<2) {
          cout << "adding marriage failed, invalid format (1)" << endl;
          continue;
        }
        if (marriage[1].size()!=1) {
          cout << "adding marriage failed, invalid format (2)" << endl;
          continue;
        }
        Node* o=forest.findById(_stoi(marriage[0]));
        if (!o) {
          cout << "marrying failed, invalid node '" << marriage[0] << "'" << endl;
          continue;
        }
        char type=marriage[1][0];
        forest.marry(node, o, type);
      }
    }
    return 0;
  }
  
  int edit_person(char* body_data, string& response) {
    parse_data(body_data);
    ProtoUser u;
    int v=parse_proto_user(u, 1);
    if (v) return v;
    Node* node = forest.findById(u.id);
    if (node==nullptr){
      response="couldn't find person with given id";
      cout << response << endl;
      return 1;
    }
    apply_proto_to_node(node, u);
    if (int v=handle_parents(node)) return v;
    if (int v=handle_children(node)) return v;
    if (int v=handle_marriages(node)) return v;
    return 0;
  }
  
  int add_person(char* body_data, map<string, string>& response) {
    parse_data(body_data);
    ProtoUser u;
    int v=parse_proto_user(u, 0);
    if (v) return v;
    Node* node = forest.createPerson();
    apply_proto_to_node(node, u);
    response[PARAM_ID]=std::to_string(node->person->id);
    if (int v=handle_parents(node)) return v;
    if (int v=handle_children(node)) return v;
    if (int v=handle_marriages(node)) return v;
    return 0;
  }
  
  int set_parents(char* body_data, map<string, string>& response) { // NOT IN USE...
    int id, fid, mid;
    if (data.count(PARAM_ID)) {
      id=_stoi(data[PARAM_ID]);
    } else {
      cout << "missing param ID" << endl;
      return 1;
    }
    if (data.count(PARAM_FATHER)) {
      fid=_stoi(data[PARAM_FATHER]);
    } else {
      cout << "missing param FATHER" << endl;
      return 1;
    }
    if (data.count(PARAM_MOTHER)) {
      mid=_stoi(data[PARAM_MOTHER]);
    } else {
      cout << "missing param MOTHER" << endl;
      return 1;
    }
    return apply_parents(id, fid, mid);
  }
  
public:
  // selecting correct function to handle GET request
  int handle_get_request(vector<string>& path, map<string, string>& responseMap, string& response) {
    if (path.size() == 1) {
      if (path[0] == PATH_GET_JSON) {
        return get_json(response);
      }
    } 
    return 1;
  }

  int handle_post_request(vector<string>& path, char* body_data, map<string, string>& responseMap, string& response) {
    int rv=1;
    if (path.size() == 1) {
      if (path[0] == PATH_SEARCH_PERSONS) {
        rv=search_users(body_data, response);
      } else if (path[0] == PATH_EDIT_PERSON) {
        rv=edit_person(body_data, response);
      } else if (path[0] == PATH_ADD_PERSON) {
        rv=add_person(body_data, responseMap);
      } else if (path[0] == PATH_SET_PARENTS) {
        rv=set_parents(body_data, responseMap);
      }
    }
    forest.save(fname);
    return rv;
  }
  
  void useForest(string s) {
    fname=s;
    forest.load(s);
  }
};

#endif