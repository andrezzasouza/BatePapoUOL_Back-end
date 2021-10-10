import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const participants = [];

app.get("/participants", (req, res) => {
  res.send(participants);
})

app.listen(4000);