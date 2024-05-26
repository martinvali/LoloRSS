import CategoriesManager from "./components/CategoriesManager.js";
import PopupModal from "./components/PopupModal.js";
import RSSFeedsEditor from "./components/RSSFeedsEditor.js";
import RSSFeedsManager from "./components/RSSFeedsManager.js";

import newsItemsClicked from "./helpers/newsItemsClicked.js";

const DEFAULT_RSS_FEED = "https://flipboard.com/@raimoseero/feed-nii8kd0sz.rss";

const modalContainer = document.querySelector(".module-container");
const modal = new PopupModal(modalContainer);

const categoriesManager = new CategoriesManager(document.querySelector(".filter-categories-container"));

const feedsManager = new RSSFeedsManager(categoriesManager);

categoriesManager.feedsManager = feedsManager;

async function initializeWebsite() {

    const rssFeeds = JSON.parse(localStorage.getItem("feeds")) || [DEFAULT_RSS_FEED];
    
    const rssFeedsContainer = document.querySelector(".rss-feeds-inputs-container");
    new RSSFeedsEditor(rssFeeds, rssFeedsContainer, feedsManager);

    feedsManager.addFeeds(rssFeeds);

    document.querySelector(".news-items-container")?.addEventListener("click", (e) => newsItemsClicked(e, modal));
}


initializeWebsite();