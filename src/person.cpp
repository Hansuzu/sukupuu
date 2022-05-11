#include <string>
#include <vector>
#include "sermap.cpp"
using namespace std;

#ifndef PERSON_CPP
#define PERSON_CPP

#define PPARAM_ID_LONG              "id"
#define PPARAM_GENDER_LONG          "gender"
#define PPARAM_FIRSTNAMES_LONG      "firstnames"
#define PPARAM_NICKNAMES_LONG       "nicknames"
#define PPARAM_SURNAME_LONG         "surname"
#define PPARAM_MAIDENNAME_LONG      "maiden-name"
#define PPARAM_BORN_LONG            "born"
#define PPARAM_DIED_LONG            "died"
#define PPARAM_DETAILS_LONG         "details"
#define PPARAM_GENI_ID_LONG         "geni-id"
#define PPARAM_BIRTH_LOCATION_LONG  "birth-location"
#define PPARAM_DEATH_LOCATION_LONG  "death-location"
#define PPARAM_SOURCES_LONG         "sources"

#define PPARAM_ID_SHORT             "i"
#define PPARAM_GENDER_SHORT         "g"
#define PPARAM_FIRSTNAMES_SHORT     "f"
#define PPARAM_NICKNAMES_SHORT      "n"
#define PPARAM_SURNAME_SHORT        "s"
#define PPARAM_MAIDENNAME_SHORT     "m"
#define PPARAM_BORN_SHORT           "b"
#define PPARAM_DIED_SHORT           "d"
#define PPARAM_DETAILS_SHORT        "D"
#define PPARAM_GENI_ID_SHORT        "G"
#define PPARAM_BIRTH_LOCATION_SHORT "l"
#define PPARAM_DEATH_LOCATION_SHORT "L"
#define PPARAM_SOURCES_SHORT        "S"

#define PVALUE_GENDER_MALE_LONG   "male"
#define PVALUE_GENDER_FEMALE_LONG "female"

#define PVALUE_GENDER_MALE_SHORT   "m"
#define PVALUE_GENDER_FEMALE_SHORT "f"

struct Person {
  int id; // unique identifier
  bool gender;
  string firstnames;
  string nicknames;
  string surname;
  string maidenname;
  int born;
  int died;
  string details;
  string geniId;
  string birthLocation;
  string deathLocation;
  vector<string> sources;
  
  string serialize(bool unc=false) {
    map<string, string> vls;
    
    vls[unc?PPARAM_ID_LONG    :PPARAM_ID_SHORT]    =to_string(id);
    vls[unc?PPARAM_GENDER_LONG:PPARAM_GENDER_SHORT]=gender?(unc?PVALUE_GENDER_MALE_LONG:PVALUE_GENDER_MALE_SHORT):(unc?PVALUE_GENDER_FEMALE_LONG:PVALUE_GENDER_FEMALE_SHORT);
    if (firstnames.size())   vls[unc?PPARAM_FIRSTNAMES_LONG    :PPARAM_FIRSTNAMES_SHORT]    =firstnames;
    if (nicknames.size())    vls[unc?PPARAM_NICKNAMES_LONG     :PPARAM_NICKNAMES_SHORT]     =nicknames;
    if (surname.size())      vls[unc?PPARAM_SURNAME_LONG       :PPARAM_SURNAME_SHORT]       =surname;
    if (maidenname.size())   vls[unc?PPARAM_MAIDENNAME_LONG    :PPARAM_MAIDENNAME_SHORT]    =maidenname;
    if (born)                vls[unc?PPARAM_BORN_LONG          :PPARAM_BORN_SHORT]          =to_string(born);
    if (died)                vls[unc?PPARAM_DIED_LONG          :PPARAM_DIED_SHORT]          =to_string(died);
    if (details.size())      vls[unc?PPARAM_DETAILS_LONG       :PPARAM_DETAILS_SHORT]       =details;
    if (geniId.size())       vls[unc?PPARAM_GENI_ID_LONG       :PPARAM_GENI_ID_SHORT]       =geniId;
    if (birthLocation.size())vls[unc?PPARAM_BIRTH_LOCATION_LONG:PPARAM_BIRTH_LOCATION_SHORT]=birthLocation;
    if (deathLocation.size())vls[unc?PPARAM_DEATH_LOCATION_LONG:PPARAM_DEATH_LOCATION_SHORT]=deathLocation;
    if (sources.size())      vls[unc?PPARAM_SOURCES_LONG       :PPARAM_SOURCES_SHORT]       =sermap::serialize(sources);
    
    string rv;
    sermap::serialize(vls, rv);
    return rv;
  }
  
  void setName(string name) {
    firstnames="";
    surname="";
    
    vector<string> names;
    string nm="";
    for (char& c : name) {
      if (c==' ') {
        if (nm.size()) names.push_back(nm);
        nm="";
      }else {
        nm.push_back(c);
      }
    }
    if (nm.size()) names.push_back(nm);
    surname=names[names.size()-1];
    if (names.size()>1) {
      for (int i=0;i<names.size()-1;++i) {
        if (firstnames.size()) firstnames.push_back(' ');
        firstnames+=names[i];
      }
    }
  }
  
  string name() {
    if (firstnames.size()) return firstnames+" "+surname;
    else return surname;
  }
  
  int deserialize(string& s) {
    map<string, string> vls;
    if (sermap::deserialize(s, vls)) {
      cerr << "deserialization failed!";
      return 1;
    }
    if (!(vls.count(PPARAM_ID_SHORT) || vls.count(PPARAM_ID_LONG)) || !(vls.count(PPARAM_GENDER_SHORT) || vls.count(PPARAM_GENDER_LONG))) {
      cerr << "invalid data";
      return 1;
    }
    
    if (vls.count(PPARAM_ID_SHORT)) id=stoi(vls[PPARAM_ID_SHORT]);
    else                            id=stoi(vls[PPARAM_ID_LONG]);
    
    if      (vls.count(PPARAM_GENDER_SHORT)) gender=vls[PPARAM_GENDER_SHORT]==PVALUE_GENDER_MALE_SHORT;
    else                                     gender=vls[PPARAM_GENDER_LONG]==PVALUE_GENDER_MALE_LONG;
    
    if      (vls.count(PPARAM_FIRSTNAMES_SHORT)) firstnames=vls[PPARAM_FIRSTNAMES_SHORT];
    else if (vls.count(PPARAM_FIRSTNAMES_LONG))  firstnames=vls[PPARAM_FIRSTNAMES_LONG];
    else                                         firstnames="";
    
    if      (vls.count(PPARAM_NICKNAMES_SHORT)) nicknames=vls[PPARAM_NICKNAMES_SHORT];
    else if (vls.count(PPARAM_NICKNAMES_LONG))  nicknames=vls[PPARAM_NICKNAMES_LONG];
    else                                       nicknames="";
    
    if      (vls.count(PPARAM_SURNAME_SHORT)) surname=vls[PPARAM_SURNAME_SHORT];
    else if (vls.count(PPARAM_SURNAME_LONG))  surname=vls[PPARAM_SURNAME_LONG];
    else surname="";
    
    if      (vls.count(PPARAM_MAIDENNAME_SHORT)) maidenname=vls[PPARAM_MAIDENNAME_SHORT];
    else if (vls.count(PPARAM_MAIDENNAME_LONG))  maidenname=vls[PPARAM_MAIDENNAME_LONG];
    else                                         maidenname="";
    
    if      (vls.count(PPARAM_BORN_SHORT)) born=stoi(vls[PPARAM_BORN_SHORT]);
    else if (vls.count(PPARAM_BORN_LONG))  born=stoi(vls[PPARAM_BORN_LONG]);
    else                                   born=0;
    
    if      (vls.count(PPARAM_DIED_SHORT)) died=stoi(vls[PPARAM_DIED_SHORT]);
    else if (vls.count(PPARAM_DIED_LONG))  died=stoi(vls[PPARAM_DIED_LONG]);
    else                                   died=0;
    
    if      (vls.count(PPARAM_DETAILS_SHORT)) details=vls[PPARAM_DETAILS_SHORT];
    else if (vls.count(PPARAM_DETAILS_LONG))  details=vls[PPARAM_DETAILS_LONG];
    else                                      details="";
    
    if      (vls.count(PPARAM_GENI_ID_SHORT)) geniId=vls[PPARAM_GENI_ID_SHORT];
    else if (vls.count(PPARAM_GENI_ID_LONG))  geniId=vls[PPARAM_GENI_ID_LONG];
    else                                      geniId="";
    
    
    if      (vls.count(PPARAM_BIRTH_LOCATION_SHORT)) birthLocation=vls[PPARAM_BIRTH_LOCATION_SHORT];
    else if (vls.count(PPARAM_BIRTH_LOCATION_LONG))  birthLocation=vls[PPARAM_BIRTH_LOCATION_LONG];
    else                                             birthLocation="";
    
    if      (vls.count(PPARAM_DEATH_LOCATION_SHORT)) deathLocation=vls[PPARAM_DEATH_LOCATION_SHORT];
    else if (vls.count(PPARAM_DEATH_LOCATION_LONG))  deathLocation=vls[PPARAM_DEATH_LOCATION_LONG];
    else                                             deathLocation="";
    
    sources.clear();
    if      (vls.count(PPARAM_SOURCES_SHORT)) sermap::deserialize(vls[PPARAM_SOURCES_SHORT], sources);
    else if (vls.count(PPARAM_SOURCES_LONG))  sermap::deserialize(vls[PPARAM_SOURCES_SHORT], sources);
    
    return 0;
  }
  
  string md(int v, bool md = true) {
    if (v>9999) {
      int a=0;
      int k=1;
      bool t=0;
      while (v>9999) {
        int l=v%10;
        a+=l*k;
        k*=10;
        v/=10;
        if (v<=9999 && !l) {
          t=1;
        }
      }
      if (t) {
        if (a/100)   return to_string(a%100)+"."+to_string(a/100)+"."+to_string(v);
        return to_string(a%100)+"/"+to_string(v);
      } else if (md) {
        return to_string(v-a)+"-"+to_string(v+a);
      }
    } else return to_string(v);
    return "";
  }
  
  void print() {
    cout << "<" << id << ">" << endl;
    cout << name() << (gender?"(male)":"(female)") << endl;
    if (born) cout << "b. " << md(born) << " ";
    if (died) cout << "d. " << md(died) << " ";
    if (born || died) cout << endl;
    if (details.size()) cout << details << endl;
    cout << endl;
  }
  
  string getFirstnames() {
    return sermap::cc(firstnames);
  }
  string getNicknames() {
    return sermap::cc(nicknames);
  }
  string getSurname() {
    return sermap::cc(surname);
  }
  string getMaidenName() {
    return sermap::cc(maidenname);
  }
  string getBorn(bool error=true) {
    return born?md(born, error):"";
  }
  string getDied() {
    return died?md(died):"";
  }
  string getGeniId() {
    return sermap::cc(geniId);
  }
  string getDetails() {
    return sermap::cc(details);
  }
  string getBirthLocation() {
    return sermap::cc(birthLocation);
  }
  string getDeathLocation() {
    return sermap::cc(deathLocation);
  }
  string getSources() {
    return sermap::serialize(sources);
  }
  
  Person() {
    born=0;
    died=0;
  }
  
  static int tconv(int v) {
    if (v>9999) {
      int a=0;
      int k=1;
      bool t=0;
      while (v>9999) {
        int l=v%10;
        a+=l*k;
        k*=10;
        v/=10;
        if (v<=9999 && !l) {
          t=1;
        }
      }
      if (t) return v*100000+a;
      else return v*100000;
    }
    return v*100000;
  }
  
  static pair<pair<int, int>, pair<int, int>> getConvV(int v) {
    int a=0;
    int k=1;
    bool t=0;
    while (v>9999) {
      int l=v%10;
      a+=l*k;
      k*=10;
      v/=10;
      if (v<=9999 && !l) {
        t=1;
      }
    }
    if (t) {
      if (a/100)  return {{v, 0}, {a/100, a%100}};
      return {{v, v}, {a%100, 0}};
    } else {
      return {{v-a, v+a}, {0, 0}};
    }
  }
  static bool overLappingTConv(int a, int b) {
    if (a<1000 || b<1000) return 1;
    if (a==b) return 1;
    pair<pair<int, int>, pair<int, int> > aa=getConvV(a);
    pair<pair<int, int>, pair<int, int> > bb=getConvV(b);
    if (aa.first.second<bb.first.first || aa.first.first>bb.first.second) return 0;
    if (aa.first.first==aa.first.second && bb.first.second==bb.first.second) {
      if (aa.second.first==0 || bb.second.first==0) return 1;
      if (aa.second.first!=bb.second.first) return 0;
      if (aa.second.second==0 || bb.second.second==0) return 1;
      if (aa.second.second!=bb.second.second) return 0;
      return 1;
    } else return 1;
  }
  
  bool operator<(Person& o) {
    return tconv(born)<tconv(o.born);
  }
};

#endif
