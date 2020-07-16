const express       = require('express');
const app           = express();
const bodyParser    = require('body-parser');
const dynamoose     = require("dynamoose");
const cors          = require('cors');
const config        = require('./aws.js');
const PORT = process.env.PORT || 4001;

const busSchema = new dynamoose.Schema({
    "busName": String,
    "busAddress": String,
    "busEmail": String,
    "busTel": {
        "type": String,
        "required": false
    }
}, {
    "timestamps": true
});

const Business = dynamoose.model(
    "Business",
     busSchema,
    {"create": false});

dynamoose.aws.ddb.set(config);

// const business = new Business({
//     "busName": "XYZ LLC",
//     "busAddress": "456 Maplegrove ST Yourtown, NY 11456",
//     "busEmail": "xyzllc@gmail.com",
//     "busTel": "347-777-5656"
// });
//
// business.save();

Business.scan().exec().then((bus) => {
    console.log(bus.map(B=>B.busEmail));
});

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// app.listen(PORT, () => {
//     console.log(`Server is running on Port: ${PORT}`);
// });
