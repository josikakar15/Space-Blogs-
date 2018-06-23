var express=require('express'),
bodyParser=require('body-parser'),
expressSanitizer=require('express-sanitizer'),
methodOverride=require('method-override'),
mongoose=require('mongoose'),
app=express();


// APP CONFIG
app.set("view engine","ejs");
mongoose.connect("mongodb://localhost/restful_blog_app");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));


// MONGOOSE CONFIG
var blogSchema=mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date ,default:Date.now()}
    
});
var Blog=mongoose.model("Blog",blogSchema);
//LANDING
app.get("/",function(req,res){
    res.redirect("/index");
})
//INDEX
app.get("/index",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        }else{
            res.render("index",{blogs:blogs});
        }
    });
});
//NEW
app.get("/index/new",function(req,res){
    res.render("new");
});

//CREATE
app.post("/index",function(req,res){
    req.body.blog.body=req.sanitize( req.body.blog.body);
    Blog.create(req.body.blog,function(err,newblog){
        if(err){
            res.render("new");
        }else{
            res.redirect('/index');
        }
    });
});
//SHOW
app.get("/index/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/index");
        }else{
            res.render("show",{blog:foundBlog});
        }
    });
});

//EDIT
app.get("/index/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/index");
        }else{
            res.render("edit",{blog:foundBlog});
        }
    });
});
//UPDATE
app.put("/index/:id",function(req,res){
    req.body.blog.body=req.sanitize( req.body.blog.body);
   Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
       if(err){
           res.redirect("/index");
       }else{
           res.redirect("/index/"+ req.params.id);
       }
   });
});

//DESTROY

app.delete("/index/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/index");
        }else{
            res.redirect("/index");
        }
    })
});



app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Server started");
});