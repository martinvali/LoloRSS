import getFeedsArticles from "../helpers/getFeedsArticles.js";
import NewsItem from "./NewsItem.js";

export default class RSSFeedsManager {
    #feedurls = [];
    #newsItemsContainer;
    #skeletonLoadersContainer;
    #categoriesManager;
    allNewsItems = {};
    #infoText;

    constructor (categoriesManager) {
        this.#categoriesManager = categoriesManager;
        this.#newsItemsContainer = document.querySelector(".news-items-container");
        this.#skeletonLoadersContainer = this.#newsItemsContainer.querySelector(".news-items:first-of-type");
        this.#infoText = this.#newsItemsContainer.querySelector(".info-text");
    }

    async addFeeds (rssFeeds, id = 0) {
        if(Array.isArray(rssFeeds)) this.#feedurls = [...this.#feedurls, ...rssFeeds];
        else this.#feedurls.push(rssFeeds);
        
        const xmlArticles = await getFeedsArticles(rssFeeds);
        this.#generateNewsArticles(xmlArticles, id);
        this.#categoriesManager.updateCategories(Object.values(this.allNewsItems).flat(1));

        this.#updateLocalStorage();
        this.#toggleInfoText();
    }
    

    removeFeed (id, newUrls) {
        this.#newsItemsContainer.querySelector(`.news-feed-container[data-id="${id}"]`)?.remove();
        this.#feedurls = newUrls;
        this.#updateLocalStorage();
        console.log("Before", this.allNewsItems);
        delete this.allNewsItems[id];
        console.log("after", this.allNewsItems, id);
        this.#categoriesManager.updateCategories(Object.values(this.allNewsItems).flat(1));
        this.#toggleInfoText();
    }

    #toggleInfoText () {
        console.log(Object.values(this.allNewsItems).flat(1));
        if(Object.values(this.allNewsItems).flat(1).length === 0) {
            this.#infoText.classList.add("visible");
            this.#infoText.innerText = "Currently there are not valid RSS feeds.";
        }
        else this.#infoText.classList.remove("visible");
    }

    #updateLocalStorage () {
        localStorage.setItem("feeds", JSON.stringify(this.#feedurls));
    }

    #generateNewsArticles (xmlDocuments, id = 0) {
        const newsItemsContainer = this.#newsItemsContainer;

        document.body.classList.add("loading");


        for (const xmlDocument of xmlDocuments) {
            const newsFeedContainer = document.createElement("ul");
            newsFeedContainer.dataset.id = id;
            newsFeedContainer.classList.add("news-feed-container", "news-items");

            const newsFeedItems = [];
            const newsItems = xmlDocument.getElementsByTagName("item");
            
            if(newsItems.length === 0) continue;

            for (let i = 0; i < newsItems?.length; i++) {
                const newsItemData = newsItems[i];
                const newsItem = new NewsItem(newsItemData, id);
                newsFeedItems.push(newsItem);
            }
    
            newsFeedItems.sort((a, b) => b.date - a.date);
            
            for (const newsItem of newsFeedItems) {
                newsFeedContainer.appendChild(newsItem.getHTMLElement());
            }

            this.allNewsItems[id] = newsFeedItems;
            newsItemsContainer.insertBefore(newsFeedContainer, this.#skeletonLoadersContainer.nextSibling);
            id++;
        }
        document.body.classList.remove("loading");
    }
}