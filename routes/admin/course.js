const express = require("express");
const router = express.Router();
require("dotenv").config();
//model
const courseModel = require("../../models/course");
const lesson = require("../../models/lesson");
const admin = require("../../middlewares/admin");
const fs = require("fs");
const upload = require("../../middlewares/upload");
const path = require("path");


router.post("/", [admin,upload('Course').single('image')], async (req, res) => {
  try {

    if (!req.body.name || !req.body.Date) {
      return res
        .status(400)
        .json({ message: "Name , Date and Image are required fields" });
    }
      const date = new Date(req.body.Date);
      if (isNaN(date.getTime()) || date.getTime() < Date.now()) {
        return res
          .status(400)
          .json({ message: "Invalid date format or date is in the past" });
      }
      const objCourse = {
        name: req.body.name,
        description: req.body.description,
        Date: req.body.Date,
        // lessons: req.body.lessons,
        image: req.file.filename,
      };

      const course = await courseModel.create(objCourse);
      return res.json(course);
    } catch (error) {
      return res.send(error);
    }
  });



router.get("/", async (req, res) => {
  try {
    const course = await courseModel.find(
      {},
      { name: 1, description: 1, Date: 1 , image: 1,ID:1}
    );
    return res.json(course);
  } catch (err) {
    res.status(500).send(err);
  }
}); //get

// Route to get waiting students for all courses
router.get('/waiting-students', async (req, res) => {
  try {
    const courses = await courseModel.find().populate('watingstudentId', 'firstName lastName email _id'); // Populate the waiting students' details
    
    const waitingStudentsByCourse = courses.map(course => ({
      courseId: course._id,
      courseName: course.name,
      waitingStudents: course.watingstudentId
    }));
    
    res.json(waitingStudentsByCourse);
  } catch (error) {
    console.error('Error fetching waiting students:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to get enroll students for all courses
router.get('/enroll-students', async (req, res) => {
  try {
    const courses = await courseModel.find().populate('enrolledstudentId', 'firstName lastName email _id'); // Populate the waiting students' details
    
    const enrollStudentsByCourse = courses.map(course => ({
      courseId: course._id,
      courseName: course.name,
      enrollStudents: course.enrolledstudentId
    }));
    
    res.json(enrollStudentsByCourse);
  } catch (error) {
    console.error('Error fetching enroll students:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to put enroll students for all courses
// /user/enroll/:courseId/:studentId
router.patch("/enroll/:courseId/:studentId", [admin], async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const studentId = req.params.studentId;
    // Remove student from watingstudentId
    const updatedCourse = await courseModel.findByIdAndUpdate(
      courseId,
      { $pull: { watingstudentId: studentId } },
      { new: true } // To get the updated document
    );
    
    if (!updatedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }
    
    // Push the student into enrolledstudentId
    updatedCourse.enrolledstudentId.push(studentId);
    const savedCourse = await updatedCourse.save();

    return res.json(savedCourse);
  } catch (e) {
    return res.send(e);
  }
});

// /student/cancel/:courseId/:studentId
router.patch("/cancel/:courseId/:studentId", [admin], async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const studentId = req.params.studentId;
    const enroll = await courseModel.updateOne(
      { _id: courseId },
      { $pull: { enrolledstudentId: studentId } }
    );
    
    return res.send(enroll);
  } catch (e) {
    return res.send(e);
  }
});

//get one course by id and display his lessons
router.get("/:id", async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await courseModel.find({_id:courseId}).populate([
      {
        path: "lessons",
        model: "lesson",
        select: { name: 1, description: 1,ID:1 },
      }
    ]);
    if (!course) {
      return res.status(404).send("Course not found");
    }
    // await course.save();
    return res.json(course);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

//delete all courses

router.delete("/", [admin], async (req, res) => {
  try {
    await Promise.all([
      lesson.deleteMany({}),
    ]);
    const courses = await courseModel.deleteMany({});
    return res.json({'status':'succes','item':courses});
  } catch (err) {
    res.status(500).send(err);
  }
}); //delete all courses

router.delete("/:id", [admin], async (req, res) => {
  try {
    const courseId = req.params.id;
    const coursebyID = await courseModel.findOne({ _id:courseId });
    if (!coursebyID) {
      return res.status(404).send("Course not found");
    }

    // Delete related lessons
    await lesson.deleteMany({ courseId: courseId });

    try {
      const imagePath = path.join(
        __dirname,
        "../../assets/uploads/Course",
        coursebyID.image
      );

      fs.unlinkSync(imagePath);
    } catch (err) {
      return res.status(500).send(err);
    }

    const course = await courseModel.deleteOne({ _id:courseId });
    if (!course) {
      return res.status(404).send("Course not found");
    }

    res.json({ status: "success", item: course });
  } catch (err) {
    res.status(500).send(err);
  }
});


router.put(
  "/:id",
  [admin, upload("course").single("image")],
  async (req, res) => {
    const id = req.params.id;
    if (!req.body.name || !req.body.Date) {
      return res
        .status(400)
        .json({ message: "Name and Date are required fields" });
    }

    const date = new Date(req.body.Date);
    if (isNaN(date.getTime()) || date.getTime() < Date.now()) {
      return res
        .status(400)
        .json({ message: "Invalid date format or date is in the past" });
    }
    const objCourse = {
      name: req.body.name,
      description: req.body.description,
      Date: req.body.Date,
    };
    oldCourse = await courseModel.find({_id:id}); 
    if (req.file && res.statusCode != 404) {
      const imagePath = path.join(
        __dirname,
        "../../assets/uploads/Course",
       oldCourse[0].image
      );
      fs.unlinkSync(imagePath);
      objCourse.image = req.file.filename;
    }
    try {
      const course = await courseModel.updateOne(
        { _id: id },
        { $set: objCourse }
      );
      if (!course) {
        return res.status(404).send("Course not found");
      }
      return res.json(course);
    } catch (err) {
      res.status(500).send(err);
    }
  }
);

module.exports = router;