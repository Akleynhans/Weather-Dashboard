var currentStats = document.querySelector('#current');
var searchBTN = document.querySelector('#searchBTN');
var searchInput = document.querySelector('#searchInput');
var historyContainer = document.querySelector('#searchHistory');
var imgEl = document.querySelector('#iconEl');


var date = dayjs().format('MMM D, YYYY');
var searchHistory = [];

var APIkey = "39f7785d8aca749af9f6a4c21d391c17";

// populate from localstorage
render()

var lookupWeather = function (event) {
    event.preventDefault();

    var city = searchInput.value.trim().toUpperCase();
    // if city doesnt match any existing cities add to array
    const matchingIndex = searchHistory.findIndex(
        (item) => item === city
    )

    if (matchingIndex === -1) {
        searchHistory.unshift(city)
        historyBtns(city)
    }

    // if array is more than 7 drop last one
    if (searchHistory.length === 7) {
        searchHistory.pop();
        historyContainer.removeChild(historyContainer.lastChild);
    }

    searchInput.value = "";
    getCoordinates(city)
    saveHistory()
}

// use city to get lat and lon coordinates
var getCoordinates = function (city) {
    var locationURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + APIkey;

    fetch(locationURL)

        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var lat = data[0].lat;
            var lon = data[0].lon;
            forcast(lat, lon)

        });

}
// use lat and lon to look up forecast
var forcast = function (lat, lon) {

    var queryURL = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&limit=5&appid=" + APIkey + "&units=imperial";
    fetch(queryURL)

        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var currentTemp = data.list[0].main.temp;
            var currentWind = data.list[0].wind.speed;
            var currentHumidity = data.list[0].main.humidity;
            var iconID = data.list[0].weather[0].icon;
            var iconURL = "http://openweathermap.org/img/w/" + iconID + ".png";

            currentStats.children[0].textContent = data.city.name + ' - ' + date;
            currentStats.children[2].textContent = 'Temp: ' + currentTemp + ' °F';
            currentStats.children[3].textContent = 'Wind: ' + currentWind + ' MPH';
            currentStats.children[4].textContent = 'Humidity: ' + currentHumidity + ' %';

            
            imgEl.src = iconURL;
            currentStats.style.border = "solid black";
            


        });
}

// save searches to local storage
var saveHistory = function () {
    localStorage.setItem("searchHistory",JSON.stringify(searchHistory))
}

// pull history from local storage
function render() {
    searchHistory = JSON.parse(localStorage.getItem("searchHistory"));

    if (searchHistory !== null) {
        searchHistory.forEach(city => {
            var buttonCreate = document.createElement('button');
            buttonCreate.setAttribute("data-city", city);
            historyContainer.append(buttonCreate);
            buttonCreate.textContent = city;
        });
    } else {
        searchHistory = [];
    }
}

// make buttons out of search history
function historyBtns(city) {

    var buttonCreate = document.createElement('button');
    buttonCreate.setAttribute("data-city", city);
    historyContainer.prepend(buttonCreate);
    buttonCreate.textContent = city;

}

// if button is clicked get attribute and get forecast
function buttonClickHandler(event) {
    var city = event.target.getAttribute('data-city');
    getCoordinates(city)
}

// event listener for search button
searchBTN.addEventListener('click', lookupWeather)
// event listener for search history buttons
historyContainer.addEventListener('click', buttonClickHandler)