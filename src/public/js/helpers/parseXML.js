export default function parseXML (xmlString) {
    const parser = new DOMParser();
    const document = parser.parseFromString(xmlString, "application/xml");
    return document;
}