export function getGeoLocation() {
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

export async function getIPAddress() {
  const ip_res = await fetch("https://api.ipify.org");
  return ip_res.text();
}

export async function getCurrentWeather(location) {
  const weather_res = await fetch(`https://wttr.in/${location}?format=j1`);
  const weather = await weather_res.json();
  return weather.current_condition[0];
}
