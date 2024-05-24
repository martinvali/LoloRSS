import PopupModal from "./components/popupModal.js";
import NewsItem from "./components/NewsItem.js";

const modalContainer = document.querySelector(".module-container");
const modal = new PopupModal(modalContainer);
const allNewsItems = [];

function initializeWebsite() {
    fetchInitialContent();
    document.querySelector(".news-items")?.addEventListener("click", newsItemsClicked);
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


async function fetchInitialContent () {
    const INITIAL_CONTENT_URL = "https://flipboard.com/@raimoseero/feed-nii8kd0sz.rss";
    const response = await getUrlContent(INITIAL_CONTENT_URL);
    const data = await response.text();
    const xmlDocument = parseXml(data);
    generateNewsArticles(xmlDocument);
}

async function getUrlContent (url) {
    const queryStringParameters = new URLSearchParams();
    queryStringParameters.append("url", url);
    const response = await fetch("/content?" + queryStringParameters);
    return response;
}

async function freeNewsItemFromClutter (url) {
    const queryStringParameters = new URLSearchParams();
    queryStringParameters.append("url", url);

    const response = await fetch("/webparser?" + queryStringParameters);
    const data = await response.json();
    return data;
}

function parseXml (xmlString) {
    const parser = new DOMParser();
    const document = parser.parseFromString(xmlString, "application/xml");
    return document;
}

function generateNewsArticles (xmlDocument) {
    const newsItems = xmlDocument.getElementsByTagName("item");
    const newsItemsContainer = document.querySelector(".news-items");
    for (let i = 0; i < newsItems?.length; i++) {
        const newsItemData = newsItems[i];
        const newsItem = new NewsItem(newsItemData);
        const newsItemHTML = newsItem.getHTMLElement();
        newsItemsContainer.appendChild(newsItemHTML);
        allNewsItems.push(newsItem);
    }
    document.body.classList.remove("loading");
    generateCategoriesFilters();
}

function generateCategoriesFilters () {
    const categories = new Set(allNewsItems.flatMap((newsItem) => newsItem.categories));
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
    }
}

initializeWebsite();