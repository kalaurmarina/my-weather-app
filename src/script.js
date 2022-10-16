//change Day and Time
let currentDate = new Date();
let timeElement = document.querySelector("h2");

function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let days = [
    "Sunday", 
    "Monday", 
    "Tuesday", 
    "Wednesday", 
    "Thursday", 
    "Friday", 
    "Saturday"
  ];

  let day = days[date.getDay()];
  let formattedDate = `${day} ${hours}:${minutes}`;
  return formattedDate;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = [
    "Monday", 
    "Tuesday", 
    "Wednesday", 
    "Thursday", 
    "Friday",
    "Saturday",
    "Sunday"
  ];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row m-0">`;
  forecast.forEach(function(forecastDay, index) {
    if (index < 6 ) {
  forecastHTML = 
  forecastHTML + 
  `
  <div class="col sm-6">
        <div class="weather-forecast-days">
            ${formatDay(forecastDay.dt)}
            </div>
          <br/>
          <img class="fa-sun"
          src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png"
          alt=""
          width="45"
        />
          <br/>
        <div class="weather-forecast-temperatures">
            <span class="weather-forecast-temperatures-max">
                ${Math.round(
            forecastDay.temp.max
          )}°
            </span>
            / <span class="weather-forecast-temperatures-min">
                ${Math.round(
            forecastDay.temp.min
          )}°
            </span>  
        </div>   
  </div> 
      `;
  }});

  
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coord) {
  console.log(coord);
  let apiKey = "6a0bac9dced487830ce6066218a5481c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coord.lat}&lon=${coord.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

timeElement.innerHTML = formatDate(currentDate);

//change City
function search(event) {
  event.preventDefault();
  let cityElement = document.querySelector("#city");
  let searchInput = document.querySelector("#search-input");
  cityElement.innerHTML = searchInput.value;
}
let searchForm = document.querySelector("#search-city");
searchForm.addEventListener("submit", search);


//change Celsius to Fahrenheit
function convertToFahrenheit(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = ((celsiusTemperature * 9) / 5 + 32);
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function convertToCelsius(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");

  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperature = temperatureElement.innerHTML;
   temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

//show City and Location 
function showTemperature(response) {
  console.log(response.data);
  let celsius = Math.round(response.data.main.temp);
  let fahrenheit = Math.round(celsius * 1.8 + 32);
  temperatureValue(celsius);
  
  let h1City = document.querySelector("#city");
  h1City.innerHTML = response.data.name;

  let weatherDescription = document.querySelector("#weather-descr");
  weatherDescription.innerHTML = response.data.weather[0].description;

  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = `${Math.round(response.data.main.humidity)} %`;

  let wind = document.querySelector("#wind");
  wind.innerHTML = `${Math.round(response.data.wind.speed)} m/h`;

  let pressure = document.querySelector("#pressure");
  pressure.innerHTML = `${Math.round(response.data.main.pressure)} hPa`;

  let icon = document.querySelector("#icon");
  icon.setAttribute(
    "src", 
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
  icon.setAttribute("alt", response.data.weather[0].description);

  celsiusTemperature = response.data.main.temp;
  getForecast(response.data.coord);
}

function temperatureValue(newTemperature) {
  let temperature = document.querySelector("#temperature");
  temperature.innerHTML = newTemperature;
}

function unitValue(newUnitTemperature) {
  let unit = document.querySelector("#unit-temperature");
  unit.innerHTML = newUnitTemperature``;
}

let celsiusTemperature = null;

let celsiusLink = document.querySelector("#fahrenheit-link");
celsiusLink.addEventListener("click", convertToFahrenheit);

let fahrenheitLink = document.querySelector("#celsius-link");
fahrenheitLink .addEventListener("click", convertToCelsius);

function showPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let units = "metric";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiKey = "6a0bac9dced487830ce6066218a5481c";
  let apiUrl = `${apiEndpoint}?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;

  axios.get(apiUrl).then(showTemperature);
}

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(showPosition);
}

let buttonMyLocation = document.querySelector("#current-loc");
buttonMyLocation.addEventListener("click", getCurrentPosition);

///Search for city
function searchCity(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-input");
  searchInput.value = firstUpper(searchInput.value.trim());

  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiKey = "6a0bac9dced487830ce6066218a5481c";
  let apiUrl = `${apiEndpoint}?q=${searchInput.value}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperature);

  let h1City = document.querySelector("#city");
  if (searchInput.value) {
    // h1City.innerHTML = `${searchInput.value}`;
  } else {
    h1City.innerHTML = null;
    temperatureValue(null);
    alert("Please enter a city");
  }
}

let searchFormCity = document.querySelector("#search-city");
searchFormCity.addEventListener("submit", searchCity);

function firstUpper(city) {
  if (!city) return city;
  return city
    .split(/\s+/)
    .map((word) => word[0].toUpperCase() + word.substring(1))
    .join(" ");
}
