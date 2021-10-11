import express from 'express';
import cors from 'cors';
import dayjs from 'dayjs';
import fs from 'fs';

console.log("node loop")

const app = express();
app.use(cors());
app.use(express.json());

const messages = [];
let participants = [];
// const dataJSON = fs.readFileSync("userData.json");
// const participants = JSON.parse(dataJSON);
// console.log("here")

function checkPresence() {
  console.log("1", participants)
  for (let i = 0; i < participants.length; i++) {
    const moreThan10 = Date.now() - participants[i].lastStatus > 10000;
    console.log("3", participants);
    if(moreThan10 /*&& participants === undefined*/) {
      messages.push({
        from: participants[i].name,
        to: "Todos",
        text: "sai da sala...",
        type: "status",
        time: dayjs(Date.now()).format("HH:mm:ss"),
      });
      participants.splice(i, 1);
      console.log("3", participants);
    }
  }
}

setInterval(checkPresence, 15000);

app.get("/participants", (req, res) => {
  res.send(participants);
});

app.post("/participants", (req, res) => {
  const newUsername = req.body.name;
  const inUse = participants.find(e => e.name === newUsername);
  const messageTime = Date.now();

  if (newUsername !== "" && inUse === undefined && newUsername !== null && newUsername !== undefined) {
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
  } else {
    res.status(400);
  }
  res.send();
  // const participantsJSON = JSON.stringify(participants);
  // fs.writeFileSync("userData.json", participantsJSON);
});

app.get("/messages", (req, res) => {
  const username = req.headers.user;
  const maxMessages = req.query.limit;

  const filteredArray = messages.filter((msg) => {
    if (msg.from === username || msg.to === username || msg.type === "message" || msg.type === "status") {
      return msg;
    }
  });
  if (maxMessages === undefined ) {
    res.send(filteredArray);
  } else {
    const returnArray = filteredArray.slice(-maxMessages);
    res.send(returnArray);
  }
});

app.post("/messages", (req, res) => {
  const messageData = req.body;
  const messageTime = Date.now();
  const username = req.headers.user;
  const userOnline = participants.find((e) => e.name === username);

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
  const username = req.headers.user;
  const foundUser = participants.find(e => e.name === username);
  if (foundUser !== undefined) {
    for (let i = 0; i < participants.length; i++) {
      if (foundUser.name === participants[i].name) {
        participants[i].lastStatus = Date.now();
      }
    }
    console.log("4", participants)
    res.status(200);
  } else {
    res.status(400);
    console.log("5", participants);
  }
  res.send(foundUser);
})

app.listen(4000);