const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const fs = require("fs");
const { log } = require("console");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  fs.readdir("./tasks", (err, tasks) => {
    const task = tasks.map((t) => {
      try {
        console.log(t);
        const content = fs.readFileSync(`./tasks/${t}`, "utf-8");
        return { title: t, content: content };
      } catch (error) {
        console.log(error);
      }
    });

    res.render("main", { task: task });
  });
});

app.post("/create", (req, res) => {
  const filename = req.body.title.split(" ").join("") + ".txt";
  fs.writeFile(`./tasks/${filename}`, req.body.details, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("File created successfully");
    }
  });
  res.redirect("/");
});
//Route to delete a task file
app.delete("/delete/:filename", (req, res) => {
  const tasksFolder = path.join(__dirname, "tasks"); // Path to the "tasks" folder
  const filename = decodeURIComponent(req.params.filename); // Decode the filename

  const filePath = path.join(tasksFolder, filename);
  console.log(`Attempting to delete file: ${filePath}`);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
      return res.json({ success: false, message: "Failed to delete file" });
    }
    res.json({ success: true });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
