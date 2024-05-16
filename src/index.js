const app = require("./configs/server");

app.get("/", (req, res) => {
    res.sendFile("index.html");
});

app.get("/test", (req,res) => console.log(req));

app.get("/content", (req, res) => {
    const url = req?.query?.url;
});
app.listen(3000, () => {
    console.log("Listening on port 3000");
})
