var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const cors = require("cors")

var logger = require('morgan');
var mongoose = require('mongoose');
require('dotenv').config()

const routerUsers = require('./routes/Event.route');
const routerrelease = require('./routes/Release.route');
const passport = require("passport");

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log('connected to buildlab`'))
.catch(err=>console.log(err.message))


if (process.env.NODE_ENV === "production") {
    console.log("app in production mode");
    app.use(express.static("client/build"));
    app.get("/*", function (req, res) {
        res.sendFile(
            path.join(__dir, "client", "build", "index.html"),
            function (err) {
                if (err) res.status(500).send(err);
            }
        );
    });
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());


app.use('/api', routerUsers)
app.use('/api', routerrelease)

/////////////////

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

//const passport = require("./passport");
const authRoute = require("./routes/auth");
const cookieSession = require("cookie-session");
const passportStrategy = require("./passport");
const Users = require('./models/userSchema');
const contributor = require('./models/contributorSchema');
const authenticate = require('./middleware/authenticate')
app.use(cookieParser());

app.use(
	cookieSession({
		name: "session",
		keys: ["Build-Lab"],
		maxAge: 24 * 60 * 60 * 100,
	})
);

app.use(passport.initialize());
app.use(passport.session())

app.use(passport.initialize());
app.use(passport.session());

app.use(
	cors({
		origin: "http://localhost:3700",
		methods: "GET,POST,PUT,DELETE",
		credentials: true,
	})
);

app.use("/auth", authRoute);



// Registration
app.post('/register', async (req, res)=>{
    try {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;

        const createUser = new Users({
            username : username,
            email : email,
            password : password
        });

        const created = await createUser.save();
        console.log(created);
        res.status(200).send("Registered");

    } catch (error) {
        res.status(400).send(error)
    }
})

// Login User
app.post('/login', async (req, res)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;

        // Find User if Exist
        const user = await Users.findOne({email : email});
        if(user){
            // Verify Password
            const isMatch = await bcryptjs.compare(password, user.password);

            if(isMatch){
                // Generate Token Which is Define in User Schema
                const token = await user.generateToken();
                res.cookie("jwt", token, {
                    // Expires Token in 24 Hours
                    expires : new Date(Date.now() + 86400000),
                    httpOnly : true
                })
                res.status(200).send("LoggedIn")
            }else{
                res.status(400).send("Invalid Credentials");
            }
        }else{
            res.status(400).send("Invalid Credentials");
        }

    } catch (error) {
        res.status(400).send(error);
    }
})

// Logout Page
app.get('/logout', (req, res)=>{
    res.clearCookie("jwt", {path : '/'})
    res.status(200).send("User Logged Out")
})

// Authentication
app.get('/auth', authenticate, (req, res)=>{

})


app.post('/upload', upload.single('apk'), (req, res) => {
    if (!req.file) {
      return res.status(400).send('No files were uploaded.');
    }
  
    // Create a new File object using the uploaded file details
    const file = new File({
      name: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      path: req.file.path,
    });
  
    // Save the file object to the database
    file.save((err) => {
      if (err) {
        return res.status(500).send('Error saving file to database.');
      }
  
      res.send('File uploaded and saved to database!');
    });
  });






// app.listen(port, () => {
//     console.log(`Server running at http://localhost:${port}/`);
// });










module.exports = app;
