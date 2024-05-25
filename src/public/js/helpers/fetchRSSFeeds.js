export default async function fetchRSSFeeds (urls) {
    const queryStringParameters = new URLSearchParams();
    
    for (const url of urls) {
        queryStringParameters.append("url", url);
    }
    const response = await fetch("/content?" + queryStringParameters);
    return response;
}