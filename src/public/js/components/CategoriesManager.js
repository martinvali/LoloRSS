export default class CategoriesManager {
    #container;
    #allFilters = {};

    constructor (container) {
        this.#container = container;
    }

    updateCategories (allNewsItems) {
        this.#generateCategoriesFilters(allNewsItems);
    }

    #generateCategoriesFilters (allNewsItems) {
        const categories = new Set(allNewsItems.flatMap((newsItem) => newsItem.categories));
        categories.add("Other");

        const categoriesContainer = this.#container;
    
        for (const category of categories) {
            const containerElement = document.createElement("div");
            containerElement.classList.add("filter-category-container");
            
            const labelElement = document.createElement("label");
            labelElement.classList.add("filter-category-label");
            labelElement.textContent = category;
            labelElement.setAttribute("for", category);
    
            const inputElement = document.createElement("input");
            inputElement.classList.add("filter-category-input");
            inputElement.checked = true;
            inputElement.id = category;
            inputElement.value = category;
            inputElement.type = "checkbox";
    
            containerElement.appendChild(inputElement);
            containerElement.appendChild(labelElement);
            
            categoriesContainer.appendChild(containerElement);
    
            this.#allFilters[category] = true;
        }
    }
}