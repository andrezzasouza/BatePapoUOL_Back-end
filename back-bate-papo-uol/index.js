import express from 'express';
import cors from 'cors';
import dayjs from 'dayjs';
import fs from 'fs';

const app = express();
app.use(cors());
app.use(express.json());

const messages = [];
const participants = [];
// const dataJSON = fs.readFileSync("userData.json");
// const participants = JSON.parse(dataJSON);
// console.log("here")

app.get("/participants", (req, res) => {
  res.send(participants);
});

app.post("/participants", (req, res) => {
  const newUsername = req.body.name;
  const inUse = participants.find(e => e.name === newUsername);
  const messageTime = Date.now();

  if (newUsername !== "" && inUse === undefined && newUsername !== null) {
    participants.push({
      name: newUsername,
      lastStatus: messageTime
    });
    messages.push(
      {
        from: newUsername, 
        to: 'Todos', 
        text: 'entra na sala...', 
        type: 'status', 
        time: dayjs(messageTime).format("HH:mm:ss")
      }
    );
    res.status(200);
    // console.log('here 1')
  } else {
    res.status(400);
    // console.log('here2')
  }
  res.send();
  // const participantsJSON = JSON.stringify(participants);
  // fs.writeFileSync("userData.json", participantsJSON);
});

app.get("/messages", (req, res) => {
  const username = req.headers.user;
  const maxMessages = req.query.limit
  const returnArray = [];

  const filteredArray = messages.filter((msg) => {
    if (msg.from === username || msg.to === username || msg.to === "Todos") {
      return msg;
    }
  });

  if (req.query.limit !== true) {
    res.send(filteredArray);
  } else {
    for (let i = 0; i < maxMessages; i++) {
      if (filteredArray[i]) {
        returnArray.push(filteredArray[i]);
      }
    }
    res.send(returnArray);
  }
  // test if it's working
});

app.post("/messages", (req, res) => {
  const messageData = req.body;
  const messageTime = Date.now();
  const username = req.headers.user;
  const userOnline = participants.find((e) => e.name === username);
  //can i send this username into the if?

  if (messageData.to !== "" && messageData.text !== "" && (messageData.type === "message" || messageData.type === "private_message") && userOnline) {
    messageData.from = username;
    messageData.time = dayjs(messageTime).format("HH:mm:ss");
    messages.push(messageData);
    res.status(200);
  } else {
    res.status(400);
  }
  res.send();
});

app.post("/status", (req, res) => {
  const statusTime = Date.now();
  const username = req.headers.user;
  const foundUser = participants.find(e => e.name === username);
  if (foundUser) {
    for (let i = 0; i < participants.length; i++) {
      if (foundUser.name === participants[i].name) {
        participants[i].time = dayjs(statusTime).format("HH:mm:ss");
      }
    }
    res.status(200);
  } else {
    res.status(400);
  }
  res.send();
})

app.listen(4000);