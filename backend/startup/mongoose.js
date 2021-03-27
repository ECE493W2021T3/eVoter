const mongoose = require('mongoose');

module.exports = function() {
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost:27017/eVoter', { useNewUrlParser: true }).then(() => {
        console.log("Connected to MongoDB successfully :)");
    }).catch((e) => {
        console.log("Error while attempting to connect to MongoDB");
        console.log(e);
    });
    
    // To prevent deprectation warnings (from MongoDB native driver)
    mongoose.set('useCreateIndex', true);
    mongoose.set('useFindAndModify', false);
}
