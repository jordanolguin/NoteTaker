const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3001;

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Line 13 is technically not necessary for full functionality in the current state, however if changes/updates would like to be made in the future, the API route is here.
// app.get("/", (req, res) => res.send());

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public/notes.html"))
);

app.get("/api/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "./db/db.json"))
);

app.post("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      console.log(req.body);
      const parsedData = JSON.parse(data);
      const newNote = req.body;
      req.body.id = parsedData.length + 1;
      parsedData.push(newNote);

      fs.writeFile("./db/db.json", JSON.stringify(parsedData), (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          res.json(newNote);
        }
      });
    }
  });
});

app.delete("/api/notes/:id", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      console.log(req.params.id);
      const parsedData = JSON.parse(data);
      const newNoteArray = [];
      for (let i = 0; i < parsedData.length; i++) {
        // console.log(parsedData[i]);
        if (req.params.id != parsedData[i].id) {
          //   console.log(parsedData[i]);
          newNoteArray.push(parsedData[i]);
        }
        console.log("New Note: ", newNoteArray);
      }
      fs.writeFile("./db/db.json", JSON.stringify(newNoteArray), (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          res.json(newNoteArray);
        }
      });
    }
  });
});

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
