const BASE_URL = "https://latest.currency-api.pages.dev/v1/currencies";

const dropdown = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const msg = document.querySelector("#msg");
const from = document.querySelector(".from select");
const to = document.querySelector(".to select");

for (let sel of dropdown) {
    for (let currcode in countryList) {
        let option = document.createElement("option");
        option.innerText = currcode;
        option.value = currcode;

        if (sel.name === "from" && currcode === "USD") {
            option.selected = true;
        } else if (sel.name === "to" && currcode === "INR") {
            option.selected = true;
        }

        sel.append(option);
    }

    sel.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

function updateFlag(ele) {
    const countryCode = countryList[ele.value];
    const img = ele.parentElement.querySelector("img");
    img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
}

async function updateRate() {
    try {
        let amount = document.querySelector(".amount input");
        let amtVal = Number(amount.value);

        if (isNaN(amtVal) || amtVal < 1) {
            amtVal = 1;
            amount.value = 1;
        }

        const URL = `${BASE_URL}/${from.value.toLowerCase()}.json`;

        const response = await fetch(URL);
        const data = await response.json();

        const rate = data[from.value.toLowerCase()][to.value.toLowerCase()];

        if (!rate) {
            msg.innerText = "Exchange rate not available.";
            return;
        }

        const finalAmount = (amtVal * rate).toFixed(2);

        msg.innerText = `${amtVal} ${from.value} = ${finalAmount} ${to.value}`;
    } catch (err) {
        console.error(err);
        msg.innerText = "Failed to fetch exchange rate.";
    }
}

btn.addEventListener("click", (e) => {
    e.preventDefault();
    updateRate();
});

window.addEventListener("load", () => {
    updateFlag(from);
    updateFlag(to);
});