// reading the env file..
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const encryption = require('mongoose-field-encryption').fieldEncryption;
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
const SecretSchema = mongoose.Schema({
    email : {
        type: String,
        required: true
    },

    password : {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});


SecretSchema.plugin(encryption, { 
    fields: ["password"], 
    secret: process.env.SECRET_KEY,
    saltGenerator: function (secret) {
      return "1234567890123456"; 
    },
  });



const SecretModel = mongoose.model('AppSecret', SecretSchema);


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



// define routes...

app.get('/', (req,res)=>{
    res.render('home');
})




// user routes...
app.get('/user/register', (req,res)=>{
    res.render('register');
})

app.get('/user/login', (req,res)=>{
    res.render('login');
});

app.get('/dashboard', (req,res)=>{
    res.render('dashboard');
});




app.post('/register', async(req,res)=>{
    const {email , password} = req.body;
    const data = await SecretModel.create({
        email: email,
        password:password
    });

    await data.save();

    res.redirect(302, '/dashboard');
});


app.post('/login', async(req,res)=>{
    
    const {email , password} = req.body;

    const docs = await SecretModel.findOne({email : email});

    try {
        docs.decryptFieldsSync();
        // decrypt all the enc fields...
    } catch (error) {
            console.error(error)
    }

    if(docs){
        if(docs.password === password){
            res.redirect(302, '/dashboard');
        }else{
           res.send('Invalid Credentials!') 
        }
        
    }

})


// listen to this port...
app.listen(PORT, ()=>{
    console.log('app is running on port',PORT);
});