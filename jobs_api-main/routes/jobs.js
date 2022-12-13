const express = require('express')
const router = express.Router()

const { getAllJobs, deleteJobs, getJob, updateJobs,createJob } = require("../controllers/jobs")

router.route('/').post(createJob).get(getAllJobs)
router.route('/:id').get(getJob).delete(deleteJobs).patch(updateJobs)

module.exports = router