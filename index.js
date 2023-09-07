const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;

const app = express();

app.use(express.json());

app.use("/assets", express.static("assets"));
app.use(cors());

// auth routes
const registerRouter = require("./routes/auth/register");
app.use("/register", registerRouter);
const loginRouter = require("./routes/auth/login");
app.use("/login", loginRouter);
// profile
const profileRouter = require("./routes/auth/profile");
app.use("/profile", profileRouter);
//course routes
const courseRouter = require("./routes/admin/course");
app.use("/course", courseRouter);
//lesson routes
const lessonRouter = require("./routes/admin/lesson");
app.use("/lesson", lessonRouter);
//review routes
const reviewRouter = require("./routes/user/review");
app.use("/review", reviewRouter);
//review routes
const studentRouter = require("./routes/user/course");
app.use("/student", studentRouter);

mongoose.connect(DB_URL);
// server connection
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
