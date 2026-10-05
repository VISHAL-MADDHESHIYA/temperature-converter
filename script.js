/* =================================
   GET HTML ELEMENTS
================================= */

const temperatureInput = document.getElementById("temperature");
const unitSelect = document.getElementById("unit");

const convertBtn = document.getElementById("convertBtn");
const clearBtn = document.getElementById("clearBtn");
const copyBtn = document.getElementById("copyBtn");

const celsiusResult = document.getElementById("celsiusResult");
const fahrenheitResult = document.getElementById("fahrenheitResult");
const kelvinResult = document.getElementById("kelvinResult");

const errorMessage = document.getElementById("errorMessage");
const summaryText = document.getElementById("summaryText");

const themeToggle = document.getElementById("themeToggle");


/* =================================
   TEMPERATURE CONVERSION FUNCTIONS
================================= */

// Celsius → Fahrenheit
function celsiusToFahrenheit(celsius) {
    return (celsius * 9 / 5) + 32;
}


// Celsius → Kelvin
function celsiusToKelvin(celsius) {
    return celsius + 273.15;
}


// Fahrenheit → Celsius
function fahrenheitToCelsius(fahrenheit) {
    return (fahrenheit - 32) * 5 / 9;
}


// Fahrenheit → Kelvin
function fahrenheitToKelvin(fahrenheit) {
    return (fahrenheit - 32) * 5 / 9 + 273.15;
}


// Kelvin → Celsius
function kelvinToCelsius(kelvin) {
    return kelvin - 273.15;
}


// Kelvin → Fahrenheit
function kelvinToFahrenheit(kelvin) {
    return (kelvin - 273.15) * 9 / 5 + 32;
}


/* =================================
   FORMAT NUMBER
================================= */

function formatTemperature(value) {

    return Number(value).toFixed(2);

}


/* =================================
   MAIN CONVERSION FUNCTION
================================= */

function convertTemperature() {

    const inputValue = temperatureInput.value.trim();

    const unit = unitSelect.value;


    /* -----------------------------
       VALIDATION
    ----------------------------- */

    if (inputValue === "") {

        showError("Please enter a temperature.");

        return;
    }


    const temperature = Number(inputValue);


    if (!Number.isFinite(temperature)) {

        showError("Please enter a valid numeric temperature.");

        return;
    }


    /* -----------------------------
       KELVIN VALIDATION
    ----------------------------- */

    if (unit === "kelvin" && temperature < 0) {

        showError("Kelvin temperature cannot be below 0 K.");

        return;
    }


    /* -----------------------------
       CLEAR ERROR
    ----------------------------- */

    clearError();


    let celsius;
    let fahrenheit;
    let kelvin;


    /* -----------------------------
       CONVERSION LOGIC
    ----------------------------- */

    if (unit === "celsius") {

        celsius = temperature;

        fahrenheit = celsiusToFahrenheit(celsius);

        kelvin = celsiusToKelvin(celsius);

    }


    else if (unit === "fahrenheit") {

        fahrenheit = temperature;

        celsius = fahrenheitToCelsius(fahrenheit);

        kelvin = fahrenheitToKelvin(fahrenheit);

    }


    else if (unit === "kelvin") {

        kelvin = temperature;

        celsius = kelvinToCelsius(kelvin);

        fahrenheit = kelvinToFahrenheit(kelvin);

    }


    /* -----------------------------
       DISPLAY RESULTS
    ----------------------------- */

    celsiusResult.textContent =
        `${formatTemperature(celsius)} °C`;


    fahrenheitResult.textContent =
        `${formatTemperature(fahrenheit)} °F`;


    kelvinResult.textContent =
        `${formatTemperature(kelvin)} K`;


    /* -----------------------------
       SUMMARY
    ----------------------------- */

    summaryText.textContent =
        `${formatTemperature(temperature)} ${getUnitSymbol(unit)}
        = ${formatTemperature(celsius)} °C
        = ${formatTemperature(fahrenheit)} °F
        = ${formatTemperature(kelvin)} K`;


    /* -----------------------------
       SAVE LAST CONVERSION
    ----------------------------- */

    localStorage.setItem(
        "lastTemperature",
        JSON.stringify({
            temperature: temperature,
            unit: unit
        })
    );
}


/* =================================
   UNIT SYMBOL
================================= */

function getUnitSymbol(unit) {

    if (unit === "celsius") {
        return "°C";
    }

    if (unit === "fahrenheit") {
        return "°F";
    }

    if (unit === "kelvin") {
        return "K";
    }

}


/* =================================
   ERROR FUNCTIONS
================================= */

function showError(message) {

    errorMessage.textContent = message;

    errorMessage.style.display = "block";

}


function clearError() {

    errorMessage.textContent = "";

    errorMessage.style.display = "none";

}


/* =================================
   CLEAR BUTTON
================================= */

function clearConverter() {

    temperatureInput.value = "";

    unitSelect.value = "celsius";


    celsiusResult.textContent = "--";

    fahrenheitResult.textContent = "--";

    kelvinResult.textContent = "--";


    summaryText.textContent =
        "Enter a temperature to see the conversion.";


    clearError();

    temperatureInput.focus();

}


/* =================================
   COPY RESULTS
================================= */

async function copyResults() {

    const celsius = celsiusResult.textContent;

    const fahrenheit = fahrenheitResult.textContent;

    const kelvin = kelvinResult.textContent;


    if (
        celsius === "--" ||
        fahrenheit === "--" ||
        kelvin === "--"
    ) {

        showError("Please convert a temperature first.");

        return;
    }


    const text = `
Temperature Conversion

Celsius: ${celsius}
Fahrenheit: ${fahrenheit}
Kelvin: ${kelvin}
    `.trim();


    try {

        await navigator.clipboard.writeText(text);

        copyBtn.textContent = "✓ Copied";

        setTimeout(() => {

            copyBtn.textContent = "📋 Copy";

        }, 1500);

    }

    catch (error) {

        showError("Unable to copy results.");

    }

}


/* =================================
   DARK / LIGHT MODE
================================= */

function toggleTheme() {

    document.body.classList.toggle("dark");


    const isDark =
        document.body.classList.contains("dark");


    if (isDark) {

        themeToggle.textContent = "☀️";

        localStorage.setItem("theme", "dark");

    }

    else {

        themeToggle.textContent = "🌙";

        localStorage.setItem("theme", "light");

    }

}


/* =================================
   LOAD SAVED THEME
================================= */

function loadTheme() {

    const savedTheme =
        localStorage.getItem("theme");


    if (savedTheme === "dark") {

        document.body.classList.add("dark");

        themeToggle.textContent = "☀️";

    }

}


/* =================================
   LOAD LAST CONVERSION
================================= */

function loadLastConversion() {

    const savedData =
        localStorage.getItem("lastTemperature");


    if (!savedData) {
        return;
    }


    try {

        const data = JSON.parse(savedData);


        temperatureInput.value =
            data.temperature;

        unitSelect.value =
            data.unit;


        convertTemperature();

    }

    catch (error) {

        localStorage.removeItem("lastTemperature");

    }

}


/* =================================
   EVENT LISTENERS
================================= */

// Convert button
convertBtn.addEventListener(
    "click",
    convertTemperature
);


// Clear button
clearBtn.addEventListener(
    "click",
    clearConverter
);


// Copy button
copyBtn.addEventListener(
    "click",
    copyResults
);


// Dark/Light mode
themeToggle.addEventListener(
    "click",
    toggleTheme
);


// Live conversion while typing
temperatureInput.addEventListener(
    "input",
    convertTemperature
);


// Conversion when unit changes
unitSelect.addEventListener(
    "change",
    convertTemperature
);


/* =================================
   KEYBOARD SUPPORT
================================= */

temperatureInput.addEventListener(
    "keydown",
    function (event) {

        // Enter → Convert
        if (event.key === "Enter") {

            convertTemperature();

        }


        // Escape → Clear
        if (event.key === "Escape") {

            clearConverter();

        }

    }
);


/* =================================
   INITIALIZE APPLICATION
================================= */

loadTheme();

loadLastConversion();