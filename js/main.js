const apiKey = "9a9d22a4335c88ec9a4be4940eb15af9";
const apiCountryURL = "https://countries.petethompson.net/#/country/";
const apiUnsplash = "https://source.unsplash.com/1600x900/?";

const cityInput = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search");

const cityElement = document.querySelector("#city");
const tempElement = document.querySelector("#temperature span");
const descElement = document.querySelector("#description");
const weatherIconElement = document.querySelector("#weather-icon");
const countryElement = document.querySelector("#country");
const umidityElement = document.querySelector("#umidity span");
const windElement = document.querySelector("#wind span");

const weatherContainer = document.querySelector("#weather-data");

const errorMessageContainer = document.querySelector("#error-message");
const loader = document.querySelector("#loader");

const suggestionContainer = document.querySelector("#suggestions");
const suggestionButtons = document.querySelectorAll("#suggestions button");

// Loader
const toggleLoader = () => {
	loader.classList.toggle("hide");
};

const getWeatherData = async (city) => {
	toggleLoader();

	const apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`;

	const res = await fetch(apiWeatherURL);
	const data = await res.json();

	toggleLoader();

	return data;
};

// Tratamento de erro
const showErrorMessage = () => {
	errorMessageContainer.classList.remove("hide");
};

const hideInformation = () => {
	errorMessageContainer.classList.add("hide");
	weatherContainer.classList.add("hide");

	suggestionContainer.classList.add("hide");
};

const showWeatherData = async (city) => {
	hideInformation();

	const data = await getWeatherData(city);

	if (data.cod === "404") {
		showErrorMessage();
		return;
	}

	cityElement.innerText = data.name;
	tempElement.innerText = parseInt(data.main.temp);
	descElement.innerText = data.weather[0].description;
	weatherIconElement.setAttribute("src", `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`);
	var urlFlag = await getFlag(data.sys.country);
	countryElement.setAttribute("src", urlFlag);
	umidityElement.innerText = `${data.main.humidity}%`;
	windElement.innerText = `${data.wind.speed}km/h`;

	// Change bg image
	document.body.style.backgroundImage = `url("${apiUnsplash + city}")`;

	weatherContainer.classList.remove("hide");
};

searchBtn.addEventListener("click", async (e) => {
	e.preventDefault();

	const city = cityInput.value;

	showWeatherData(city);
});

cityInput.addEventListener("keyup", (e) => {
	if (e.code === "Enter") {
		const city = e.target.value;

		showWeatherData(city);
	}
});

// Sugestões
suggestionButtons.forEach((btn) => {
	btn.addEventListener("click", () => {
		const city = btn.getAttribute("id");

		showWeatherData(city);
	});
});

async function getFlag(countryCode) {
	var url = await axios
		.get(`https://restcountries.com/v2/alpha/${countryCode}`)
		.then(function (response) {
			var flagUrl = response.data.flag;
			url = flagUrl;
			return url;
		})
		.catch(function (error) {
			console.error("Erro ao obter a bandeira do país", error);
		});
	return url;
}
