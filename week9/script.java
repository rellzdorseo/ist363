async function getWeather() {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=43.0481&longitude=-76.1474&current=temperature_2m,precipitation,cloud_cover&temperature_unit=fahrenheit&precipitation_unit=inch";

    try {
        const response = await fetch(url);
        const data = await response.json();

        const temperature = data.current.temperature_2m;
        const precipitation = data.current.precipitation;
        const cloudCover = data.current.cloud_cover;

        document.getElementById("temperature").textContent = temperature + "°F";
        document.getElementById("precipitation").textContent = precipitation + "\"";

        if (cloudCover >= 50) {
            document.getElementById("cloudEmoji").textContent = "☁️";
        } else {
            document.getElementById("cloudEmoji").textContent = "☀️";
        }
    } catch (error) {
        console.log("There was an error getting the weather data:", error);
        document.getElementById("temperature").textContent = "Unavailable";
        document.getElementById("precipitation").textContent = "Unavailable";
        document.getElementById("cloudEmoji").textContent = "❌";
    }
}

getWeather();