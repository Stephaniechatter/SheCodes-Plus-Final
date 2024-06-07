function refreshWeather(response) {
    let temperatureElement = document.querySelector("#temperature");
    let cityElement = document.querySelector("#city");
    let descriptionElement = document.querySelector("#description");
    let humidityElement = document.querySelector("#humidity");
    let windSpeedElement = document.querySelector("#wind-speed");
    let timeElement = document.querySelector("#time");
    let iconElement = document.querySelector("#icon");
    
    let temperature = response.data.temperature.current;
    let date = new Date(response.data.time * 1000);
    let iconUrl = response.data.condition.icon_url;
    
    cityElement.innerHTML = response.data.city;
    timeElement.innerHTML = formatDate(date);
    descriptionElement.innerHTML = response.data.condition.description;
    humidityElement.innerHTML = `${response.data.temperature.humidity}%`;
    windSpeedElement.innerHTML = `${response.data.wind.speed} mph`;
    temperatureElement.innerHTML = Math.round(temperature);
    iconElement.setAttribute("src", iconUrl);
    iconElement.setAttribute("alt", response.data.condition.description);
}

function displayForecast(response) {
    let forecastElement = document.querySelector("#forecast");
    let forecast = response.data.daily;
    
    let forecastHTML = `<div class="weather-forecast-row">`;
    forecast.forEach(function(forecastDay, index) {
        if (index < 5) {
            let day = new Date(forecastDay.time * 1000);
            forecastHTML += `
                <div class="weather-forecast-day">
                    <div class="weather-forecast-date">${formatDay(day)}</div>
                    <img src="${forecastDay.condition.icon_url}" alt="${forecastDay.condition.description}" width="42" />
                    <div class="weather-forecast-temperature">
                        <span class="weather-forecast-max">${Math.round(forecastDay.temperature.maximum)}°</span>
                        <span class="weather-forecast-min">${Math.round(forecastDay.temperature.minimum)}°</span>
                    </div>
                </div>
            `;
        }
    });
    forecastHTML += `</div>`;
    forecastElement.innerHTML = forecastHTML;
}

function formatDate(date) {
    let minutes = date.getMinutes();
    let hours = date.getHours();
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let day = days[date.getDay()];

    if (minutes < 10) {
        minutes = `0${minutes}`;
    }

    return `${day} ${hours}:${minutes}`;
}

function formatDay(date) {
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[date.getDay()];
}

function searchCity(city) {
    let apiKey = "64od2000bca5188a9533t4ea4bf43c96";
    let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=imperial`;
    axios.get(apiUrl).then(refreshWeather);

    apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=imperial`;
    axios.get(apiUrl).then(displayForecast);
}

function handleSearchSubmit(event) {
    event.preventDefault();
    let searchInput = document.querySelector("#search-form-input");
    searchCity(searchInput.value);
}

let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearchSubmit);

searchCity("Houston");
