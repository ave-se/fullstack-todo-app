const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cors());

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Serve static files from the React build
app.use(express.static(path.join(__dirname, "client", "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

// Models
const Todo = require("./models/Todo");

app.get("/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post("/todo/new", (req, res) => {
  const todo = new Todo({
    text: req.body.text,
  });

  todo
    .save()
    .then((savedTodo) => {
      res.json(savedTodo);
    })
    .catch((error) => {
      res.status(500).json({ error: "Error saving todo" });
    });
});

app.delete("/todo/delete/:id", async (req, res) => {
  const result = await Todo.findByIdAndDelete(req.params.id);
  res.json({ result });
});

app.get("/todo/complete/:id", async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  todo.complete = !todo.complete;
  todo.save();
  res.json(todo);
});

app.put("/todo/update/:id", async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  todo.text = req.body.text;
  todo.save();
  res.json(todo);
});

// Route to serve the React app (index.html) for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
