const express = require("express");
const multer = require("multer");
const path = require('path');

//File upload folder
const UPLOADS_FOLDER = "./uploads/";

//define storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_FOLDER);
  },
  fileName: (req, file, cb) => {
    //important file.pdf => important-file-3445202234.pdf
    const fileExt = path.extname(file.orginalname);
    const fileName = file.orginalname.replace(fileExt, "").toLowerCase().split(" ").join("-") + "-" + Date.now();
    cb(null, fileName + fileExt);
  }
})

//Prepare the final multer upload object
var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000, //1mb
  },
  fileFilter: (req, file, cb) => {
    // console.log(file);
    if (file.fileName === "avatar") {
      if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
      ) {
        cb(null, true);
      } else {
        cb(new Error("Only .jpg, .png, .jpeg format allowed!"))
      }
    } else if (file.fileName === "doc") {
      if (file.mimetype === "application/pdf") {
        cb(null, true);
      } else {
        cb(new Error("Only .pdf format allowed!"))
      }
    } else {
      cb(new Error("Unknown Error!"))
    }
  },
});

const app = express();

//application route
// app.post("/", upload.single("avatar"), (req, res) => {
//   res.send('hello');
// });

app.post("/", upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "doc", maxCount: 1 },
]), (req, res) => {
  console.log(req.files);
  res.send('Files uploaded in server');
});

//default error handler
app.use((err, req, res, next) => {
  if (err) {
    if (err instanceof multer.MulterError) {
      res.status(500).send("There was an upload error!");
    } else {
      res.status(500).send(err.message);
    }
  } else {
    res.send("success")
  }
});

app.listen(3000, () => {
  console.log('listening on port 3000');
});
