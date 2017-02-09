var fs = require("fs");
var cheerio = require('cheerio');
var json2csv = require('json2csv');
var request = require('request');
var url = require("url");
var moment = require("moment");
var csv = require("fast-csv");
var date = moment().format("YYYY-MM-DD");

var csvStream = csv.createWriteStream({headers: true});
writableStream = fs.createWriteStream("./data/" + date + ".csv");


var productpageURL = "http://shirts4mike.com/shirts.php";


// Throws with a ReferenceError because z is undefined
try {
    fs.accessSync("./data");
} catch (err) {
  // Handle the error here.
    fs.mkdirSync("./data");
}


request(productpageURL, function(error, response, body){
    
   if (!error && response.statusCode === 200) {
       scrapURL(body);
   } else {
       console.log("There’s been a 404 error. Cannot connect to the to http://shirts4mike.com.");
   }
});


//Function scraping the urls 
function scrapURL(body) {

    var $ = cheerio.load(body);

     $("a[href*='shirt']","#content").each(function() {
            var link = $(this);
            var href = link.attr("href");
            var productLinks = url.resolve(productpageURL,"/" + href);
            //console.log(productLinks);
            visitProductpage(productLinks);
    });
} 

//Function that goes to each product page
function visitProductpage(productLinks){
    console.log(productLinks);
request(productLinks, function (error, response, body){ 
    if(!error && response.statusCode === 200) {
        scrapProductpage(body, productLinks);
        //console.log("function visitProductpage")
        } else { 
            console.log(error.message);
        }
});
}


//Assume that the the column headers in the CSV need to be in a certain order to be correctly entered into a database. They should be in this order: Title, Price, ImageURL, URL, and Time
//Function that scraps relevant data 
function scrapProductpage(body,productLinks) {
    
    var $ = cheerio.load(body);
    var Title = $(".shirt-details h1").text().substr(4);
    console.log(Title);
    
    var price = $(".price").text();
    console.log(price);
    
    var Imageurl = $(".shirt-picture img").attr("src");
    console.log(Imageurl);
    
    console.log(productLinks);
    
    csvStream.write({
        Title: Title,
        Price: price,
        Imageurl: Imageurl,
        URL: productLinks,
        Time: moment().format("HH:mm:ss")
        
    });
} 


csvStream.pipe(writableStream);

writableStream.on("finish", function(){
  console.log("DONE!");
});
 



