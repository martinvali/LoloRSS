import freeNewsItemFromClutter from "./freeNewsItemsFromClutter.js";

export default async function newsItemsClicked (e, modal) {
    const target = e?.target;
    const newsItem = target?.closest(".news-item");
    if(!newsItem) return;

    const url = newsItem.dataset.url;

    modal.showLoading(url);
    const data = await freeNewsItemFromClutter(url);
    
    if(!modal.isVisible) return;
    modal.showContent(data);
}