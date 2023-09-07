const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const path = require("path");
const lessonModel = require("../../models/lesson");
const admin = require("../../middlewares/admin");
const upload = require("../../middlewares/upload");
const fs = require("fs");
require("dotenv").config();
const courseModel = require("../../models/course");
const imgURL = process.env.imgUrl;


// add lesson -----------------------

router.post("/", [admin], async (req, res) => {
    if (!(req.body.name && req.body.description&& req.body.link)) {
      res.status(400).send("All inputs are required");
    }
   
    const lesson = new lessonModel({
      name: req.body.name,
      description: req.body.description,
      courseId: req.body.courseId,
      link:req.body.link,
    });
    try {
      await lesson.save();
      await courseModel.updateOne(
        { _id: lesson.courseId },
        { $push: { lessons: lesson._id } }
      );
      return res.json(lesson);
    } catch (e) {
      return res.send(e);
    }
  });
// display all lesson ---------------------

router.get("/", async (req, res) => {
  try {
    const lesson = await lessonModel
      .find({})
      .populate("courseId");
    res.send(lesson);
  } catch (err) {
    res.send(err);
  }
});

// display all lesson  of a specifi course---------------------
router.get("/courses/:courseId", async (req, res) => {
  try {
    const {courseId} = req.params
    const lesson = await lessonModel
      .find({courseId})
      .populate("courseId");
    res.send(lesson);
  } catch (err) {
    res.send(err);
  }
});

// display one lesson -------------

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const lesson = await lessonModel.findById({ _id: id });
    return res.send(lesson);
  } catch (e) {
    return res.send(e);
  }
});


// update lesson -----------------------

router.patch(
  "/:id",
  [admin],
  async (req, res) => {
    const id = req.params.id;
    try {
      const lesson = await lessonModel.findById(id);
      if (!lesson) {
        res.status(404).send("lesson not found");
        console.log(res.statusCode);
      } else {
        
        lesson.name = req.body.name;
        lesson.description = req.body.description;
        lesson.courseId = req.body.courseId;
        lesson.link = req.body.link;
        await lesson.save();
        return res.send(lesson);
      }
    } catch (e) {
      return res.send(e);

    }

});

// delete lesson -----------------------

router.delete("/:id", admin, async (req, res) => {
  const id = req.params.id;
  try {
    const lesson = await lessonModel.findById({ _id: id });
    if (!lesson) {
      res.status(404).send("lesson not found");
    }
    const deletedlesson = await lessonModel.findByIdAndDelete(id);
    return res.send({'status':'success','item':deletedlesson});
  } catch (e) {
    return res.send(e);
  }
});

module.exports = router;
