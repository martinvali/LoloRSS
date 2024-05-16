const app = require("./configs/server");

app.get("/", (req, res) => {
    res.sendFile("index.html");
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
})
