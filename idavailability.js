var items = null;
var out = null;

var ITEMS_URL = 'http://wedata.net/databases/idAvailability/items.json?callback=?';
var RETRIEVER = 'http://localhost/~moto/idavailability/retriever.cgi';
var NOT_FOUND = '404';

// debug stuff
function debug(msg) {
  out.innerHTML += msg + '<br />';
}

function bootstrap() {
  $.getJSON(ITEMS_URL, function(data) {
    items = data
  });
  out = document.getElementById('out');
}

function checkId() {
  var id = document.forms[0]['id'].value;
  debug('checking ' + id + '...');

  var count = 0;

  for (var i=0; i<items.length; i++) {
    out.innerHTML += '  from ' + items[i].name + ': <br />';

    var url = items[i].data.urlToCheck + id;
    debug(url);
    $.get(RETRIEVER, {'url':url}, function(data) {
       //debug(data);
       if (NOT_FOUND == data) {
         debug('not found');
       } else {
         search = data.evaluate(items[i].data.condition, data, null, 7, null)
         if (0 < search.snapshotLength) {
           debug('xpath hit');
         } else {
           count++;
         }
       }
    });
  }

  return false;
}
