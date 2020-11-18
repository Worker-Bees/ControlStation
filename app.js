const express = require("express");
const multer = require("multer");
const path = require("path");
const Video = require("./models/video");

app = express();
let http = require("http").Server(app);
let io = require("socket.io")(http);

let storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function(req, file, cb) {
    cb(null, "video-" + Date.now() + path.extname(file.originalname));
  }
});

// Init upload
let upload = multer({
  storage: storage
});

app.use(express.static("./public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/livestream", (req, res) => {
  res.render("livestream");
});

app.get("/videos", (req, res) => {
  Video.find((err, videos) => {
    if (err) console.log(err);
    else {
      console.log(videos);
      res.render("video", { videos: videos });
    }
  });
});


io.on("connection", function(socket) {
  console.log("a user connected");
  socket.on("image", data => {
    io.emit("encoded_image", data);
  });
});

http.listen(8000, () => {
  console.log("The server has started");
});
