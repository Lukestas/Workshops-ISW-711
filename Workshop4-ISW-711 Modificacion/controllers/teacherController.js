const Teacher = require("../models/teachermodel");

const teacherCreate = (req, res) => {
    let teacher = new Teacher();

    teacher.first_name = req.body.first_name;
    teacher.last_name = req.body.last_name;
    teacher.cedula = req.body.cedula;
    teacher.age = req.body.age;

    if (teacher.first_name && teacher.last_name) {
        teacher.save().then(() => {
            res.status(201);
            res.header({
                "location": `/teachers/?id=${teacher.id}`
            });
            res.json(teacher);
        }).catch((error) => {
            res.status(422);
            console.log("error while saving the teacher", error);
            res.json({
                error: "There was an error saving the teacher"
            });
        });
    } else {
        res.status(422);
        console.log("error while saving the teacher")
        res.json({
            error: "No valid data provided for teacher"
        });
    }
};

const teacherGet = (req, res) => {
    if (req.query && req.query.id) {
        Teacher.findById(req.query.id).then((teacher) => {
            if (teacher) {
                res.json(teacher);
            } else {
                res.status(404).json({ error: "Teacher doesn't exist" })
            }
        }).catch((error) => {
            res.status(500);
            console.log('error while queryting the teacher', error)
            res.json({ error: "There was an error" })
        });
    } else {
        Teacher.find().then(teachers => {
            res.json(teachers);
        }).catch(err => {
            res.status(422);
            res.json({
                "error": err
            })
        })
    }
};

const teacherDelete = (req, res) => {
    if (req.query && req.query.id) {
        Teacher.findByIdAndDelete(req.query.id).then((teacher) => {
            if (teacher) {
                res.status(200);
                res.json({ message: "Teacher deleted successfully", teacher });
            } else {
                res.status(404);
                res.json({ error: "Teacher not found" });
            }
        }).catch((error) => {
            res.status(500);
            console.log('Error while deleting the teacher', error);
            res.json({ error: "There was an error deleting the teacher" });
        });
    } else {
        res.status(400).json({ error: "ID is required for deleting a teacher" });
    }
};

const teacherPut = (req, res) => {
    if (req.query && req.query.id) {
        Teacher.findById(req.query.id).then((teacher) => {
            const TeacherBefore = { ...teacher.toObject() }
            if (teacher) {
                teacher.first_name = req.body.first_name || teacher.first_name;
                teacher.last_name = req.body.last_name || teacher.last_name;
                teacher.cedula = req.body.cedula || teacher.cedula;
                teacher.age = req.body.age || teacher.age;
            }
            teacher.save().then((UpdateTeacher) => {
                res.status(200)
                res.json({ message: "Teacher updated successfully", TeacherBefore, TeacherAfter: UpdateTeacher });
            }).catch((error) => {
                res.status(500);
                console.log('Error while updating the teacher', error);
                res.json({ error: "There was an error updating the teacher" });

            });


        })
    } else {
        res.status(400)
        res.json({ error: "ID is required for updating a teacher" });
    }
};


module.exports = {
    teacherCreate, teacherGet, teacherDelete, teacherPut
}
