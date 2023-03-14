const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let SubtaskSchema = new Schema({
    task: {
        type: String,
        required: true
    },
    task_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'taskGroup'
    },
    created_At: {
        type: Date, default: Date.now
    },
    due_date: {
        type: Date
    },
    task_status: {
        type: Number,
        default: 0
    },
    userId: {
        type: String,
        required: true
    }


})

module.exports = mongoose.model("task", SubtaskSchema);