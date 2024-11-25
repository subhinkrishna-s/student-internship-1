const express = require('express')
const { process_params } = require('express/lib/router')
const mongoose = require('mongoose')
require('ejs')


const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.set('view engine', 'ejs')

const port = 5000
app.listen(port, ()=>{
    console.log('server runing on port: ',port)
})


// Connecting MongoDB Database
mongoose.connect("mongodb+srv://subhinkrishna:Intelligent%40369@clustersks.oyjlntc.mongodb.net/?retryWrites=true&w=majority&appName=Clustersks")
.then(()=>console.log("Mongodb connected successfully!"))
.catch((err)=>console.log('Error connetcing to mongoDB: ',err))


// Defining Schema for Students data
const studentSchema = mongoose.Schema({
    fullname: {type: String, required: true},
    email: {type: String, required: true, unique: true}
})

// Defining collection and Schema for Student data
const studentModel = mongoose.model("interndb_students",studentSchema)

// Student Registration
app.post('/registerstudent', async (req, res)=>{
    try{
        const {studentName, studentEmail} = req.body

        if(studentName&&studentEmail){

            const tempStudent = new studentModel({
                fullname: studentName,
                email: studentEmail
            })

            const dataSave = await tempStudent.save()
            if(dataSave){
                return res.send({success: true, message: "Registration successfull!"})
            }
            else{
                return res.send({success: false, message: "Student Registration failed!"})
            }
        }
        else{
            return res.send({success: false, message: "Please provide all details!"})
        }
    }
    catch(err){
        console.log('Error in registration: ',err)
        return res.send({success: false, message: "Trouble in Student Registration, please contact support team!"})
    }
})

// Fetching Student information
app.get('/fetch-students', async (req, res)=>{
    try{
        const fetchedStudent = await studentModel.find({})
        // const fetchedStudent = await studentModel.find({email: "mani@gmail.com"})
        // const fetchedStudent = await studentModel.findOne({email: "mani@gmail.com"})
        console.log('fetche students: ',fetchedStudent.email)
        // return res.render('dashboard',{success: true, classStudents: fetchedStudent})
        return res.send({success: true, classStudents: fetchedStudent})
    }
    catch(err){
        console.log('Error in Fetching: ',err)
        return res.send({success: false, message: "Trouble in fetching Student, please contact support team!"})
    }
})



// Updating Student
app.post('/update-student', async (req, res)=>{
    try{
        const {studentEmail, studentName} = req.body
        console.log(studentEmail, studentName)
        if(studentEmail && studentName){
            // const updateStudent = await studentModel.updateMany({email: studentEmail}, {$set:{
            //     fullname: studentName
            // }})
            const updateStudent = await studentModel.updateOne({email: studentEmail}, {$set:{
                fullname: studentName
            }})
            if(updateStudent){
                return res.send({success: true, message: "Student data updated succesfuly!"})
            }
            else{
                return res.send({success: false, message: "Failed to update Student, please try gain later!"})
            }    
        }
        else{
            return res.send({success: false, message: "Please provide the student email and fullname"})
        }
    }
    catch(err){
        console.log('Error in Updating students: ',err)
        return res.send({success: false, message: "Trouble in uodating Student data, please contact support team!"})
    }
})


// TASK DETAILS - Student Deletion
// Deletion Syntax:-

// modelNames.deleteOne({email : "email value"})
// modelNames.deleteMany({email : "email value"})



app.get('/', (req, res)=>{
    // res.json({name: "test student", course: "node"})
    res.render('home')
})