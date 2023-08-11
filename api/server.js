const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb://127.0.0.1:27017/mern-todo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch(console.error);

// Models
const Todo = require("../models/Todo"); // Adjust the path based on your project structure

app.get("/todos", async (req, res) => {
  const todos = await Todo.find();

  res.json(todos);
});

// ... Other routes ...

// Serve static files from the React build
app.use(express.static(path.join(__dirname, "..", "client", "build")));

// For any other route, serve the React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
