require("dotenv").config();
const express = require("express");
const PORT = process.env.PORT || 8000;
const axios = require("axios");

const fs = require('fs');
const FormData = require("form-data")
const multer = require("multer")
const cors = require("cors");
const bodyParser = require("body-parser");
const expressLayouts = require("express-ejs-layouts");

const app = express();

app.use(express.static('public'))
app.use(expressLayouts);
app.set('view-engine', 'ejs');
app.set('layout', './layouts/layout.ejs');
app.use(cors())
app.use(bodyParser.json({ limit: '10mb' })); // Adjust the limit based on your needs
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Initialize API endpoint
const API_ENDPOINT = "http://127.0.0.1:5000";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


app.get("/", (req,res)=>{
    res.render('home.ejs');
})
//l5pPbRFJb8cX4iGtJmBjIgJILBwJBVh8
app.post('/generate', upload.single("image"), async (req, res) => {
    try {
        const form = new FormData();
        form.append('image', req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
        });

        const response = await axios.post(`${API_ENDPOINT}/api/generate_caption`, form, {
            headers: {
                ...form.getHeaders(),
            }
        });
        const data = response.data
        res.status(200).json({ message: data });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});




app.listen(PORT, (error)=>{
    if (error) {
        console.error(error)
    } else {
        console.log(`Server running on port: ${PORT}`);
    }
})

/**
 * The goal is to use the local python server as an api for sending raw image to it and getting the caption and generation time from it back as json data.
 * We will use axios to implement a post request to this server and send the image to it. Then send the json data to client in ejs
 * The client side will display the image and the caption in a fancy manner and also later, we will use an external chat gpt like api to convert the caption to a vibe like-
 * funny, etc. this will also be done from the server side
 * 
 * Axios resource-
 * axios.post()
 */