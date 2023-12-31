const createError = require("http-errors");
const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const APIRouter = require("./routes/api");
const authRouter = require("./routes/auth");
const adminRouter = require("./routes/admin");
const mainRouter = require("./routes/main");
require("dotenv").config();
const session = require("express-session");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000, secure: false },
  })
);
app.use(cors());
app.use("/api", APIRouter);
app.use("/auth", authRouter);
app.use("/admin", (req, res, next) => {
  if (!req.session.SchoolID) return res.redirect("/auth")
  next()
}, adminRouter);

app.use("/", mainRouter);

// catch 404 and forward to error handler

app.all("*", (req, res) => {
  res.status(404).render("error");
});

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error",{status: err.status, message: err.message});
});

module.exports = app;
