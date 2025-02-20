const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Chatkit = require("@pusher/chatkit-server");

const app = express();
const instance_locator_id = "082d1264-5771-48aa-9828-a1f0e3231330";
const chatkit_secret = "9f524a7a-d414-45f8-b2a9-498267df3cd6:Tywp2QvyqFS6tGkq67whRFkmiCZgCZdnnNp6SsGR1W8=";

const chatkit = new Chatkit.default({
  instanceLocator: 'v1:us1:082d1264-5771-48aa-9828-a1f0e3231330',
  key: "9f524a7a-d414-45f8-b2a9-498267df3cd6:Tywp2QvyqFS6tGkq67whRFkmiCZgCZdnnNp6SsGR1W8="
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Api work! :-)");
});

app.post('/auth', (req, res) => {
  const { userId } = req.body;
  const authData = chatkit.authenticate({
    userId
  });

  res.status(authData.status)
     .set(authData.headers)
     .send(authData.body);
})

app.post("/users", (req, res) => {
  const { username } = req.body;
  console.log(username)
  chatkit.createUser({
    id: username,
    name: username
  })
    .then((user) => {
      console.log("OK", user)
      res.status(200).send(user);
    }).catch((err) => {
      console.log("ERROR", err)
      res.status(500).send(err);
    });
  
})

app.get("/users", (req, res) => {
  
  chatkit.getUsers({
    limit: 200
  })
    .then((user) => {
      res.status(200).send('Success', user);
    }).catch((err) => {
      res.status(500).send(err);
    });
  
})



// app.post("/users", (req, res) => {
//   const { username } = req.body;
 
//   chatkit
//     .createUser({
//       username
//     })
//     .then(() => {
//       console.log("AAA: 2 ok")
//       res.sendStatus(201);
//     })
//     .catch(error => {
//       console.log("AAA: 2 error" )
//       console.log(error )
//       if (error.error === "services/chatkit/user_already_exists") {
//         res.sendStatus(200);
//       } else {
//         let statusCode = error.status;
//         if (statusCode >= 100 && statusCode < 600) {
//           res.status(statusCode);
//         } else {
//           res.status(500);
//         }
//       }
//     });
// });

const PORT = process.env.PORT || 3000
app.listen(PORT, err => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Running on ports ${PORT}`);
  }
});
