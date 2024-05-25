export default class CategoriesManager {
    #container;
    #categories = new Set(["Other"]);
    #feedsManager;
    #allFilters = {};

    constructor (container) {
        this.#container = container;
        this.#container.addEventListener("change", this.#filterCategoriesClicked.bind(this));
    }

    set feedsManager (feedsManager) {
        this.#feedsManager = feedsManager;
    }

    updateCategories (allNewsItems) {
        this.#generateCategoriesFilters(allNewsItems);
    }

    #generateCategoriesFilters (allNewsItems) {
        this.#categories = new Set([...Object.values(allNewsItems.flatMap((newsItem) => newsItem.categories))]);

        this.#container.innerHTML = "";
        const categoriesContainer = this.#container;

        for (const category of this.#categories) {
            
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

    #filterCategoriesClicked (e) {
        if(!e.target.type === "checkbox") return;
        
        const target = e?.target;
        const category = target?.value;
        const isChecked = target?.checked;
        
        this.#allFilters[category] = isChecked;
    
    
        for (const newsItem of Object.values(this.#feedsManager?.allNewsItems).flat(1)) {
            if(newsItem?.categories?.every((category) => this.#allFilters[category] === false)) newsItem.setVisibilityTo(false);
            else newsItem.setVisibilityTo(true);
        }
    }
}