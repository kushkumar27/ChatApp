

const express = require('express');
const path = require('path');
const http = require("http");
const hbs = require('hbs')
const app = express();
const body = require('body-parser');
app.set("view engine", 'hbs');

const mongoose = require('mongoose');

const { Server } = require("socket.io");
const server = http.createServer(app)
const io = new Server(server)


mongoose.connect(
    'mongodb+srv://kush123:kush123@cluster0.d0ytg.mongodb.net/Login?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,

}
).then(() => {
    console.log(" mongo Connected");
}).catch(err => {
    console.log(err);
});

const LoginSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,

    },
    Password: {
        type: String,
        required: true,

    },
    Email: {
        type: String,
        required: true,

    }
});


const Employee = mongoose.model('Employee', LoginSchema)

//         SOCKET IO
var users = {};
//when ever a  connection made ts fire a callback function
io.on('connection', socket => {
    console.log("connected");
    //when we deal with a particular connection
    socket.on('new-user-joined', name => {

        console.log(name);
        users[socket.id] = name; // store new useer as id in users as key and name as value

        socket.broadcast.emit('usre-joined', name); // jo joun kiya hai usko chor k sbko show krega user joined
    });

    socket.on('send', (message) => {
        // when some user send a message then start event 'send'
        socket.broadcast.emit('recieve', { message: message, name: users[socket.id] }); // shows every other user that message
    });


    socket.on('disconnect', () => {

        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    })

});
//        SOCKET IO ENDS
app.use(body.urlencoded({ extended: true }))


const { BlockList } = require('net');

const static_path = path.join(__dirname, '/public');
app.use(express.static(static_path));

app.post('/register', (req, res) => {
    console.log("request send", req.body);
    const Emp = new Employee({
        username: req.body.UserID,
        Password: req.body.pass,
        Email: req.body.email
    });

    Emp.save(function (err, done) {
        console.log(err, done);
        if (err) {
            if (err.message == `E11000 duplicate key error collection: Login.employees index: username_1 dup key: { username: "${req.body.UserID}" }`) {
                console.log("name already taken");
                res.render("index", { msg1: "User Name Already Taken", token: 101 });
            }

        }
        else {
            res.render("index", { msg: "registerd successfully", token: 505 });
        }
    })
})

app.post('/login', (req, res) => {
    Employee.findOne({ username: req.body.name }, function (error, found) {
        if (found) {
            if (found.Password == req.body.password) {

                console.log(found)
                res.render('chat', { name: found.username })
            }
            else {
                res.render("index", { msg: "Invalid Password", token: 202 });
            }
        }
        else {
            res.render("index", { msg: "User Not Found", token: 404 });

        }
    });
})

// requestin view folder indexedDB.hbs


app.get("/", (req, res) => {
    res.render("index");

});

const port = process.env.PORT || 8000;
server.listen(port, function () {
    console.log(`Example app listening on http://localhost:${port}`)
});
