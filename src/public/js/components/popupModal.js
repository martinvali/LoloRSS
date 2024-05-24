export default class PopupModal {
    #container;
    #mainImage;
    #content;

    constructor (container) {
        this.#container = container;
        this.#mainImage = container.querySelector(".news-item-module-image");
        this.#content = container.querySelector(".news-item-module-content");
        container.querySelector(".news-item-module-close-button")?.addEventListener("click", this.#closeButtonClicked.bind(this));
    }

    showLoading () {
        this.#toggleVisibility(true);
    }


    showContent (data) {
        const content = data?.content;
        const leadImageUrl = data?.lead_image_url;
        this.#mainImage.src = leadImageUrl;

        this.#toggleLoading(false);
        this.#content.innerHTML = content;
    }

    #closeButtonClicked () {
        this.#toggleVisibility(false);
        this.#resetModuleToEmpty();
    }

    #resetModuleToEmpty () {
        this.#content.innerHTML = "";
    }

    #toggleLoading (isLoading) {
        document.querySelector(".module-container").classList.toggle("loading", isLoading);
    }

    #toggleVisibility (isVisible) {
        const CLASSES_TO_TOGGLE = ["loading", "open"];
        CLASSES_TO_TOGGLE.forEach((className) => this.#container.classList.toggle(className, isVisible));
    }
}