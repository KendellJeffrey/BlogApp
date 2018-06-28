var bodyParser = require("body-parser"),
methodOverride = require("method-override"),
expressSanitizer = require("express-sanitizer"),
mongoose = require("mongoose"),
express = require("express"),
app = express();

// APP CONFIG
// mongoose.connect("mongodb://localhost/restful_blog_app");
mongoose.connect("mongodb://scriptgrendell:kendie11@ds121321.mlab.com:21321/restfulblog222");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String, 
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// RESTFUL ROUTES

// test create
// Blog.create ({
//     title: "test blog",
//     image: "https://www.theverge.com/2017/10/27/16561848/google-search-always-local-results-ignores-domain", 
//     body: "This is a blog post"
// });
app.get ("/", function(req, res){
    res.redirect("/blogs");
});
// Index route
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if (err){
            console.log("error");
        } else {
            res.render("index", {blogs: blogs});
        }
    });
});

// NEW ROUTE
app.get("/blogs/new", function(req, res) {
    res.render("new");
});

// CREATE ROUTE

app.post("/blogs", function(req, res){
    // create blog 
    req.body.blog.body = req.sanitize(req.body.blog.body)
    // Sanitized any html the user may try to run ^
    Blog.create(req.body.blog, function(err, newBlog){
        if (err){
            res.render("new");
        } else {
            // then redirect to the index
            res.redirect("/blogs");
        }
    });
});

// SHOW ROUTE
app.get("/blogs/:id", function(req, res) {
   Blog.findById(req.params.id, function(err, foundBlog){
       if(err){
           res.redirect("/blogs");
       } else {
           res.render("show", {blog: foundBlog});
       }
   })
});

// EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    })
});

// UPDATE ROUTE

app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body)
    // Sanitized any html the user may try to run ^ Upgrade with "middleware " later
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/"+req.params.id);
        }
    });
});

// DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
    // destroy blog
    Blog.findByIdAndRemove(req.params.id, function(err){
       if(err) {
           res.redirect("/blogs");
       } else {
           res.redirect("/blogs");
       }
    })
    // redirect blog
    // res.send("DESTROY ROUTE");
});




app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Blog server has started");
}); 