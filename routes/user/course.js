const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const path = require("path");
const reviewModel = require("../../models/review");
const admin = require("../../middlewares/admin");
const student = require("../../middlewares/student");
const fs = require("fs");
require("dotenv").config();
const courseModel = require("../../models/course");
const imgURL = process.env.imgUrl;


// /user/enroll/:courseId/:studentId
router.patch("/enroll/:courseId/:studentId", [student], async (req, res) => {
    try {
      const courseId = req.params.courseId;
      const studentId = req.params.studentId;
      const enroll = await courseModel.updateOne(
        { _id: courseId },
        { $push: { watingstudentId: studentId } }
      );
      return res.send(enroll);
    } catch (e) {
      return res.send(e);
    }
  });
  
  // /student/cancel/:courseId/:studentId
  router.patch("/cancel/:courseId/:studentId", [student], async (req, res) => {
    try {
      const courseId = req.params.courseId;
      const studentId = req.params.studentId;
      const enroll = await courseModel.updateOne(
        { _id: courseId },
        { $pull: { watingstudentId: studentId } }
      );
      
      return res.send(enroll);
    } catch (e) {
      return res.send(e);
    }
  });

module.exports = router;
