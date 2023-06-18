const weatherBlock = document.querySelector(".weather__main");
const forecastBlock = document.querySelector(".forecast__main");

const form = document.querySelector(".form__form");
const formInput = document.querySelector(".form__input");
const formButton = document.querySelector(".form__button");

const apiKey = "2205e20b14da4db286500717230805";
const apiURL = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&days=3&q=`;
const apiSearchURL = `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=`;
const apiIP = `https://api.weatherapi.com/v1/ip.json?key=${apiKey}&q=`;

const locationCountry = document.querySelector(".location__country");

const tempNow = document.querySelector(".temp__now");
const tempMax = document.querySelector(".max");
const tempMin = document.querySelector(".min");

const windValue = document.querySelector(".wind");
const humidityValue = document.querySelector(".humidity");
const rainValue = document.querySelector(".rain");

const weatherIcon = document.querySelector(".weather__icon");

const searchBlock = document.querySelector(".search");
const searchItem = document.querySelector(".search__item");

const loader = document.querySelector(".loader");

const daysItems = document.getElementsByClassName("days__item");
const daysIcons = document.getElementsByClassName("days__icon");
const daysMax = document.getElementsByClassName("forecastMax");
const daysMin = document.getElementsByClassName("forecastMin");
const daysLinks = document.getElementsByClassName("days__link");

const hoursIcon = document.getElementsByClassName("hour__icon");
const hoursTemp = document.getElementsByClassName("hour__temp");
const hoursText = document.getElementsByClassName("hour__text");

console.log(daysMax[1]);

let isShowed = false;

let globalData;

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
            removeLoader();
          });
      })
      .catch((error) => {
        removeLoader();
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
  forecastBlock.classList.add("hide");
  searchBlock.classList.remove("hide");
});

// Обработчик события при потере фокуса элементом input
formInput.addEventListener("blur", function () {
  if (isShowed) {
    weatherBlock.classList.remove("hide");
    forecastBlock.classList.remove("hide");
    setTimeout(() => {
      searchBlock.classList.add("hide");
    }, 200);
  }
});

formInput.addEventListener("input", function () {
  searchURL(formInput.value);
});

Array.from(daysItems).forEach(function (daysItem) {
  daysItem.addEventListener("click", function (event) {
    event.preventDefault();
    deleteActiveDaysItem();
    daysItem.classList.add("days__item_active");
    changeWeather(event, daysItem.id);
  });
});

function deleteActiveDaysItem() {
  Array.from(daysItems).forEach(function (daysItem) {
    daysItem.classList.remove("days__item_active");
  });
}

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

function removeLoader() {
  loader.classList.add("none");
  document.body.classList.remove("noscroll");
}

function changeWeather(event, index) {
  event.preventDefault();

  if (index == 0) {
    tempNow.textContent = `${Math.round(globalData.current.temp_c)}`;
    weatherIcon.src = `https:${globalData.current.condition.icon}`.replace(
      "64x64",
      "128x128"
    );
  } else {
    tempNow.textContent = `${Math.round(
      globalData.forecast.forecastday[index].day.avgtemp_c
    )}`;
    weatherIcon.src =
      `https:${globalData.forecast.forecastday[index].day.condition.icon}`.replace(
        "64x64",
        "128x128"
      );
  }

  tempMax.textContent = `${Math.round(
    globalData.forecast.forecastday[index].day.maxtemp_c
  )}°`;
  tempMin.textContent = `${Math.round(
    globalData.forecast.forecastday[index].day.mintemp_c
  )}°`;

  windValue.innerHTML = `${Math.round(
    globalData.forecast.forecastday[index].day.maxwind_kph
  )} <span>km/h</span>`;
  humidityValue.innerHTML = `${Math.round(
    globalData.forecast.forecastday[index].day.avghumidity
  )} <span>%</span>`;
  rainValue.innerHTML = `${Math.round(
    globalData.forecast.forecastday[index].day.daily_chance_of_rain
  )} <span>%</span>`;

  setHoursInformation(index);
}

function setHoursInformation(index) {
  Array.from(hoursIcon).forEach(function (hourIcon, i) {
    hourIcon.src =
      `https:${globalData.forecast.forecastday[index].hour[i].condition.icon}`.replace(
        "64x64",
        "128x128"
      );
  });

  Array.from(hoursTemp).forEach(function (hourTemp, i) {
    hourTemp.textContent = `${Math.round(
      globalData.forecast.forecastday[index].hour[i].temp_c
    )}°`;
  });
}

function getStringDate(unixTime) {
  let date = new Date(unixTime * 1000);

  let day = ("0" + date.getDate()).slice(-2);
  let month = ("0" + (date.getMonth() + 1)).slice(-2);
  let year = date.getFullYear();

  return `${day}.${month}.${year}`;
}

function loadWeather(event, city, preventDefault = false) {
  if (preventDefault) {
    event.preventDefault();
  }

  fetch(`${apiURL}${city}`)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
    })
    .then(function (data) {
      if (data) {
        console.log(data);
        globalData = data;
        deleteActiveDaysItem();
        daysItems[0].classList.add("days__item_active");
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

        weatherIcon.src = `https:${data.current.condition.icon}`.replace(
          "64x64",
          "128x128"
        );

        for (let i = 0; i < 3; i++) {
          daysMax[i].textContent = `${Math.round(
            data.forecast.forecastday[i].day.maxtemp_c
          )}°`;
          daysMin[i].textContent = `${Math.round(
            data.forecast.forecastday[i].day.mintemp_c
          )}°`;

          daysIcons[
            i
          ].src = `https:${data.forecast.forecastday[i].day.condition.icon}`;

          daysLinks[i].textContent = getStringDate(
            data.forecast.forecastday[i].date_epoch
          );
        }

        isShowed = true;
        weatherBlock.classList.remove("hide");
        forecastBlock.classList.remove("hide");
        searchBlock.classList.add("hide");
        formInput.value = data.location.name;
        window.history.replaceState(null, "", `?city=${data.location.name}`);
        removeLoader();
        setHoursInformation(0);
        console.log(globalData);
      }
    })
    .catch(function (error) {
      console.log("Error:", error);
      removeLoader();
    });
}
