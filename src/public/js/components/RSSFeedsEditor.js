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
        container.parentElement.querySelector(".rss-feeds-text.subheading").addEventListener("click", this.#toggleRSSFeedsDropdown.bind(this));
        container.addEventListener("focusout", this.#lostFocusDetected.bind(this));
    }

    get #nextId () {
        const nextHighestId = this.#highestId + 1
        this.#highestId += 1;
        return nextHighestId;
    }

    #lostFocusDetected (e) {
        const target = e?.target;

        if (!target.matches(".rss-feed-input:not(.add-new-rss-feed-input)")) return;
        
        const id = target.parentElement.dataset.id;

        const newValue = target.value;
        const previousValue = this.#urls[id];

        if(newValue === previousValue) return;
        
        this.#feedUpdated(newValue, id);
    }

    async #feedUpdated (newValue, id) {
        this.#removeFeed(id);

        if(newValue === "") {
            return this.#container.querySelector(`.rss-feed-input-container[data-id="${id}"`)?.remove();
        }

        this.#urls[id] = newValue;
        document.body.classList.add("loading");
        await this.#feedsManager.addFeeds([newValue], id);
        document.body.classList.remove("loading");
    
    }

    #toggleRSSFeedsDropdown () {
        this.#container.parentElement.classList.toggle("open");
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