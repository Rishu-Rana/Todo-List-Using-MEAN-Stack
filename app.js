// import module
const express = require('express');

const app = express();

const List = require('./database/models/list');
const Task = require('./database/models/task');

 const mongoose = require('./database/mongoose');



//port
const port = process.env.PORT || 3000;

// Cors -> cross origin request security 
//localhost:3000 backend
//localhost:4200  frontend 

app.use((req,res,next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST,HEAD,OPTIONS,PUT,PATCH,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})
// same can be done using app.use(cors());


app.use(express.json());//similar like bodyparser

//api for list

app.get('/lists',(req,res)=>{
    List.find({})
    .then(list => res.send(list))
    .catch((error) => console.log(error));
});

app.post('/lists',(req,res) =>{
    (new List({'title':req.body.title}))
    .save()
    .then((list) => res.send(list))
    .catch((error) => console.log(error));
});

app.get('/lists/:listId',(req,res) =>{
    List.find({_id:req.params.listId})
    .then((list) => res.send(list))
    .catch((error) => console.log(error));
});

app.patch('/lists/:listId',(req,res) =>{
     List.findOneAndUpdate({'_id':req.params.listId},{$set: req.body})
     .then((list) => res.send(list))
     .catch((error) => console.log(error));
});

app.delete('/lists/:listId',(req,res) =>{
    const deletetasks = (list) => {
        Task.deleteMany({_listId:list._id})
        .then(() => list)
        .catch((error) => console.log(error));
    }
       List.findByIdAndDelete({'_id':req.params.listId})
            .then((list) => res.send(deletetasks(list)))
            .catch((error) => console.log(error));
         
});

//task api

app.get('/lists/:listId/tasks',(req,res) => {
    Task.find({_listId:req.params.listId})
        .then((tasks) => res.send(tasks))
        .catch((error) => console.log(error));
});

app.get('/lists/:listId/tasks/:taskId',(req,res) => {
    Task.findOne({_listId:req.params.listId,_id:req.params.taskId})
        .then((tasks) => res.send(tasks))
        .catch((error) => console.log(error));
});

app.post('/lists/:listId/tasks',(req,res) => {
    ( new Task({'title':req.body.title, '_listId':req.params.listId}))
        .save()
        .then((tasks) => res.send(tasks))
        .catch((error) => console.log(error));
});

app.patch('/lists/:listId/tasks/:taskId',(req,res) => {
      Task.findOneAndUpdate({_listId:req.params.listId,_id:req.params.taskId},{$set: req.body})
      .then((tasks) => res.send(tasks))
      .catch((error) => console.log(error));
})

app.delete('/lists/:listId/tasks/:taskId',(req,res) => {
    Task.findOneAndDelete({_listId:req.params.listId,_id:req.params.taskId})
    .then((tasks) => res.send(tasks))
    .catch((error) => console.log(error));
})

app.listen(port,() => {
    console.log('Server run on port: '+port);
})