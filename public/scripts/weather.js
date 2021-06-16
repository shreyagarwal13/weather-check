const hr = document.getElementById("hr-hand");
const min = document.getElementById("min-hand");
const sec = document.getElementById("sec-hand");
const date = document.getElementById("date");
const deg = 6;


let months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
let weekdays = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday",]
let aqiReview = ['Good','Fair','Moderate','Poor','Very Poor'];

setInterval(function(){
  let day = new Date();
  let hrHand = day.getHours()*30;
  let minHand = day.getMinutes() * deg;
  let secHand = day.getSeconds() * deg;
  let dd = day.getDate();
  let mm = months[day.getMonth()]; //starts from 0
  let weekday = weekdays[day.getDay()-1];

  hr.style.transform = `rotateZ(${(hrHand)+(minHand/12)}deg)`;
  min.style.transform = `rotateZ(${minHand}deg)`;
  sec.style.transform = `rotateZ(${secHand}deg)`;
  date.innerText = dd+" "+mm+", "+weekday
},100);



var city='Delhi';
getWeather(city);
getCity();

setInterval(function(){
  getWeather(city);
},3000);


function getCity(){
  // const url = "https://ipinfo.io/json?"+ip_token;
  // fetch(url)
  // .then(handleErrors)
  // .then((response) => response.json())
  // .then((data) => setCity(data.city));

  $.post('/city',function(response){
    if(response.city){
      setCity(response.city);
    }
  });
}

function getWeather(weatherCity){
  $.post('/weather', {
    city:weatherCity
  },function(response){
    if(response.cod==200){
      city = response.name;
      setWeather(response);
    }
    else{

      document.getElementById('error').style.visibility = 'visible';
      setTimeout(function(){
        document.getElementById('error').style.visibility = 'hidden';
      },3000);
    }
  });
}

function getAQI(lat,lon){
  $.post('/aqi', {
    lat:lat,
    lon:lon
  },function(response){
    setAQI(response);
  });
}

function setCity(userCity){
  city = userCity;
  getWeather(city);
}

function setWeather(data){
  const lat = data.coord.lat;
  const lon = data.coord.lon;
  getAQI(lat,lon);

  const icon = data.weather[0].icon;
  document.getElementById('city').innerText= data.name;
  document.getElementById('temp').innerText= data.main.temp;
  document.getElementById('min-temp').innerText= data.main.temp_min;
  document.getElementById('max-temp').innerText= data.main.temp_max;
  document.getElementById('humidity').innerText= data.main.humidity;
  document.getElementById('desc').innerText= data.weather[0].description;
  document.getElementById('wind').innerText= data.wind.speed;
  document.getElementById('weather-icon').src= "http://openweathermap.org/img/wn/"+icon+"@2x.png";
}

function setAQI(data){
  document.getElementById('aqi').innerText = aqiReview[data.list[0].main.aqi-1];
}

document.getElementById('search-button').addEventListener("click",function(){

  getWeather(document.getElementById('search-bar').value);
});

document.getElementById("search-bar").addEventListener("keyup",function(event){
  if(event.key =='Enter'){
    getWeather(document.getElementById('search-bar').value);
  }
});
