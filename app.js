const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const data = require('./secrets.json');
const port = process.env.PORT||3000;
const regionCode=data[0].regionCode;
const apiKey = data[0].apiKey; + regionCode;
const listID = data[0].listID;
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "//signup.html");
  app.post("/", function(res, req) {

    const firstName = res.body.fName;
    const lastName = res.body.lName;
    const email = res.body.email;
    console.log(firstName + " " + lastName + " " + email + " ");
    const data = {
      members: [{
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }]
    };
    const jsonData = JSON.stringify(data);
    const url = "https://us17.api.mailchimp.com/3.0/lists/" + listID;
    var options = {
      method: "POST",
      auth: "Hello:" + apiKey
    }
    const request = https.request(url, options, function(response) { //when we want to post data
      response.on("data", function(data) {
        //console.log(JSON.parse(data));
        console.log(response.statusCode);
        if (response.statusCode == 200) {
          req.sendFile(__dirname + "/success.html");
        } else {
          req.sendFile(__dirname + "/failure.html");
        }
      })
    })
    request.write(jsonData);
    request.end();
  })
});


app.post("/failure", function(req, res) {
  res.redirect("/");
})


app.listen(port || 3000, function() {
  console.log("Listening at port " + port );

})
