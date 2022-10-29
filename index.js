const express = require("express");
const cors = require("cors");
const formData = require("form-data");
const Mailgun = require("mailgun.js");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const mailgun = new Mailgun(formData);
const client = mailgun.client({
  username : process.env.MAILGUN_USERNAME,
  key : process.env.MAILGUN_API_KEY,
});

app.get("/", (req, res)=> {
  res.send("server is up");
});

app.post("/form", (req, res) => {
  console.log(req.body);

  const messageData = {
    from: `${req.body.firstname} ${req.body.lastname} <${req.body.email}>`,
    to: process.env.EMAIL,
    subject: `Formulaire `,
    text: req.body.message,
  };

  client.messages
      .create(process.env.MAILGUN_DOMAIN, messageData) 
      .then((response) => {
        console.log(response);
        res.status(200).json({ message: "email sent" });
      })
      .catch((err) => {
        res.status(err.status).json({ message: err.message });
      });
      
});

app.listen(process.env.PORT, () => {
  console.log("Server started !");
});