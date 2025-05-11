const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");

const Blog = require("./models/Blog");

const app = express();

// Connect to mongoDB Atlas
// midoria - username
// midoria1234 - password
const dbURI =
  "mongodb+srv://midoria:midoria1234@cluster0.6sxuwa3.mongodb.net/node-raman?retryWrites=true&w=majority&appName=Cluster0";

// Connecting to the mongoDB Atlas using 'mongoose'
mongoose
  .connect(dbURI)
  .then((result) => {
    console.log("Connected to DB");
    console.log("listening to port http://localhost:3000");

    app.listen(3000);
  })
  .catch((err) => console.log(err));

// Whenever I render a view, use EJS as the templating engine.
app.set("view engine", "ejs");

// Make the 'public' folder public.
app.use(express.static("public"));
// Using 'morgan' to log request details.
app.use(morgan("dev"));

// Sandbox Routes
app.get("/add-blog", (req, res) => {
  // const blog = new Blog({
  //   title: "One Piece: The Timeless Tale of Pirates, Dreams, and the Sea",
  //   snippet:
  //     "Dive into the epic world of One Piece, where a rubber-bodied boy with an unbreakable spirit sails across oceans chasing the ultimate treasure. It’s not just an anime—it’s a journey through legacy, friendship, and freedom.",
  // });
  const blog = new Blog({
    title:
      "Demon Slayer: Beauty, Bloodshed, and the Bonds That Burn Brighter Than Fire",
    snippet:
      "A tale of blades, demons, and unwavering resolve—Demon Slayer is a stunning anime that blends jaw-dropping animation with heart-wrenching emotion. Follow Tanjiro as he fights to save what’s left of his family and his humanity.",
  });

  blog
    .save()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => console.log(err));
});

app.get("/all-blogs", (req, res) => {
  Blog.find()
    .then((result) => res.send(result))
    .catch((err) => console.log(err));
});

app.get("/single-blog", (req, res) => {
  Blog.findById("682043f4617f258fce12d8d5")
    .then((result) => res.send(result))
    .catch((err) => console.log(err));
});

// -------------------------------------------
// -------------------------------------------
// -------------------------------------------
// -------------------------------------------

app.get("/", (req, res) => {
  const blogs = [
    { title: "All Might", snippet: "Inherited 'One For All'." },
    {
      title: "Eraser Head",
      snippet: "Can erase Quirks of anyone he can see physically.",
    },
    {
      title: "Izuku Midoria",
      snippet:
        "Inherited 'One For All' from All Might. Also the biggest 'All Might' fan.",
    },
    {
      title: "Naruto",
      snippet: "The Hokage of the Konoha Village.",
    },
    {
      title: "Itachi Uchiha",
      snippet: "Annhilated his entire clan for the future of his village.",
    },
  ];

  res.render("index", { title: "Home", blogs });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

app.get("/blogs/create", (req, res) => {
  res.render("createBlog", { title: "Create a new blog" });
});

// If none of the routes match
app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});
