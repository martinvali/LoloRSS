const app = require("./configs/server");
const fetch = require("node-fetch");
const isValidUrl = require("./helpers/isValidUrl");

app.get("/", (req, res) => {
    res.sendFile("index.html");
});

app.get("/test", (req,res) => console.log(req));

app.get("/content", async (req, res) => {
    const dataArray = [];
    try {
        let urls = req?.query?.url;

        if(!Array.isArray(urls)) urls = [urls];

        if(!urls) return res.status(400).json("");
        
        for (const url of urls) {
            if(!isValidUrl(url)) continue;
            const response = await fetch(url);
            const data = await response.text();
            dataArray.push(data);
        }
        res.set('Content-Type', 'application/json');
        return res.json(dataArray);
    }
    catch(err) {
        console.log(err);
        res.status(400).json(dataArray);
    }
});

app.get("/webparser", async (req,res) => {
    try {
        const WEB_PARSER_API_URL = "https://uptime-mercury-api.azurewebsites.net/webparser";
        const url = req?.query?.url;
        if(!url) return res.status(400).json("");

        const response = await fetch(WEB_PARSER_API_URL, {
            method:"POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({url})
        });
        const data = await response.json();

        return res.status(200).json(data);
    }
    
    catch(err) {
        console.log(err);
        return res.status(400).json("");
    }
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
})
