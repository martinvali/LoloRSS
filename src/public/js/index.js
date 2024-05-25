import CategoriesManager from "./components/CategoriesManager.js";
import PopupModal from "./components/PopupModal.js";
import RSSFeedsEditor from "./components/RSSFeedsEditor.js";
import RSSFeedsManager from "./components/RSSFeedsManager.js";

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

    document.querySelector(".news-items-container")?.addEventListener("click", newsItemsClicked);
}

async function newsItemsClicked (e) {
    const target = e?.target;
    console.log(target);
    const newsItem = target?.closest(".news-item");
    if(!newsItem) return;

    const url = newsItem.dataset.url;
    modal.showLoading(url);
    const data = await freeNewsItemFromClutter(url);

    modal.showContent(data);
}

async function freeNewsItemFromClutter (url) {
    const queryStringParameters = new URLSearchParams();
    queryStringParameters.append("url", url);

    const response = await fetch("/webparser?" + queryStringParameters);
    const data = await response.json();
    return data;
}

initializeWebsite();