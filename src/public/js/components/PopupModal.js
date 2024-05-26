export default class PopupModal {
    #container;
    #mainImage;
    #content;
    #mainHeading;

    constructor (container) {
        this.#container = container;
        this.#mainImage = container.querySelector(".news-item-module-image");
        this.#content = container.querySelector(".news-item-module-content");
        this.#mainHeading = container.querySelector(".news-item-module-heading");

        container.querySelector(".news-item-module-close-button")?.addEventListener("click", this.#hideModule.bind(this));
        this.#container.addEventListener("click", this.#containerClicked.bind(this));
    }

    showLoading () {
        document.querySelector("html").style.overflowY = "hidden";
        this.#toggleVisibility(true);
    }


    showContent (data) {
        if(data.error) return this.#showErrorContent();

        const content = data?.content;
        const heading = data?.title;
        const leadImageUrl = data?.lead_image_url || "/images/not_available.svg";

        if (heading) this.#mainHeading.innerText = heading;
        this.#mainImage.src = leadImageUrl;
        this.#toggleLoading(false);
        this.#content.innerHTML = content;
    }

    #showErrorContent () {
        const paragraph = document.querySelector("p");
        paragraph.innerText = "Sorry, the article could not be freed from clutter.";
        this.#content.appendChild(paragraph);
        this.#toggleLoading(false);
    }

    #hideModule () {
        this.#toggleVisibility(false);
        this.#resetModuleToEmpty();
        this.#mainImage.src = "";
        this.#mainHeading.innerText = "";
        document.querySelector("html").style.overflowY = "visible";
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