var request = require("request");
var cheerio = require("cheerio");

var urlStorage = [];
var index = 1;

request({
  uri: "http://ru.wikipedia.org/",
}, function(error, response, body) {
  var $ = cheerio.load(body);

  $("a").each(function() {
    var link = $(this);
    var text = link.text();
    var href = link.attr("href");


    if(typeof href !== 'undefined' && index<=1000){
      if(href.search(/\/ru.wikipedia.org/g) != -1){
        if(href.search(/^\/\//g) != -1){
          urlStorage.push("https:" + href);
          console.log(index + ": " + text + " -> " + "https:" + href);
          index++;
        }else{
          //urlStorage.push(href);
          urlStorage.push(href);
          console.log(index + ": " + text + " -> " + href);
          index++;
        }

      }
      else if (href.search(/^\/wiki/g) != -1 ) {
        console.log(index + ": " + text + " -> " + "https://ru.wikipedia.org" + href);
        urlStorage.push("https://ru.wikipedia.org" + href);
        index++;
      }

    }
  });
  if(index<=1000 && urlStorage.length !== 0){
    searchMoreLinks(urlStorage[0]);
  }

});
function searchMoreLinks(url){
  request({
    uri: url,
  }, function(error, response, body) {
    var $ = cheerio.load(body);

    $("a").each(function() {
      var link = $(this);
      var text = link.text();
      var href = link.attr("href");

      if(typeof href !== 'undefined' && index<=1000){
        if(href.search(/\/ru.wikipedia.org/g) != -1){
          if(href.search(/^\/\//g) != -1){
            //urlStorage.push("https:" + href)
            console.log(index + ": " + text + " -> " + "https:" + href);
            index++;
          }else{
            //urlStorage.push(href)
            console.log(index + ": " + text + " -> " + href);
            index++;
          }

        }
        else if (href.search(/^\/wiki/g) != -1 ) {
          console.log(index + ": " + text + " -> " + "https://ru.wikipedia.org" + href);
          //urlStorage.push("https://ru.wikipedia.org" + href);
          index++;
        }

      }
    });
    urlStorage.splice(0,1);
    if(urlStorage.length !== 0 && index<=1000){
      searchMoreLinks(urlStorage[0]);
    }
  });

}
