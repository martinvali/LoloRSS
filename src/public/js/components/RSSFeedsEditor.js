export default class RSSFeedsEditor {
    #urls;
    #container;
    #addNewFeedInput;
    #feedsManager;

    constructor (urls, container, feedsManager) {
        this.#urls = urls;
        this.#container = container;
        this.#addNewFeedInput = container.querySelector(".add-new-rss-feed-input");
        container.querySelector(".rss-feed-button.add-new-rss-feed-button").addEventListener("click", this.#addNewFeed.bind(this));
        this.#generateInputsForAllUrls();
        this.#feedsManager = feedsManager;
        this.#container.addEventListener("click", this.#containerClicked.bind(this));
    }

    #containerClicked (e) {
        const target = e.target;
        if (!target?.classList.contains("rss-feed-input-delete-button")) return;

        const id = target?.parentNode?.dataset?.id;
        
        if(id) this.#removeFeed(id);
        target?.parentNode?.remove();
    }

    #generateInputsForAllUrls () {
        let id = 0;
        for (const url of this.#urls) {
            this.#displayNewFeed(url, id);
            id++;
        }
    }

    #displayNewFeed (url, id) {
        const container = document.createElement("div");
        container.classList.add("rss-feed-input-container");
        container.dataset.id = id;
        
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("rss-feed-input-delete-button", "rss-feed-button");

        const input = document.createElement("input");
        input.type = "text";
        input.value = url;
        input.classList.add("rss-feed-input");

        container.appendChild(input);
        container.appendChild(deleteButton);
        this.#container.appendChild(container);

    }

    #addNewFeed () {
        const url = this.#addNewFeedInput?.value;
        if(!url) return;

        this.#addNewFeedInput.value = "";
        this.#urls.push(url);
        this.#displayNewFeed(url, this.#urls.length - 1);
        this.#feedsManager.addFeeds([url]);
    }

    #removeFeed (id) {
        this.#feedsManager.removeFeed(id);

    }
}