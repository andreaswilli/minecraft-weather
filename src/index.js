import {
  getIPAddress,
  getGeoLocation,
  getCurrentWeather,
} from "./api-requests.js";
import { withCache } from "./cache.js";
import { NO_OF_IMAGES, WEATHER_MAPPING, WWO_CODE } from "./constants.js";
import { setInnerText, showOnMouseMove, updateLinks } from "./dom.js";

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
  setInnerText(".description", "loading...");
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
      setInnerText(".temperature", current_weather.temp_F + "°F");
    } else {
      setInnerText(".temperature", current_weather.temp_C + "°C");
    }
    setInnerText(".description", current_weather.weatherDesc[0].value);
    const weather_description =
      WEATHER_MAPPING[WWO_CODE[current_weather.weatherCode]];
    setImage(weather_description);
    updateLinks(isFahrenheit, overlayLeft);
    showOnMouseMove(".settings-overlay");
  } catch (e) {
    setInnerText(
      ".description",
      "API request failed. Was it blocked by your ad/script blocker?"
    );
    throw e;
  }
}

function setLastImage() {
  const lastImage = localStorage.getItem("lastImage");
  if (lastImage) {
    setImage(lastImage);
  }
  document.querySelector(".bg-image").classList.remove("hidden");
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
