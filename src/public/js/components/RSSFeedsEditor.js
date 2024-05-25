export default class RSSFeedsEditor {
    #urls;
    #container;

    constructor (urls, container) {
        this.#urls = urls;
        this.#container = container;
        this.#generateInputsForAllUrls();
    }

    #generateInputsForAllUrls () {
        for (const url of this.#urls) {
            const input = document.createElement("input");
            input.type = "text";
            input.value = url;
            input.classList.add("rss-feed-input");
            this.#container.appendChild(input);
        }
    }
}