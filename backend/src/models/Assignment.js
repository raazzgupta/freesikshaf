const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({

    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    },

    title: String,

    description: String,

    deadline: Date

});

module.exports = mongoose.model('Assignment', assignmentSchema);