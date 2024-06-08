const express = require("express");
const app = express();

const path =  require("path");
const fs = require("fs");
require('dotenv').config()

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded( { extended: true } ));
app.use(express.static(path.join(__dirname + "/public")));

app.get("/", (req, res) => {
    fs.readdir(`./public/files`, (err, files) =>{
    res.render("index", { files: files });
    })
}); 

app.post("/save", (req, res) => {
    fs.writeFile(`./public/files/${req.body.title.split(' ').join('')}.txt`, req.body.details, (err) => {
        res.redirect("/"); 
    })
}); 

app.get("/public/files/:filename", (req, res) => {
    fs.readFile(`./public/files/${req.params.filename}`, "utf-8", (err, data) => {
        if (err) {
            return res.status(404).send("File not found");
        }
        res.render("show", { filename: req.params.filename, data });
    });
}); 

app.get("/edit/:filename", (req, res) => {
    fs.readFile(`./public/files/${req.params.filename}`, "utf-8", (err, data) => {
        if (err) {
            return res.status(404).send("File not found");
        }
        res.render("edit", { filename: req.params.filename, data });
    });
}); 

app.post("/save/:filename", (req, res) => {
    const filepath = `./public/files/${req.params.filename}`;
    fs.writeFile(filepath, req.body.content, (err) => {
        if (err) {
            return res.status(500).send("Error saving file");
        }
        res.redirect(`/public/files/${req.params.filename}`);
    });
});

app.post("/edit", (req, res) => {
    fs.rename( `./public/files/${req.body.title}` , `./public/files/${req.body.newTitle}`, (err) => {
        res.redirect("/");
        console.log("Renamed");
    });
}); 

app.post("/rename/:filename", (req, res) => {
    const oldPath = `./public/files/${req.params.filename}`;
    const newPath = `./public/files/${req.body.newTitle.split(' ').join('')}.txt`;
    fs.rename(oldPath, newPath, (err) => {
        if (err) {
            return res.status(500).send("Error renaming file");
        }
        res.redirect("/");
    });
});

app.get("/delete/:filename", (req, res) => {
    fs.unlink(`./public/files/${req.params.filename}`, (err) => {
        res.redirect("/");
      });
}); 

app.listen(process.env.PORT, () => {
    console.log("Server chl ria hai", process.env.PORT);
});