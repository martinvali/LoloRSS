export default class RSSFeedsEditor {
    #urls;
    #container;
    #addNewFeedInput;

    constructor (urls, container) {
        this.#urls = urls;
        this.#container = container;
        this.#addNewFeedInput = container.querySelector(".add-new-rss-feed-input");
        container.querySelector(".add-new-rss-feed-button").addEventListener("click", this.#addNewFeed.bind(this));
        this.#generateInputsForAllUrls();
    }

    #generateInputsForAllUrls () {
        for (const url of this.#urls) {
            this.#displayNewFeed(url);
        }
    }

    #displayNewFeed (url) {
        const input = document.createElement("input");
            input.type = "text";
            input.value = url;
            input.classList.add("rss-feed-input");
            this.#container.appendChild(input);
    }

    #addNewFeed () {
        const url = this.#addNewFeedInput?.value;
        this.#urls.push(url);
        this.#displayNewFeed(url);
    }
}