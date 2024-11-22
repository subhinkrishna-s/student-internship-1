const express = require('express')
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

mongoose.connect("mongodb+srv://subhinkrishna:Intelligent%40369@clustersks.oyjlntc.mongodb.net/?retryWrites=true&w=majority&appName=Clustersks")
.then(()=>console.log("Mongodb connected successfully!"))
.catch((err)=>console.log('Error connetcing to mongoDB: ',err))


const studentSchema = mongoose.Schema({
    fullname: {type: String, required: true},
    email: {type: String, required: true, unique: true}
})


const studentModel = mongoose.model("interndb_students",studentSchema)

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



app.get('/', (req, res)=>{
    // res.json({name: "test student", course: "node"})
    res.render('home')
})