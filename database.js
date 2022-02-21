
const mongoose = require('mongoose');

const server = 'localhost:27017'; // REPLACE WITH YOUR OWN DATABASE SERVER
const database = 'Login';


//Connecting with data base
mongoose.connect(`mongodb://${server}/${database}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,

}).then(() => {
    console.log('MongoDB connected!!');  //if connection is succefully stablished
}).catch(err => {
    console.log('Failed to connect to MongoDB', err);
});



// // creating our schema
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


module.exports = Employee;