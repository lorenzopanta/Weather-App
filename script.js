async function fetchWeather() {
    let searchInput = document.getElementById("search").value;   //.value gets the input from the <input>
    const weatherDataSection = document.getElementById("weather-data");
    weatherDataSection.style.display = "block";
    const apiKey = "check notepad";

    if(searchInput == ""){
        weatherDataSection.innerHTML =
        `
        <div>
            <h2>Empty Input!</h2>
            <p>Please try again with a valid <u> city name</u>. </p>
        </div>
        `;
        return;
    }

    //function that takes longitude and latitude coordinates
    async function getLonAndLat() {
        const countryCode = 39;
        const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${searchInput.replace(" ", "%20")},${countryCode}&limit=1&appid=${apiKey}`;

        const response = await fetch(geocodeURL);
        if(!response.ok) {
            console.log("Bad response! ", response.status);
            return;
        }

        const data = await response.json();     //converts the data into a json

        //checks if the json data is empty
        if(data.length == 0){
            console.log("Something went wrong here.");
            weatherDataSection.innerHTML = 
            `
            <div>
                <h2>Invalid Input: "${searchInput}"</h2>
                <p>Please try again with a valid <u>city name</u>.</p>
            </div>
            `;
            return;
        }
        else{
            console.log(data[0]);           //press f12 to open the browser console and see the data
            return data[0];     //the json data that we need
        }
    }


    //function that gets current weather based on lon and lat
    async function getWeatherData(lon, lat){
        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    
        const response = await fetch(weatherURL);
        if(!response.ok){
            console.log("Bad response! ", response.status);
            return;
        }

        const data = await response.json();

        weatherDataSection.style.display = "flex";
        weatherDataSection.innerHTML = 
        `
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}" width="100" />
        <div>
            <h2>${data.name}</h2>
            <p><strong>Temperature:</strong> ${Math.round(data.main.temp - 273.15)}°C</p>
            <p><strong>Description:</strong> ${data.weather[0].description}</p>
        </div>
        `;
    }


    document.getElementById("search").value = "";   //removes text from the input box
    const geocodeData = await getLonAndLat();
    getWeatherData(geocodeData.lon, geocodeData.lat);
}