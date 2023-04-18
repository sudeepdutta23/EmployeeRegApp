const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Employee = require('./Employee')

mongoose.connect('mongodb://localhost:27017/Employee')
.then((connection)=>{
    console.log("Database Connected");
})
.catch((err)=>{
    console.log("Error", err)
})

app.use(express.json())
app.get('/',(req,res)=>{
    res.send("Welcome to Employee portal")
})
app.get('/get-employee',(req,res)=>{
    Employee.find({})
    .then((employees)=>{
        return res.status(200).json({ error: false, employees: employees });
    })
    .catch((error)=>{
        return res.status(400).json({ error: true, data: error });
    })
})

app.post('/add-employee',async(req,res)=>{
    const employee = new Employee({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        picture: req.body.picture,
        salary: req.body.salary,
        position: req.body.position
    });
    await employee.save()
    .then((employee)=>{
        return res.status(201).json({ error: false, data: 'Employee recorded successfully' });
    })
    .catch((error)=>{
        return res.status(400).json({ error: true, data: error });
    })
})

app.put('/update-employee', async(req,res)=>{
    Employee.findByIdAndUpdate(req.body.id,{
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        picture: req.body.picture,
        salary: req.body.salary,
        position: req.body.position
    })
    .then((employee)=>{
        res.status(200).json({ error: false, data: 'Records updated successfully' });
    })
    .catch((error)=>{
        return res.status(400).json({ error: true, data: "Something went wrong" });
    })
})

app.delete('/remove-employee/:id', async(req,res)=>{
    Employee.findByIdAndDelete(req.params.id)
    .then((employee)=>{
        res.status(200).json({ error: false, data: `${employee.name} fired successfully` });
    })
    .catch((error)=>{
        return res.status(400).json({ error: true, data: "Something went wrong" });
    })
})

app.listen(3000,()=>{
    console.log("Server is running 0n port 3000");
})