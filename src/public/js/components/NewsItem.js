export default class NewsItem {
    categories;
    date;
    #HTMLElement;
    
    constructor (data) {
        this.#HTMLElement =  this.#generateNewsItemHTML(data);
        this.categories = this.#getNewsItemCategories(data);
        this.date = this.#getNewsItemDate(data);
        this.setVisibilityTo(true);
    }

    getHTMLElement () {
        return this.#HTMLElement;
    }

    setVisibilityTo (isVisible) {
        this.#HTMLElement.classList.toggle("visible", isVisible);
    }

    #generateNewsItemHTML (data) {
        const DATE_START_INDEX = 5;
        const DATE_END_INDEX = 16;
        const date = data.getElementsByTagName("pubDate")?.[0];
        const dateText = (date.textContent || date.innerText).slice(DATE_START_INDEX, DATE_END_INDEX);
    
        const link = data.getElementsByTagName("link")?.[0];
        const linkUrl = link.textContent || link.innerText || "";
    
        const image = data.getElementsByTagName("media:content")?.[0];
        const imageSrc = image?.getAttribute("url") || "/images/not_available.svg";
    
        const title = data.getElementsByTagName("title")?.[0];
        const titleText = title.textContent || title.innerText || "No Title";
    
        const description = data.getElementsByTagName("description")?.[0];
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

    #getNewsItemDate (data) {
        const date = data.getElementsByTagName("pubDate")?.[0].textContent;
        return new Date(date);
    }

    #getNewsItemCategories (data) {
        const categories = Array.from(data.getElementsByTagName("category")).map((category) => category.textContent).filter((category) => category !== "");
        if(categories.length !== 0) return categories;
        return ["Other"];
    }
}