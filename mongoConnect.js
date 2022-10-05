const config = require('./config');
const mongoose = require('mongoose');


// Connection URL
module.exports = async function connection(){
    try {
        const connection_params = {
            useNewUrlParser : true,
            useUnifiedTopology: true,
        };
        await mongoose.connect(config.mongoUri, connection_params);
        console.log(`succesfully connected to the database`);
    } catch (error) {
        console.log(error);
        console.log('could not connect to the database');
    }
}

// Connection URL

