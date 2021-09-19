import { TTL } from "./cache.js";
import { NO_OF_IMAGES } from "./constants.js";

export function setInnerText(selector, text) {
  const element = document.querySelector(selector);
  if (element) {
    element.innerText = text;
  }
}

export function showOnMouseMove(selector, duration = 1000) {
  const element = document.querySelector(selector);
  element.classList.add("show-on-mouse-move");
  let timer;

  document.addEventListener("mousemove", () => {
    element.classList.remove("hidden");
    clearTimeout(timer);
    timer = setTimeout(() => {
      element.classList.add("hidden");
    }, duration);
  });
}

export function updateLinks(isFahrenheit, overlayLeft) {
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

export function updateOverlayPosition(overlayLeft) {
  if (overlayLeft) {
    document
      .querySelector(".overlay-container")
      .classList.add("overlay-container--left");
  }
}

// image helpers
export function restoreLastImage() {
  const lastImage = localStorage.getItem("lastImage");
  if (lastImage) {
    setImage(lastImage);
  }
  document.querySelector(".bg-image").classList.remove("hidden");
}

export function setImage(description) {
  localStorage.setItem("lastImage", description);
  const max = NO_OF_IMAGES[description];
  const num = calculateImageNumber(max);
  document
    .querySelector(".bg-image")
    .setAttribute("src", `assets/images/${description}_${num}.png`);
}

export function calculateImageNumber(max) {
  const now = new Date();
  const msSinceMidnight = now.getTime() - now.setHours(0, 0, 0, 0);
  return (Math.floor(msSinceMidnight / TTL) % max) + 1;
}
