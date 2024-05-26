export default async function freeNewsItemFromClutter (url, modal) {
    const queryStringParameters = new URLSearchParams();
    queryStringParameters.append("url", url);

    const abortController = new AbortController();
    const signal = abortController.signal;

    if(modal.abortController) modal.abortController.abort("Race condition");
    modal.abortController = abortController;

    const response = await fetch("/webparser?" + queryStringParameters, {signal});
    const data = await response.json();
    return data;
}