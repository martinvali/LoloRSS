export default class CategoriesManager {
    #container;
    #categories = new Set(["Other"]);

    #allFilters = {};

    constructor (container) {
        this.#container = container;
    }

    updateCategories (allNewsItems) {
        this.#generateCategoriesFilters(allNewsItems);
    }

    #generateCategoriesFilters (allNewsItems) {
        this.#categories = new Set([...this.#categories, ...(allNewsItems.flatMap((newsItem) => newsItem.categories))]);

        const categoriesContainer = this.#container;
        
        for (const category of this.#categories) {
            if(category in this.#allFilters) return;
            
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