const express = require("express");
const app = express();

const mongoose=require("mongoose");
const db=mongoose.connect("mongodb+srv://Luque:123@cluster0.etb8j.mongodb.net/");

const bodyParser = require ("body-parser");
const { base64decode } = require("nodejs-base64")
app.use(bodyParser.json())

const cors = require("cors");
const { teacherCreate, teacherGet, teacherDelete,teacherPut } = require('./controllers/teacherController');
const { courseCreate,courseGet, courseDelete, courseUpdate}=require('./controllers/courseController');

app.use(cors({
  domains: '*',
  methods: "*"
}));

app.use(function (res, req, next){
  if(req.headers["authorization"]){
    const authbase64=req.header["authorization"].split(' ');
    const userpass=authbase64.base64decode(authbase64[1])
    const user=userpass.split(':')[0]
    const pass=userpass.split(':')[1]
    if(user=="admin"&&pass=="123"){
      next()
      return;
    }
    res.status(401)
    res.send({error: "No autorizado"})
  }
})

app.post('/teachers', teacherCreate);
app.get("/teachers",teacherGet);
app.delete("/teachers",teacherDelete);
app.put("/teachers",teacherPut);
app.post('/courses',courseCreate),
app.get('/courses',courseGet)
app.delete('/courses',courseDelete)
app.put('/courses',courseUpdate)

app.listen(3001, () => console.log(`Example app listening on port 3001!`));