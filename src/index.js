const isFahrenheit = /[&?]unit=([^&]+)/.exec(location.search)?.[1] === "F";
const overlayLeft = /[&?]overlay=([^&]+)/.exec(location.search)?.[1] === "left";

initPage();

async function initPage() {
  try {
    if (overlayLeft) {
      document
        .querySelector(".overlay-container")
        .classList.add("overlay-container--left");
    }
    setText(".description", "loading...");
    const current_weather = await getCurrentWeather();
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

async function getCurrentWeather() {
  const ip_res = await fetch("https://api.ipify.org");
  const ip = await ip_res.text();
  const weather_res = await fetch(`https://wttr.in/${ip}?format=j1`);
  const weather = await weather_res.json();
  return weather.current_condition[0];
}

function setText(selector, text) {
  document.querySelector(selector).innerText = text;
}

function setImage(description) {
  const max = NO_OF_IMAGES[description];
  const random = Math.floor(Math.random() * max + 1);
  document
    .querySelector(".bg-image")
    .setAttribute("src", `assets/images/${description}_${random}.png`);
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
  const unitLink = document.querySelector(".unit-switch");
  const positionLink = document.querySelector(".position-switch");
  unitLink.classList.add("hidden");
  positionLink.classList.add("hidden");

  let timer;

  document.addEventListener("mousemove", () => {
    unitLink.classList.remove("hidden");
    positionLink.classList.remove("hidden");
    clearTimeout(timer);
    timer = setTimeout(() => {
      console.log("timeout");
      unitLink.classList.add("hidden");
      positionLink.classList.add("hidden");
    }, 1000);
  });
}

// https://github.com/chubin/wttr.in/blob/master/lib/constants.py
WWO_CODE = {
  113: "Sunny",
  116: "PartlyCloudy",
  119: "Cloudy",
  122: "VeryCloudy",
  143: "Fog",
  176: "LightShowers",
  179: "LightSleetShowers",
  182: "LightSleet",
  185: "LightSleet",
  200: "ThunderyShowers",
  227: "LightSnow",
  230: "HeavySnow",
  248: "Fog",
  260: "Fog",
  263: "LightShowers",
  266: "LightRain",
  281: "LightSleet",
  284: "LightSleet",
  293: "LightRain",
  296: "LightRain",
  299: "HeavyShowers",
  302: "HeavyRain",
  305: "HeavyShowers",
  308: "HeavyRain",
  311: "LightSleet",
  314: "LightSleet",
  317: "LightSleet",
  320: "LightSnow",
  323: "LightSnowShowers",
  326: "LightSnowShowers",
  329: "HeavySnow",
  332: "HeavySnow",
  335: "HeavySnowShowers",
  338: "HeavySnow",
  350: "LightSleet",
  353: "LightShowers",
  356: "HeavyShowers",
  359: "HeavyRain",
  362: "LightSleetShowers",
  365: "LightSleetShowers",
  368: "LightSnowShowers",
  371: "HeavySnowShowers",
  374: "LightSleetShowers",
  377: "LightSleet",
  386: "ThunderyShowers",
  389: "ThunderyHeavyRain",
  392: "ThunderySnowShowers",
  395: "HeavySnowShowers",
};

WEATHER_MAPPING = {
  Cloudy: "cloudy",
  Fog: "fog",
  HeavyRain: "rain",
  HeavyShowers: "rain",
  HeavySnow: "snow",
  HeavySnowShowers: "snow",
  LightRain: "rain",
  LightShowers: "rain",
  LightSleet: "snow",
  LightSleetShowers: "snow",
  LightSnow: "snow",
  LightSnowShowers: "snow",
  PartlyCloudy: "cloudy",
  Sunny: "sunny",
  ThunderyHeavyRain: "thundery",
  ThunderyShowers: "thundery",
  ThunderySnowShowers: "thundery",
  VeryCloudy: "cloudy",
};

const NO_OF_IMAGES = {
  sunny: 5,
  cloudy: 5,
  fog: 5,
  rain: 5,
  snow: 6,
  thundery: 3,
};
