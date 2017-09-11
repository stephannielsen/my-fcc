var currentUnitIndex = 0;
var tempInCText;
var tempInFText;
var marker;

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(handlePosition, handleError);
  }
}

function handleError(error) {
  $("#weather").html("Sorry, I don't know where you are...did you share your location?");
}

function switchUnit() {
  currentUnitIndex = currentUnitIndex == 0 ? 1 : 0;
  if (currentUnitIndex === 0) {
    marker.setPopupContent(tempInCText);
    $("#temp-unit").html("in °F");
  }
  else {
    marker.setPopupContent(tempInFText);
    $("#temp-unit").html("in °C");
  }
}

function handlePosition(position) {
  var lat = position.coords.latitude;
  var lon = position.coords.longitude;

  var weatherMapUrl = "http://api.openweathermap.org/data/2.5/weather?units=metric&lat=" + lat + "&lon=" + lon + "&appid=" + openWeatherMapApiKey;

  $.getJSON(weatherMapUrl, (weather) => {
    var country = weather.sys.country;
    var city = weather.name;
    var tempInC = weather.main.temp;
    var tempInF = (tempInC * 9 / 5 + 32).toFixed(2);
    tempInCText = city + ' (' + country + ')<br>' + tempInC + ' °C';
    tempInFText = city + ' (' + country + ')<br>' + tempInF + ' °F'

    var map = L.map('map').setView([lat, lon], 13);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox.streets',
      accessToken: mapboxApiKey
    }).addTo(map);
    marker = L.marker([lat, lon]).addTo(map)
      .bindPopup(tempInCText)
      .openPopup();
  });
}

$(document).ready(function () {
  $("#temp-unit").html(" in " + temperatureUnits[currentUnitIndex == 0 ? 1 : 0]);
    $("#switchUnit").on("click", function () {
    switchUnit();
  });
  getLocation();
});