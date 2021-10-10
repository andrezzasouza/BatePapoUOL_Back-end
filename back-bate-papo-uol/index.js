import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const participants = [];

app.get("/participants", (req, res) => {
  res.send(participants);
})

app.post("/participants", (req, res) => {
  console.log(req.body.name)
  const newUsername = req.body.name;
  const inUse = participants.find(e => e.name === newUsername)

  if (newUsername !== "" && inUse === undefined && newUsername !== null) {
    participants.push({
      name: newUsername,
      lastStatus: Date.now()
    })
    res.status(200);
  } else {
    res.status(400);
  }
  res.send()
})

app.listen(4000);