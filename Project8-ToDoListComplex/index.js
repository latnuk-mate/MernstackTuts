// reading the env file..
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const Path = require('path');
const PORT = process.env.PORT || 4000;


// init the template engine...
app.set('views', 'views');
app.set('view engine', 'ejs');

// serving static files...
app.use(express.static(Path.join(__dirname, "public")));

// parsing body data...
app.use(express.urlencoded({extended: false}));



// create a new Model/Schema for the App
const ToDoSchema = mongoose.Schema({
    task : {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const ToDoModel = mongoose.model('TutsTodo', ToDoSchema);

// setting up the database connection...
const connection = async()=>{
    try {
        const db = await mongoose.connect(process.env.MONGO_URI, { 
            useUnifiedTopology : true,
    });
    console.log("database is connected...")
    } catch (error) {
        console.error(error.message)
    }
}

connection(); // init the database...

// routes for the app..

app.get('/', async(req,res)=>{
    const tasks = await ToDoModel.find({});
    res.render('index' , {tasks : tasks});
});


app.post('/task/create', async(req,res)=>{
    const {task} = req.body;

    // create a document..
    const ModelTask = await ToDoModel.create({
        task : task,
        createdAt: new Date()
    });

    await ModelTask.save(); //save it..

    res.redirect(302, "/");

});


app.get('/task/delete/:id', async(req,res)=>{
    const {id} = req.params;
    try {
        await ToDoModel.findByIdAndDelete(id);
        res.redirect(302, '/');
    } catch (error) {
            console.error(error.code);
    }
});



// listen to this port...
app.listen(PORT, ()=>{
    console.log('app is running on port',PORT);
});