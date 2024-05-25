import fetchRSSFeeds from "./fetchRSSFeeds.js";
import parseXML from "./parseXML.js";

export default async function getFeedsArticles (urls) {
    const xmlDocuments = [];

    const response = await fetchRSSFeeds(urls);
    const xmlStrings = await response.json();
    
    for (const xmlString of xmlStrings) {
        const xmlDocument = parseXML(xmlString);
        xmlDocuments.push(xmlDocument);
    }

    return xmlDocuments;
}