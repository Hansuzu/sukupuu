#include <string>
#include <map>
using namespace std;

#ifndef ESCAPE_CPP
#define ESCAPE_CPP

void escape(string& s1, string& s2) {
  s2="";
  for (int i=0;i<s1.size();++i){
    if (s1[i]=='"') {
      s2.push_back('\\');
      s2.push_back('"');
    }else if (s1[i]=='\\'){
      s2.push_back('\\');
      s2.push_back('\\');
    }else{
      s2.push_back(s1[i]);
    }
  }
}

string escape(string s1) {
  string a;
  escape(s1, a);
  return a;
}
#endif