import express from "express";
import fs from "fs";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";
import { isUtf8 } from "buffer";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/assets", express.static("assets"));
// app.use(express.static("public"));

function getFileName() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${day}-${month}-${year}.txt`;
}

app.get("/", function (req, res) {
  // const directoryPath = path.join("./", "files");

  fs.readdir("files", function (err, files) {
    if (err) {
      return res.send("Unable to scan directory: " + err);
    }

    res.render("index.ejs", { hisaabs: files });
  });
});
app.get(`/view/:filename`, (req, res) => {
  fs.readFile(`./files/${req.params.filename}`, "utf-8", (err, filedata) => {
    if (err) {
      console.log(err);
    }
    res.render("view", { title: req.params.filename, details: filedata }); //baki che
  });
});

app.get("/create", function (req, res) {
  res.render("create");
});
app.post("/create", (req, res) => {
  fs.writeFile(
    `./files/${req.body.title}.txt`,
    req.body.details,
    function (err) {
      if (err) return res.send(err);
      else return res.redirect("/");
    }
  );
});

app.get("/edit/:filename", function (req, res) {
  fs.readFile(`./files/${req.params.filename}`, "utf-8", function (err, data) {
    if (err) return err;

    res.render("edit", { details: data, filename: req.params.filename });
  });
});
app.post("/update/:filename", (req, res) => {
  fs.writeFile(`./files/${req.params.filename}`, req.body.details, (err) => {
    if (err) return err;
    res.redirect("/");
  });
});

app.get("/delete/:filename", function (req, res) {
  fs.unlink(`./files/${req.params.filename}`, function (err) {
    if (err) return err;
    res.redirect("/");
  });
});

app.listen(3000);
