// Import helper to map currency to country flags
import { currencyToFlagCode } from './currency-to-flag-code.js'

// Select elements from the DOM
const inputSourceCurrency = document.getElementById("inputSourceCurrency");

const currencySelectElements = document.querySelectorAll(".currency-convertor-select select");

const imageSourceCurrency = document.getElementById("imageSourceCurrency");
const selectSourceCurrency = document.getElementById("selectSourceCurrency");

const imageTargetCurrency = document.getElementById("imageTargetCurrency");
const selectTargetCurrency = document.getElementById("selectTargetCurrency");

const exchangeRateText = document.getElementById("exchangeRateText");
const buttonConvert = document.getElementById("buttonConvert");

const buttonSwap = document.getElementById("buttonSwap");

//Declare Variablas
let conversionRate = 0;
let isFetching = false;

let souceCurrencyValue = 0;
let targetCurrencyValue = 0;

// Swap source and target currencies
buttonSwap.addEventListener('click', event => {
    //Swap select values
    [selectSourceCurrency.value, selectTargetCurrency.value]
    =
    [selectTargetCurrency.value, selectSourceCurrency.value];

    //Swap flag 
    [imageSourceCurrency.src, imageTargetCurrency.src]
    =
    [imageTargetCurrency.src, imageSourceCurrency.src];

    //Swap conversion rate
    inputSourceCurrency.value = targetCurrencyValue;

    if (isFetching) {
        //Reverse conversion rate
        conversionRate = 1 / conversionRate;
    };
    updateExhangeRate();

});
// Update exchange rate upon input

inputSourceCurrency.addEventListener('input', event => {
    //Update exhange rate
    if(isFetching && inputSourceCurrency.value > 0){
        updateExhangeRate();
    }
})

// Perform conversion when button is clicked
buttonConvert.addEventListener('click', async () => {
    //Whwn input is les or equal to 0
    if(inputSourceCurrency.value <= 0) {
        alert('Please enter a valid amount.')
        return; // Stops execution
    }

    exchangeRateText.textContent = 'Fetching exchange rate, please wait...'

    const selectSourceCurrencyValue = selectSourceCurrency.value;
    const selectTargetCurrencyValue = selectTargetCurrency.value;

    try {
        const response = 
        await fetch(`https://v6.exchangerate-api.com/v6/d6c8597d91b0529e19a1dae9/pair/${selectSourceCurrencyValue}/${selectTargetCurrencyValue}`
        );
        const data = await response.json();
        conversionRate = data.conversion_rate;

        isFetching = true;
        updateExhangeRate();

    }catch (error) {
        console.log('Error fetching exchange rate!');
        exchangeRateText.textContent = 'Error fetching exhange rate!';
    }

});
// Update exchange rate displayed
function updateExhangeRate() {
    souceCurrencyValue = parseFloat(inputSourceCurrency.value).toFixed(2);
    targetCurrencyValue = (souceCurrencyValue * conversionRate);

    exchangeRateText.textContent = `${formatCurrency(souceCurrencyValue)} ${selectSourceCurrency.value}
    =
    ${formatCurrency(targetCurrencyValue)} ${selectTargetCurrency.value}
    `
    }
// Change country flags upon select

// Initialize select menus and flags
currencySelectElements.forEach(selectElement => {
    for (const [currency, flagCode] of Object.entries(currencyToFlagCode)){
    const newOptionElement = document.createElement('option');
    newOptionElement.value = currency;
    newOptionElement.textContent = currency;
    selectElement.appendChild(newOptionElement);
    }
//Listen for change
    selectElement.addEventListener('change', () => {
        inputSourceCurrency.value = '';
        isFetching = false;
        updateExhangeRate();
        changeFlag(selectElement);
    })
    // Set default select target values

    if(selectElement.id === "selectTargetCurrency") {
        selectElement.value = 'IDR';
    }
})

function changeFlag(selectElement) {
    const selectValue = selectElement.value;
    const selectID = selectElement.id;
    const flagCode = currencyToFlagCode[selectValue];

    if(selectID === 'selectSourceCurrency') {
    imageSourceCurrency.src = `https://flagcdn.com/w640/${flagCode}.png`/* shenja ${} sherben per te shtuar vlera te ndryshueshme */
    }else{
    imageTargetCurrency.src = `https://flagcdn.com/w640/${flagCode}.png`
    }
}
// Format currency

function formatCurrency(number) {
    return new Intl.NumberFormat().format(number);
}