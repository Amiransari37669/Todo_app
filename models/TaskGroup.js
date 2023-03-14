const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskgroupSchema = new Schema({
    task_group: {
        type: String,
        required: true,
    },
    userId:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model("taskGroup", TaskgroupSchema);