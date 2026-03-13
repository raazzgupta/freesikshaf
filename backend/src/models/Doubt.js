const mongoose = require('mongoose');

const doubtSchema = new mongoose.Schema({

    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    },

    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    question: String,

    answer: String,

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('Doubt', doubtSchema);