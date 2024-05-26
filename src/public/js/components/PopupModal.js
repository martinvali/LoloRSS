export default class PopupModal {
    #container;
    #mainImage;
    #content;
    #mainHeading;
    abortController;

    constructor (container) {
        this.#container = container;
        this.#mainImage = container.querySelector(".news-item-module-image");
        this.#content = container.querySelector(".news-item-module-content");
        this.#mainHeading = container.querySelector(".news-item-module-heading");

        container.querySelector(".news-item-module-close-button")?.addEventListener("click", this.#hideModule.bind(this));
        this.#container.addEventListener("click", this.#containerClicked.bind(this));
    }

    showLoading () {
        this.#resetModuleToEmpty();
        document.querySelector("html").style.overflowY = "hidden";
        this.#toggleVisibility(true);
    }


    showContent (data) {
        if(data.error || !data.content) return this.#showErrorContent();

        const content = data?.content;

        const heading = data?.title;
        const leadImageUrl = data?.lead_image_url || "/images/not_available.svg";

        if (heading) this.#mainHeading.innerText = heading;
        this.#mainImage.src = leadImageUrl;
        this.#toggleLoading(false);
        this.#content.innerHTML = content;
    }

    #showErrorContent () {
        const content = "<p>Sorry, it seems like the article cannot be freed from clutter.<p>";
        this.#mainHeading.innerText = "Something went wrong.";
        this.#mainImage.src = "/images/not_available.svg";
        this.#content.innerHTML = content;
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