const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app=express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

mongoose.connect("mongodb://0.0.0.0:27017/wikiDB");

const wikiSchema = {
  title:String,
  content:String
};
const Article = mongoose.model("Article", wikiSchema);


//-----------------------------------Request targetting All articlies----------------------------//
// chaning the methods using the route() methods
app.route("/articles")

.get(function(req,res){
  Article.find({},function(err,article){
    // res.render("home",{articles:article});
    if(!err)
    res.send(article);
    else
    res.send(err);
  });
})


.post(function(req,res){
   // console.log(req.body.title);
   // console.log(req.body.content);

   const newArticle = new Article({
     title:req.body.title,
     content:req.body.content
   });
   newArticle.save((err)=>{
     if(!err)
     console.log("everyThing went swimmingly");
     else
     console.log(err);
   });
})

.delete(function(req,res){  //when user send delete request <- this is how server will response
    Article.deleteMany((err)=>{  //model.deleteMany({codition} fun(err)){} // this will delete all the document if conditions are not given
      if(!err)
      res.send("successfully deleted all the articles");
      else
      res.send(err);
    });
});

//-----------------------------------Request targetting Specific articlies----------------------------//



app.route("/articles/:articlesTitle")   //urlencoding -> for space- %20, #- %21 for more head over to https://www.w3schools.com/tags/ref_urlencode.ASP
                                        //we are using in chrome search box - to give space - ex: jack%20bauer  which is equal to jack bauer
.get((req,res)=>{   //D: req.params converts %20 to space and find.
  Article.findOne({title:req.params.articlesTitle},function(err,articleFound){
    if(articleFound)
    res.send(articleFound);
    else
    res.send("Article Not Found");
  });
})
 //note using  postman to send all the request , not through html or ejs page
.put((req,res)=>{
   Article.updateOne(                    // mongoose update method takes- model.update({condition},{update},{overWrite:ture}, function(err){});
     {title:req.params.articlesTitle},                                                //by default mongoose prevent overWrite so, we have to write , if we are using mongoDB then default is true there.
     {title:req.body.title, content:req.body.content},
     {overwrite: true},  //if we didnt write then it will update it what we send and keep the other key value in the document
      function(err){
        if(!err)
        res.send("successfully updated");
      });
})

.patch(function(req,res){
  Article.updateOne(
    {title: req.params.articlesTitle},
    {$set:req.body},  //here req.body will find automaticly what user send for update , take and update that value and keep remaining as it is
    function(err){
      if(!err)
      res.send("successfully updated patch value");
    }
  );
})

.delete(function(req,res){
  Article.deleteOne({title:req.params.articlesTitle}, function(err){
    if(!err){
      res.send("deleted");
    }
  });
});



app.listen("3000", ()=>{
  console.log("server is running");
});



























/*
app.get("/articles",function(req,res){
  Article.find({},function(err,article){
    // res.render("home",{articles:article});
    if(!err)
    res.send(article);
    else
    res.send(err);
  });
});


app.post("/articles", function(req,res){
   // console.log(req.body.title);
   // console.log(req.body.content);

   const newArticle = new Article({
     title:req.body.title,
     content:req.body.content
   });
   newArticle.save((err)=>{
     if(!err)
     console.log("everyThing went swimmingly");
     else
     console.log(err);
   });
});


app.delete("/articles", function(req,res){  //when user send delete request <- this is how server will response
    Article.deleteMany((err)=>{  //model.deleteMany({codition} fun(err)){} // this will delete all the document if conditions are not given
      if(!err)
      res.send("successfully deleted all the articles");
      else
      res.send(err);
    });
});

*/
