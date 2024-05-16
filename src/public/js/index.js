async function fetchInitialContent () {
    const INITIAL_CONTENT_URL = "https://flipboard.com/@raimoseero/feed-nii8kd0sz.rss";
    const initialData = await getUrlContent(INITIAL_CONTENT_URL);
}

async function getUrlContent (url) {
    const queryStringParameters = new URLSearchParams();
    queryStringParameters.append("url", url);
    const response = await fetch("/content?" + queryStringParameters);
    const data = await response.json();
    return data;
}

fetchInitialContent();