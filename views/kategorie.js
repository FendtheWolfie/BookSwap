// Function to get the query parameter value from the URL
      function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
      }

      // Function to populate the category section with books based on the category
      function populateCategoryBooks(category) {
        // Example data for categories
        const categories = {
          
          Mathematik: [
            { title: "Math Book 1", price: 20 },
            { title: "Math Book 2", price: 25 },
            { title: "Math Book 3", price: 30 },
            { title: "Math Book 4", price: 15 },
            { title: "Math Book 5", price: 10 },
            { title: "Teest 12424", price: 132313 },
          ],
          Deutsch: [
            { title: "German Book 1", price: 18 },
            { title: "German Book 2", price: 22 },
            { title: "German Book 3", price: 28 },
            { title: "German Book 4", price: 12 },
            { title: "German Book 5", price: 16 },
          ],
          Englisch: [
            { title: "English Book 1", price: 20 },
            { title: "English Book 2", price: 22 },
            { title: "English Book 3", price: 18 },
            { title: "English Book 4", price: 30 },
            { title: "English Book 5", price: 25 },
          ],
          Französisch: [
            { title: "French Book 1", price: 25 },
            { title: "French Book 2", price: 20 },
            { title: "French Book 3", price: 22 },
            { title: "French Book 4", price: 18 },
            { title: "French Book 5", price: 15 },
          ],
          Wirtschaft: [
            { title: "Economics Book 1", price: 30 },
            { title: "Economics Book 2", price: 28 },
            { title: "Economics Book 3", price: 25 },
            { title: "Economics Book 4", price: 20 },
            { title: "Economics Book 5", price: 22 },
          ],
          Geografie: [
            { title: "Geography Book 1", price: 18 },
            { title: "Geography Book 2", price: 22 },
            { title: "Geography Book 3", price: 30 },
            { title: "Geography Book 4", price: 15 },
            { title: "Geography Book 5", price: 25 },
          ],
          Geschichte: [
            { title: "History Book 1", price: 20 },
            { title: "History Book 2", price: 18 },
            { title: "History Book 3", price: 28 },
            { title: "History Book 4", price: 25 },
            { title: "History Book 5", price: 30 },
          ],
          Recht: [
            { title: "Law Book 1", price: 35 },
            { title: "Law Book 2", price: 30 },
            { title: "Law Book 3", price: 40 },
            { title: "Law Book 4", price: 25 },
            { title: "Law Book 5", price: 18 },
          ],

          // Add more categories and books as needed...
        };

        const categoryBooks = categories[category];

        if (!categoryBooks) {
          document.getElementById("category-section").innerHTML =
            "Keine Kategorie gefunden";
          return;
        }

        const section = document.getElementById("category-section");
        section.innerHTML = ""; // Clear any previous content

        categoryBooks.forEach((book) => {
          const bookCard = `
                    <div class="col">
                        <div class="card">
                            <div class="card-body">
                                <div class="bg-secondary" style="height: 150px;"></div>
                                <h5 class="card-title mt-3">${book.title}</h5>
                                <p class="card-text">${book.price} CHF</p>
                            </div>
                        </div>
                    </div>
                `;
          section.innerHTML += bookCard;
        });
      }

      // Get the category from the query parameter
      const category = getQueryParam("category");

      // Set the category name in the header
      document.getElementById("category-name").textContent +=
        category || "Unbekannte Kategorie";

      // Populate the books based on the category
      document.addEventListener("DOMContentLoaded", () => {
        if (category) {
          populateCategoryBooks(category);
        } else {
          document.getElementById("category-section").innerHTML =
            "Keine Kategorie gefunden";
        }
      });
    