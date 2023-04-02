"use strict";
let currentCountry;
let globalLang;
let indexesOfSelectedCountries = [];
let option;
let translations;

const areaBtn = document.querySelector("#area");
const backBtn = document.querySelector("#back");
const dropDownList = document.querySelector("#all");
const flashCardBox = document.querySelector("#country");
const popBtn = document.querySelector("#population");

const capital = document.createElement("h4");
const commonName = document.createElement("h1");
const img = document.createElement("img");
const nextBtn = document.createElement("button");
const prevBtn = document.createElement("button");
const region = document.createElement("h2");
const subRegion = document.createElement("h3");

prevBtn.id = "prev";
prevBtn.textContent = "Previous country";
prevBtn.disabled = true;
prevBtn.classList.add("hidden");

nextBtn.id = "next";
nextBtn.textContent = "Next country";
nextBtn.disabled = true;
nextBtn.classList.add("hidden");

backBtn.disabled = true;

popBtn.disabled = true;
areaBtn.disabled = true;

document.getElementById("country").appendChild(prevBtn);
document.getElementById("country").appendChild(nextBtn);

const buttons = document.querySelectorAll("button");
const toolbar = document.getElementById("toolbar");
let createLanguagersList = document.createElement("select");
createLanguagersList.setAttribute("id", "languages");
toolbar.appendChild(createLanguagersList);
createLanguagersList.appendChild(getOption("Choose a language"));

function getOption(input) {
	const option = document.createElement("option");
	option.value = input;
	option.textContent = input;
	return option;
}

function getImg(input) {
	img.src = input;
	return img;
}

function getCommon(input) {
	commonName.textContent = input;
	return commonName;
}

function getRegion(input) {
	region.textContent = input;
	return region;
}

function getsubRegion(input) {
	subRegion.textContent = input;
	return subRegion;
}

function getCapital(input) {
	capital.textContent = input;
	return capital;
}

function showFlashCard(element, country) {
	element.classList.add("card", "text", "resize");
	selectLanguages(country);
	element.appendChild(getImg(country.flags.png));
	if (!Object.keys(country.translations).includes(globalLang)) {
		element.appendChild(getCommon(country.name.official));
		globalLang = Object.keys(country.translations)[0];
	} else {
		element.appendChild(getCommon(country.translations[globalLang].official));
	}
	element.appendChild(getRegion(country.region));
	element.appendChild(getsubRegion(country.subregion));
	element.appendChild(getCapital(country.capital));
	prevBtn.classList.remove("hidden");
	nextBtn.classList.remove("hidden");
	element.appendChild(prevBtn);
	element.appendChild(nextBtn);
}

function togglePrevNextBtns(indexOfCountry) {
	if (indexOfCountry === 0) {
		prevBtn.disabled = true;
		nextBtn.disabled = false;
		return;
	}
	if (indexOfCountry === countries.length - 1) {
		prevBtn.disabled = false;
		nextBtn.disabled = true;
		return;
	}
	prevBtn.disabled = false;
	nextBtn.disabled = false;
}

function togglePopulAreaBtns(inputCountry) {
	if (inputCountry.borders !== undefined) {
		popBtn.disabled = false;
		areaBtn.disabled = false;
		return;
	}
	popBtn.disabled = true;
	areaBtn.disabled = true;
}

function getNeighbourCountryBy(inputCountry, buttonID) {
	if (inputCountry.borders !== undefined) {
		return countries
			.filter(
				(country) =>
					country.borders && country.borders.includes(inputCountry.cca3)
			)
			.sort((a, b) => b[buttonID] - a[buttonID])[0];
	}
	return inputCountry;
}

function changeDropDownListSelection(inputCountry) {
	let selectionElement = document.querySelector("#all");
	let optionToSelect = selectionElement.querySelector(
		`option[value='${inputCountry.name.official.replace("'", "\\'")}']`
	);
	optionToSelect.selected = true;
}

countries
	.sort((a, b) => a.name.official.localeCompare(b.name.official))
	.forEach((country) =>
		dropDownList.appendChild(getOption(country.name.official))
	);

const selectLanguages = (currentCountry) => {
	createLanguagersList.innerHTML = "";
	translations = Object.keys(currentCountry.translations);
	translations.forEach((translation, index) => {
		createLanguagersList.appendChild(getOption(translation));
	});
	createLanguagersList.addEventListener("change", (event) => {
		globalLang = event.target.value;
		getCommon(currentCountry.translations[event.target.value].official);
	});
};
dropDownList.addEventListener("change", (event) => {
	if (event.target.value !== "default") {
		currentCountry = countries.find(
			(country) => country.name.official === event.target.value
		);
		showFlashCard(flashCardBox, currentCountry);

		let index = countries.findIndex(
			(country) => country.name.official === currentCountry.name.official
		);
		togglePrevNextBtns(index);
		togglePopulAreaBtns(currentCountry);
		indexesOfSelectedCountries = [];
		indexesOfSelectedCountries.push(index);
	}
});

document.addEventListener("click", (event) => {
	if (
		event.target === createLanguagersList ||
		event.target.parentNode === createLanguagersList
	) {
		createLanguagersList.addEventListener("change", () => {
			dropDownList.focus();
		});
	} else {
		dropDownList.focus();
	}
});

buttons.forEach((button) => {
	button.addEventListener("click", (event) => {
		const index = countries.indexOf(currentCountry);
		if (event.target.id === "next") {
			currentCountry = countries[index + 1];
			let idxCurrentCountry = countries.indexOf(currentCountry);
			indexesOfSelectedCountries.push(idxCurrentCountry);
			showFlashCard(flashCardBox, currentCountry);
			togglePrevNextBtns(idxCurrentCountry);
			togglePopulAreaBtns(currentCountry);
			changeDropDownListSelection(currentCountry);
			return currentCountry;
		}
		if (event.target.id === "prev") {
			currentCountry = countries[index - 1];
			let idxCurrentCountry = countries.indexOf(currentCountry);
			showFlashCard(flashCardBox, currentCountry);
			togglePrevNextBtns(idxCurrentCountry);
			togglePopulAreaBtns(currentCountry);
			changeDropDownListSelection(currentCountry);
			return currentCountry;
		}
		if (event.target.id === "population") {
			currentCountry = getNeighbourCountryBy(currentCountry, "population");
			let idxCurrentCountry = countries.indexOf(currentCountry);
			indexesOfSelectedCountries.push(idxCurrentCountry);
			showFlashCard(flashCardBox, currentCountry);
			togglePrevNextBtns(idxCurrentCountry);
			togglePopulAreaBtns(currentCountry);
			areaBtn.disabled = false;
			backBtn.disabled = false;
			if (indexesOfSelectedCountries.length < 2) {
				backBtn.disabled = true;
			}
			changeDropDownListSelection(currentCountry);
			return currentCountry;
		}
		if (event.target.id === "area") {
			currentCountry = getNeighbourCountryBy(currentCountry, "area");
			let idxCurrentCountry = countries.indexOf(currentCountry);
			indexesOfSelectedCountries.push(idxCurrentCountry);
			showFlashCard(flashCardBox, currentCountry);
			togglePrevNextBtns(idxCurrentCountry);
			togglePopulAreaBtns(currentCountry);
			popBtn.disabled = false;
			backBtn.disabled = false;
			if (indexesOfSelectedCountries.length < 2) {
				backBtn.disabled = true;
			}
			changeDropDownListSelection(currentCountry);
			return currentCountry;
		}
		if (event.target.id === "back") {
			let idxCurrentCountry =
				indexesOfSelectedCountries[indexesOfSelectedCountries.length - 2];
			currentCountry = countries[idxCurrentCountry];
			indexesOfSelectedCountries.pop();
			showFlashCard(flashCardBox, currentCountry);
			popBtn.disabled = false;
			areaBtn.disabled = false;
			if (indexesOfSelectedCountries.length < 2) backBtn.disabled = true;
			changeDropDownListSelection(currentCountry);
			return currentCountry;
		}
	});
});
