const express = require("express");
const bodyParser = require("body-parser");
//const ejs = require("ejs");
const mongoose = require("mongoose"); //mongoose
const _ =require("lodash"); //Lodash

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//mongoose start
mongoose.connect("mongodb://127.0.0.1:27017/blogwebsiteDB")

//defines a schema for mongoose called postsSchema
const postsSchema = new mongoose.Schema({
  title:String,
  post:String
});

//creates a Mongoose model called "Post" using the previously defined "postsSchema"
const Post = mongoose.model("Post", postsSchema);


app.get('/', function(req,res){
  Post.find()
  .then((results)=>{
    res.render('home',{
      startingContent: homeStartingContent,results, 
      composeItems:results //composeItems are the results from the Post.find() method. Those results are added in to the foreach loop in the home.ejs file. In the home.ejs file those results gets as item and <a href="/posts/<%= item._id %>"> in this code gets the item id.
    });
  })
  .catch((err)=>{
    console.error(err);
  });
  
});

app.get('/about', function(req,res){
  res.render('about',{aboutContent: aboutContent});
});

app.get('/contact', function(req,res){
  res.render('contact',{contactContent: contactContent});
});

app.get('/compose', function(req,res){
  res.render('compose');
});


app.post('/compose', function(req,res){

  postTitle= req.body.text;
  postPost= req.body.textArea;

  //creating new instance of the Mongoose model "Post" and assigns it to a constant called "post"
  const post = new Post({
    title:postTitle,
    post:postPost
  });

  //save it to the database
  post.save();

  //redirect to the home page
  res.redirect('/');
});

// app.get('/posts/:text', function(req,res){
//   const requestedTitle = _.lowerCase(req.params.text);
//   composeItems.forEach(function(composeItem){
//     const storedTitle=_.lowerCase(composeItem.title);
//     if(storedTitle===requestedTitle){
//       res.render('post',{
//         requestedTitle: composeItem.title, 
//         requestedBody:composeItem.post
//       });
//     }
//   });
  
  
// });

app.get('/posts/:postId', function(req,res){
  const requestedPostId = req.params.postId; //req.params.postId is a property of the req object in the Express.js framework. It is used to extract the value of a URL parameter named "postId" from the requested URL.
  Post.findOne({_id:requestedPostId})
  .then((posts)=>{
    res.render('post',{
      requestedTitle: posts.title, // assigned the title which is created in the compose view, to the requestedTitle property
      requestedBody:posts.post // assigned the post which is created in the compose view, to the requestedBody property
    });
  })
  .catch((err)=>{
    console.error(err);
  });
});
 

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
