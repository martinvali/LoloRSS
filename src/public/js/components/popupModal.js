export default class PopupModal {
    #container;
    #mainImage;
    #content;

    constructor (container) {
        this.#container = container;
        this.#mainImage = container.querySelector(".news-item-module-image");
        this.#content = container.querySelector(".news-item-module-content");
        container.querySelector(".news-item-module-close-button")?.addEventListener("click", this.#hideModule.bind(this));
        this.#container.addEventListener("click", this.#containerClicked.bind(this));
    }

    showLoading () {
        this.#toggleVisibility(true);
    }


    showContent (data) {
        console.log(data);
        if(data.error) return this.#showErrorContent();
        const content = data?.content;
        const leadImageUrl = data?.lead_image_url || "/images/not_available.svg";
        this.#mainImage.src = leadImageUrl;

        this.#toggleLoading(false);
        this.#content.innerHTML = content;
    }

    #showErrorContent () {
        console.log("errror");
        const paragraph = document.querySelector("p");
        paragraph.innerText = "Sorry, the article could not be freed from clutter.";
        this.#content.appendChild(paragraph);
        this.#toggleLoading(false);
    }

    #hideModule () {
        this.#toggleVisibility(false);
        this.#resetModuleToEmpty();
    }

    #resetModuleToEmpty () {
        this.#content.innerHTML = "";
    }

    #toggleLoading (isLoading) {
        this.#container.classList.toggle("loading", isLoading);
    }

    #containerClicked (e) {
        if(e?.target !== this.#container) return;
        this.#hideModule();
    }

    #toggleVisibility (isVisible) {
        const CLASSES_TO_TOGGLE = ["loading", "open"];
        CLASSES_TO_TOGGLE.forEach((className) => this.#container.classList.toggle(className, isVisible));
    }
}