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
    console.log(req.body.newTitle);
    const oldPath = `./public/files/${req.params.filename}`;
    const newTitle = req.body.newTitle ? req.body.newTitle.split(' ').join('') : null;
    const newPath = newTitle ? `./public/files/${newTitle}.txt` : oldPath;

    // Function to save the file content
    const saveFileContent = (path, content, callback) => {
        fs.writeFile(path, content, (err) => {
            if (err) {
                return res.status(500).send("Error saving file");
            }
            callback();
        });
    };

    // Rename the file if a new title is provided
    if (newTitle) {
        fs.rename(oldPath, newPath, (err) => {
            if (err) {
                return res.status(500).send("Error renaming file");
            }
            saveFileContent(newPath, req.body.content, () => {
                res.redirect(`/public/files/${newTitle}.txt`);
            });
        });
    } else {
        // If no renaming, just write the content to the existing file
        saveFileContent(oldPath, req.body.content, () => {
            res.redirect(`/public/files/${req.params.filename}`);
        });
    }
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});