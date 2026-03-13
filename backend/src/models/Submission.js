const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({

    assignmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assignment"
    },

    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    fileUrl: String,

    marks: Number

});

module.exports = mongoose.model('Submission', submissionSchema);