/**
 * Created by victor on 08/07/15.
 */

var mongoose = require('mongoose');

module.exports = function() {

    mongoose.connect('mongodb://localhost/todos');

    var conn = mongoose.connection;

    conn.on('error', function(callback){
        console.error('MongoDB connection failed!');
    });

    conn.once('open', function (callback) {
        console.info('MongoDB connected...');
    });

};
