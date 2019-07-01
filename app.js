//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');


//mongoose.connect('mongodb://localhost:27017/fruitsDB', {useNewUrlParser: true}); // local
mongoose.connect('mongodb+srv://user_admin_dm:dm1234@cluster0-pwze8.mongodb.net/fruitsDB', {useNewUrlParser: true});

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));  
app.set('view engine', 'ejs');


const fruitSchema = new mongoose.Schema({
    name: String,
    rating: Number,
    review: String
});

const Fruit = mongoose.model("Fruit", fruitSchema);

    



const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


const posts = [];

//-----------------------------

app.get('/', (req, res) => {
    console.log("---------- / ------------");
    
    var fruitsA;
    
    Fruit.find(function(err, fruits){
        if(err){
            console.log("error = " + fruits);
        }else{
            fruits.forEach(function(fruit){
            console.log("Fruit: " + fruit.name + ", id "+ fruit._id); 
       })  
            
    res.render('home', {contentHome: homeStartingContent, postsList: posts, fruitList: fruits });    
//       fruits.forEach(function(fruit){
//       console.log("Fruit: " + fruit.name + ", id "+ fruit._id); 
//          })        
        }
    });
 
    });



app.get('/home', (req, res) => {
     res.render('home', { contentHome: homeStartingContent });
//    redirect.
    });


 
app.get('/about', (req, res) => {
     res.render('about', {aboutText: aboutContent});
    });
 

app.get('/contact', (req, res) => {
     res.render('contact', {contactText: contactContent});
    });

app.get('/admin', (req, res) => {
     res.render('admin', {contactText: contactContent});
    });




// post
app.post('/admin', (req, res) => {
    console.log("----------  Admin Post ------------");
//    console.log(req.body.postTitle);
//    console.log(req.body.postBody);
    
    const post = {title: req.body.postTitle,
               body: req.body.postBody
              };
    
//    console.log("obj = " + post);

        posts.push(post);
        console.log("posts.length = " + posts.length);
        console.log("posts = " + posts);
    
   const fruit = new Fruit ({
        name: post.title,
        rating: 1,
        review: post.body
   });
  
fruit.save().then(() => console.log('fruit is saved!!'));
    
        res.redirect("admin");
    
     }
 );


app.get('/news/:topic', (req, res) => {
      console.log("topic = " + req.params.topic);
    
    let x = req.params.topic;
    
     for(var i = 0; i<posts.length; i++){
         console.log(i + " - " + posts[i].title);
         if(posts[i].title === x){
             console.log(x + " - true!!")
         } 
     }
     console.log( "Finish")
    
   });




app.get('/update/:id/:name', (req, res) => {
    
      console.log("ttttttttt = " );
      console.log("id = " + req.params.id);
    
      let id = req.params.id;
      let nameNew = req.params.name;
    
    Fruit.updateOne({_id: id}, {name: nameNew}, function(err){
        if(err){
            console.log(err);
        }else{
             console.log("fruit #"+id + "is changed!");
        }
    });
    
//     for(var i = 0; i<posts.length; i++){
//         console.log(i + " - " + posts[i].title);
//         if(posts[i].title === x){
//             console.log(x + " - true!!")
//         } 
//     }
     console.log( "New is finished!")
    
   });


app.get('/delete/:name', (req, res) => {
   const nameForDel = req.params.name;
    
   Fruit.deleteOne({name: nameForDel}, function(err){
      
   if(err){
      console.log(err);
   }else{
      console.log("fruit is deleted!");
   }
     });
    
});

app.get('/deleteMany/:name', (req, res) => {
   const nameForDel = req.params.name;
    
   Fruit.deleteMany({name: nameForDel}, function(err){
      
   if(err){
      console.log(err);
   }else{
      console.log("fruits is deleted!");
   }
     });
    
});


let port = process.env.PORT;
if (port == null || port == "") {
port = 5000;
}
//app.listen(port);

app.listen(port, function() {
  console.log("Server started on port " + port);
});
