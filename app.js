const express = require("express");
const app = express();

const path =  require("path");
const fs = require("fs");
const { log } = require("console");
const { monitorEventLoopDelay } = require("perf_hooks");

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
       res.render("show", { filename: req.params.filename, data });
    });
}); 

app.get("/edit/:filename", (req, res, data) => {
    res.render("edit", { filename: req.params.filename, data });
}); 

app.post("/edit", (req, res) => {
    fs.rename( `./public/files/${req.body.title}` , `./public/files/${req.body.newTitle}`, (err) => {
        res.redirect("/");
        console.log("Renamed");
    });
}); 

app.get("/delete/:filename", (req, res) => {
    fs.unlink(`./public/files/${req.params.filename}`, (err) => {
        res.redirect("/");
      });
}); 

app.listen(3000, () => {
    console.log("Server chl ria hai");
});