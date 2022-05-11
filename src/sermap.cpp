#include <bits/stdc++.h>
using namespace std;

#ifndef SERMAP_CPP
#define SERMAP_CPP

namespace sermap{
  
  string cc(const string& a) {
    string rv="";
    for (int i=0;i<a.size();++i) {
      if (a[i]=='\\') rv.push_back('\\'), rv.push_back('\\');
      else if (a[i]=='\"') rv.push_back('\\'), rv.push_back('\"');
      else if (a[i]=='\n') rv.push_back('\\'), rv.push_back('n');
      else if (a[i]=='\r') rv.push_back('\\'), rv.push_back('r');
      else rv.push_back(a[i]);
    }
    return rv;
  }
  string ucc(const string& a) {
    string rv="";
    for (int i=0;i<a.size();++i) {
      if (a[i]=='\\') {
        ++i;
        
        if(i==a.size()) break;
        if (a[i]=='n') rv.push_back('\n');
        else if (a[i]=='r') rv.push_back('\r');
        else rv.push_back(a[i]);
        
      } else rv.push_back(a[i]);
    }
    return rv;
  }
  
  
  void serialize(map<string, string>& values, string& res) {
    res="{";
    for (auto t=values.begin();t!=values.end();++t) {
      if (res.size()!=1) res.push_back(',');
      res+="\""+cc(t->first)+"\":";
      res+="\""+cc(t->second)+"\"";
    }
    res+="}";
  }
  string serialize(map<string, string>& values) {
    string rv="";
    serialize(values, rv);
    return rv;
  }

  int deserialize(string& s, map<string, string>& res) {
    if (s[0]!='{' || s.back()!='}') {
      cerr << "invalid value for deserializing: '" << s << "'" << endl;
      return 1;
    }
    bool str=0;
    string key="";
    string l="";
    for (int i=1;i<s.size()-1;++i) {
      if (str) {
        if (s[i]=='\\') {
          l.push_back(s[i]);
          l.push_back(s[++i]);
        }else if (s[i]=='"') str=0;
        else l.push_back(s[i]);
      } else {
        if (s[i]=='"') {
          str=1;
          l="";
        } else if (s[i]==':') {
          key=ucc(l);
        } else if (s[i]==',') {
          res[key]=ucc(l);
        }
      }
    }
    res[key]=l;
    return 0;
  }
  void serialize(vector<string>& values, string& res) {
    res="[";
    for (int i=0;i<values.size();++i) {
      if (res.size()!=1) res.push_back(',');
      res+="\""+cc(values[i])+"\"";
    }
    res+="]";
  }
  string serialize(vector<string>& values) {
    string rv="";
    serialize(values, rv);
    return rv;
  }
  
  int deserialize(string& s, vector<string>& res) {
    if (s[0]!='[' || s.back()!=']') {
      cerr << "invalid value for deserializing: '" << s << "'" << endl;
      return 1;
    }
    bool str=0;
    string val="";
    for (int i=1;i<s.size()-1;++i) {
      if (str) {
        if (s[i]=='\\') {
          val.push_back(s[i]);
          val.push_back(s[++i]);
        }else if (s[i]=='"') str=0;
        else val.push_back(s[i]);
      } else {
        if (s[i]=='"') {
          str=1;
        } else if (s[i]==',') {
          res.push_back(ucc(val));
          val="";
        }
      }
    }
    res.push_back(val);
    return 0;
  }
}

#endif