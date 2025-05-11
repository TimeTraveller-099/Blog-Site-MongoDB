const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");

const Blog = require("./models/Blog");

const app = express();

require("dotenv").config();

// Connect to mongoDB Atlas
// midoria - username
// midoria1234 - password

const dbURI = process.env.MONGO_URI;

// Connecting to the mongoDB Atlas using 'mongoose'
mongoose
  .connect(dbURI)
  .then((result) => {
    console.log("Connected to DB");
    console.log("listening to port http://localhost:3000");

    app.listen(process.env.PORT || 3000);
  })
  .catch((err) => console.log(err));

// Whenever I render a view, use EJS as the templating engine.
app.set("view engine", "ejs");

// Make the 'public' folder public.
app.use(express.static("public"));

// Using 'morgan' to log request details.
app.use(morgan("dev"));

// This is a middleware function that parses incoming requests with URL-encoded payloads, which is the default format for form submissions.
app.use(express.urlencoded({ extended: true }));

/* ---------- Route Handlers ---------- */
app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

/* ------ Blog Routes ------ */
// Post a Blog
app.post("/blogs", (req, res) => {
  const blog = new Blog(req.body);
  blog.save().then((result) => {
    res.redirect("/");
  });
});

// Render all the Blogs
app.get("/blogs", (req, res) => {
  Blog.find()
    .sort({ createdAt: -1 }) // Newest at the Top
    .then((result) =>
      res.render("index", { title: "All Blogs", blogs: result })
    )
    .catch((err) => console.log(err));
});

// Create a blog
app.get("/blogs/create", (req, res) => {
  try {
    res.render("createBlog", { title: "Create a new blog" });
  } catch (err) {
    console.log("Render error:", err);
    res.send("Something went wrong.");
  }
});

// Single Blog Page
app.get("/blogs/:id", (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .then((result) => {
      res.render("blogDetails", { blog: result, title: "Blog Details" });
    })
    .catch((err) => res.render("404", { title: "Blog not Found" }));
});

// Deleting a Blog
app.delete("/blogs/:id", (req, res) => {
  Blog.findByIdAndDelete(req.params.id)
    .then(() => {
      res.json({ redirect: "/blogs" });
    }) // We cannot redirect here
    .catch((err) => console.log(err));
});

// If none of the routes match
app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});
