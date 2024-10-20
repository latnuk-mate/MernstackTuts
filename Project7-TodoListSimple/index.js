const express = require('express');
const app = express();
const Path = require('path');
const shortId = require('shortid');
const PORT = 4000;

// temporary storage...
let tasks = [];


// init the template engine...
app.set('views', 'views');
app.set('view engine', 'ejs');

// serving static files...
app.use(express.static(Path.join(__dirname, "public")));

// parsing body data...
app.use(express.urlencoded({extended: false}));



// route for app, for a temporary storage..


app.get('/', (req,res)=>{
    res.render('index' , {tasks});
});



app.post('/task/create', async(req,res)=>{
    const {task} = req.body;
    
    const data = {
        id:shortId.generate(),
        text:task
    }

    tasks.push(data);

    res.redirect(302, "/");

});


app.get('/task/delete/:id', (req,res)=>{
    const {id} = req.params;
    // modify the list..
    const data = tasks.filter(item => item.id !== id);
    tasks = data;
    res.redirect('/')
})



// listen to this port...
app.listen(PORT, ()=>{
    console.log('app is running on port',PORT);
})