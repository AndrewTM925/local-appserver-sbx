const express = require("express");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const cors = require("cors");
const bodyParser = require("body-parser");


const BAW_ENDPOINT = "https://bpmtst.costco.com";
const usrnm = "andrewmartin@costco.com"//"Buyer_IMP1@email.com";
const pwd = "Optimist#12" //"BPMRocks!5";

const app = express();
const port = 3000;

let authToken;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const basicAuthHeader = {
  Authorization: `Basic ${Buffer.from(`${usrnm}:${pwd}`).toString("base64")}`,
  "Content-Type": "application/json",
};


app.get("/", (req, res) => {
  res.send("hello!");
});

app.get("/baw/v1/tasks", async (req, res) => {
  const options = {
    method: "POST",
    headers: basicAuthHeader,
    body: JSON.stringify({ userName: "Buyer_USA1@email.com" }),
  };
  try {
    let response = await fetch(
      `${BAW_ENDPOINT}/automationservices/rest/ADIBAWS/Start_IA_Rest/get_tasks`,
      options
    );
    if (response.ok) {
      const data = await response.json();
      res.send(data);
    } else {
      console.error("Error: ", response);
      res.sendStatus(response.status);
    }
  } catch (e) {
    console.log(e);
  }
});

app.get("/baw/v1/services", async (req, res) => {
  const options = {
    method: "GET",
    headers: basicAuthHeader
  };

  try {
    let response = await fetch(
      `${BAW_ENDPOINT}/rest/bpm/wle/v1/exposed?avoidBasicAuthChallenge=true&excludeReferencedFromToolkit=all&includeServiceSubtypes=startable_service,dashboard&forUser=Buyer_USA1@email.com`,
      options
    );

    if (response.ok) {
      const data = await response.json();
      res.send(data);
    } else {
      console.log("Error: ", response);
      res.sendStatus(response.status);
    }
  } catch (e) {
    console.error(e);
  }
});

app.get("/baw/v1/supplier-details", async (req, res) => {
  const options = {
    method: "POST",
    headers: basicAuthHeader,
  };

  try {
    let response = await fetch(
      `${BAW_ENDPOINT}/automationservices/rest/ADIBAWS/Start_IA_Rest/getSupplierDetails`,
      options
    );

    if (response.ok) {
      const data = await response.json();
      res.send(data);
    } else {
      console.log("Error: ", response);
      res.sendStatus(response.status);
    }
  } catch (e) {
    console.error(e);
  }
});



const basicAuthHeader_v2 = {
  "Content-Type": "application/json",
};

app.get("/baw/v1/login", async (req, res) => {
    let options = {
      method: "POST",
      header: basicAuthHeader_v2,
      body: {
        login: 'andrewmartin@costco.com',
        password: 'Optimist#12',
        login_request: {
            "refresh_groups": false,
            "requested_lifetime": 7200
        }
      },
    };
    try {
        var response = await fetch(`${BAW_ENDPOINT}/ops/system/login`, options);
        if (response.ok) {
            const data = await response.json();
            console.log('Response OK: ', data);
            res.send(data);
        } else {
            console.log('Response NOT OK: ', response);
            res.sendStatus(response.status);
        }

    } catch (e) {
        console.log("Error: ", e);
        res.sendStatus(response.status)
    }
});

app.get("/bpm/v1/token", async (req, res, next) => {
  const options = {
    method: "POST",
    headers: basicAuthHeader,
    body: new URLSearchParams({
      avoidBasicAuthChallenge: "true",
    }),
  };

  try {
    let response = await fetch(
      `${BAW_ENDPOINT}/rest/bpm/wle/v1/system/session/token`,
      options
    );

    if (response.ok) {
      const data = await response.json();
      // console.log('Fetch Response:' , response);
      // console.log("Set Cookies: " , response.headers.raw()['set-cookie']);    /// <------ Grabs Response Cookies
      // let tmpArr = response.headers.raw()["set-cookie"];
      // let startIdx = 11;
      // let endIdx = tmpArr[0].indexOf(";")
      // console.log('Token: ', tmpArr[0].substring(startIdx, endIdx));         /// <------- Extract token from Cookies array
      // authToken = tmpArr[0].substring(startIdx, endIdx);
      // res.append('set-cookie', response.headers.raw()["set-cookie"]);
      res.send(data);
    } else {
      console.log("Error: ", response);
      res.sendStatus(response.status);
    }
  } catch (e) {
    console.error(e);
  }
});

app.use((req, res) => {
  res.status(404).send("Sorry can't find that!");
});

app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});
