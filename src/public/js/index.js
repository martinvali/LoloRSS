function initializeWebsite() {
    fetchInitialContent();
    document.querySelector(".news-items")?.addEventListener("click", newsItemsClicked);
}


function newsItemsClicked (e) {
    const target = e?.target;
    const newsItem = target?.closest(".news-item");
    if(!newsItem) return;

    const url = newsItem.dataset.url;
    openNewsItemModule();
}

function openNewsItemModule () {
    document.querySelector(".news-item-module").classList.add("open", "loading");
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
        const newsItemElement = generateNewsItemElement(newsItemData);
        newsItemsContainer.appendChild(newsItemElement);
    }

    document.body.classList.remove("loading");
}

function generateNewsItemElement (newsItemData) {
    console.log(newsItemData);
    const DATE_START_INDEX = 5;
    const DATE_END_INDEX = 16;
    const date = newsItemData.getElementsByTagName("pubDate")?.[0];
    const dateText = (date.textContent || date.innerText).slice(DATE_START_INDEX, DATE_END_INDEX);

    const link = newsItemData.getElementsByTagName("link")?.[0];
    const linkUrl = link.textContent || link.innerText || "";

    const image = newsItemData.getElementsByTagName("media:content")?.[0];
    const imageSrc = image?.getAttribute("url") || "";

    const title = newsItemData.getElementsByTagName("title")?.[0];
    const titleText = title.textContent || title.innerText || "No Title";

    const description = newsItemData.getElementsByTagName("description")?.[0];
    const descriptionText = description.textContent || description.innerText || "No Description";

    const newsItemContainer = document.createElement("li");
    newsItemContainer.classList.add("news-item");
    newsItemContainer.dataset.url = linkUrl;

    const newsItemDate = document.createElement("p");
    newsItemDate.classList.add("news-item-date");
    newsItemDate.innerText = dateText;

    const newsItemTitle = document.createElement("h2");
    newsItemTitle.classList.add("news-item-title");
    newsItemTitle.innerText = titleText;

    const newsItemDescription = document.createElement("p");
    newsItemDescription.classList.add("news-item-description");
    newsItemDescription.innerText = descriptionText;

    const newsItemImage = document.createElement("img");
    newsItemImage.setAttribute("src", imageSrc);
    newsItemImage.classList.add("news-item-image");

    newsItemContainer.appendChild(newsItemImage);
    newsItemContainer.appendChild(newsItemDate);
    newsItemContainer.appendChild(newsItemTitle);
    newsItemContainer.appendChild(newsItemDescription);
    return newsItemContainer;
}

initializeWebsite();