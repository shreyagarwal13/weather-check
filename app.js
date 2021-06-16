require('dotenv').config();
const express = require("express");
const bp = require("body-parser");
const https = require("https");
const flash = require("express-flash");
var geoip = require('geoip-lite');


const api_key = process.env.WEATHER_API;
const ip_token = process.env.IP_API;

const app = express();

app.use(bp.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));



app.get('/',function(req,res){
  res.render('index');
});

app.post('/weather',function(req,res){
  var city = req.body.city;
  const url = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&units=metric&appid="+api_key;
  https.get(url,function(response){
    response.on("data", function(data){
      const wdata = JSON.parse(data);
      res.send(wdata);
    });
  });
});

app.post('/aqi',function(req,res){
  var lat = req.body.lat;
  var lon = req.body.lon;
  const url = "https://api.openweathermap.org/data/2.5/air_pollution?lat="+lat+"&lon="+lon+"&appid="+api_key;
  https.get(url,function(response){
    response.on("data", function(data){
      const aqidata = JSON.parse(data);
      res.send(aqidata);
    });
  });
});

app.post('/city',function(req,res){
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  if (ip.substr(0, 7) == "::ffff:") {
    ip = ip.substr(7)
  }

  const url = 'https://ipinfo.io/'+ip+'?token='+ip_token;
  https.get(url,function(response){
    response.on("data", function(data){
      const citydata = JSON.parse(data);
      res.send(citydata);
    });
  });
});

let port = process.env.PORT;
if(port==null || port ==""){
  port = 3000;
}
app.listen(port, function(){
  console.log("Server has started successfully");
});
