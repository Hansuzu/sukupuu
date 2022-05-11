#ifndef DEFS_H
#define DEFS_H


// root paths


// get paths
#define PATH_GET_JSON        "a"

// post paths
#define PATH_SEARCH_PERSONS  "a"
#define PATH_EDIT_PERSON     "b"
#define PATH_ADD_PERSON      "c"
#define PATH_SET_PARENTS     "d"
#define PATH_SET_MARRIAGES   "e"

// post params
#define PARAM_SEARCH_WORD    "a"
#define PARAM_ID             "b"
#define PARAM_SURNAME        "c"
#define PARAM_FIRSTNAMES     "d"
#define PARAM_NICKNAME       "e"
#define PARAM_DETAILS        "f"
#define PARAM_GENDER         "g"
#define PARAM_MAIDEN_NAME    "h"
#define PARAM_BORN           "i"
#define PARAM_DIED           "j"
#define PARAM_HUSBAND        "k"
#define PARAM_WIFE           "l"
#define PARAM_FATHER         "m"
#define PARAM_MOTHER         "n"
#define PARAM_CHILD          "o"
#define PARAM_CHILDREN       "p"
#define PARAM_MARRIED        "q"
#define PARAM_GENI_ID        "r"
#define PARAM_GENI_FUNIONS   "s"
#define PARAM_BIRTH_LOCATION "t"
#define PARAM_DEATH_LOCATION "u"
#define PARAM_SOURCES        "v"

// response dictionary things
#define KEY_FIRSTNAMES       "a"
#define KEY_SURNAME          "b"
#define KEY_NICKNAME         "c"
#define KEY_BORN             "d"
#define KEY_BORN_RAW         "e"
#define KEY_DIED             "f"
#define KEY_DIED_RAW         "g"
#define KEY_MAIDENNAME       "h"
#define KEY_DETAILS          "i"
#define KEY_GENDER           "j"
#define KEY_MOTHER           "k"
#define KEY_FATHER           "l"
#define KEY_MARRIED          "m"
#define KEY_CHILDREN         "n"
#define KEY_GENI_ID          "o"
#define KEY_GENI_MARRIED     "p"
#define KEY_GENI_CHILDREN    "q"
#define KEY_GENI_FATHER      "r"
#define KEY_GENI_MOTHER      "s"
#define KEY_GENI_API_URL     "t"
#define KEY_GENI_PROFILE_URL "u"
#define KEY_REQUEST_STATUS   "v"
#define KEY_ID               "w"
#define KEY_BIRTH_LOCATION   "x"
#define KEY_DEATH_LOCATION   "y"
#define KEY_SOURCES          "z"

#define VALUE_GENDER_MALE       "m"
#define VALUE_GENDER_FEMALE     "f"
#define VALUE_MARRIAGE_CURRENT  "3"
#define VALUE_MARRIAGE_DIVORCED "x"
#define VALUE_MARRIAGE_DIED     "4"
#define VALUE_REQUEST_OK        "0"
#define VALUE_REQUEST_FAIL      "1"



#endif