import getFeedsArticles from "../helpers/getFeedsArticles.js";
import NewsItem from "./NewsItem.js";

export default class RSSFeedsManager {
    #feedurls = [];
    #newsItemsContainer;
    #skeletonLoadersContainer;
    #categoriesManager;
    allNewsItems = {};

    constructor (categoriesManager) {
        this.#categoriesManager = categoriesManager;
        this.#newsItemsContainer = document.querySelector(".news-items-container");
        this.#skeletonLoadersContainer = this.#newsItemsContainer.querySelector(".news-items:first-of-type");
    }

    async addFeeds (rssFeeds, id = 0) {
        if(Array.isArray(rssFeeds)) this.#feedurls = [...this.#feedurls, ...rssFeeds];
        else this.#feedurls.push(rssFeeds);
        
        const xmlArticles = await getFeedsArticles(rssFeeds);
        this.#generateNewsArticles(xmlArticles, id);
        this.#categoriesManager.updateCategories(Object.values(this.allNewsItems).flat(1));

        this.#updateLocalStorage();
    }

    removeFeed (id, newUrls) {
        this.#newsItemsContainer.querySelector(`.news-feed-container[data-id="${id}"]`)?.remove();
        this.#feedurls = newUrls;
        this.#updateLocalStorage();
        delete this.allNewsItems[id];
        this.#categoriesManager.updateCategories(Object.values(this.allNewsItems).flat(1));
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