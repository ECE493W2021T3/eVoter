const mongoose = require('mongoose');
const config = require('config');

module.exports = function() {
    mongoose.Promise = global.Promise;
    mongoose.connect(config.get('db'), { useNewUrlParser: true }).then(() => {
        console.log(`Connected to ${config.get('db')} successfully :)`);
    }).catch((e) => {
        console.log("Error while attempting to connect to MongoDB");
        console.log(e);
    });
    
    // To prevent deprectation warnings (from MongoDB native driver)
    mongoose.set('useCreateIndex', true);
    mongoose.set('useFindAndModify', false);
}
