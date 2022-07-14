const express = require('express');
var bodyParser = require('body-parser');
const route = require('./routes/route.js');
const app = express();
const multer = require('multer')


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer().any())

const mongoose = require('mongoose')

mongoose.connect("mongodb+srv://Abhishek0186:7SIIHhKFk1Vsyl1o@thoriumbackend.izyvo.mongodb.net/groupXDatabase?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true
})
    .then(() => console.log('mongodb connected'))
    .catch(err => console.log(err))

app.use('/', route);

app.listen(process.env.PORT || 5000, function() {
	console.log('Express app running on port ' + (process.env.PORT || 5000))
});
