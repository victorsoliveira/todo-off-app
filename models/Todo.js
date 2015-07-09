/**
 * Created by victor on 08/07/15.
 */

var mongoose    = require('mongoose');
var uuid        = require('node-uuid');
var Schema      = mongoose.Schema;

var TodoSchema = new Schema({
    id      : { type: String, default: uuid.v4 },
    text    : { type: String, required: true },
    insertedDate : { type: Date, default: new Date() },
    modifiedDate : { type: Date, default: new Date() }
});

module.exports = mongoose.model('Todo', TodoSchema);