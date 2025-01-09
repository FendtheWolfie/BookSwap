// Function to create a book card
function createCard(title, price, year, condition, level) {
    return `
        <div class="col">
            <div class="card">
                <div class="card-body">
                    <div class="bg-secondary" style="height: 150px;"></div>
                    <h5 class="card-title mt-3">${title}</h5>
                    <p class="card-text">Preis: ${price} CHF</p>
                    <p class="card-text">Erscheinungsjahr: ${year}</p>
                    <p class="card-text">Zustand: ${condition}</p>
                    <p class="card-text">Niveau: ${level}</p>
                </div>
            </div>
        </div>
    `;
}


// Function to populate a section with books
function populateSection(sectionId, books) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.innerHTML = ""; // Clear any previous content
        books.forEach((book) => {
            section.innerHTML += createCard(
                book.title,
                book.price,
                book.year,
                book.condition,
                book.level
            );
        });
    }
}

// Books data for all categories
const mathBooks = [
    { title: "Math Book 1", price: 20, year: 2015, condition: "Wie neu", level: "Realschule" },
    { title: "Math Book 2", price: 25, year: 2018, condition: "Guter Zustand", level: "Sekundarschule" },
    { title: "Math Book 3", price: 30, year: 2020, condition: "Akzeptabel", level: "Kantonsschule" },
    { title: "Math Book 4", price: 15, year: 2012, condition: "Stark gebraucht", level: "Hochschule" },
    { title: "Math Book 5", price: 10, year: 2021, condition: "Wie neu", level: "Universität" },
];

const germanBooks = [
    { title: "German Book 1", price: 18, year: 2013, condition: "Wie neu", level: "Realschule" },
    { title: "German Book 2", price: 22, year: 2015, condition: "Guter Zustand", level: "Sekundarschule" },
    { title: "German Book 3", price: 28, year: 2018, condition: "Akzeptabel", level: "Kantonsschule" },
    { title: "German Book 4", price: 12, year: 2012, condition: "Stark gebraucht", level: "Hochschule" },
    { title: "German Book 5", price: 16, year: 2020, condition: "Wie neu", level: "Universität" },
];

const englishBooks = [
    { title: "English Book 1", price: 20, year: 2014, condition: "Guter Zustand", level: "Realschule" },
    { title: "English Book 2", price: 22, year: 2016, condition: "Akzeptabel", level: "Sekundarschule" },
    { title: "English Book 3", price: 18, year: 2017, condition: "Wie neu", level: "Kantonsschule" },
    { title: "English Book 4", price: 30, year: 2021, condition: "Stark gebraucht", level: "Hochschule" },
    { title: "English Book 5", price: 25, year: 2019, condition: "Guter Zustand", level: "Universität" },
];

const frenchBooks = [
    { title: "French Book 1", price: 25, year: 2015, condition: "Wie neu", level: "Realschule" },
    { title: "French Book 2", price: 20, year: 2013, condition: "Akzeptabel", level: "Sekundarschule" },
    { title: "French Book 3", price: 22, year: 2019, condition: "Guter Zustand", level: "Kantonsschule" },
    { title: "French Book 4", price: 18, year: 2016, condition: "Stark gebraucht", level: "Hochschule" },
    { title: "French Book 5", price: 15, year: 2018, condition: "Wie neu", level: "Universität" },
];

const economicsBooks = [
    { title: "Economics Book 1", price: 30, year: 2017, condition: "Guter Zustand", level: "Realschule" },
    { title: "Economics Book 2", price: 28, year: 2015, condition: "Akzeptabel", level: "Sekundarschule" },
    { title: "Economics Book 3", price: 25, year: 2018, condition: "Wie neu", level: "Kantonsschule" },
    { title: "Economics Book 4", price: 20, year: 2021, condition: "Stark gebraucht", level: "Hochschule" },
    { title: "Economics Book 5", price: 22, year: 2019, condition: "Guter Zustand", level: "Universität" },
];

const geographyBooks = [
    { title: "Geography Book 1", price: 18, year: 2013, condition: "Wie neu", level: "Realschule" },
    { title: "Geography Book 2", price: 22, year: 2015, condition: "Guter Zustand", level: "Sekundarschule" },
    { title: "Geography Book 3", price: 30, year: 2017, condition: "Akzeptabel", level: "Kantonsschule" },
    { title: "Geography Book 4", price: 15, year: 2018, condition: "Stark gebraucht", level: "Hochschule" },
    { title: "Geography Book 5", price: 25, year: 2020, condition: "Wie neu", level: "Universität" },
];

const historyBooks = [
    { title: "History Book 1", price: 20, year: 2014, condition: "Guter Zustand", level: "Realschule" },
    { title: "History Book 2", price: 18, year: 2016, condition: "Akzeptabel", level: "Sekundarschule" },
    { title: "History Book 3", price: 28, year: 2018, condition: "Wie neu", level: "Kantonsschule" },
    { title: "History Book 4", price: 25, year: 2021, condition: "Stark gebraucht", level: "Hochschule" },
    { title: "History Book 5", price: 30, year: 2019, condition: "Guter Zustand", level: "Universität" },
];

const lawBooks = [
    { title: "Law Book 1", price: 35, year: 2015, condition: "Wie neu", level: "Realschule" },
    { title: "Law Book 2", price: 30, year: 2017, condition: "Guter Zustand", level: "Sekundarschule" },
    { title: "Law Book 3", price: 40, year: 2018, condition: "Akzeptabel", level: "Kantonsschule" },
    { title: "Law Book 4", price: 25, year: 2021, condition: "Stark gebraucht", level: "Hochschule" },
    { title: "Law Book 5", price: 18, year: 2019, condition: "Wie neu", level: "Universität" },
];

// Populate sections when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    populateSection("math-section", mathBooks);
    populateSection("german-section", germanBooks);
    populateSection("english-section", englishBooks);
    populateSection("french-section", frenchBooks);
    populateSection("economics-section", economicsBooks);
    populateSection("geography-section", geographyBooks);
    populateSection("history-section", historyBooks);
    populateSection("law-section", lawBooks);
});