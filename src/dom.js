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
