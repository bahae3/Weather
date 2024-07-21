import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';

// creating the app and the server port
const app = express();
const port = 3000;

// API url and the api key
const api_url = "https://api.openweathermap.org/data/2.5/weather";
const api_key = "31f974544e5c89c653cef3f88d315c30";

// middlewares:
app.use(bodyParser.urlencoded({ extended: true })); // for retrieving data from the form
app.use(express.static("public")); // for static files such as images and css files

// home page
app.get("/", (req, res) => {
    res.render("index.ejs");
});

// once submitted in the form, processes are handled in this route
app.post("/getText", async (req, res) => {
    const cityName = req.body.city;
    try {
        const response = await axios.get(`${api_url}?q=${cityName}&appid=${api_key}&units=metric`);
        const temp = response.data.main.temp;
        const city = response.data.name;
        const description = response.data.weather[0].description;
        let regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
        const country = regionNames.of(response.data.sys.country);

        let info = {
            temp: temp,
            city: city,
            country: country,
            description: description
        };
        res.render("weather.ejs", { weatherInfo: info });
    } catch (error) {
        console.error(error);
    }
});

// listening to the port
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
