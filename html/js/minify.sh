sudo uglifyjs a.js --toplevel --mangle reserved=['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w']  | sudo uglifyjs --compress > m.js
sudo chmod 777 m.js
