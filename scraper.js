//Program your scraper so that it visits the website http://shirts4mike.com and uses http://shirts4mike.com/shirts.php 

var cheerio = require('cheerio');
var json2csv = require('json2csv');
var request = require('request');
var urls = [];
var urlsId = [];
var productPage = [];

    
var url = "http://shirts4mike.com/shirts.php";


request(url, function (error, response, body) {
        if (!error && response.statusCode === 200) {    
            // Use body; no need to handle chunks of data *or* redirects!
            var $ = cheerio.load(body);

        //tshirts urls
        $("a[href*='shirt']","#content").each(function() {
            var link = $(this);
            var href = link.attr("href");
            urls.push(href);    
        }); 
         
        $(urls).each(function () {
            var adress = this.replace("shirt.php","");
            urlsId.push(adress);        
        });
    
        $(urlsId).each(function() {
            var https = url + "/" + this;
            productPage.push(https);
        });
            console.log(productPage);
        } else { console.log("We've encountered an error:");
               }
});


          
for (var i = 0; i < productPage.lenght; i++) {
    console.log(i);
        request(productPage[i], function(error, response, body) {
            if (!error && response.statusCode === 200) {
        
                var $ = cheerio.load(body);
                
                /*The scraper should get the price, title, url and image url from the product page and save this information into a CSV file.*/
                console.log($(".price").text());
              
                
                } else {
                    console.log("error");
                }
        });
    }

console.log("end");



//http://www.netinstructions.com/how-to-make-a-simple-web-crawler-in-javascript-and-node-js/

/*

let $ = cheerio.load('<h2 class="title">Hello world</h2>');
 
$('h2.title').text('Hello there!');
$('h2').addClass('welcome');
 
$.html(); 


var fields = ['car', 'price', 'color'];

var myData = [
  {
    "car": "Audi",
    "price": 40000,
    "color": "blue"
  }, {
    "car": "BMW",
    "price": 35000,
    "color": "black"
  }, {
    "car": "Porsche",
    "price": 60000,
    "color": "green"
  }
];



try {
  var result = json2csv({ data: myData, fields: fields });
  console.log(result);
} catch (err) {
  // Errors are thrown for bad options, or if the data is empty and no fields are provided. 
  // Be sure to provide fields if it is possible that your data array will be empty. 
  console.error(err);
}
*/


