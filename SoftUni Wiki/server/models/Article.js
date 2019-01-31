const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: {type: mongoose.SchemaTypes.String, required:[true, 'Article must have title']},
    lockedStatus: {type: mongoose.SchemaTypes.Boolean, default: false},
    edits: [{type: mongoose.SchemaTypes.ObjectId, ref: 'Edit'}]
});

module.exports = mongoose.model('Article', articleSchema);