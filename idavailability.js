var items = [];
var out = null;
var site_area = null;
var result = null;
var availableCount = 0;
var totalCount = 0;
var count = 0;
var id = '';

var src = '';
var cond = '';

var ITEMS_URL = 'http://wedata.net/databases/idAvailability/items.json?callback=?';
//var ITEMS_URL = 'http://localhost/~moto/idavailability/sites.json'; // for local test
var RETRIEVER = 'http://localhost/~moto/idavailability/retriever.cgi';
var NOT_FOUND = 'null';
var FOUND     = 'found';

// debug stuff
function debug(msg) {
  out.innerHTML = msg + '<br />';
}

var Site = function(name, data) {
  this.name = name;
  this.data = data;
  this.div = $('<div/>');
  this.div  = document.createElement('div');
  this.div.id = 'site_' + name;
  this.div.className = 'site';

  if (data.icon != '') {
    var icon = document.createElement('img');
    icon.src = data.icon;
    this.div.appendChild(icon);
  }

  var msg = document.createElement('p');
  msg.className = 'msg';
  msg.innerHTML = name; // TODO: 1. should use something else than innerHTML.
  this.div.appendChild(msg);
  this.msg = msg;

  site_area.appendChild(this.div);
}


/*
Site.prototype.ok = 'green';
Site.prototype.ng = '#666';
*/

Site.prototype.check = function(id) {
  var url = this.data.urlToCheck + id;
  var self = this;
  self.div.style.backgroundColor = '#bbb';
  params = {'url':url};
  if (this.data.condition != '') {
    params['cond'] = this.data.condition;
  }

  $.get(RETRIEVER, params, function(html) {
     if (NOT_FOUND == html) {
       availableCount++;

       /*
       var ok = document.createElement('span');
       ok.className = 'ok';
       ok.innerHTML = 'OK'; // TODO: 1.
       self.msg.appendChild(ok);
       */
       self.div.style.backgroundColor = 'green';

     } else {
       if (FOUND == html) {
         //search = data.evaluate(items[i].condition, data, null, 7, null)
         //if (0 < search.snapshotLength) {
           //debug('xpath hit');
           //white.push(i);
         //} else
         {
           self.div.style.backgroundColor = 'red';
           /*
           var ok = document.createElement('span');
           ok.className = 'ng';
           ok.innerHTML = 'NG'; // TODO: 1.
           self.msg.appendChild(ok);
           */
         }
       } else {
         // check XPath
         src = html;
         cond = self.data.condition;
       }
     }
     count++;
     updateResult();
  });
}

function bootstrap() {
  out = document.getElementById('out');
  result = document.getElementById('result');
  site_area = document.getElementById('sites');

  $.getJSON(ITEMS_URL, function(sites) {
    totalCount = sites.length;
    for (var i=0; i<sites.length; i++) {
      items.push(new Site(sites[i].name, sites[i].data));
    }
  });
}

function checkId() {
  availableCount = 0;
  count = 0;

  id = document.forms[0]['id'].value;
  debug('checking ' + id + ' from ' + totalCount + ' sites...');

  for (var i=0; i<items.length; i++) {
    items[i].check(id);
  }

  return false;
}

function updateResult() {
  //result.innerHTML = availableCount + '/' + items.length;
  if (totalCount == count) {
    debug('done.<br /> <span class="id">' + id + ' </span> ' +
      'is <span class="availability">' + parseInt(100 * availableCount / items.length) + '</span>% available.');
  }
}
