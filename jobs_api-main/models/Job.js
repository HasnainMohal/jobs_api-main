const { text } = require('express')
const mongooes = require('mongoose')

const JobSchema = new mongooes.Schema({
    company: {
        type: String,
        required: [true, 'Please Provide Company Name'],
        maxlength: 50
    },
    position: {
        type: String,
        required: [true, 'Please Provide Position Name'],
        maxlength: 100
    },
    status: {
        type: String,
        enum: ['interview', 'declined', 'pending'],
        default: 'pending'
    },
    description: {
        type: String,
        required: [true, 'Please Provide Descrption Name'],
        maxlength: 1000
    },
    createdBy: {
        type: mongooes.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please Provide User'],
    }
}, { timestamps: true })


module.exports = mongooes.model('Job', JobSchema)