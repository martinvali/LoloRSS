const app = require("./configs/server");
const fetch = require("node-fetch");

app.get("/", (req, res) => {
    res.sendFile("index.html");
});

app.get("/test", (req,res) => console.log(req));

app.get("/content", async (req, res) => {
    const url = req?.query?.url;
    if(!url) return res.status(400).json("");

    const response = await fetch(url);
    const data = await response.text();
    res.set('Content-Type', 'application/xml');
    return res.send(data);
});
app.listen(3000, () => {
    console.log("Listening on port 3000");
})