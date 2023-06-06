const weatherBlock = document.querySelector(".weather__main");

const form = document.querySelector(".form__form");
const formInput = document.querySelector(".form__input");
const formButton = document.querySelector(".form__button");

const apiKey = "2205e20b14da4db286500717230805";
const apiURL = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&days=1&q=`;
const apiSearchURL = `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=`;
const apiIP = `https://api.weatherapi.com/v1/ip.json?key=${apiKey}&q=`;

const searchBlock = document.querySelector(".search");
const searchItem = document.querySelector(".search__item");

let isShowed = false;

window.addEventListener("DOMContentLoaded", function () {
  var urlParams = new URLSearchParams(window.location.search);
  var city = urlParams.get("city");
  if (city) {
    // Если город указан в URL, загружаем погоду для этого города
    loadWeather(event, city, false);
  } else {
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => {
        const ipAddress = data.ip;
        fetch(`${apiIP}${data.ip}`)
          .then((response) => response.json())
          .then((data) => {
            loadWeather(event, data.city);
          })
          .catch((error) => {
            return;
          });
      })
      .catch((error) => {
        return;
      });
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  loadWeather(event, formInput.value, false);
});

formInput.addEventListener("focus", function () {
  formInput.select();
  weatherBlock.classList.add("hide");
  searchBlock.classList.remove("hide");
});

// Обработчик события при потере фокуса элементом input
formInput.addEventListener("blur", function () {
  if (isShowed) {
    weatherBlock.classList.remove("hide");
    setTimeout(() => {
      searchBlock.classList.add("hide");
    }, 200);
  }
});

formInput.addEventListener("input", function () {
  searchURL(formInput.value);
});

function searchURL(city) {
  if (!city) return;

  fetch(`${apiSearchURL}${city}`)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
    })
    .then(function (data) {
      if (data) {
        let content = "";

        for (let city in data) {
          if (!data[city].name) {
            content = "";
          }

          content += `<a href="#" onclick="loadWeather(event, '${data[city].name}', 1);" class="search__link">${data[city].name}, ${data[city].country}</a>`;
        }
        searchItem.innerHTML = content;
      }
    })
    .catch(function (error) {
      console.log("Error:", error);
    });
}

function loadWeather(event, city, preventDefault = false) {
  if (preventDefault) {
    event.preventDefault();
  }
  const locationCountry = document.querySelector(".location__country");

  const tempNow = document.querySelector(".temp__now");
  const tempMax = document.querySelector(".max");
  const tempMin = document.querySelector(".min");

  const windValue = document.querySelector(".wind");
  const humidityValue = document.querySelector(".humidity");
  const rainValue = document.querySelector(".rain");

  const weatherIcon = document.querySelector(".weather__icon");

  fetch(`${apiURL}${city}`)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
    })
    .then(function (data) {
      if (data) {
        formInput.blur();
        locationCountry.textContent = `${data.location.name}, ${data.location.country}`;

        tempNow.textContent = `${Math.round(data.current.temp_c)}`;
        tempMax.textContent = `${Math.round(
          data.forecast.forecastday[0].day.maxtemp_c
        )}°`;
        tempMin.textContent = `${Math.round(
          data.forecast.forecastday[0].day.mintemp_c
        )}°`;

        windValue.innerHTML = `${Math.round(
          data.forecast.forecastday[0].day.maxwind_kph
        )} <span>km/h</span>`;
        humidityValue.innerHTML = `${Math.round(
          data.forecast.forecastday[0].day.avghumidity
        )} <span>%</span>`;
        rainValue.innerHTML = `${Math.round(
          data.forecast.forecastday[0].day.daily_chance_of_rain
        )} <span>%</span>`;

        weatherIcon.src = `http:${data.current.condition.icon}`;

        isShowed = true;
        weatherBlock.classList.remove("hide");
        searchBlock.classList.add("hide");
        formInput.value = data.location.name;
        window.history.replaceState(null, "", `?city=${data.location.name}`);
      }
    })
    .catch(function (error) {
      console.log("Error:", error);
    });
}
