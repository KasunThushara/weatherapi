// Define the API endpoint URL
//const cityIds = '1248991,1850147,2644210,2988507,2147714,4930956,1796236,3143244';
const jsonString = '{"List":[{"CityCode":"1248991","CityName":"Colombo","Temp":"33.0","Status":"Clouds"},{"CityCode":"1850147","CityName":"Tokyo","Temp":"8.6","Status":"Clear"},{"CityCode":"2644210","CityName":"Liverpool","Temp":"16.5","Status":"Rain"},{"CityCode":"2988507","CityName":"Paris","Temp":"22.4","Status":"Clear"},{"CityCode":"2147714","CityName":"Sydney","Temp":"27.3","Status":"Rain"},{"CityCode":"4930956","CityName":"Boston","Temp":"4.2","Status":"Mist"},{"CityCode":"1796236","CityName":"Shanghai","Temp":"10.1","Status":"Clouds"},{"CityCode":"3143244","CityName":"Oslo","Temp":"-3.9","Status":"Clear"}]}';
const cityCodes = JSON.parse(jsonString).List.map(city => city.CityCode);
const cityIds = cityCodes.join(',');

const apiUrl = `http://api.openweathermap.org/data/2.5/group?id=${cityIds}&appid=50a7aa80fa492fa92e874d23ad061374`;

async function fetchWeatherData() {
    const response = await fetch(apiUrl);
    const data = await response.json();
    localStorage.setItem('weatherData', JSON.stringify(data));
    localStorage.setItem('weatherDataTimestamp', Date.now());
    return data;
  }
  function getWeatherDataFromCache() {
    const weatherData = localStorage.getItem('weatherData');
    const weatherDataTimestamp = localStorage.getItem('weatherDataTimestamp');
    if (weatherData && weatherDataTimestamp && (Date.now() - weatherDataTimestamp) < 5 * 60 * 1000) {
      return JSON.parse(weatherData);
    } else {
      return null;
    }
  }
  async function updateWeather() {
    // Get the weather data from localStorage if it exists and is not expired
    let data = getWeatherDataFromCache();
    
    // If the weather data doesn't exist or is expired, fetch it from the API and store it in localStorage
    if (!data) {
      data = await fetchWeatherData();
    }
    const cards = document.querySelectorAll('.card');

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];

    // Get the weather data for the current city
    const cityData = data.list[i];

    // Update the city and date/time
    const cityElement = card.querySelector('#city');
    cityElement.textContent = cityData.name + ', ' + cityData.sys.country;

    const dateTimeElement = card.querySelector('#date_time');
    const now = new Date();
    dateTimeElement.textContent = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' }) + ', ' + now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });



    // Update the weather icon and description
    const imageElement = card.querySelector('#image');
    imageElement.textContent = formatClouds(cityData.weather[0].description);
    

    // Update the weather icon and description
    const imageEle = card.querySelector('#imglink');
    const iconUrl = `http://openweathermap.org/img/w/${cityData.weather[0].icon}.png`;
    imageEle.setAttribute('src', iconUrl);
    imageEle.setAttribute('alt', cityData.weather[0].description);    

    // Update the temperature information
    const tempElement = card.querySelector('#temp');
    tempElement.textContent = Math.round(cityData.main.temp - 273.15) + '°C';

    const minTempElement = card.querySelector('#min_temp');
    minTempElement.textContent = 'Temp min '+Math.round(cityData.main.temp_min - 273.15) + '°C';

    const maxTempElement = card.querySelector('#max_temp');
    maxTempElement.textContent = 'Temp max '+Math.round(cityData.main.temp_max - 273.15) + '°C';

    // Update the atmospheric pressure, humidity, and visibility information
    const pressureElement = card.querySelector('#pressure');
    pressureElement.innerHTML = '<b>Pressure </b>'+cityData.main.pressure + ' hPa';

    const humidityElement = card.querySelector('#humidity');
    humidityElement.innerHTML = '<b>Humidity</b> '+cityData.main.humidity + ' %';

    const visibilityElement = card.querySelector('#visibility');
    visibilityElement.innerHTML = '<b>Visibility</b> ' + (cityData.visibility / 1000).toFixed(1) + ' km';

    // Update the wind speed and direction information
    //const windImgElement = card.querySelector('#wind_img');
   // windImgElement.textContent = 'image';

    

    const windSpeedElement = card.querySelector('#wind_speed');
    windSpeedElement.textContent = cityData.wind.speed.toFixed(1) + ' m/s ' + cityData.wind.deg + '°';

    // Update the sunrise and sunset information
    const sunriseElement = card.querySelector('#sunrise');
    const sunriseTime = new Date(cityData.sys.sunrise * 1000);
    sunriseElement.innerHTML = '<b>Sunrise: </b>' + sunriseTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' });

    const sunsetElement = card.querySelector('#sunset');
    const sunsetTime = new Date(cityData.sys.sunset * 1000);
    sunsetElement.innerHTML = '<b>Sunset: </b>' + sunsetTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' });
}
  
    // Update the content of each card with the weather data
    // ...
  }    

  function formatClouds(cloudStr) {
    // Split the string into words
    const words = cloudStr.split(" ");
  
    // Convert the first word to title case
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  
    // Join the words back into a string and return
    return words.join(" ");
  }
  updateWeather()