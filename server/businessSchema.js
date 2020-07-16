const dynamoose = require("dynamoose");

const busSchema = new dynamoose.Schema({
    "busName": String,
    "busAddress": String,
    "busEmail": String,
    "busTel": String
}, {
    "timestamps": true
});

module.exports = busSchema;
