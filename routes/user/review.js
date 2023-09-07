const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const path = require("path");
const reviewModel = require("../../models/review");
const admin = require("../../middlewares/admin");
const upload = require("../../middlewares/upload");
const fs = require("fs");
require("dotenv").config();
const courseModel = require("../../models/course");
const imgURL = process.env.imgUrl;


// add review -----------------------
router.post("/", [admin,upload('Review').single('image')], async (req, res) => {
  try {

      const objReview = {
        name: req.body.name,
        description: req.body.description,
        image: req.file.filename,
      };

      const review = await reviewModel.create(objReview);
      return res.json(review);
    } catch (error) {
      return res.send(error);
    }
  });

  router.get("/", async (req, res) => {
    try {
      const review = await reviewModel.find();
      return res.json(review);
    } catch (err) {
      res.status(500).send(err);
    }
  }); //get
  
  //get one review by id and display his lessons
  router.get("/:id", async (req, res) => {
    try {
      const reviewId = req.params.id;
      const review = await reviewModel.findOne({_id:reviewId});
      if (!review) {
        return res.status(404).send("review not found");
      }
      return res.json(review);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  });

// delete review -----------------------

router.delete("/:id", [admin], async (req, res) => {
  try {
    const reviewId = req.params.id;
    const reviewbyID = await reviewModel.findOne({ _id:reviewId });
    if (!reviewbyID) {
      return res.status(404).send("Course not found");
    }
    try {
      const imagePath = path.join(
        __dirname,
        "../../assets/uploads/Review",
        reviewbyID.image
      );

      fs.unlinkSync(imagePath);
    } catch (err) {
      return res.status(500).send(err);
    }

    const review = await reviewModel.deleteOne({ _id:reviewId });
    if (!review) {
      return res.status(404).send("review not found");
    }

    res.json({ status: "success", item: review });
  } catch (err) {
    res.status(500).send(err);
  }
});


module.exports = router;
