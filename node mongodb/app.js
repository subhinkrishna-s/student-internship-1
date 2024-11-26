const express = require('express')
const { process_params } = require('express/lib/router')
const mongoose = require('mongoose')
require('ejs')
const Session = require('express-session')
const MongoDbSession = require('connect-mongodb-session')(Session)


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

const Store = new MongoDbSession({
    uri: "mongodb+srv://subhinkrishna:Intelligent%40369@clustersks.oyjlntc.mongodb.net/?retryWrites=true&w=majority&appName=Clustersks",
    collection: 'session'
})



app.use(Session({
    secret: 'sks-key',
    resave: false,
    saveUninitialized: false,
    store: Store
}))

// Defining Schema for Students data
const studentSchema = mongoose.Schema({
    fullname: {type: String, required: true},
    email: {type: String, required: true, unique: true}
})


// Defining Schema for users
const userSchema = mongoose.Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true}
})

// Defining collection and Schema for Student data
const studentModel = mongoose.model("interndb_students",studentSchema)

// Defining collection and Schema for User data
const userModel = mongoose.model("interndb_user",userSchema)

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
        console.log('fetche students: ',fetchedStudent[0].fullname)
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



app.get('/', async (req, res)=>{
    // res.json({name: "test student", course: "node"})

    let authName;
    const authStatus = req.session.user
    console.log('session data: ',req.session.user)
    if(authStatus){
        const findUser = await userModel.findOne({username: req.session.user})
        if(findUser){
           authName=findUser.username
        }
        else{
            authName='Guest'
        }
    }
    else{
        authName='Guest'
    }
    res.render('home', {userName: authName})
})

app.get('/login', (req, res)=>{
    res.render('login')
})

app.get('/logout', (req, res)=>{
    req.session.destroy()
})



app.post('/register-user', async (req, res)=>{
    try{
        const {userName, userPassword} = req.body
        if(userName && userPassword){
            const findUser = await userModel.findOne({username: userName})
            if(findUser){
                return res.send({success: false, message: "The username already exist, please try with another username!"})
            }
            else{
                const tempUser = new userModel({
                    username: userName,
                    password: userPassword
                })
                const registerUser = await tempUser.save()

                if(registerUser){
                    return res.send({success: true, message: "User Registered succesfully!"})
                }
                else{
                    return res.send({success: false, message: "Failed to register user!"})
                }
            }
        }
        else{
            return res.send({success: false, message: "Please provide all details!"})
        }
    }
    catch(err){
        console.log('Error in Registering user: ',err)
        return res.send({success: false, message: "Trouble in Registering user, please contact support team!"})
    }
})


app.post('/login', async(req, res)=>{
    try{
        const {userName, userPassword} = req.body
        if(userName && userPassword){
            const findUser = await userModel.findOne({username: userName})
            if(findUser){
               if(findUser.password===userPassword){
                    req.session.user    
                    return res.render('success', {message: 'User logged in suucessfully'})
               }
               else{
                return res.render('fail',{message: "Please enter the correct password"})
               }
            }
            else{
                return res.render('fail',{message: "The user doent exist, please try with correct username!"})
            }
        }
        else{
            return res.render('fail',{message: "Please provide all details!"})
        }
    }
    catch(err){
        console.log('Error in Login: ',err)
        return res.render('fail',{message: "Trouble in RLogin, please contact support team!"})
    }
})