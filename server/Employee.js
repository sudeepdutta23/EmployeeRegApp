const mongoose = require('mongoose')

const EmployeeSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    picture: { type: String },
    salary: { type: String },
    position: { type: String }
}, { timestamps: true })

module.exports = mongoose.model("employee", EmployeeSchema)