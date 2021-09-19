import { withCache } from "./cache.js";
import { NO_OF_IMAGES, WEATHER_MAPPING, WWO_CODE } from "./constants.js";

const isFahrenheit = /[&?]unit=([^&]+)/.exec(location.search)?.[1] === "F";
const overlayLeft = /[&?]overlay=([^&]+)/.exec(location.search)?.[1] === "left";

initPage();

async function initPage() {
  setLastImage();
  if (overlayLeft) {
    document
      .querySelector(".overlay-container")
      .classList.add("overlay-container--left");
  }
  setText(".description", "loading...");
  try {
    let location;
    try {
      const coords = await withCache(getGeoLocation, "location");
      location = `[${coords.lat},${coords.lon}]`;
    } catch (e) {
      document.querySelector(".info-text").innerText =
        "Note: Using location based on IP address. For more precise data enable location services.";
      location = await withCache(getIPAddress, "ip");
    }
    const current_weather = await getCurrentWeather(location);
    if (isFahrenheit) {
      setText(".temperature", current_weather.temp_F + "°F");
    } else {
      setText(".temperature", current_weather.temp_C + "°C");
    }
    setText(".description", current_weather.weatherDesc[0].value);
    const weather_description =
      WEATHER_MAPPING[WWO_CODE[current_weather.weatherCode]];
    setImage(weather_description);
    updateLinks();
    hideAndShowLinks();
  } catch (e) {
    setText(
      ".description",
      "API request failed. Was it blocked by your ad/script blocker?"
    );
  }
}

function setLastImage() {
  const lastImage = localStorage.getItem("lastImage");
  if (lastImage) {
    setImage(lastImage);
  }
  document.querySelector(".bg-image").classList.remove("hidden");
}

function getGeoLocation() {
  return new Promise((res, rej) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        res({
          lon: pos.coords.longitude,
          lat: pos.coords.latitude,
        });
      },
      rej,
      { maximumAge: 0 }
    );
  });
}

async function getIPAddress() {
  const ip_res = await fetch("https://api.ipify.org");
  return ip_res.text();
}

async function getCurrentWeather(location) {
  const weather_res = await fetch(`http://wttr.in/${location}?format=j1`);
  const weather = await weather_res.json();
  return weather.current_condition[0];
}

function setText(selector, text) {
  document.querySelector(selector).innerText = text;
}

function setImage(description) {
  localStorage.setItem("lastImage", description);
  const max = NO_OF_IMAGES[description];
  const num = calculateImageNumber(max);
  document
    .querySelector(".bg-image")
    .setAttribute("src", `assets/images/${description}_${num}.png`);
}

function calculateImageNumber(max) {
  const now = new Date();
  const msSinceMidnight = now.getTime() - now.setHours(0, 0, 0, 0);
  const TTL = 1000 * 60 * 30; // 30min
  return (Math.floor(msSinceMidnight / TTL) % max) + 1;
}

function updateLinks() {
  const currentUnit = isFahrenheit ? "F" : "C";
  const otherUnit = isFahrenheit ? "C" : "F";
  const currentPosition = overlayLeft ? "left" : "right";
  const otherPosition = overlayLeft ? "right" : "left";

  const unitLink = document.querySelector(".unit-switch");
  unitLink.innerText = `switch to °${otherUnit}`;
  unitLink.setAttribute(
    "href",
    `?unit=${otherUnit}&overlay=${currentPosition}`
  );

  const positionLink = document.querySelector(".position-switch");
  positionLink.innerText = `move to the ${otherPosition}`;
  positionLink.setAttribute(
    "href",
    `?unit=${currentUnit}&overlay=${otherPosition}`
  );
}

function hideAndShowLinks() {
  const settingsOverlay = document.querySelector(".settings-overlay");
  let timer;

  document.addEventListener("mousemove", () => {
    settingsOverlay.classList.remove("hidden");
    clearTimeout(timer);
    timer = setTimeout(() => {
      settingsOverlay.classList.add("hidden");
    }, 1000);
  });
}
