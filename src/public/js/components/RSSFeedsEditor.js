export default class RSSFeedsEditor {
    #urls =  {}
    #container;
    #addNewFeedInput;
    #feedsManager;
    #highestId;

    constructor (urls, container, feedsManager) {
        urls.forEach((url, index) => this.#urls[index] = url);
        this.#container = container;
        this.#addNewFeedInput = container.querySelector(".add-new-rss-feed-input");
        container.querySelector(".rss-feed-button.add-new-rss-feed-button").addEventListener("click", this.#addNewFeed.bind(this));
        this.#generateInputsForAllUrls();
        this.#feedsManager = feedsManager;
        this.#container.addEventListener("click", this.#containerClicked.bind(this));
        this.#highestId = Object.keys(this.#urls).length - 1;
    }

    get #nextId () {
        console.log("doing");
        const currentHighestId = this.#highestId;
        this.#highestId += 1;
        return currentHighestId;
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
        for (const url of Object.values(this.#urls)) {
            this.#displayNewFeed(url, id);
            this.#urls[id] = url;
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

    async #addNewFeed () {
        const url = this.#addNewFeedInput?.value;
        if(!url) return;
    
        this.#addNewFeedInput.value = "";

        const id = this.#nextId;
        this.#urls[id] = url;

        console.log(this.#urls);
        this.#displayNewFeed(url, id);
        document.body.classList.add("loading");
        await this.#feedsManager.addFeeds([url], id);
        document.body.classList.remove("loading");
    }

    #removeFeed (id) {
        delete this.#urls[id];
        this.#feedsManager.removeFeed(id, Object.values(this.#urls));
    }
}