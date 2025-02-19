const Course = require("../models/coursemodel");
const Teacher = require("../models/teachermodel");

const courseCreate = (req, res) => {
    let course = new Course();
    course.name = req.body.name;
    course.code = req.body.code;
    course.description = req.body.description;
    course.teacher = req.body.teacher;
    if (course.name && course.code) {
        course.save().then(() => {
            res.status(201);
            res.header({
                "location": `/courses/?id=${course.id}`
            })
            res.json(course);
        }).catch((error) => {
            res.status(422)
            res.json({
                error: "There was an error saving the course"
            });
        });
    } else {
        res.status(422)
        res.json({
            error: "No valid data for provided for course"
        });
    };
};

const courseGet = (req, res) => {
    if (req.query && req.query.id) {
        Course.findById(req.query.id).populate('teacher').then((course) => {
            if (course) {
                res.json(course)
            } else {
                res.status(404)
                res.json({ error: "Course doesn't exist" })
            }
        }).catch((error) => {
            res.status(500)
            res.json({ error: "There was an error" })
        })
    } else {
        Course.find().then((courses) => {
            res.json(courses)
        }).catch((error) => {
            res.status(422)
            res.json({ "error": error })
        })
    }
}

const courseDelete = (req, res) => {
    if (req.query && req.query.id){
        Course.findByIdAndDelete(req.query.id).then((course) => {
            if (course) {
                res.status(200)
                res.json({ message: "Course deleted successfully", course })
            } else {
                res.status(404)
                res.json({ error: "Course not found" })
            }
        }).catch(() => {
            res.status(500)
            res.json({ error: "There was an error deleting the course" });
        })
    }else {
        res.status(400)
        res.json({ error: "ID is required for deleting a course" });
    }
}

const courseUpdate=(req,res)=>{
    if (req.query && req.query.id) {
            Course.findById(req.query.id).then((course) => {
                const CourseBefore = { ...course.toObject() }
                if (course) {
                    course.name = req.body.name || course.name;
                    course.code = req.body.code || course.code;
                    course.description = req.body.description || course.description;
                    course.teacher = req.body.teacher || course.teacher;
                }
                course.save().then((Updatecourse) => {
                    res.status(200)
                    res.json({ message: "Course updated successfully", CourseBefore, CourseAfter: Updatecourse });
                }).catch((error) => {
                    res.status(500);
                    res.json({ error: "There was an error updating the course" });
    
                });
    
    
            })
        } else {
            res.status(400)
            res.json({ error: "ID is required for updating a course" });
        }
}

module.exports = { courseCreate, courseGet, courseDelete, courseUpdate };