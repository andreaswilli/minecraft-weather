import {
  getIPAddress,
  getGeoLocation,
  getCurrentWeather,
} from "./api-requests.js";
import { TTL, withCache } from "./cache.js";
import { WEATHER_MAPPING, WWO_CODE } from "./constants.js";
import {
  setInnerText,
  showOnMouseMove,
  updateLinks,
  restoreLastImage,
  setImage,
  updateOverlayPosition,
} from "./dom.js";

const isFahrenheit = /[&?]unit=([^&]+)/.exec(location.search)?.[1] === "F";
const overlayLeft = /[&?]overlay=([^&]+)/.exec(location.search)?.[1] === "left";

initPage();

async function initPage() {
  restoreLastImage();
  updateOverlayPosition(overlayLeft);
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
    const currentWeather = await withCache(
      () => getCurrentWeather(location),
      "weather"
    );

    if (isFahrenheit) {
      setInnerText(".temperature", currentWeather.temp_F + "°F");
    } else {
      setInnerText(".temperature", currentWeather.temp_C + "°C");
    }

    setInnerText(".description", currentWeather.weatherDesc[0].value);
    const weatherDescription =
      WEATHER_MAPPING[WWO_CODE[currentWeather.weatherCode]];

    setImage(weatherDescription);
    updateLinks(isFahrenheit, overlayLeft);
    showOnMouseMove(".settings-overlay");
    periodicallyRefreshPage();
  } catch (e) {
    setInnerText(
      ".description",
      "API request failed. Was it blocked by your ad/script blocker?"
    );
    throw e;
  }
}

// the interval should be slightly larger than the TTL of the cache
function periodicallyRefreshPage(interval = TTL * 1.01) {
  setInterval(() => {
    location.reload();
  }, interval);
}
