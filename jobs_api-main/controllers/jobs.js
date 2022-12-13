const Job = require('../models/Job')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const createJob = async (req, res) => {
    //??? req.user.userId
    req.body.createdBy = req.user.userId
    console.log(req.body)
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({ job })
}

const getAllJobsP = async (req, res) => {
    const jobs = await Job.find().sort('createdAt')
    res.status(StatusCodes.OK).json({ jobs, count: jobs.length })
}

const getAllJobs = async (req, res) => {
    const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt')
    res.status(StatusCodes.OK).json({ jobs, count: jobs.length })
}

const getJob = async (req, res) => {
    const {
        user: { userId },
        params: { id: jobId }
    } = req
    const job = await Job.findOne({
        _id: jobId,
        createdBy: userId
    })
    if (!job) {
        throw new NotFoundError(`No Job With Id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({ job })
}

const updateJobs = async (req, res) => {
    const {
        body: { company, position },
        user: { userId },
        params: { id: jobId }
    } = req
    if (company === '' || position === '') {
        throw new BadRequestError('Company or Position Cannot be Empty')
    }
    const job = await Job.findOneAndUpdate({
        _id: jobId,
        createdBy: userId  
    },
    req.body,
    {new:true,runValidators:true}
    )
    if (!job) {
        throw new NotFoundError(`No Job With Id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({ job })
}

const deleteJobs = async (req, res) => {
    const {
        user: { userId },
        params: { id: jobId }
    } = req
    const job = await Job.findOneAndRemove({
        _id: jobId,
        createdBy: userId
    })
    if (!job) {
        throw new NotFoundError(`No Job With Id ${jobId}`)
    }
    res.status(StatusCodes.OK).send()
}

module.exports = {
    deleteJobs,
    getAllJobs,
    getJob,
    updateJobs,
    createJob,
    getAllJobsP
}