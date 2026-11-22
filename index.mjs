import "dotenv/config";
import express from "express";
const solar = (await import("npm-solarsystem")).default;

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

// Random background image for home page
app.get("/", (req, res) => {
    const number = Math.floor(Math.random() * 8) + 1;
    const backgroundImage = `/img/backgrounds/space${number}.jpg`;
    res.render("index", { backgroundImage });
});


app.get("/planet", (req, res) => {
    const planetName = req.query.planetName;
        if (typeof solar["get" + planetName] !== "function") {
        return res.status(404).send("Planet not found");
    }
    const planetInfo = solar["get" + planetName]();
    res.render("planet", { planetName, planetInfo });
});


// NASA picture of the day route
app.get("/nasa", async (req, res) => {
    const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
    const url = `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}&date=${today}`;
    const response = await fetch(url);
    if (!response.ok) return res.send("NASA is not answering right now. Please try again later.");
    const data = await response.json();
    res.render("nasa", { data });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});