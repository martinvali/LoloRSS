import CategoriesManager from "./components/CategoriesManager.js";
import PopupModal from "./components/popupModal.js";
import RSSFeedsEditor from "./components/RSSFeedsEditor.js";
import RSSFeedsManager from "./components/RSSFeedsManager.js";

const DEFAULT_RSS_FEED = "https://flipboard.com/@raimoseero/feed-nii8kd0sz.rss";

const modalContainer = document.querySelector(".module-container");
const modal = new PopupModal(modalContainer);

const categoriesManager = new CategoriesManager(document.querySelector(".filter-categories-container"));

const feedsManager = new RSSFeedsManager(categoriesManager);

const allFilters = {};

async function initializeWebsite() {

    const rssFeeds = JSON.parse(localStorage.getItem("feeds")) || [DEFAULT_RSS_FEED];
    
    const rssFeedsContainer = document.querySelector(".rss-feeds-inputs-container");
    new RSSFeedsEditor(rssFeeds, rssFeedsContainer, feedsManager);

    feedsManager.addFeeds(rssFeeds);

    document.querySelector(".news-items-container")?.addEventListener("click", newsItemsClicked);
    document.querySelector(".filter-categories-container").addEventListener("change", filterCategoriesClicked);
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

function filterCategoriesClicked (e) {
    if(!e.target.type === "checkbox") return;
    
    const target = e?.target;
    const category = target?.value;
    const isChecked = target?.checked;
    
    allFilters[category] = isChecked;


    for (const newsItem of Object.values(feedsManager.allNewsItems).flat(1)) {
        if(newsItem?.categories?.every((category) => allFilters[category] === false)) newsItem.setVisibilityTo(false);
        else newsItem.setVisibilityTo(true);
    }
}

async function freeNewsItemFromClutter (url) {
    const queryStringParameters = new URLSearchParams();
    queryStringParameters.append("url", url);

    const response = await fetch("/webparser?" + queryStringParameters);
    const data = await response.json();
    return data;
}

initializeWebsite();