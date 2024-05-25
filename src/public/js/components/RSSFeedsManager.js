import getFeedsArticles from "../helpers/getFeedsArticles.js";
import NewsItem from "./NewsItem.js";

export default class RSSFeedsManager {
    #feedurls = [];
    #newsItemsContainer;
    #categoriesManager;
    allNewsItems = [];

    constructor (categoriesManager) {
        this.#categoriesManager = categoriesManager;
        this.#newsItemsContainer = document.querySelector(".news-items");
    }

    async addFeeds (rssFeeds) {
        if(Array.isArray(rssFeeds)) this.#feedurls = [...this.#feedurls, ...rssFeeds];
        else this.#feedurls.push(rssFeeds);
        const xmlArticles = await getFeedsArticles(rssFeeds);
        this.#generateNewsArticles(xmlArticles);
        this.#categoriesManager.updateCategories(this.allNewsItems);

        console.log(this.#feedurls, "SET");
        localStorage.setItem("feeds", JSON.stringify(this.#feedurls));
    }

    removeFeed () {

    }

    #generateNewsArticles (xmlDocuments) {
        const newsItemsContainer = this.#newsItemsContainer;
        
        document.body.classList.add("loading");
        for (const xmlDocument of xmlDocuments) {
            const feedNewsItems = [];
            const newsItems = xmlDocument.getElementsByTagName("item");
    
            for (let i = 0; i < newsItems?.length; i++) {
                const newsItemData = newsItems[i];
                const newsItem = new NewsItem(newsItemData);
                this.allNewsItems.push(newsItem);
                feedNewsItems.push(newsItem);
            }
    
            feedNewsItems.sort((a, b) => b.date - a.date);
    
            for (const newsItem of feedNewsItems) {
                newsItemsContainer.appendChild(newsItem.getHTMLElement());
            }
            
        }
        document.body.classList.remove("loading");
    }
}