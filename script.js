
let cars = [];

function displayCars() {
    let text = "<ul>";
    for (let i = 0; i < cars.length; i++) {
        text += "<li>" + cars[i] + "</li>";
    }
    text += "</ul>";

    // Display the list:
    document.getElementById("demo").innerHTML = text;
}

function addCar() {
    const newCar = document.getElementById("addCarInput").value;
    if (newCar.trim() !== "") { // Check if the input is not empty or whitespace only
        cars.push(newCar);
        displayCars();
        document.getElementById("addCarInput").value = ""; // Clear input field
        saveDataToLocalStorage();
    } else {
        alert("Please enter a valid car name");
    }
}

function removeCar() {
    const indexToRemove = document.getElementById("removeCarInput").value;
    if (indexToRemove !== "") {
        const index = parseInt(indexToRemove);
        if (!isNaN(index) && index >= 0 && index < cars.length) {
            cars.splice(index, 1);
            displayCars();
            document.getElementById("removeCarInput").value = ""; // Clear input field
            saveDataToLocalStorage();
        } else {
            alert("Please enter a valid index to remove");
        }
    }
}

function handleKeyPress(event, action) {
    if (event.key === "Enter") {
        if (action === "add") {
            addCar();
        } else if (action === "remove") {
            removeCar();
        }
    }
}

function loadDataFromLocalStorage() {
    const data = localStorage.getItem("carsData");
    if (data) {
        cars = JSON.parse(data);
        displayCars();
    } else {
        loadExcelData();
    }
}

function loadExcelData() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.xlsx';
    fileInput.onchange = function (e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = function (event) {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            cars = jsonData[0].filter(car => car.trim() !== "");
            displayCars();
            saveDataToLocalStorage();
        };
        reader.readAsArrayBuffer(file);
    };
    fileInput.click();
}

function saveDataToLocalStorage() {
    localStorage.setItem("carsData", JSON.stringify(cars));
}