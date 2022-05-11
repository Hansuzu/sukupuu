var ___backend
var ___geni_api
var ___element
var ___canvas
var ___infoDiv
var ___infoDiv2
var ___data
var ___dataKeys
var ___geniData={}
var ___geniDataLoadList=[]
var ___useGeni
var ___geniNodes
var ___hashVariables={}
var ___maleNames=new Set()
var ___femaleNames=new Set()

var ___root

var ___down = 1
var ___up = 2
var ___visible=[]
var ___wasVisible=[]
var ___animMoving=[]
var ___animIn=[]
var ___animOut=[]


var ___processID=0
var ___processingDone=0
var ___processingStarted=0


var ___searchLast=""
var ___searchRes=[]
var ___searchPos


var _W0=75
var _H0=80
var _HG0=40
var _M0=10

var _FSZ0=16
var _FSZ_SM0=12
var _scale=1

var _W=75
var _H=80
var _HG=40
var _M=10

var _FSZ=16
var _FSZ_SM=12

var _MTOP=50
var _MBOTTOM=50
var _MLEFT=10
var _MRIGHT=10

var _EDITMODE=1

function _setScale(scl, draw) {
  var sc=Math.pow(1.25, scl)
  _W=_W0*sc
  _H=_H0*sc
  _HG=_HG0*sc
  _M=_M0*sc
  _FSZ=_FSZ0*sc
  _FSZ_SM=_FSZ_SM0*sc
  _scale=scl
  _setHashVariable("c",scl)
  if (draw) _draw()
}

function _setUpDown(up, down, draw) {
  ___up=up
  ___down=down
  _setHashVariable("d",down)
  _setHashVariable("u",up)
  if (draw) _draw()
}

var _EL_SIMILAR 

var _EL_FIRSTNAMES
var _EL_NICKNAMES
var _EL_SURNAME
var _EL_MAIDENNAME
var _EL_BORN
var _EL_DIED
var _EL_BIRTH_LOCATION
var _EL_DEATH_LOCATION
var _EL_DETAILS
var _EL_GENI_ID
var _EL_GENDER_MALE
var _EL_GENDER_FEMALE
var _EL_FATHER
var _EL_MOTHER
var _EL_MARRIAGES
var _EL_CHILDREN
var _EL_FETCH_GENI


// BACKEND REQUESTS...

// get paths
var _PATH_GET_JSON        ="/a"

// post paths
var _PATH_SEARCH_PERSONS  ="/a"
var _PATH_EDIT_PERSON     ="/b"
var _PATH_ADD_PERSON      ="/c"
var _PATH_SET_PARENTS     ="/d"
var _PATH_SET_MARRIAGES   ="/e"

// post params
var _PARAM_SEARCH_WORD    ="a"
var _PARAM_ID             ="b"
var _PARAM_SURNAME        ="c"
var _PARAM_FIRSTNAMES     ="d"
var _PARAM_NICKNAME       ="e"
var _PARAM_DETAILS        ="f"
var _PARAM_GENDER         ="g"
var _PARAM_MAIDEN_NAME    ="h"
var _PARAM_BORN           ="i"
var _PARAM_DIED           ="j"
var _PARAM_HUSBAND        ="k"
var _PARAM_WIFE           ="l"
var _PARAM_FATHER         ="m"
var _PARAM_MOTHER         ="n"
var _PARAM_CHILD          ="o"
var _PARAM_CHILDREN       ="p"
var _PARAM_MARRIED        ="q"
var _PARAM_GENI_ID        ="r"
var _PARAM_GENI_FUNIONS   ="s"
var _PARAM_BIRTH_LOCATION ="t"
var _PARAM_DEATH_LOCATION ="u"
var _PARAM_SOURCES        ="v"
var _PARAM_FORCE_ONLINE   ="w"

var _ASTR_FIRSTNAMES      ="First names:"
var _ASTR_NICKNAMES       ="Nicknames:"
var _ASTR_SURNAME         ="Surname:"
var _ASTR_MAIDENNAME      ="Maiden name:"
var _ASTR_BACHELORNAME    ="Bachelor name:"
var _ASTR_BORN            ="Born:"
var _ASTR_DIED            ="Died:"
var _ASTR_BIRTH_LOCATION  ="Birth location:"
var _ASTR_DEATH_LOCATION  ="Death location:"
var _ASTR_GENDER          ="Gender:"
var _ASTR_GENDER_MALE     ="Male"
var _ASTR_GENDER_FEMALE   ="Female"
var _ASTR_DETAILS         ="Details:"
var _ASTR_GENI_ID         ="Geni id:"
var _ASTR_FETCH_GENI      ="Fetch geni node"
var _ASTR_FATHER          ="Father:"
var _ASTR_MOTHER          ="Mother:"
var _ASTR_MARRIAGES       ="Marriage(s):"
var _ASTR_CHILDREN        ="Children:"
var _ASTR_SAVE            ="Save"

var _KEY_FIRSTNAMES       ="a"
var _KEY_SURNAME          ="b"
var _KEY_NICKNAME         ="c"
var _KEY_BORN             ="d"
var _KEY_BORN_RAW         ="e"
var _KEY_DIED             ="f"
var _KEY_DIED_RAW         ="g"
var _KEY_MAIDENNAME       ="h"
var _KEY_DETAILS          ="i"
var _KEY_GENDER           ="j"
var _KEY_MOTHER           ="k"
var _KEY_FATHER           ="l"
var _KEY_MARRIED          ="m"
var _KEY_CHILDREN         ="n"
var _KEY_GENI_ID          ="o"
var _KEY_GENI_MARRIED     ="p"
var _KEY_GENI_CHILDREN    ="q"
var _KEY_GENI_FATHER      ="r"
var _KEY_GENI_MOTHER      ="s"
var _KEY_GENI_API_URL     ="t"
var _KEY_GENI_PROFILE_URL ="u"
var _KEY_REQUEST_STATUS   ="v"
var _KEY_ID               ="w"
var _KEY_BIRTH_LOCATION   ="x"
var _KEY_DEATH_LOCATION   ="y"
var _KEY_SOURCES          ="z"

var _VALUE_GENDER_MALE       ="m"
var _VALUE_GENDER_FEMALE     ="f"
var _VALUE_MARRIAGE_CURRENT  ="3"
var _VALUE_MARRIAGE_DIVORCED ="x"
var _VALUE_MARRIAGE_DIED     ="4"
var _VALUE_REQUEST_OK        ="0"
var _VALUE_REQUEST_FAIL      ="1"


function _gr(path, cb, backend, cbfail) {
  if (backend==undefined) backend=___backend
  if (cbfail==undefined)  cbfail=alert
  var xhttp = new XMLHttpRequest()
  xhttp.timeout=3500
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 404) {
        cbfail("404, "+path + " " + xhttp.responseText)
      }else if (this.status == 200) {
        cb(JSON.parse(xhttp.responseText))
      } else if (this.status == 0) {
        cbfail("Conection refused "+path)
      }
    }
  }
  xhttp.open("GET", backend+path, true)
  xhttp.send()
}

function _pr(path, data, cb, timeout, backend, cbfail) {
  if (backend==undefined) backend=___backend
  if (cbfail==undefined)  cbfail=alert
  if (timeout==undefined)  timeout=3500
  var xhttp = new XMLHttpRequest()
  xhttp.timeout=timeout
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      ___networking = 0
      if (this.status == 404) {
        cbfail("404, "+path + " " + xhttp.responseText)
      }else if (this.status == 200) {
        cb(JSON.parse(xhttp.responseText))
      } else if (this.status == 0) {
        cbfail("Conection refused")
      }
    }
  }
  xhttp.open("POST", backend+path, true)
  xhttp.send(data)
}

function _ppp(array) {
  var str = ""
  for (var i=0;i<array.length;i++) {
    if (str.length) {
      str+="&"
    }
    str+=encodeURIComponent(array[i][0])+"="+encodeURIComponent(array[i][1])
  }
  return str
}








// Geni Data handling functions
function _getId(gid) {
  if (!gid) return gid
  if (gid in ___geniNodes) {
    return ___geniNodes[gid][0]
  }
  return "G"+gid
}

function _handleGeniData(data) {
  key="G"+data[_KEY_GENI_ID]
  var i,l=data[_KEY_GENI_CHILDREN].length;
  data[_KEY_CHILDREN]=[]
  for (i=0;i<l;++i) {
    data[_KEY_CHILDREN].push(_getId(data[_KEY_GENI_CHILDREN][i][_KEY_GENI_ID]))
  }
  data[_KEY_MOTHER]=_getId(data[_KEY_GENI_MOTHER][_KEY_GENI_ID])
  data[_KEY_FATHER]=_getId(data[_KEY_GENI_FATHER][_KEY_GENI_ID])
  if (data[_KEY_GENI_ID] in ___geniNodes) {
    cdata=___data[_getId(data[_KEY_GENI_ID])]
    for (i=0;i<l;++i) {
      if (data[_KEY_CHILDREN][i][0]=="G") cdata[_KEY_CHILDREN].push(data[_KEY_CHILDREN][i])
      else {
        if (!(cdata[_KEY_CHILDREN].includes(data[_KEY_CHILDREN][i]))) {
          cdata[_KEY_CHILDREN].push(data[_KEY_CHILDREN][i])
        }
      }
    }
    if (data[_KEY_MOTHER] && !cdata[_KEY_MOTHER]) {
      cdata[_KEY_MOTHER]=data[_KEY_MOTHER]
    }
    if (data[_KEY_FATHER] && !cdata[_KEY_FATHER]) {
      cdata[_KEY_FATHER]=data[_KEY_FATHER]
    }
  }
  ___geniData[key]=data
  ___geniData.LD=0
  if(___useGeni)_draw()
}

___geniDataLoading=0
___geniLoadIndex=0
function _geniLoadNext() {
  if (___geniLoadIndex>=___geniDataLoadList.length) {
    ___geniDataLoadList.length=0
    ___geniDataLoading=0
  } else {
    ___geniLoadIndex++
    _pr("", _ppp([[_PARAM_GENI_ID, ___geniDataLoadList[___geniLoadIndex-1].substring(1)], [_PARAM_GENI_FUNIONS, 1]]), function(data){_handleGeniData(data);_geniLoadNext();}, 120000, ___geni_api)
  }
}

function _loadGeniData() {
  if (___geniDataLoading) return
  ___geniDataLoading=1
  ___geniLoadIndex=0
  _geniLoadNext()
}
function _fetchGeniData(c) {
  if (c in ___geniData) return;
  ___geniData[c]={}
  ___geniData[c].LD=1
  ___geniDataLoadList.push(c)
  _loadGeniData();
}

function _getData(c) {
  if (!c) return 
  if (c[0]=="G") {
    if (!(c in ___geniData)) {
      if (!___useGeni) return 
      _fetchGeniData(c)
    }
    return ___geniData[c]
  }
  var data=___data[c]
  if (data[_KEY_GENI_ID] && ___useGeni)  {
    var key="G"+data[_KEY_GENI_ID]
    if (!(key in ___geniData)) {
      _fetchGeniData(key)
    }
    data.LD=___geniData[key].LD
  }
  return data
}


// TREE DRAWING FUNCTIONS


 // the width and height of
var ___WIDTH=0
var ___HEIGHT=0

// up 

function _drawLineTo(f, m, xx, yy) {
  var ctx = ___canvas.getContext("2d")
  ctx.beginPath()
  
  var dataf=_getData(f)
  var datam=_getData(m)
  if (dataf && datam) {
    var px = (dataf.X+_W+datam.X)/2
    var py = dataf.Y+_H
    
    var x = xx+(_W+_M)/2
    var y = yy
    
    ctx.moveTo(px, py)
    ctx.lineTo(px, py+2*_HG/3)
    ctx.lineTo(x, py+2*_HG/3)
    ctx.lineTo(x, y)
  } else if (dataf||datam) {
    var datap=dataf?dataf:datam
    var px = datap.X+(_W+_M)/2
    var py = datap.Y+_H
    var x = xx+(_W+_M)/2
    var y = yy
    ctx.moveTo(px, py)
    ctx.lineTo(px, py+_HG/3)
    ctx.lineTo(x, py+_HG/3)
    ctx.lineTo(x, y)
  } else return 
  ctx.stroke()
}

function _drawLine(f, m, c) {
  var data=_getData(c)
  if (!data) return;
  _drawLineTo(f, m, data.X, data.Y)
}

function _cszu(c, d) {
  var data=_getData(c)
  if (!data) return 0;
  var rv=1
  data.W=_W+_M
  data.addFather=false
  data.addMother=false
  if (d>0) {
    var cw=_M
    if (data[_KEY_FATHER]) {
      rv=Math.max(rv, 1+_cszu(data[_KEY_FATHER], d-1))
      var fdata=_getData(data[_KEY_FATHER])
      if (fdata) cw+=fdata.W
    } else if (c[0]!="G") {
      rv=Math.max(rv, 2)
      cw+=_W+_M
      data.addFather=true
    }
    if (data[_KEY_MOTHER]) {
      rv=Math.max(rv, 1+_cszu(data[_KEY_MOTHER], d-1))
      var mdata=_getData(data[_KEY_MOTHER])
      if (mdata) cw+=mdata.W
    } else if (c[0]!="G") {
      rv=Math.max(rv, 2)
      cw+=_W+_M
      data.addMother=true
    }
    data.W=Math.max(data.W, cw)
  }
  return rv
}

function _cxyu(c, d, x, y) {
  var data=_getData(c)
  if (!data) return;
  if (data[_KEY_GENDER]==_VALUE_GENDER_MALE) {
    data.X=(x+data.W)-(_W+_M)
  } else {
    data.X=x
  }
  data.Y=y
  if (d!=___up){
    ___WIDTH = Math.max(___WIDTH, data.X+_W)
    ___HEIGHT = Math.max(___HEIGHT, data.Y+_H)
  }
  
  if (d>0) {
    if (data[_KEY_FATHER]) {
      _cxyu(data[_KEY_FATHER], d-1, x, y-_H-_HG)
      var fdata=_getData(data[_KEY_FATHER])
      if (fdata) x+=fdata.W
    } else if (data.addFather) {
      data.addFatherX=x
      x+=_W+_M
      data.addFatherY=y-_H-_HG
      ___WIDTH = Math.max(___WIDTH, data.addFatherX+_W)
      ___HEIGHT = Math.max(___HEIGHT, data.addFatherY+_H)
    }
    if (data[_KEY_MOTHER]) {
      _cxyu(data[_KEY_MOTHER], d-1, x, y-_H-_HG)
      var mdata=_getData(data[_KEY_MOTHER])
      if (mdata) x+=mdata.W
    } else if (data.addMother) {
      data.addMotherX=x
      x+=_W+_M
      data.addMotherY=y-_H-_HG
      ___WIDTH = Math.max(___WIDTH, data.addMotherX+_W)
      ___HEIGHT = Math.max(___HEIGHT, data.addMotherY+_H)
    }
  }
}

// down
function _cszd(c, d) {
  var data=_getData(c)
  if (!data) return;
  data.W=_W+_M
  if (data.mar) {
    data.W+=_W+_M+_M+_M
  }
  data.addChild=false
  if (d>0) {
    var cw=_M
    for (var i in data[_KEY_CHILDREN]) {
      var w=data[_KEY_CHILDREN][i]
      var wdata=_getData(w)
      if (!wdata) continue
      _cszd(w, d-1)
      cw+=wdata.W
    }
    if (data.mar && c[0]!="G") {
      data.addChild=true
      cw+=_W+_M
    }
    
    data.W=Math.max(data.W, cw)
  }
}

function _cxyd(c, d, x, y) {
  var data=_getData(c)
  if (!data) return;
  var wdata=_getData(data.mar)
  if (wdata) {
    data.Y=y
    wdata.Y=y
    if (data[_KEY_GENDER]==_VALUE_GENDER_MALE) {
      data.X=(x+data.W/2)-_W
      wdata.X=(x+data.W/2)
    } else {
      data.X=(x+data.W/2)
      wdata.X=(x+data.W/2)-_W
    }
  } else {
    data.X=(x+data.W/2)-(_W+_M)/2
    data.Y=y
  }
  ___WIDTH = Math.max(___WIDTH, data.X+_W)
  ___HEIGHT = Math.max(___HEIGHT, data.Y+_H)
  
  if (d>0) {
    for (var i in data[_KEY_CHILDREN]) {
      var w=data[_KEY_CHILDREN][i]
      var wdata=_getData(w)
      if (!wdata) continue
      _cxyd(w, d-1, x, y+_H+_HG)
      x+=wdata.W
    }
    if (data.addChild) {
      data.addChildX=x
      data.addChildY=y+_H+_HG
      ___WIDTH=Math.max(___WIDTH, data.addChildX+_W)
      ___HEIGHT=Math.max(___HEIGHT, data.addChildY+_H)
    }
  }
}


function _csz() {
  var realUp=_cszu(___root, ___up)-1
  var data=_getData(___root)
  if (!data) return;
  var wu=data.W
  _cszd(___root, ___down)
  var wd=data.W
  var w=Math.max(wd, wu)
  _cxyu(___root, ___up, (w-wu)/2+_MLEFT, (_H+_HG)*realUp+_MTOP)
  _cxyd(___root, ___down, (w-wd)/2+_MLEFT, (_H+_HG)*realUp+_MTOP)
}

function _drawAddCell(x, y, data) {
  var el = document.createElement("div")
  el.style.width = _W
  el.style.height = _H
  el.style.position="absolute"
  el.style.left=x
  el.style.top=y
  el.textContent = "+"
  el.style.fontSize = _FSZ
  
  el.style.backgroundColor="#eee"

  el.onclick=function(){_createPerson(data)}
  el.style.cursor="pointer"

  ___element.appendChild(el)
}


function _addFormattedText(el, text) {
  /* Adds text to el, formatting *bold*, _italix_, /underlined/, ~strikethrough~ */
  var ignore=[0]
  var bix=-1,bolda=[]
  var iix=-1,ita=[]
  var uix=-1,unda=[]
  var six=-1,stra=[]

  var i, l=text.length-1
  for (i=0;i<l;++i) { ignore.push(0)
    if (text[i]!=" " && text[i+1]!=" ") {
      if      (text[i]=="*") bix=i
      else if (text[i]=="_") iix=i
      else if (text[i]=="/") uix=i
      else if (text[i]=="~") six=i
      else if (text[i+1]=="*" && bix!=-1) {
        bolda.push([bix, i+1])
        ignore[bix]=1
        ignore[i+1]=1
        bix=-1
      } else if (text[i+1]=="_" && iix!=-1) {
        ita.push([iix, i+1])
        ignore[iix]=1
        ignore[i+1]=1
        iix=-1
      } else if (text[i+1]=="/" && uix!=-1) {
        unda.push([uix, i+1])
        ignore[uix]=1
        ignore[i+1]=1
        uix=-1
      } else if (text[i+1]=="~" && six!=-1) {
        stra.push([six, i+1])
        ignore[six]=1
        ignore[i+1]=1
        six=-1
      }
    }
  }
  var tmp="",elstack=[el]

  bix=0;var bold=0
  iix=0;var it=0
  uix=0;var und=0
  six=0;var str=0
  for (++l,i=0;i<l;++i) {
    if (bix<bolda.length && bolda[bix][bold]==i) {
      if (bold=1-bold) {
        elstack[elstack.length-1].appendChild(document.createTextNode(tmp))
        elstack.push(document.createElement("b"))
      } else { ++bix
        elstack[elstack.length-1].appendChild(document.createTextNode(tmp))
        elstack[elstack.length-2].appendChild(elstack.pop())
      } tmp=""
    } else if (iix<ita.length && ita[iix][it]==i) {
      if (it=1-it) {
        elstack[elstack.length-1].appendChild(document.createTextNode(tmp))
        elstack.push(document.createElement("i"))
      } else { ++iix
        elstack[elstack.length-1].appendChild(document.createTextNode(tmp))
        elstack[elstack.length-2].appendChild(elstack.pop())
      } tmp=""
    } else if (uix<unda.length && unda[uix][und]==i) {
      if (und=1-und) {
        elstack[elstack.length-1].appendChild(document.createTextNode(tmp))
        elstack.push(document.createElement("u"))
      } else { ++uix
        elstack[elstack.length-1].appendChild(document.createTextNode(tmp))
        elstack[elstack.length-2].appendChild(elstack.pop())
      } tmp=""
    } else if (six<stra.length && stra[six][str]==i) {
      if (str=1-str) {
        elstack[elstack.length-1].appendChild(document.createTextNode(tmp))
        elstack.push(document.createElement("s"))
      } else { ++six
        elstack[elstack.length-1].appendChild(document.createTextNode(tmp))
        elstack[elstack.length-2].appendChild(elstack.pop())
      } tmp=""
    }
    if (ignore[i]) continue
    tmp+=text[i]
  }
  elstack[elstack.length-1].appendChild(document.createTextNode(tmp))
}



function _addCellContent(el, c) {
  var data=_getData(c)
  _addFormattedText(el, (data[_KEY_FIRSTNAMES]?data[_KEY_FIRSTNAMES]:"")+" "+(data[_KEY_SURNAME]?data[_KEY_SURNAME]:""))
  el.style.fontSize = _FSZ
  
  if (data[_KEY_MAIDENNAME]) {
    el.appendChild(document.createElement("br"))
    var sm = document.createElement("span")
    sm.style.fontSize = _FSZ_SM
    sm.textContent="o.s. "+data[_KEY_MAIDENNAME]
    el.appendChild(sm)
  }
  el.appendChild(document.createElement("br"))
  var sm = document.createElement("span")
  sm.style.fontSize = _FSZ_SM
  if (data[_KEY_BORN] && (_EDITMODE || !(data[_KEY_BORN_RAW]>19000 && data[_KEY_BORN_RAW]<222222))) sm.appendChild(document.createTextNode("s. "+data[_KEY_BORN]))
  if (data[_KEY_BORN] && data[_KEY_DIED]) sm.appendChild(document.createElement("br"))
  if (data[_KEY_DIED]) sm.appendChild(document.createTextNode("k. "+data[_KEY_DIED]))

  el.appendChild(sm)
}

function _drawCell(c, visible) {
  var data=_getData(c)
  if (!data) return;
  var el = document.createElement("div")
  var data=_getData(c)
  el.style.width = _W
  el.style.height = _H
  el.style.position="absolute"
  el.style.left=data.X
  el.style.top=data.Y
  if (visible) {
    ___visible.push(c)
    if (___wasVisible.includes(c)) {
      el.style.left=data.prevX
      el.style.top=data.prevY
      ___animMoving.push([c, el])
    } else {
      el.style.opacity=0
      ___animIn.push([c, el])
    }
  } else {
    ___animOut.push([c, el])
  }
  
  data.xx=data.prevX
  data.yy=data.prevY
  data.prevX=data.X
  data.prevY=data.Y
  if (data.LD && ___useGeni) {
    var ld=document.createElement("div")
    ld.className="t"
    el.appendChild(ld)
  }
  _addCellContent(el, c)
  
  if (c[0]=="G") {
    if (c==___root)el.style.backgroundColor=data[_KEY_GENDER]==_VALUE_GENDER_MALE?"#dff":(data[_KEY_GENDER]==_VALUE_GENDER_FEMALE?"#ffd":"#eee")
    else el.style.backgroundColor=data[_KEY_GENDER]==_VALUE_GENDER_MALE?"#ddf":(data[_KEY_GENDER]==_VALUE_GENDER_FEMALE?"#fdd":"#ddd")
  }else{
    if (c==___root)el.style.backgroundColor=data[_KEY_GENDER]==_VALUE_GENDER_MALE?"#cff":"#ffc"
    else el.style.backgroundColor=data[_KEY_GENDER]==_VALUE_GENDER_MALE?"#ccf":"#fcc"
  }

  if (data[_KEY_GENI_ID]) {
    el.style.borderStyle="dotted"
    el.style.borderWidth="2"
  }
    
  if (visible) {
    el.onclick=function(){e(c)}
    el.style.cursor="pointer"
    if (_EDITMODE && c[0]!="G") {
      var ed=document.createElement("div")
      ed.style.width = _W/5.0
      ed.style.height = _W/5.0
      ed.style.position="absolute"
      ed.style.cursor="pointer"
      ed.style.top=-_W/6.0
      ed.style.right=-_W/10.0
      ed.style.backgroundColor="#ccc"

      ed.onclick=function(event){event.stopPropagation();_openPerson(c)}
      ed.style.zIndex=500
      el.appendChild(ed)
      
      if (!data.mar) {
        var mar=document.createElement("div")
        var marU=document.createElement("div")
        var marD=document.createElement("div")
        SZ=_W/7.0
        mar.style.width = SZ
        mar.style.height = SZ
        mar.style.position="absolute"
        mar.style.cursor="pointer"
        mar.style.bottom=-SZ/2
        mar.style.right=-SZ/2
        mar.style.backgroundColor="#f66"
        marU.style.width = SZ
        marU.style.height = SZ
        marU.style.position="absolute"
        marU.style.cursor="pointer"
        marU.style.bottom=0
        marU.style.right=-SZ/2
        marU.style.backgroundColor="#f66"
        marU.style.borderRadius="50%"
        marU.style.webKitBorderRadius="50%"
        marU.style.MozBorderRadius="50%"
        marD.style.width = SZ
        marD.style.height = SZ
        marD.style.position="absolute"
        marD.style.cursor="pointer"
        marD.style.bottom=-SZ/2
        marD.style.right=-SZ
        marD.style.backgroundColor="#f66"
        marD.style.borderRadius="50%"
        marD.style.webKitBorderRadius="50%"
        marD.style.MozBorderRadius="50%"

        var marry=function(event){
          event.stopPropagation();
          var ndata={}
          ndata[_KEY_GENDER]=data[_KEY_GENDER]==_VALUE_GENDER_MALE?_VALUE_GENDER_FEMALE:_VALUE_GENDER_MALE
          ndata[_KEY_SURNAME]=data[_KEY_SURNAME]
          ndata[_KEY_MARRIED]=[[c, _VALUE_MARRIAGE_CURRENT]]
          _createPerson(ndata)
        }
        mar.onclick=marry
        marU.onclick=marry
        marD.onclick=marry
        mar.style.zIndex=500
        marU.style.zIndex=499
        marD.style.zIndex=499
        el.appendChild(mar)
        el.appendChild(marU)
        el.appendChild(marD)
      } 
    }else if (!_EDITMODE && data[_KEY_GENI_ID]) {
      var ed=document.createElement("div")
      ed.style.width = _W/5.0
      ed.style.height = _W/5.0
      ed.style.position="absolute"
      ed.style.cursor="pointer"
      ed.style.top=-_W/6.0
      ed.style.right=-_W/10.0
      ed.style.backgroundColor="#ccc"
      ed.value=data[_KEY_GENI_ID]="https://www.geni.com/api/profile-"+data[_KEY_GENI_ID]

      ed.onclick=function(event){
        event.stopPropagation()
        window.open(ed.value)
      }
      ed.style.zIndex=500
      el.appendChild(ed)
    }
  }
  
  ___element.appendChild(el)
}



function _drawd(c, d) {
  var data = _getData(c)
  if (!data) return

  _drawCell(c, true)
  if (data.mar) {
    _drawCell(data.mar, true)
  }
  if (d>0) {
    for (var i in data[_KEY_CHILDREN]) {
      var w=data[_KEY_CHILDREN][i]
      var wdata=_getData(w)
      if (!wdata) continue
      if (data[_KEY_GENDER]==_VALUE_GENDER_MALE) {
        if (wdata[_KEY_MOTHER] == data.mar)  _drawLine(c, data.mar, w)
        else  _drawLine(c, 0, w)
      } else {
        if (wdata[_KEY_FATHER] == data.mar) _drawLine(data.mar, c, w)
        else  _drawLine(0, c, w)
      }
      _drawd(w, d-1)
    }
    if (data.addChild && _EDITMODE) {
      _drawLineTo(c, data.mar, data.addChildX, data.addChildY)
      var ndata={}
      if (data[_KEY_GENDER]==_VALUE_GENDER_MALE) {
        ndata[_KEY_FATHER]=c
        ndata[_KEY_MOTHER]=data.mar
      } else {
        ndata[_KEY_FATHER]=data.mar
        ndata[_KEY_MOTHER]=c
      }
      if (___data[ndata[_KEY_FATHER]][_KEY_SURNAME]==___data[ndata[_KEY_MOTHER]][_KEY_SURNAME]) ndata[_KEY_SURNAME]=data[_KEY_SURNAME]
      _drawAddCell(data.addChildX, data.addChildY, ndata)
    }
  }
}

function _drawu(c, d) {
  if (d>0) {
    var data = _getData(c)
    if (!data) return

    _drawLine(data[_KEY_FATHER], data[_KEY_MOTHER], c)
    if (data[_KEY_FATHER]) {
      _drawCell(data[_KEY_FATHER], true)
      _drawu(data[_KEY_FATHER], d-1)
    } else if (data.addFather && _EDITMODE) {
      var ndata={}
      ndata[_KEY_GENDER]=_VALUE_GENDER_MALE
      ndata[_KEY_CHILDREN]=[c]
      if (data[_KEY_MOTHER]) {
        ndata[_KEY_MARRIED]=[[data[_KEY_MOTHER], _VALUE_MARRIAGE_CURRENT]]
      }
      _drawAddCell(data.addFatherX, data.addFatherY, ndata)
    }
    if (data[_KEY_MOTHER]) {
      _drawCell(data[_KEY_MOTHER], true)
      _drawu(data[_KEY_MOTHER], d-1)
    } else if (data.addMother && _EDITMODE) {
      var ndata={}
      ndata[_KEY_GENDER]=_VALUE_GENDER_FEMALE
      ndata[_KEY_CHILDREN]=[c]
      if (data[_KEY_FATHER]) {
        ndata[_KEY_MARRIED]=[[data[_KEY_FATHER], _VALUE_MARRIAGE_CURRENT]]
      }
      _drawAddCell(data.addMotherX, data.addMotherY, ndata)
    }
  }
}

function _drawAnimOut() {
  var i, l
  l=___wasVisible.length
  for (i=0;i<l;i++) {
    if (___visible.includes(___wasVisible[i])) continue
    _drawCell(___wasVisible[i], false)
  }
}
function _draw() {
  if (___root == null) return
  ___animMoving=[]
  ___animIn=[]
  ___animOut=[]  
  
  ___element.innerHTML=""
  ___WIDTH=0
  ___HEIGHT=0
  _csz()
  ___canvas.width=___WIDTH+_MLEFT+_MRIGHT
  ___canvas.height=___HEIGHT+_MBOTTOM
  ___canvas.style.width=___WIDTH+_MLEFT+_MRIGHT
  ___canvas.style.height=___HEIGHT+_MBOTTOM
  ___wasVisible=___visible
  ___visible=[]

  _drawd(___root, ___down)
  _drawu(___root, ___up)

  _drawAnimOut()
  ___canvas.style.visibility="hidden"

  var pos=0
  var id = setInterval(frame, 20);
  function frame(){
    var i, l
    var el, c, data
    if (pos < 100) {
      l=___animMoving.length
      for (i=0;i<l;i++) {
        c=___animMoving[i][0]
        el=___animMoving[i][1]
        data=_getData(c)
        if (!data) {el.style.visibility="hidden";continue}
        el.style.left = (data.X*pos/100.0 + data.xx*(100-pos)/100.0)
        el.style.top = (data.Y*pos/100.0 + data.yy*(100-pos)/100.0)
      }
      l=___animIn.length
      for (i=0;i<l;i++) {
        ___animIn[i][1].style.opacity = pos/100.0
      }
      l=___animOut.length
      for (i=0;i<l;i++) {
        ___animOut[i][1].style.opacity = 1-pos/100.0
      }
      pos+=8
    } else {
      clearInterval(id)
      ___canvas.style.visibility="visible"

      l=___animMoving.length
      for (i=0;i<l;i++) {
        c=___animMoving[i][0]
        el=___animMoving[i][1]
        data=_getData(c)
        if (!data) {el.style.visibility="hidden";continue}
        el.style.left = data.X
        el.style.top = data.Y
      }
      l=___animIn.length
      for (i=0;i<l;i++) {
        ___animIn[i][1].style.opacity = 1
      }
      l=___animOut.length
      for (i=0;i<l;i++) {
        ___animOut[i][1].opacity=0
        ___animOut[i][1].remove()
      }
    }
  }
}








// 
function _getHashVariables() {
  var vars=document.location.hash.substr(1).split("&")
  var i, l=vars.length
  for (i=0;i<l;++i) {
    var v=vars[i].split("=")
    ___hashVariables[v[0]]=v[1]
  }
}

function _setHashVariable(key, value) {
  ___hashVariables[key]=value
  var hash=""
  for (var i in ___hashVariables) {
    if (!i) continue
    if (hash.length)hash+="&"
    hash+=i+"="+___hashVariables[i]
  }
  document.location.hash=hash
}
function _getHashVariable(key) {
  _getHashVariables()
  return ___hashVariables[key]
}



function _match2(a, b) {
  var i,l=a.length
  var j,ll=b.length
  var e=0
  for (i=0;i<l;i++) {
    e=0
    for (j=0;j<ll;j++) {
      if (b[j].startsWith(a[i])) {
        e=1
        break
      }
    }
    if (!e) return 0;
  }
  return 1;
}

function _match(kw, firstnames, nickname, surname, oname) {
  var regex=/[^a-zA-Z ]+/g
  var f=firstnames.replace(regex, "").toLowerCase().split(" ")
  var n=nickname.replace(regex, "").toLowerCase().split(" ")
  var s=surname.replace(regex, "").toLowerCase().split(" ")
  var o=oname.replace(regex, "").toLowerCase().split(" ")
  return _match2(kw, f.concat(n).concat(s).concat(o))
}

function _search(keywords, maxLen, filter) {
  var b=performance.now()
  var b1=0, b2=0
  var kw=_splitName(keywords)
  var array=[]
  var tests=0
//  for (var ii=0;ii<100;++ii){
    array.length=0
  if (keywords[0]=="#" && keywords.substring(1) in ___data) {
    array.push(keywords.substring(1))
  }
    // TODO: handle filter change...
    var i=0
    var bb=performance.now()
    if (keywords && ___searchLast.startsWith(keywords)) { // removed characters from the end, all previous results match
      for (var j=0,l=___searchRes.length;j<l;++j) array.push(___searchRes[j])
    } else if (___searchLast && keywords.startsWith(___searchLast)) { // added characters to the end, filter results from last results and continue search from last pos 
      i=___searchPos
      if (___processingDone) {
        for (var j=0,l=___searchRes.length;j<l;++j) { ++tests
          var c=___searchRes[j]
          if (filter && !filter(c)) continue
          if (_match2(kw, ___data[c].NN)) {
            array.push(c)
            if (array.length >= maxLen) break
          }
        }
      } else {
        for (var j=0,l=___searchRes.length;j<l;++j) { ++tests
          var c=___searchRes[j]
          if (filter && !filter(c)) continue
          if (_match(kw, ___data[c][_KEY_FIRSTNAMES], ___data[c][_KEY_NICKNAME], ___data[c][_KEY_SURNAME], ___data[c][_KEY_MAIDENNAME])) {
            array.push(c)
            if (array.length >= maxLen) break
          }
        }
      }
    }
    b1+=performance.now()-bb;bb=performance.now()
    if (array.length<maxLen) {
      if (___processingDone) {
        for (var l=___dataKeys.length;i<l;++i) { ++tests
          var c=___dataKeys[i]
          if (filter && !filter(c)) continue
          if (___searchRes.includes(c)) continue
          if (_match2(kw, ___data[c].NN)) {
            array.push(c)
            if (array.length >= maxLen) {++i;break}
          }
        }
      } else {
        for (var l=___dataKeys.length;i<l;++i) { ++tests
          var c=___dataKeys[i]
          if (filter && !filter(c)) continue
          if (___searchRes.includes(c)) continue
          if (_match(kw, ___data[c][_KEY_FIRSTNAMES], ___data[c][_KEY_NICKNAME], ___data[c][_KEY_SURNAME], ___data[c][_KEY_MAIDENNAME])) {
            array.push(c)
            if (array.length >= maxLen) {++i;break}
          }
        }
      }
    }
    b2+=performance.now()-bb
//  }
  ___searchRes.length=0
    for (var j=0,l=array.length;j<l;++j) ___searchRes.push(array[j])
  ___searchPos=i
  ___searchLast=keywords

  return array
}



function _createPersonSelector(baseElement, value, cb, filter) {
  baseElement.innerHTML=""
  var el = document.createElement("div")
  if (value && value[0]!="G") {
    _addFormattedText(el, ___data[value][_KEY_FIRSTNAMES]+" "+___data[value][_KEY_SURNAME]+" ("+value+")")
    var r=document.createElement("div")
    r.style.width="20px"
    r.style.height="20px"
    r.style.position="absolute"
    r.style.top="0px"
    r.style.right="0px"
    r.style.marginRight="-30px"
    r.textContent="X"
    r.style.cursor="pointer"
    r.style.backgroundColor="#f00"
    r.style.zIndex=1000
    r.onclick=function() {
      _createPersonSelector(baseElement, null, cb, filter)
      cb(null)
    }
    el.appendChild(r)
  } else {
    el.textContent="N/A"
  }
  el.width="50px"
  el.height="20px"
  el.style.marginRight="30px"
  el.style.position="relative"
  el.style.cursor="pointer"


  var sec = document.createElement("div")
  sec.style.width="640px"
  sec.style.position="fixed"
  sec.style.zIndex=1001

  var se = document.createElement("div")
  se.style.width="600px"
  se.style.position="fixed"
  se.style.overflowY="scroll"
  se.style.overflowX="hidden"
  se.style.maxHeight="150px"
  
  var secross = document.createElement("div")
  secross.style.width="40px"
  secross.style.height="40px"
  secross.style.backgroundColor="#f00"
  secross.style.cursor="pointer"
  secross.style.display="none"
  secross.style.position="fixed"
  secross.style.marginLeft="600px"
  secross.onclick=(function(){var s=secross;var sse=se;return function() {
    s.style.display="none"
    sse.innerHTML=""
  }})()

  sec.appendChild(se)
  sec.appendChild(secross)

  el.onclick=(function(){var s=secross;var sse=se;return function() {
    s.style.display="block"
    sse.innerHTML=""
    var input=i(sse, function(k) {
      _createPersonSelector(baseElement, k, cb, filter)
      cb(k)
    }, filter, function(){s.style.display="none";sse.innerHTML=""})
    input.focus()
  }})()
  baseElement.value=value
  baseElement.appendChild(el)  
  baseElement.appendChild(sec)  
}


function _nameScore(name1, name2) {
  var v1=name1.split(" ")
  var v2=name2.split(" ")
  var error_score=0
  var common=0
  for (var i=0,l=v1.length;i<l;++i) {
    if (v2.indexOf(v1[i])<0) error_score++
    else common=1
  }
  for (var i=0,l=v2.length;i<l;++i) {
    if (v1.indexOf(v2[i])<0) error_score++
    else common=1
  }
  if (!common) error_score+=50
  return error_score
}



function _yearFromRawDate(date) {
  while (date>=10000) date/=10
  return date
}

function _createGeniFindMatchAndApply(el, geniData, matchFrom, forceMatch) {
  if (!geniData) return
  var bestMatch=null
  var bestValue=forceMatch?1e9:10
  if (geniData[_KEY_GENI_ID] in ___geniNodes) {
    bestMatch=___geniNodes[geniData[_KEY_GENI_ID]][0]
    bestValue=-1
  }else{
    for (var i in matchFrom) {
      if (matchFrom[i] in ___data) {
        var data = ___data[matchFrom[i]]
        var value=_nameScore(data[_KEY_FIRSTNAMES], geniData[_KEY_FIRSTNAMES])
        var b1=_yearFromRawDate(data[_KEY_BORN_RAW])
        var b2=_yearFromRawDate(geniData[_KEY_BORN_RAW])
        if (b1 && b2) value+=Math.abs(b1-b2)
        if (value<bestValue) {
          bestValue=value
          bestMatch=matchFrom[i]
        }
      }
    }
  }
  var input=document.createElement("input")
  var linkB=document.createElement("button")
  linkB.textContent="Link"
  if (bestMatch) {
    input.value=bestMatch
    console.log(bestMatch)
    if (___data[bestMatch][_KEY_GENI_ID]==geniData[_KEY_GENI_ID]) {
      linkB.disabled=true
    }
  }
  linkB.onclick=function() {
    var c=input.value
    if (c in ___data) {
      linkB.disabled=true
      var uplist=[
              [_PARAM_ID, c], 
              [_PARAM_SURNAME, ___data[c][_KEY_SURNAME]], 
              [_PARAM_FIRSTNAMES, ___data[c][_KEY_FIRSTNAMES]],
              [_PARAM_NICKNAME, ___data[c][_KEY_NICKNAME]],
              [_PARAM_MAIDEN_NAME, ___data[c][_KEY_MAIDENNAME]],
              [_PARAM_GENDER, ___data[c][_KEY_GENDER]==_VALUE_GENDER_MALE?"1":"0"],
              [_PARAM_BORN,___data[c][_KEY_BORN_RAW]],
              [_PARAM_DIED, ___data[c][_KEY_DIED_RAW]],
              [_PARAM_BIRTH_LOCATION, geniData[_KEY_BIRTH_LOCATION]],
              [_PARAM_DEATH_LOCATION, geniData[_KEY_DEATH_LOCATION]],
              [_PARAM_DETAILS, ___data[c][_KEY_DETAILS]],
              [_PARAM_GENI_ID, geniData[_KEY_GENI_ID]],
              [_PARAM_SOURCES, ""],
            ]
      _pr(_PATH_EDIT_PERSON, _ppp(uplist),
        function(data) {
          _reload()
        })
    } else{
      alert("invalid id!")
    }
  }
  var createAsNew=document.createElement("button")
  createAsNew.textContent="Create As New"
  if (geniData[_KEY_GENI_ID] in ___geniNodes) createAsNew.disabled=true
  createAsNew.onclick=function() {
    createAsNew.disabled=true
    if (!(geniData[_KEY_GENI_ID] in ___geniNodes)) {
      _pr("", _ppp([[_PARAM_GENI_ID, geniData[_KEY_GENI_ID]], [_PARAM_GENI_FUNIONS, 1]]), function(geniData) {
        var uplist=[
                [_PARAM_SURNAME, geniData[_KEY_SURNAME]], 
                [_PARAM_FIRSTNAMES, geniData[_KEY_FIRSTNAMES]],
                [_PARAM_NICKNAME, geniData[_KEY_NICKNAME]],
                [_PARAM_MAIDEN_NAME, geniData[_KEY_MAIDENNAME]],
                [_PARAM_GENDER, geniData[_KEY_GENDER]==_VALUE_GENDER_MALE?"1":"0"],
                [_PARAM_BORN, geniData[_KEY_BORN_RAW]],
                [_PARAM_DIED, geniData[_KEY_DIED_RAW]],
                [_PARAM_BIRTH_LOCATION, geniData[_KEY_BIRTH_LOCATION]],
                [_PARAM_DEATH_LOCATION, geniData[_KEY_DEATH_LOCATION]],
                [_PARAM_DETAILS, geniData[_KEY_DETAILS]],
                [_PARAM_GENI_ID, geniData[_KEY_GENI_ID]],
                [_PARAM_SOURCES, ""],
              ]
        
        if (geniData[_KEY_GENI_FATHER] && (geniData[_KEY_GENI_FATHER][_KEY_GENI_ID] in ___geniNodes)) uplist.push([_PARAM_FATHER, ___geniNodes[geniData[_KEY_GENI_FATHER][_KEY_GENI_ID]][0]])
        if (geniData[_KEY_GENI_MOTHER] && (geniData[_KEY_GENI_MOTHER][_KEY_GENI_ID] in ___geniNodes)) uplist.push([_PARAM_MOTHER, ___geniNodes[geniData[_KEY_GENI_MOTHER][_KEY_GENI_ID]][0]])
        var marriages=""
        var i,l=geniData[_KEY_GENI_MARRIED].length
        for (i=0;i<l;++i) {
          var spousegid = geniData[_KEY_GENI_MARRIED][i][_KEY_GENI_ID]
          if (spousegid in ___geniNodes) {
            if (marriages.length) marriages+=","
            marriages+=___geniNodes[spousegid][0]+"."+(i==l-1?_VALUE_MARRIAGE_CURRENT:_VALUE_MARRIAGE_DIED) // TODO: add to geni api some more information about marriage...
          }
        }
        uplist.push([_PARAM_MARRIED, marriages])
        l=geniData[_KEY_GENI_CHILDREN].length
        var children=""
        for (i=0;i<l;++i) {
          var childgid = geniData[_KEY_GENI_CHILDREN][i][_KEY_GENI_ID]
          if (childgid in ___geniNodes) {
            if (children.length) children+=","
            children+=___geniNodes[childgid][0]
          }
        }
        uplist.push([_PARAM_CHILDREN, children])
        
        _pr(_PATH_ADD_PERSON, _ppp(uplist),
          function(data) {
            _reload(_reloadInfoDivs)
            // TODO: 
          })
      }, 20000, ___geni_api, function(message){
        alert(message)
      })
    } else{
      alert("Geni node with same id already exists!")
    }
  }
  el.appendChild(input)
  el.appendChild(linkB)
  el.appendChild(createAsNew)
}

function _createGeniUserName(el, geniData) {
  if (!geniData) return
  if (_KEY_GENI_PROFILE_URL in geniData) {
    var el_url = document.createElement("a")
    el_url.href = geniData[_KEY_GENI_PROFILE_URL]
    el_url.textContent = geniData[_KEY_FIRSTNAMES]+" "+geniData[_KEY_SURNAME]
    el.appendChild(el_url)
  }
  el.appendChild(document.createTextNode(" <"))
  var url2 = document.createElement("a")
  url2.href="https://www.geni.com/api/profile-"+geniData[_KEY_GENI_ID]
  url2.textContent=geniData[_KEY_GENI_ID]
  el.appendChild(url2)
  el.appendChild(document.createTextNode(">"))
}

function _createGeniForm(data) {
  ___infoDiv2.innerHTML=""
  ___infoDiv2.value=data[_KEY_GENI_ID]
  var t=document.createElement("div")
  var t = document.createElement("table").createTBody()

  var r = t.insertRow(-1)
  var c=r.insertCell(-1)
  var el_url = document.createElement("a")
  if (data) el_url.href = data[_KEY_GENI_PROFILE_URL]?data[_KEY_GENI_PROFILE_URL]:""
  if (data) el_url.textContent = "Geni profile page"
  c.appendChild(el_url)
  c.colSpan=3

  r = t.insertRow(-1)
  c=r.insertCell(-1)
  var el_api_url = document.createElement("a")
  if (data) el_api_url.href = "https://www.geni.com/api/profile-"+data[_KEY_GENI_ID]
  if (data) el_api_url.textContent = "Geni api page"
  c.appendChild(el_api_url)
  c.colSpan=3

  r = t.insertRow(-1)
  r.insertCell(-1).appendChild(document.createTextNode(_ASTR_FIRSTNAMES))
  var EL_FIRSTNAMES = document.createElement("input")
  if (data) EL_FIRSTNAMES.value = data[_KEY_FIRSTNAMES]?data[_KEY_FIRSTNAMES]:""
  if (EL_FIRSTNAMES.value != _EL_FIRSTNAMES.value) EL_FIRSTNAMES.style.backgroundColor="#eff"
  r.insertCell(-1).appendChild(EL_FIRSTNAMES)
  var rb=document.createElement("button")
  rb.textContent="APPLY";rb.onclick=function(){_EL_FIRSTNAMES.value=EL_FIRSTNAMES.value;EL_FIRSTNAMES.style.backgroundColor="#fff"}
  r.insertCell(-1).appendChild(rb)

  r = t.insertRow(-1)
  r.insertCell(-1).appendChild(document.createTextNode(_ASTR_NICKNAMES))
  var EL_NICKNAMES = document.createElement("input")
  if (data) EL_NICKNAMES.value = data[_KEY_NICKNAME]?data[_KEY_FIRSTNAME]:""
  if (EL_NICKNAMES.value != _EL_NICKNAMES.value) EL_NICKNAMES.style.backgroundColor="#eff"
  r.insertCell(-1).appendChild(EL_NICKNAMES)
  var rb=document.createElement("button")
  rb.textContent="APPLY";rb.onclick=function(){_EL_NICKNAMES.value=EL_NICKNAMES.value;EL_NICKNAMES.style.backgroundColor="#fff"}
  r.insertCell(-1).appendChild(rb)

  r=t.insertRow(-1)
  r.insertCell(-1).appendChild(document.createTextNode(_ASTR_SURNAME))
  var EL_SURNAME = document.createElement("input")
  if (data) EL_SURNAME.value = data[_KEY_SURNAME]?data[_KEY_SURNAME]:""
  if (EL_SURNAME.value != _EL_SURNAME.value) EL_SURNAME.style.backgroundColor="#eff"
  r.insertCell(-1).appendChild(EL_SURNAME)
  var rb=document.createElement("button")
  rb.textContent="APPLY";rb.onclick=function(){_EL_SURNAME.value=EL_SURNAME.value;EL_SURNAME.style.backgroundColor="#fff"}
  r.insertCell(-1).appendChild(rb)

  var mn = _ASTR_MAIDENNAME
  if (!data || data[_KEY_GENDER]==_VALUE_GENDER_MALE) mn=_ASTR_BACHELORNAME
  r=t.insertRow(-1)
  var mntn=document.createTextNode(mn)
  r.insertCell(-1).appendChild(mntn)
  var EL_MAIDENNAME = document.createElement("input")
  if (data) EL_MAIDENNAME.value = data[_KEY_MAIDENNAME]?data[_KEY_MAIDENNAME]:""
  if (EL_MAIDENNAME.value != _EL_MAIDENNAME.value) EL_MAIDENNAME.style.backgroundColor="#eff"
  r.insertCell(-1).appendChild(EL_MAIDENNAME)
  var rb=document.createElement("button")
  rb.textContent="APPLY";rb.onclick=function(){_EL_MAIDENNAME.value=EL_MAIDENNAME.value;EL_MAIDENNAME.style.backgroundColor="#fff"}
  r.insertCell(-1).appendChild(rb)

  r=t.insertRow(-1)
  r.insertCell(-1).appendChild(document.createTextNode(_ASTR_BORN))
  var EL_BORN = document.createElement("input")
  if (data) EL_BORN.value = data[_KEY_BORN_RAW]?data[_KEY_BORN_RAW]:""
  if (EL_BORN.value != _EL_BORN.value) EL_BORN.style.backgroundColor="#eff"
  r.insertCell(-1).appendChild(EL_BORN)
  var rb=document.createElement("button")
  rb.textContent="APPLY";rb.onclick=function(){_EL_BORN.value=EL_BORN.value;EL_BORN.style.backgroundColor="#fff"}
  r.insertCell(-1).appendChild(rb)

  r=t.insertRow(-1)
  r.insertCell(-1).appendChild(document.createTextNode(_ASTR_DIED))
  var EL_DIED = document.createElement("input")
  if (data) EL_DIED.value = data[_KEY_DIED_RAW]?data[_KEY_DIED_RAW]:""
  if (EL_DIED.value != _EL_DIED.value) EL_DIED.style.backgroundColor="#eff"
  r.insertCell(-1).appendChild(EL_DIED)
  var rb=document.createElement("button")
  rb.textContent="APPLY";rb.onclick=function(){_EL_DIED.value=EL_DIED.value;EL_DIED.style.backgroundColor="#fff"}
  r.insertCell(-1).appendChild(rb)

  r=t.insertRow(-1)
  r.insertCell(-1).appendChild(document.createTextNode(_ASTR_BIRTH_LOCATION))
  var EL_BIRTH_LOCATION = document.createElement("input")
  if (data) EL_BIRTH_LOCATION.value = data[_KEY_BIRTH_LOCATION]?data[_KEY_BIRTH_LOCATION]:""
  if (EL_BIRTH_LOCATION.value != _EL_BIRTH_LOCATION.value) EL_BIRTH_LOCATION.style.backgroundColor="#eff"
  r.insertCell(-1).appendChild(EL_BIRTH_LOCATION)
  var rb=document.createElement("button")
  rb.textContent="APPLY";rb.onclick=function(){_EL_BIRTH_LOCATION.value=EL_BIRTH_LOCATION.value;EL_BIRTH_LOCATION.style.backgroundColor="#fff"}
  r.insertCell(-1).appendChild(rb)
  
  r=t.insertRow(-1)
  r.insertCell(-1).appendChild(document.createTextNode(_ASTR_DEATH_LOCATION))
  var EL_DEATH_LOCATION = document.createElement("input")
  if (data) EL_DEATH_LOCATION.value = data[_KEY_DEATH_LOCATION]?data[_KEY_DEATH_LOCATION]:""
  if (EL_DEATH_LOCATION.value != _EL_DEATH_LOCATION.value) EL_DEATH_LOCATION.style.backgroundColor="#eff"
  r.insertCell(-1).appendChild(EL_DEATH_LOCATION)
  var rb=document.createElement("button")
  rb.textContent="APPLY";rb.onclick=function(){_EL_DEATH_LOCATION.value=EL_DEATH_LOCATION.value;EL_DEATH_LOCATION.style.backgroundColor="#fff"}
  r.insertCell(-1).appendChild(rb)


  r=t.insertRow(-1)
  r.insertCell(-1).appendChild(document.createTextNode(_ASTR_GENDER))
  var EL_GENDER_MALE = document.createElement("input")
  EL_GENDER_MALE.type="radio"
  EL_GENDER_MALE.name="gender_g"
  var EL_GENDER_FEMALE = document.createElement("input")
  EL_GENDER_FEMALE.type="radio"
  EL_GENDER_FEMALE.name="gender_g"
  EL_GENDER_MALE.onclick=function() {mntn.textContent=_ASTR_BACHELORNAME}
  EL_GENDER_FEMALE.onclick=function() {mntn.textContent=_ASTR_MAIDENNAME}

  if (data==null || typeof data[_KEY_GENDER] === "undefined" ||  data[_KEY_GENDER] == _VALUE_GENDER_MALE) EL_GENDER_MALE.checked=true
  else EL_GENDER_FEMALE.checked=true

  b=r.insertCell(-1)
  b.appendChild(EL_GENDER_MALE)
  b.appendChild(document.createTextNode(_ASTR_GENDER_MALE))
  b.appendChild(EL_GENDER_FEMALE)
  b.appendChild(document.createTextNode(_ASTR_GENDER_FEMALE))

  r=t.insertRow(-1)
  r.insertCell(-1).appendChild(document.createTextNode(_ASTR_DETAILS))
  var EL_DETAILS = document.createElement("input")
  if (data) EL_DETAILS.value = data[_KEY_DETAILS]?data[_KEY_DETAILS]:""
  if (EL_DETAILS.value != _EL_DETAILS.value) EL_DETAILS.style.backgroundColor="#eff"
  r.insertCell(-1).appendChild(EL_DETAILS)
  var rb=document.createElement("button")
  rb.textContent="APPLY";rb.onclick=function(){_EL_DETAILS.value=EL_DETAILS.value;EL_DETAILS.style.backgroundColor="#fff"}
  r.insertCell(-1).appendChild(rb)


  var b = document.createElement("button")
  b.textContent = "APPLY"
  b.onclick = function() {
    _EL_FIRSTNAMES.value=EL_FIRSTNAMES.value
    EL_FIRSTNAMES.style.backgroundColor="#fff"
    EL_SURNAME.style.backgroundColor="#fff"
    _EL_FIRSTNAMES.onchange()
    _EL_MAIDENNAME.value=EL_MAIDENNAME.value
    EL_MAIDENNAME.style.backgroundColor="#fff"
    _EL_BORN.value=EL_BORN.value
    EL_BORN.style.backgroundColor="#fff"
    _EL_DIED.value=EL_DIED.value
    EL_DIED.style.backgroundColor="#fff"
    _EL_BIRTH_LOCATION.value=EL_BIRTH_LOCATION.value
    EL_BIRTH_LOCATION.style.backgroundColor="#fff"
    _EL_DEATH_LOCATION.value=EL_DEATH_LOCATION.value
    EL_DEATH_LOCATION.style.backgroundColor="#fff"
    _EL_GENDER_MALE.checked=EL_GENDER_MALE.checked
    _EL_GENDER_FEMALE.checked=EL_GENDER_FEMALE.checked


    _EL_DETAILS.value=EL_DETAILS.value
    EL_DETAILS.style.backgroundColor="#fff"
    _resetSimilars()
  }

  t.insertRow(-1).insertCell(-1).appendChild(b)

  var b = document.createElement("button")
  b.textContent = "update data"
  b.onclick = function() {
    _closeGeniForm()
    _fetchGeniForId(data[_KEY_GENI_ID], 1)
  }

  t.insertRow(-1).insertCell(-1).appendChild(b)

  r=t.insertRow(-1)
  r.insertCell(-1).appendChild(document.createTextNode(_ASTR_FATHER))
  var EL_FATHER=r.insertCell(-1)
  _createGeniUserName(EL_FATHER, data[_KEY_GENI_FATHER])
  var applyc=r.insertCell(-1)
  _createGeniFindMatchAndApply(applyc, data[_KEY_GENI_FATHER], [_EL_FATHER.value], true)


  r=t.insertRow(-1)
  r.insertCell(-1).appendChild(document.createTextNode(_ASTR_MOTHER))
  var EL_MOTHER=r.insertCell(-1)
  _createGeniUserName(EL_MOTHER, data[_KEY_GENI_MOTHER])
  applyc=r.insertCell(-1)
  _createGeniFindMatchAndApply(applyc, data[_KEY_GENI_MOTHER], [_EL_MOTHER.value], true)

  t.insertRow(-1).insertCell(-1).appendChild(document.createTextNode(_ASTR_MARRIAGES))
  var marriages=[]
  for (var i=0,l=_EL_MARRIAGES.value.length;i<l;++i) {
    marriages.push(_EL_MARRIAGES.value[i][0])
  }
  for (var i=0,l=data[_KEY_GENI_MARRIED].length;i<l;++i) {
    r=t.insertRow(-1)
    r.insertCell(-1)
    var EL_MARRIAGE=r.insertCell(-1)
    _createGeniUserName(EL_MARRIAGE, data[_KEY_GENI_MARRIED][i])
    applyc=r.insertCell(-1)
    _createGeniFindMatchAndApply(applyc, data[_KEY_GENI_MARRIED][i], marriages)
  }

  t.insertRow(-1).insertCell(-1).appendChild(document.createTextNode(_ASTR_CHILDREN))
  for (var i=0,l=data[_KEY_GENI_CHILDREN].length;i<l;++i) {
    r=t.insertRow(-1)
    r.insertCell(-1)
    var EL_CHILD=r.insertCell(-1)
    _createGeniUserName(EL_CHILD, data[_KEY_GENI_CHILDREN][i])
    applyc=r.insertCell(-1)
    _createGeniFindMatchAndApply(applyc, data[_KEY_GENI_CHILDREN][i], _EL_CHILDREN.value)
  }

  ___infoDiv2.appendChild(t)

  var b = document.createElement("button")
  b.textContent = "CLOSE"
  b.onclick = _closeGeniForm
  ___infoDiv2.appendChild(b)

  ___infoDiv2.style.display="block"
  ___infoDiv.style.left="calc(50% - 260px)"
}

function _closeGeniForm() {
  ___infoDiv2.style.display="none"
  ___infoDiv.style.left="50%"
}

function _fetchGeniForId(id, force_online) {
  _EL_FETCH_GENI.disabled=true
  _pr("", _ppp([[_PARAM_GENI_ID, id], [_PARAM_GENI_FUNIONS, 2], [_PARAM_FORCE_ONLINE, force_online]]), function(data) {
    _EL_FETCH_GENI.disabled=false
    _createGeniForm(data)
  }, 20000, ___geni_api, function(message){
    _EL_FETCH_GENI.disabled=false
    alert(message)
  })
}
function _fetchGeni() {
  _fetchGeniForId(_EL_GENI_ID.value, 0)
}

function _createMarriageList(element, marriages) {
  if (!marriages) marriages=[]
  element.value=marriages
  element.innerHTML=""
  
  var t = document.createElement("table").createTBody()
  var isMarried=false
  var i, l=marriages.length
  for (i=0;i<l;i++) {
    var r=t.insertRow(-1)
    var c=r.insertCell(-1)
    _createPersonSelector(c, marriages[i][0], (function () {
      var ii=i;
      return function(v) {
        if (!v) {
          marriages.splice(ii, 1)
          _createMarriageList(element, marriages)
        } else {
          marriages[i][0]=v
          _createMarriageList(element, marriages)
        }
      }
    })(), function(v) { return ___data[v][_KEY_GENDER] != (_EL_GENDER_MALE.checked?_VALUE_GENDER_MALE:_VALUE_GENDER_FEMALE)})
    c=r.insertCell(-1)
    if (marriages[i][1]!=_VALUE_MARRIAGE_DIVORCED) {
      var e=document.createElement("button")
      e.textContent="Divorce"
      e.onclick=(function () {
        var ii=i;
        return function(v) {
          marriages[ii][1]=_VALUE_MARRIAGE_DIVORCED
          _createMarriageList(element, marriages)
        }
      })()
      c.appendChild(e)
    }
    if (marriages[i][1]!=_VALUE_MARRIAGE_DIED) {
      var e=document.createElement("button")
      e.textContent="Died"
      e.onclick=(function () {
        var ii=i;
        return function(v) {
          marriages[ii][1]=_VALUE_MARRIAGE_DIED
          _createMarriageList(element, marriages)
        }
      })()
      c.appendChild(e)
    }
    
    if (marriages[i][1]==_VALUE_MARRIAGE_CURRENT)  isMarried=true
  }
  if (!isMarried) {
    var r=t.insertRow(-1)
    var c=r.insertCell(-1)
    _createPersonSelector(c, null, (function () {
      return function(v) {
        if (v) {
          marriages.push([v,_VALUE_MARRIAGE_CURRENT])
          _createMarriageList(element, marriages)
        }
      }
    })(), function(v) { 
        var gender = _EL_GENDER_MALE.checked?_VALUE_GENDER_MALE:_VALUE_GENDER_FEMALE
        return ___data[v][_KEY_GENDER]!=gender && !___data[v].mar
      })
  }

  element.appendChild(t)
}

function _createChildList(element, children) {
  if (!children) children=[]

  element.value=children
  element.innerHTML=""
  
  var t = document.createElement("table").createTBody()
  var i, l;l=children.length;
  for (i=0;i<l;i++) {
    var r=t.insertRow(-1)
    var c=r.insertCell(-1)
    _createPersonSelector(c, children[i], (function () {
      var ii=i;
      return function(v) {
        if (!v) {
          children.splice(ii, 1)
          _createChildList(element, children)
        } else {
          children[i]=v
          _createChildList(element, children)
        }
      }
    })())
   
  }
  var r=t.insertRow(-1)
  var c=r.insertCell(-1)
  _createPersonSelector(c, null, (function () {
    return function(v) {
      if (v) {
        children.push(v)
        _createChildList(element, children)
      }
    }
  })(), function(v) {
    
    return _EL_GENDER_MALE.checked?!___data[v][_KEY_FATHER]:!___data[v][_KEY_MOTHER]
  })

  element.appendChild(t)
}


function _compareDates(date1, date2) {
  if (!date1[0]||!date2[0])return 0;
  return Math.max(Math.max(date1[6]-date2[7], date2[6]-date1[7]), 0)
}
function _splitDate(date) {
  if (!date) return [0]
  var t=1,d=0,l=0
  while(date>=10000){l=date%10;d+=l*t;t*=10;date=Math.floor(date/10);}
  if (l) {
    return [date-d, 0, 0, date+d, 12, 32, (date-d)*10000, (date+d)*10000+800*12+3*33]
  } else {
    if (d>99) {
      var M=Math.floor(d/100)
      var D=d%100
      return [date, M, D, date, M, D, date*10000+800*M+3*D, date*10000+800*M+3*D]
    }else{
      return [date, d, 0, date, d, 33, date*10000+800*d, date*10000+800*d+3*33]
    }
  }
}
var ___charRegex=/[^a-zA-ZäöåÄÖÅ ]+/g
var ___spaceRegex=/ [ ]+/g
function _splitName(name){
  var a=name.replace(___charRegex, "").replace(___spaceRegex, " ").toLowerCase().split(" ")
  while (a.length && !a[a.length-1]) a.pop()
  return a
}

___cnsets=[new Set(), new Set()]
function _prepareNameComparisons(name, ix) {
  ___cnsets[ix].clear()
  if (!name) return
  var d=_splitName(name)
  var i,l=d.length
  for (i=0;i<l;++i) {
    ___cnsets[ix].add(d[i])
  }
}
function _compareNames(name, ix) {
  if (!___cnsets[ix].size || !name) return 0;
  var i,l=name.length
  for (i=0;i<l;++i) {
    if (___cnsets[ix].has(name[i])) return 0
  } 
  return 1
}

var ___similars=[]
function _updateSimilarGUI() {
  if (___similars.length>5) {
    _EL_SIMILAR.innerHTML=""
    _EL_SIMILAR.textContent=___similars.length+" similar users exist"
  } else {
    _EL_SIMILAR.innerHTML=""
    _EL_SIMILAR.appendChild(document.createTextNode(___similars.length+" similar user"+(___similars.length==1?"":"s")+" exist:"))
    _EL_SIMILAR.appendChild(document.createElement("br"))
    var c, txt
    for (var i=0,l=___similars.length;i<l;++i) {
      c=___similars[i]
      txt=___data[c][_KEY_FIRSTNAMES]+" "+___data[c][_KEY_SURNAME]
      if (___data[c][_KEY_MAIDENNAME]) txt+=" (os. "+___data[c][_KEY_MAIDENNAME]+")"
      if (___data[c][_KEY_BORN])       txt+=", s. "+___data[c][_KEY_BORN]
      if (___data[c][_KEY_DIED])       txt+=", k. "+___data[c][_KEY_DIED]
      _addFormattedText(_EL_SIMILAR, txt)
      _EL_SIMILAR.appendChild(document.createElement("br"))
    }
  }
 // console.log(___checks, ___moves, performance.now()-___updateSimilarStarted)
}
var ___updateSimilarStarted=0
var ___unsimilarGender=[]
var ___lastGender
var ___unsimilarBirthDate=[]
var ___lastBirthDate
var ___unsimilarDeathDate=[]
var ___lastDeathDate
var ___unsimilarFirstname=[]
var ___lastFirstname
var ___unsimilarSurname=[]
var ___lastSurname
var ___possiblySimilars=[]
var ___checks,___moves
function _handlePossiblySimilars() {
  if (!___processingDone) return
  ___lastGender=(_EL_GENDER_MALE.checked?_VALUE_GENDER_MALE:_VALUE_GENDER_FEMALE)
  ___lastBirthDate=_EL_BORN.value
  var lbd=_splitDate(___lastBirthDate)
  ___lastDeathDate=_EL_DIED.value
  var ldd=_splitDate(___lastDeathDate)
  ___lastFirstname=_EL_FIRSTNAMES.value+" "+_EL_NICKNAMES.value
  ___lastSurname=_EL_SURNAME.value+" "+_EL_MAIDENNAME.value
  var c, i, l=___possiblySimilars.length
  _prepareNameComparisons(___lastFirstname, 0)
  _prepareNameComparisons(___lastSurname, 1)
  for (i=0;i<l;++i) {
    c=___possiblySimilars[i]
    if (___lastGender != ___data[c][_KEY_GENDER]){ ++___checks
      ___unsimilarGender.push(c)
    } else if (_compareDates(lbd, ___data[c].BD)>60) { ___checks+=2
      ___unsimilarBirthDate.push(c)
    } else if(_compareDates(ldd, ___data[c].DD)>60) { ___checks+=3
      ___unsimilarDeathDate.push(c)
    } else if (_compareNames(___data[c].FN, 0)) { ___checks+=4
      ___unsimilarFirstname.push(c)
    } else if (_compareNames(___data[c].SN, 1)) { ___checks+=5
      ___unsimilarSurname.push(c)
    } else { ___checks+=5
      ___similars.push(c)
    }
  }
  _updateSimilarGUI()
}

function _updateSimilarsGender(){
  if (!___processingDone) return
  if (___lastGender == (_EL_GENDER_MALE.checked?_VALUE_GENDER_MALE:_VALUE_GENDER_FEMALE)) return
  ___updateSimilarStarted=performance.now();___checks=0;___moves=0
  ___lastGender=(_EL_GENDER_MALE.checked?_VALUE_GENDER_MALE:_VALUE_GENDER_FEMALE)
  ___possiblySimilars=___unsimilarGender
  ___unsimilarGender=___similars
  ___similars=[]
  _handlePossiblySimilars()
}

function _updateSimilarsBirthDate(){
  if (!___processingDone) return
  if (___lastBirthDate == _EL_BORN.value) return
  ___updateSimilarStarted=performance.now();___checks=0;___moves=0
  ___lastBirthDate=_EL_BORN.value
  var lbd=_splitDate(___lastBirthDate)
  var i,l,ll
  ___possiblySimilars=[]
  for (i=0,l=___unsimilarBirthDate.length;i<l;++i) { ++___checks
    if (_compareDates(lbd, ___data[___unsimilarBirthDate[i]].BD)<=60) { ++___moves
      ___possiblySimilars.push(___unsimilarBirthDate[i])
      ___unsimilarBirthDate[i]=___unsimilarBirthDate[--l]
      ___unsimilarBirthDate.pop();--i;
    }
  }
  for (i=0,l=___similars.length;i<l;++i) { ++___checks
    if (_compareDates(lbd, ___data[___similars[i]].BD)>60) { ++___moves
      ___unsimilarBirthDate.push(___similars[i])
      ___similars[i]=___similars[--l];
      ___similars.pop();--i;
    }
  }
  _handlePossiblySimilars()
}

function _updateSimilarsDeathDate() {
  if (!___processingDone) return
  if (___lastDeathDate == _EL_DIED.value) return
  ___updateSimilarStarted=performance.now();___checks=0;___moves=0
  ___lastDeathDate=_EL_DIED.value
  var ldd=_splitDate(___lastDeathDate)
  var i,l,ll
  ___possiblySimilars=[]
  for (i=0,l=___unsimilarDeathDate.length;i<l;++i) { ++___checks
    if (_compareDates(ldd, ___data[___unsimilarDeathDate[i]].DD)<=60) { ++___moves
      ___possiblySimilars.push(___unsimilarDeathDate[i])
      ___unsimilarDeathDate[i]=___unsimilarDeathDate[--l]
      ___unsimilarDeathDate.pop();--i;
    }
  }
  for (i=0,l=___similars.length;i<l;++i) { ++___checks
    if (_compareDates(ldd, ___data[___similars[i]].DD)>60) { ++___moves
      ___unsimilarDeathDate.push(___similars[i])
      ___similars[i]=___similars[--l];
      ___similars.pop();--i;
    }
  }
  _handlePossiblySimilars()
}
function _updateSimilarsFirstname() {
  if (!___processingDone) return
  if (___lastFirstname == _EL_FIRSTNAMES.value+" "+_EL_NICKNAMES.value) return
  ___updateSimilarStarted=performance.now();___checks=0;___moves=0
  ___lastFirstname=_EL_FIRSTNAMES.value+" "+_EL_NICKNAMES.value
  var i,l,ll
  ___possiblySimilars=[]
  _prepareNameComparisons(___lastFirstname, 0)
  for (i=0,l=___unsimilarFirstname.length;i<l;++i) { ++___checks
    if (!_compareNames(___data[___unsimilarFirstname[i]].FN, 0)) { ++___moves
      ___possiblySimilars.push(___unsimilarFirstname[i])
      ___unsimilarFirstname[i]=___unsimilarFirstname[--l]
      ___unsimilarFirstname.pop();--i;
    }
  }
  for (i=0,l=___similars.length;i<l;++i) { ++___checks
    if (_compareNames(___data[___similars[i]].FN, 0)) { ++___moves
      ___unsimilarFirstname.push(___similars[i])
      ___similars[i]=___similars[--l];
      ___similars.pop();--i;
    }
  }
  _handlePossiblySimilars()
}

function _updateSimilarsSurname() {
  if (!___processingDone) return
  if (___lastSurname == _EL_SURNAME.value+" "+_EL_MAIDENNAME.value) return
  ___updateSimilarStarted=performance.now();___checks=0;___moves=0
  ___lastSurname=_EL_SURNAME.value+" "+_EL_MAIDENNAME.value
  var i,l,ll
  ___possiblySimilars=[]
  _prepareNameComparisons(___lastSurname, 1)
  for (i=0,l=___unsimilarSurname.length;i<l;++i) { ++___checks
    if (!_compareNames(___data[___unsimilarSurname[i]].SN, 1)) { ++___moves
      ___possiblySimilars.push(___unsimilarSurname[i])
      ___unsimilarSurname[i]=___unsimilarSurname[--l]
      ___unsimilarSurname.pop();--i;
    }
  }
  for (i=0,l=___similars.length;i<l;++i) { ++___checks
    if (_compareNames(___data[___similars[i]].SN, 1)) { ++___moves
      ___unsimilarSurname.push(___similars[i])
      ___similars[i]=___similars[--l];
      ___similars.pop();--i;
    }
  }
  _handlePossiblySimilars()
}

function _resetSimilars() {
  if (!___processingDone) return
  ___updateSimilarStarted=performance.now();___checks=0;___moves=0
  ___similars=[]
  ___unsimilarGender=[]
  ___unsimilarBirthDate=[]
  ___unsimilarDeathDate=[]
  ___unsimilarFirstname=[]
  ___unsimilarSurname=[]
  ___possiblySimilars=Object.keys(___data)
  _handlePossiblySimilars()
}

function _createPersonForm(data, cbred, cbgreen, cbsave) {
 // console.log(data)
  ___infoDiv.innerHTML=""
  ___infoDiv.style.left="50%"
  ___infoDiv.value=data?data[_KEY_ID]:undefined
  _EL_SIMILAR=document.createElement("div")

  var el = document.createElement("div")
  
  var t = document.createElement("table").createTBody()
  var r = t.insertRow(-1)
  r.insertCell(-1).appendChild(document.createTextNode(_ASTR_FIRSTNAMES))
  _EL_FIRSTNAMES = document.createElement("input")
  if (data) _EL_FIRSTNAMES.value = data[_KEY_FIRSTNAMES]?data[_KEY_FIRSTNAMES]:""
  r.insertCell(-1).appendChild(_EL_FIRSTNAMES)
  // AUTOMATICALLY GUESS THE GENDER
  _EL_FIRSTNAMES.onchange=function() {
    var names=_splitName(_EL_FIRSTNAMES.value)
    var i, l=names.length
    gd=0
    for (i=0;i<l;++i) {
      if (___maleNames.has(names[i]) && !___femaleNames.has(names[i])) gd|=1
      else if (___femaleNames.has(names[i]) && !___maleNames.has(names[i])) gd|=2
    }
    if (gd==1) {
      _EL_GENDER_MALE.click()
    } else if (gd==2) {
      _EL_GENDER_FEMALE.click()
    }
    _updateSimilarsFirstname()
  }
  
  r=t.insertRow(-1)
  r.insertCell(-1).appendChild(document.createTextNode(_ASTR_NICKNAMES))
  _EL_NICKNAMES = document.createElement("input")
  if (data) _EL_NICKNAMES.value = data[_KEY_NICKNAME]?data[_KEY_NICKNAME]:""
  _EL_NICKNAMES.tabIndex=-1
  _EL_NICKNAMES.onchange=_updateSimilarsFirstname
  r.insertCell(-1).appendChild(_EL_NICKNAMES)

  r=t.insertRow(-1)
  r.insertCell(-1).appendChild(document.createTextNode(_ASTR_SURNAME))
  _EL_SURNAME = document.createElement("input")
  if (data) _EL_SURNAME.value = data[_KEY_SURNAME]?data[_KEY_SURNAME]:""
  _EL_SURNAME.onchange=_updateSimilarsSurname
  r.insertCell(-1).appendChild(_EL_SURNAME)

  var mn = _ASTR_MAIDENNAME
  if (!data || data[_KEY_GENDER]==_VALUE_GENDER_MALE) mn=_ASTR_BACHELORNAME
  r=t.insertRow(-1)
  var mntn=document.createTextNode(mn)
  r.insertCell(-1).appendChild(mntn)
  _EL_MAIDENNAME = document.createElement("input")
  if (data) _EL_MAIDENNAME.value = data[_KEY_MAIDENNAME]?data[_KEY_MAIDENNAME]:""
  _EL_MAIDENNAME.onchange=_updateSimilarsSurname
  r.insertCell(-1).appendChild(_EL_MAIDENNAME)

  r=t.insertRow(-1)
  r.insertCell(-1).appendChild(document.createTextNode(_ASTR_BORN))
  _EL_BORN = document.createElement("input")
  if (data) _EL_BORN.value = data[_KEY_BORN_RAW]?data[_KEY_BORN_RAW]:""
  _EL_BORN.onchange=_updateSimilarsBirthDate
  r.insertCell(-1).appendChild(_EL_BORN)

  r=t.insertRow(-1)
  r.insertCell(-1).appendChild(document.createTextNode(_ASTR_DIED))
  _EL_DIED = document.createElement("input")
  if (data) _EL_DIED.value = data[_KEY_DIED_RAW]?data[_KEY_DIED_RAW]:""
  _EL_DIED.onchange=_updateSimilarsDeathDate
  r.insertCell(-1).appendChild(_EL_DIED)
  
  r=t.insertRow(-1)
  r.insertCell(-1).appendChild(document.createTextNode(_ASTR_BIRTH_LOCATION))
  _EL_BIRTH_LOCATION = document.createElement("input")
  if (data) _EL_BIRTH_LOCATION.value = data[_KEY_BIRTH_LOCATION]?data[_KEY_BIRTH_LOCATION]:""
  r.insertCell(-1).appendChild(_EL_BIRTH_LOCATION)
  
  r=t.insertRow(-1)
  r.insertCell(-1).appendChild(document.createTextNode(_ASTR_DEATH_LOCATION))
  _EL_DEATH_LOCATION = document.createElement("input")
  if (data) _EL_DEATH_LOCATION.value = data[_KEY_DEATH_LOCATION]?data[_KEY_DEATH_LOCATION]:""
  r.insertCell(-1).appendChild(_EL_DEATH_LOCATION)

  r=t.insertRow(-1)
  r.insertCell(-1).appendChild(document.createTextNode(_ASTR_GENDER))
  _EL_GENDER_MALE = document.createElement("input")
  _EL_GENDER_MALE.type="radio"
  _EL_GENDER_MALE.name="gender"
  _EL_GENDER_FEMALE = document.createElement("input")
  _EL_GENDER_FEMALE.type="radio"
  _EL_GENDER_FEMALE.name="gender"
  _EL_GENDER_MALE.onchange=function() {mntn.textContent=_ASTR_BACHELORNAME;_updateSimilarsGender()}
  _EL_GENDER_FEMALE.onchange=function() {mntn.textContent=_ASTR_MAIDENNAME;_updateSimilarsGender()}

  if (data==null || typeof data[_KEY_GENDER] === "undefined" ||  data[_KEY_GENDER] == _VALUE_GENDER_MALE) _EL_GENDER_MALE.checked=true
  else _EL_GENDER_FEMALE.checked=true

  b=r.insertCell(-1)
  b.appendChild(_EL_GENDER_MALE)
  b.appendChild(document.createTextNode(_ASTR_GENDER_MALE))
  b.appendChild(_EL_GENDER_FEMALE)
  b.appendChild(document.createTextNode(_ASTR_GENDER_FEMALE))

  r=t.insertRow(-1)
  r.insertCell(-1).appendChild(document.createTextNode(_ASTR_DETAILS))
  _EL_DETAILS = document.createElement("textarea")
  if (data) _EL_DETAILS.value = data[_KEY_DETAILS]?data[_KEY_DETAILS]:""
  r.insertCell(-1).appendChild(_EL_DETAILS)
  /*
  var ebutton=document.createElement("button")
  ebutton.textContent="FIX" // TEMPORARY FIX FUNCTION FOR BIRTH LOCATION AND DEATH LOCATION IN DETAILS
  ebutton.onclick=function() {
    var v=_EL_DETAILS.value
    v=v.split("k. ")
    if (v.length==2) {
      v[0]=v[0].split("s. ")
      if (v[0].length==2) {
        _EL_BIRTH_LOCATION.value=v[0][1]
      } else {
        _EL_BIRTH_LOCATION.value=v[0][0]
      }
      v[1]=v[1].split("Finland")
      if (v[1].length==2) {
        _EL_DEATH_LOCATION.value=v[1][0]+"Finland"
        _EL_DETAILS.value=v[1][1]
      } else {
        _EL_DEATH_LOCATION.value=v[1][0]
        _EL_DETAILS.value=""
      }
    } else {
      v[0]=v[0].split("s. ")
      if (v[0].length==2) {
        v[0][1]=v[0][1].split("Finland")
        if (v[0][1].length==2) {
          _EL_BIRTH_LOCATION.value=v[0][1][0]+"Finland"
          _EL_DETAILS.value=v[0][1][1]
        } else {
          _EL_BIRTH_LOCATION.value=v[0][1][0]
          _EL_DETAILS.value=""
        }
      } else {
        v[0][0]=v[0][0].split("Finland")
        if (v[0][0].length==2) {
          _EL_BIRTH_LOCATION.value=v[0][0][0]+"Finland"
          _EL_DETAILS.value=v[0][0][1]
        } else {
          _EL_BIRTH_LOCATION.value=v[0][0][0]
          _EL_DETAILS.value=""
        }
      }
    }
  }
  r.insertCell(-1).appendChild(ebutton)
  //*/
  
  r=t.insertRow(-1)
  r.insertCell(-1).appendChild(document.createTextNode(_ASTR_GENI_ID))
  _EL_GENI_ID = document.createElement("input")
  if (data) _EL_GENI_ID.value = data[_KEY_GENI_ID]?data[_KEY_GENI_ID]:""
  var c=r.insertCell(-1)
  c.appendChild(_EL_GENI_ID)
  
  _EL_FETCH_GENI=document.createElement("button")
  _EL_FETCH_GENI.textContent=_ASTR_FETCH_GENI
  _EL_FETCH_GENI.onclick=_fetchGeni
  c.appendChild(_EL_FETCH_GENI)


  r=t.insertRow(-1)
  r.insertCell(-1).appendChild(document.createTextNode(_ASTR_FATHER))
  _EL_FATHER=r.insertCell(-1)
  _createPersonSelector(_EL_FATHER, data?data[_KEY_FATHER]:null, function(k){_EL_FATHER.value=k}, function(k){return ___data[k][_KEY_GENDER]==_VALUE_GENDER_MALE})


  r=t.insertRow(-1)
  r.insertCell(-1).appendChild(document.createTextNode(_ASTR_MOTHER))
  _EL_MOTHER=r.insertCell(-1)
  _createPersonSelector(_EL_MOTHER, data?data[_KEY_MOTHER]:null, function(k){_EL_MOTHER.value=k}, function(k){return ___data[k][_KEY_GENDER]==_VALUE_GENDER_FEMALE})

  r=t.insertRow(-1)
  r.insertCell(-1).appendChild(document.createTextNode(_ASTR_MARRIAGES))
  _EL_MARRIAGES=r.insertCell(-1)
  var married=null
  if (data && data[_KEY_MARRIED]) {
    married=data[_KEY_MARRIED].slice()
    var i, l;l=married.length;
    for (i=0;i<l;i++) married[i]=married[i].slice()
  }
  _createMarriageList(_EL_MARRIAGES, married)

  r=t.insertRow(-1)
  r.insertCell(-1).appendChild(document.createTextNode(_ASTR_CHILDREN))
  _EL_CHILDREN=r.insertCell(-1)
  _createChildList(_EL_CHILDREN, data?(data[_KEY_CHILDREN]?data[_KEY_CHILDREN].slice():null):null, (data==null || typeof data[_KEY_GENDER] === "undefined" ||  data[_KEY_GENDER] == _VALUE_GENDER_MALE)?_VALUE_GENDER_MALE:_VALUE_GENDER_FEMALE)

  el.appendChild(t)
  
  var b = document.createElement("button")
  b.textContent = _ASTR_SAVE
  b.onclick = cbsave
  el.appendChild(b)
  // ctrl + enter submit
  _EL_FIRSTNAMES.addEventListener('keydown', function(e) {if(e.keyCode == 13 && e.ctrlKey) cbsave()})
  _EL_NICKNAMES.addEventListener('keydown', function(e) {if(e.keyCode == 13 && e.ctrlKey) cbsave()})
  _EL_SURNAME.addEventListener('keydown', function(e) {if(e.keyCode == 13 && e.ctrlKey) cbsave()})
  _EL_MAIDENNAME.addEventListener('keydown', function(e) {if(e.keyCode == 13 && e.ctrlKey) cbsave()})
  _EL_BORN.addEventListener('keydown', function(e) {if(e.keyCode == 13 && e.ctrlKey) cbsave()})
  _EL_DIED.addEventListener('keydown', function(e) {if(e.keyCode == 13 && e.ctrlKey) cbsave()})
  _EL_BIRTH_LOCATION.addEventListener('keydown', function(e) {if(e.keyCode == 13 && e.ctrlKey) cbsave()})
  _EL_DEATH_LOCATION.addEventListener('keydown', function(e) {if(e.keyCode == 13 && e.ctrlKey) cbsave()})
  _EL_DETAILS.addEventListener('keydown', function(e) {if(e.keyCode == 13 && e.ctrlKey) cbsave()})
  _EL_GENI_ID.addEventListener('keydown', function(e) {if(e.keyCode == 13 && e.ctrlKey) cbsave()})

  // Buttons
  b = document.createElement("div")
  b.style.position="absolute"
  b.style.zIndex=1000
  b.style.width=50
  b.style.height=50
  b.style.top=0
  b.style.right=0
  b.style.cursor="pointer"
  b.style.backgroundColor="#f00"
  b.onclick=cbred
  el.appendChild(b)

  if (cbgreen) {
    b = document.createElement("div")
    b.style.position="absolute"
    b.style.zIndex=1000
    b.style.width=50
    b.style.height=50
    b.style.top=50
    b.style.right=0
    b.style.cursor="pointer"
    b.style.backgroundColor="#0f0"
    b.onclick=cbgreen
    el.appendChild(b)
  }

  _resetSimilars()
  // Make all visible
  ___infoDiv.style.display="block"
  ___infoDiv.appendChild(el)
  ___infoDiv.appendChild(_EL_SIMILAR)
  _EL_FIRSTNAMES.focus()
}

function _reloadInfoDivs() {
  if (___infoDiv.style.display=="block") {
    _openPerson(___infoDiv.value)
    if (___infoDiv2.style.display=="block") {
      _fetchGeniForId(___infoDiv2.value, 0)
    }
  }
}

function _getChildrenValue() {
  var children=""
  var i,l=_EL_CHILDREN.value.length
  for (i=0;i<l;i++) {
    if (children.length) children+=","
    children+=_EL_CHILDREN.value[i]
  }
  return children
}
function _getMarriageValue() {
  var marriages=""
  var i,l=_EL_MARRIAGES.value.length
  for (i=0;i<l;i++) {
    if (marriages.length) marriages+=","
    marriages+=_EL_MARRIAGES.value[i][0]+"."+_EL_MARRIAGES.value[i][1]
  }
  return marriages
}

function _openPerson(c) {
  _createPersonForm(___data[c],

  function() { // cbred
    ___infoDiv.innerHTML=""
    ___infoDiv.style.display="none"
    ___infoDiv2.style.display="none"
  },
  function() { //cbgreen
    ___infoDiv.innerHTML=""
    ___infoDiv.style.display="none"
    ___infoDiv2.style.display="none"
    e(c)
  },

  function() { //cbsave

    var uplist=[
            [_PARAM_ID, c], 
            [_PARAM_SURNAME, _EL_SURNAME.value], 
            [_PARAM_FIRSTNAMES, _EL_FIRSTNAMES.value],
            [_PARAM_NICKNAME, _EL_NICKNAMES.value],
            [_PARAM_MAIDEN_NAME, _EL_MAIDENNAME.value],
            [_PARAM_GENDER, _EL_GENDER_MALE.checked?"1":"0"],
            [_PARAM_BORN, _EL_BORN.value?_EL_BORN.value:"0"],
            [_PARAM_DIED, _EL_DIED.value?_EL_DIED.value:"0"],
            [_PARAM_BIRTH_LOCATION, _EL_BIRTH_LOCATION.value],
            [_PARAM_DEATH_LOCATION, _EL_DEATH_LOCATION.value],
            [_PARAM_SOURCES, ""],
            [_PARAM_DETAILS, _EL_DETAILS.value],
            [_PARAM_GENI_ID, _EL_GENI_ID.value],
          ]
    if ((___data[c][_KEY_FATHER] !== _EL_FATHER.value) || (___data[c][_KEY_MOTHER] !== _EL_MOTHER.value)) {
      uplist.push([_PARAM_FATHER, _EL_FATHER.value?_EL_FATHER.value:0])
      uplist.push([_PARAM_MOTHER, _EL_MOTHER.value?_EL_MOTHER.value:0])
    }
    var update_children=false
    if (___data[c][_KEY_CHILDREN].length != _EL_CHILDREN.value.length) update_children=true
    else {
      var i,l=___data[c][_KEY_CHILDREN].length
      for (i=0;i<l;i++) {
        if (___data[c][_KEY_CHILDREN][i]!=_EL_CHILDREN.value[i]) {
          update_children=true;
          break;
        }
      }
    }
    if (update_children) {
      uplist.push([_PARAM_CHILDREN, _getChildrenValue()])
    }
    var update_marriages=false
    if (___data[c][_KEY_MARRIED].length != _EL_MARRIAGES.value.length) update_marriages=true
    else {
      var i,l=___data[c][_KEY_MARRIED].length
      for (i=0;i<l;i++) {
        if (___data[c][_KEY_MARRIED][i][0]!=_EL_MARRIAGES.value[i][0] || ___data[c][_KEY_MARRIED][i][1]!=_EL_MARRIAGES.value[i][1]) {
          update_marriages=true;
          break;
        }
      }
    }
    if (update_marriages) {
      uplist.push([_PARAM_MARRIED, _getMarriageValue()])
    }
    _pr(_PATH_EDIT_PERSON, _ppp(uplist),
      function(data) {
        ___infoDiv.innerHTML=""
        ___infoDiv.style.display="none"
        ___infoDiv2.style.display="none"
        _reload()
      })
  })
}

function _createPerson(data) {
  if (data) {
    //console.log(data);
  } else {
    data=null
  }
  _createPersonForm(data,
  function() { // cbred
    ___infoDiv.innerHTML=""
    ___infoDiv.style.display="none"
    ___infoDiv2.style.display="none"
  },
  null,
  function() { //cbsave
    var uplist=[
            [_PARAM_SURNAME, _EL_SURNAME.value], 
            [_PARAM_FIRSTNAMES, _EL_FIRSTNAMES.value],
            [_PARAM_NICKNAME, _EL_NICKNAMES.value],
            [_PARAM_MAIDEN_NAME, _EL_MAIDENNAME.value],
            [_PARAM_GENDER, _EL_GENDER_MALE.checked?"1":"0"],
            [_PARAM_BORN, _EL_BORN.value?_EL_BORN.value:"0"],
            [_PARAM_DIED, _EL_DIED.value?_EL_DIED.value:"0"],
            [_PARAM_BIRTH_LOCATION, _EL_BIRTH_LOCATION.value],
            [_PARAM_DEATH_LOCATION, _EL_DEATH_LOCATION.value],
            [_PARAM_SOURCES, ""],
            [_PARAM_DETAILS, _EL_DETAILS.value],
            [_PARAM_GENI_ID, _EL_GENI_ID.value],
            [_PARAM_FATHER, _EL_FATHER.value?_EL_FATHER.value:0],
            [_PARAM_MOTHER, _EL_MOTHER.value?_EL_MOTHER.value:0],
            [_PARAM_CHILDREN, _getChildrenValue()],
            [_PARAM_MARRIED, _getMarriageValue()],
          ]

    _pr(_PATH_ADD_PERSON, _ppp(uplist),
      function(data) {
        ___infoDiv.innerHTML=""
        ___infoDiv.style.display="none"
        ___infoDiv2.style.display="none"
        _reload()
      })
  })
}


function _geniHero(c) {
  var data=_getData(c)
  if (data[_KEY_GENI_ID]) {
    if (data[_KEY_MOTHER] && data[_KEY_FATHER]) return 0
    var gdata=_getData("G"+data[_KEY_GENI_ID])
    if (gdata && !gdata.LD) {
      return (gdata[_KEY_MOTHER] && gdata[_KEY_MOTHER][0]=="G") || (gdata[_KEY_FATHER] && gdata[_KEY_FATHER][0]=="G")
    } else if (!gdata) console.log("FAIL")
  }
  return 0
}

// functions to be called outside
// When minimizing, these names should not be changed!


// set backend
function a(backend) {
  ___backend = backend
}

// set root element
function b(element) {
  ___element = element
}

// set canvas
function c(element) {
  ___canvas = element
}


function _processData(pid, ix) {
  //var b=performance.now()
  if(pid!=___processID) {_processingInterrupted(pid);return;}
  if (ix>=___dataKeys.length) {_processingFailed(pid);return;}
  var maxi=Math.min(___dataKeys.length, ix+1000)

  for (;ix<maxi;++ix) {
    var c=___dataKeys[ix]
    ___data[c].FN=_splitName(___data[c][_KEY_FIRSTNAMES]+" "+___data[c][_KEY_NICKNAME])
    ___data[c].SN=_splitName(___data[c][_KEY_SURNAME]+" "+___data[c][_KEY_MAIDENNAME])
    ___data[c].NN=___data[c].FN.concat(___data[c].SN)
    ___data[c].BD=_splitDate(___data[c][_KEY_BORN_RAW])
    ___data[c].DD=_splitDate(___data[c][_KEY_DIED_RAW])
    var names=_splitName(___data[c][_KEY_FIRSTNAMES])
    if (___data[c][_KEY_GENDER]==_VALUE_GENDER_MALE) for (var i=0,l=names.length;i<l;++i) ___maleNames.add(names[i])
    else                                             for (var i=0,l=names.length;i<l;++i) ___femaleNames.add(names[i])
  }
  //console.log(performance.now()-b)
  if (ix<___dataKeys.length) {
    setTimeout(function(){_processData(___processID, ix)}, 10)
  } else {
    _processingFinished(pid)
  }
}
function _startProcessingData() {
  ___processingStarted=performance.now()
  ___processID+=1
  ___processingDone=0
  _processData(___processID, 0)
}
function _processingInterrupted(pid) {}
function _processingFinished(pid) {var b=performance.now();___processingDone=1}
function _processingFailed(pid) {}


function d(data) {
  var b=performance.now()
  ___data = data
  ___dataKeys = Object.keys(___data)
  ___geniNodes={}
  ___maleNames.clear()
  ___femaleNames.clear()
  _startProcessingData()

  var b=performance.now()
  for (var ii=0,ll=___dataKeys.length;ii<ll;++ii) {
    var c=___dataKeys[ii]
    ___data[c][_KEY_ID]=c
    var i, l;l=___data[c][_KEY_MARRIED].length 
    for (i=0;i<l;i++) {
      if (___data[c][_KEY_MARRIED][i][1]==_VALUE_MARRIAGE_CURRENT) {
        ___data[c].mar=___data[c][_KEY_MARRIED][i][0]
        break
      }
    }
    if (___data[c][_KEY_GENI_ID]!=="") {
        var gid=___data[c][_KEY_GENI_ID]
        if (!(gid in ___geniNodes)) {
          ___geniNodes[gid]=[]
        }
        ___geniNodes[gid].push(c)
    }
  }
}

// set top node
function h(element) {
  ___infoDiv = element
}

function q(element) {
  ___infoDiv2=element
}

// set root node
function e(id) {
  if (!id) id=_getHashVariable("i")
  if (!id) id="596516649"
  if (_getData(id)) {
    ___root = id
    _draw()
    _setHashVariable("i", id)
  } else {
    alert("invalid root node");
  }
}


// fetch data and call callback function
function g(cb) {
  _gr(_PATH_GET_JSON, function(data) {
    cb(data)
  })
}

// reload data and call callback function
function _reload(cb) {
  _gr(_PATH_GET_JSON, function(data) {
    d(data)
    e(___root)
    if (cb) cb()
  })
}


// setup search
function i(element, cb, filter, cbEsc) {
  var searchResults = document.createElement("div")
  searchResults.ix=-1
  var searchField = document.createElement("input")
  searchField.style.height="38px"
  searchField.style.width="100%"
  searchField.style.fontSize="30"
  searchField.style.zIndex="1001"
  searchField.addEventListener('keydown', function(e) {
    if(e.keyCode == 40) { // down
      if (searchResults.ix>=0 && searchResults.ix<searchResults.childNodes.length)  searchResults.childNodes[searchResults.ix].style.backgroundColor="#fff"
      if (++searchResults.ix >= searchResults.childNodes.length) searchResults.ix=0
      if (searchResults.ix>=0 && searchResults.ix<searchResults.childNodes.length) searchResults.childNodes[searchResults.ix].style.backgroundColor="#99c"
    } else if(e.keyCode == 38) { // up
      if (searchResults.ix>0 && searchResults.ix<searchResults.childNodes.length)  searchResults.childNodes[searchResults.ix].style.backgroundColor="#fff"
      if (--searchResults.ix < 0) searchResults.ix=searchResults.childNodes.length-1
      if (searchResults.ix>=0 && searchResults.ix<searchResults.childNodes.length)  searchResults.childNodes[searchResults.ix].style.backgroundColor="#99c"
    } else if(e.keyCode == 13) { // enter
      if (searchResults.ix>=0 && searchResults.ix<searchResults.childNodes.length)  searchResults.childNodes[searchResults.ix].click()
    } else if(e.keyCode == 27) { // esc
      searchField.value=""
      searchField.oninput()
      if (cbEsc)cbEsc()
    }
  })
  searchField.oninput=function() {
    var v=searchField.value
    searchResults.innerHTML=""
    if (v.length>0) {
      var r = _search(searchField.value, 20, filter)
      var i, l=r.length
      var el
      for (i=0;i<l;i++) {
        el=document.createElement("div")
        el.className="r"
        var txt=___data[r[i]][_KEY_FIRSTNAMES]+" "+___data[r[i]][_KEY_SURNAME]
        if (___data[r[i]][_KEY_MAIDENNAME]) {
          txt+=" (os. "+___data[r[i]][_KEY_MAIDENNAME]+")"
        }
        if (___data[r[i]][_KEY_BORN]) {
          txt+=", s. "+___data[r[i]][_KEY_BORN]
        } 
        _addFormattedText(el, txt)
        el.onclick=(function() {
          searchResults.ix=-1
          var k=r[i]
          return function(){searchResults.innerHTML="";cb(k)}
        })()
        searchResults.appendChild(el)
      }
    }
  }
  element.appendChild(searchField)
  element.appendChild(searchResults)
  return searchField
}

function j(id) { // big search callback function
  e(id)
}


function k() { // scale +
  _setScale(_scale+1,1)
}

function l() { // scale -
  _setScale(_scale-1,1)
}

function m(n) { // scale n
  _setScale(n,1)
}

function n() { // new person
  if (_EDITMODE) _createPerson()
}

function o() { // set up and down
  var u=document.getElementById("j")
  var d=document.getElementById("k")
  _setUpDown(u.value, d.value, 1);
}

// set up, down and scale, use hash values if defined, otherwise use defaults
function f() {
  var c=_getHashVariable("c")
  var u=_getHashVariable("u")
  var d=_getHashVariable("d")
  if (c===undefined) c=0
  if (u===undefined) u=document.getElementById("j").value
  if (d===undefined) d=document.getElementById("k").value
  document.getElementById("j").value=u
  document.getElementById("k").value=d
  _setScale(parseInt(c), 0)
  _setUpDown(u, d, 0)
}

function p(url) { // set geni api url
  ___geni_api=url
}







// geni fetch stuff...


var ___geniFetchUpSet = new Set()
var ___geniFetchDownSet = new Set()
var ___geniFetchPaused
var ___geniFetchContinueCB=0
var ___geniFetchDownStack=[]

function s() {
  ___geniFetchPaused=1
  document.getElementById("pausegeni").disabled=true
  document.getElementById("continuegeni").disabled=false
}
function t() {
  document.getElementById("pausegeni").disabled=false
  document.getElementById("continuegeni").disabled=true
  ___geniFetchPaused=0
  if (___geniFetchContinueCB) {
    var cb=___geniFetchContinueCB
    ___geniFetchContinueCB=0
    cb()
  }
}
function _callWhenNotPaused(cb) {
  if (___geniFetchPaused) {
    ___geniFetchContinueCB=cb
  } else {
    cb()
  }
}

function _geniFetch(id, cb) {
  _pr("", _ppp([[_PARAM_GENI_ID, id], [_PARAM_GENI_FUNIONS, 2]]), cb, 120000, ___geni_api, function(message){
    alert(message)
    s()
    ___geniFetchContinueCB=function(){_geniFetch(id, cb)}
  })

}
function _geniFetchUp(id, cb) {
  if (___geniFetchUpSet.has(id)) {_callWhenNotPaused(cb); return;}
  ___geniFetchUpSet.add(id)
  console.log("geniFetchUp", id, " downfetch size: ", ___geniFetchDownSet.size, " upfetch size: ", ___geniFetchUpSet.size)
  if (!id) _callWhenNotPaused(cb)
  else {
    _callWhenNotPaused(function() {
      _geniFetch(id, function(data) {
        console.log("User", data[_KEY_FIRSTNAMES], data[_KEY_SURNAME], data[_KEY_BORN_RAW], data[_KEY_DIED_RAW])
        _callWhenNotPaused(function() {
          _geniFetchUp(data[_KEY_GENI_MOTHER]?data[_KEY_GENI_MOTHER][_KEY_GENI_ID]:0, function(){
            _callWhenNotPaused(function() {
              _geniFetchUp(data[_KEY_GENI_FATHER]?data[_KEY_GENI_FATHER][_KEY_GENI_ID]:0, function(){_callWhenNotPaused(cb)})
            })
          })
        })
      })
    })
  }
}
function _geniFetchDown_(data, i, cb) {
  if (!data || !data[_KEY_GENI_CHILDREN] || i>=data[_KEY_GENI_CHILDREN].length) {_callWhenNotPaused(cb); return}
  ___geniFetchDownStack.push(""+(i+1)+"/"+data[_KEY_GENI_CHILDREN].length)
  console.log("User", data[_KEY_FIRSTNAMES], data[_KEY_SURNAME], data[_KEY_BORN_RAW], data[_KEY_DIED_RAW], "child", (i+1), "of", data[_KEY_GENI_CHILDREN].length)
  for (var j in ___geniFetchDownStack) {
    console.log(___geniFetchDownStack[j])
  }
  _callWhenNotPaused(function() {
    _geniFetchDown(data[_KEY_GENI_CHILDREN][i][_KEY_GENI_ID], function() {
      _callWhenNotPaused(function() {
        ___geniFetchDownStack.pop()
        _geniFetchDown_(data, i+1, cb)
      })
    })
  })
}
function _geniFetchDown(id, cb) {
  if (___geniFetchDownSet.has(id)) {_callWhenNotPaused(cb); return}
  ___geniFetchDownSet.add(id)
  console.log("geniFetchDown", id, " downfetch size: ", ___geniFetchDownSet.size, " upfetch size: ", ___geniFetchUpSet.size)
  if (!id) _callWhenNotPaused(cb)
  else {
    _callWhenNotPaused(function() {
      _geniFetch(id, function(data) {
        ___geniFetchDownStack.push(data[_KEY_FIRSTNAMES]+" "+data[_KEY_SURNAME]+" "+data[_KEY_BORN_RAW]+" "+data[_KEY_DIED_RAW])
        _geniFetchDown_(data, 0, function(){___geniFetchDownStack.pop();_callWhenNotPaused(cb);})
      })
    })
  }
}

function r(out_el, i) { // do geni fetching...
  document.getElementById("pausegeni").disabled=false
  if (i==undefined) i=0

  if (i<Object.keys(___geniNodes).length) {
    var geniId=Object.keys(___geniNodes)[i][0]
    out_el.textContent=(i+1)+"/"+Object.keys(___geniNodes).length+" ("+geniId+")"
    _geniFetchUp(geniId, function() {
      _geniFetchDown(geniId, function() {
        r(out_el, i+1)
      })
    })
  }
}

function u() {
  ___useGeni=document.getElementById("usegeni").checked
  console.log(___useGeni)
}

function v() {
  var i=0, l=___dataKeys.length
  var f=0;
  for (i=0;i<l;++i) {
    if (!f && ___dataKeys[i] == ___root) f=1
    else if (f) {
      if (_geniHero(___dataKeys[i])) {
        console.log("HERO")
        e(___dataKeys[i])
        return
      }
    }
  }
  for (i=0;i<l;++i) {
    if (_geniHero(___dataKeys[i])) {
        console.log("HERO")
      e(___dataKeys[i])
      return
    }
  }
}

// set view type
function w(type) {
  if (type==1) {
    _EDITMODE=0
  }
}
