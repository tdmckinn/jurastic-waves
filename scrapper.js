
var fs = require('fs');
var casper = require('casper').create();
 
function getLinks() {
    var dinosEls = document.querySelectorAll('.griditem');
    var linksa = [];
    var dinos = Array.prototype.map.call(dinosEls, function(element) {
        linksa.push(element.querySelector('a').getAttribute('href'));
        
        return JSON.stringify({ 
            name: element.querySelector('a').getAttribute('title'),
            shortDescription: element.innerText
        });
    });
    return [linksa, dinos];
}

casper.start('http://www.dinosaurfact.net/jurassic.php', function() {
});


function getOtherPageData() {
  
    var classifications = Array.prototype.map.call(document.querySelectorAll('.block strong'), function(item, index) {
        
      if(item.children.length !== 0 && index !== 0) {
        
        var title = item.innerText.replace(': ', '');
        var sibling = item.nextSibling.textContent;
        var classified = {};
        
        classified[title] = sibling;
        
        return classified;
      }
    }).filter(function(item) {
      return item !== undefined; 
    });
    
    var parahs = Array.prototype.map.call(document.querySelectorAll('.block p'), function(item, index) {
      if(item.children.length !== 0 && index === 0 && item.innerText) {
        return {
            longDescription: item.innerText
        }
      } else {
        return { item: null };
      }
    }).filter(function(val) {
        return val.item !== null;
    });
    
    var imageUrl = 'http://www.dinosaurfact.net' + document.querySelectorAll('.block img')[0].getAttribute('src').replace('../', '');

    return {
      parahs: parahs ? parahs[0] : {},
      classifications: classifications || {},
      imageUrl: imageUrl
    };
}

casper.then(function() {
  var data = this.evaluate(getLinks);
  var links = data[0];
  var customData = data[1];
  var dino = [];
  
  this.each(links, function(self, link, index) { 

    this.thenOpen('http://www.dinosaurfact.net'+link, function() {
      
      try { 
        var pagedata = this.evaluate(getOtherPageData)
        var customDataItem = JSON.parse(customData[index]);
         
         if(pagedata) {
          var newWorld = {
            name: customDataItem.name,
            shortDescription: customDataItem.shortDescription,
            longDescription: pagedata.parahs.longDescription,
            imageUrl: pagedata.imageUrl
          }
          
         pagedata.classifications.forEach(function(item) {
          for(var prop in item) {
            newWorld[prop] = item[prop];
          }
         });
          
          dino.push(newWorld);
          fs.write('temp.json', JSON.stringify(dino), 'w');
       
         }
      } catch(e) {
        console.log(e)
      }
        
    });


  });
})


casper.run(function() {
  this.echo('Items found and saved:').exit(); 
});