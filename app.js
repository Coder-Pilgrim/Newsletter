import express from "express";
import https from "node:https";
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import client from "@mailchimp/mailchimp_marketing";

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

client.setConfig({ apiKey: "25ede9d3466b8edc39433f2ba32ce6c3-us13", server: "us13", });

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/signup.html"));
});

app.post("/", function (req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    // res.send(firstName + " " + lastName + " = " + email);

    const subscribingUser = { firstName: firstName, lastName: lastName, email: email };

    const run = async () => {
        try {
            const response = await client.lists.addListMember("ed7cf7262e", {
                email_address: subscribingUser.email,
                status: "subscribed",
                merge_fields: {
                    FNAME: subscribingUser.firstName,
                    LNAME: subscribingUser.lastName
                }
            });
            console.log(`${response.merge_fields.FNAME} ${response.merge_fields.LNAME} with email ${response.email_address} has been successfully registered`);
            res.sendFile(__dirname + "/success.html");
        } catch (error) {
            console.log(error.status);
            res.sendFile(__dirname + "/failure.html");
        }
    };

    run();
});

app.post("/failure", function (req, res){
    res.redirect("/");
})
app.listen(process.env.PORT || port, function () {
    console.log(`Port is listening ${port}`);
});

// API KEY
// 25ede9d3466b8edc39433f2ba32ce6c3-us13

// LIST ID
// ed7cf7262e.