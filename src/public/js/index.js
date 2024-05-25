import PopupModal from "./components/popupModal.js";
import NewsItem from "./components/NewsItem.js";

import getFeedsArticles from "./helpers/getFeedsArticles.js";

const DEFAULT_RSS_FEED = "https://flipboard.com/@raimoseero/feed-nii8kd0sz.rss";

const modalContainer = document.querySelector(".module-container");
const modal = new PopupModal(modalContainer);
const allFilters = {};
const allNewsItems = [];

async function initializeWebsite() {

    const rssFeeds = localStorage.getItem("feeds") || [DEFAULT_RSS_FEED];
    displayCurrentRSSFeedsLinks(rssFeeds);

    const xmlArticles = await getFeedsArticles(rssFeeds);
    generateNewsArticles(xmlArticles);

    document.querySelector(".news-items")?.addEventListener("click", newsItemsClicked);
    document.querySelector(".filter-categories-container").addEventListener("change", filterCategoriesClicked);
}

function displayCurrentRSSFeedsLinks (rssFeeds) {
    const container = document.querySelector(".rss-feeds");
    for (const url of rssFeeds) {
        const input = document.createElement("input");
        input.type = "text";
        input.value = url;
        input.classList.add("rss-feed-input");
        container.appendChild(input);
    }
}

async function newsItemsClicked (e) {
    const target = e?.target;
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


    for (const newsItem of allNewsItems) {
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

function generateNewsArticles (xmlDocuments) {
    const newsItemsContainer = document.querySelector(".news-items");

    for (const xmlDocument of xmlDocuments) {
        const feedNewsItems = [];
        const newsItems = xmlDocument.getElementsByTagName("item");

        for (let i = 0; i < newsItems?.length; i++) {
            const newsItemData = newsItems[i];
            const newsItem = new NewsItem(newsItemData);
            allNewsItems.push(newsItem);
            feedNewsItems.push(newsItem);
        }

        feedNewsItems.sort((a, b) => b.date - a.date);

        for (const newsItem of feedNewsItems) {
            newsItemsContainer.appendChild(newsItem.getHTMLElement());
        }
        
    }
    document.body.classList.remove("loading");
    generateCategoriesFilters();
}

function generateCategoriesFilters () {
    const categories = new Set(allNewsItems.flatMap((newsItem) => newsItem.categories));
    categories.add("Other");
    const categoriesContainer = document.querySelector(".filter-categories-container");

    for (const category of categories) {
        const containerElement = document.createElement("div");
        containerElement.classList.add("filter-category-container");
        
        const labelElement = document.createElement("label");
        labelElement.classList.add("filter-category-label");
        labelElement.textContent = category;
        labelElement.setAttribute("for", category);

        const inputElement = document.createElement("input");
        inputElement.classList.add("filter-category-input");
        inputElement.checked = true;
        inputElement.id = category;
        inputElement.value = category;
        inputElement.type = "checkbox";

        containerElement.appendChild(inputElement);
        containerElement.appendChild(labelElement);
        
        categoriesContainer.appendChild(containerElement);

        allFilters[category] = true;
    }
}

initializeWebsite();