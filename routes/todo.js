const router = require("express").Router();
const TaskGroup = require('../models/TaskGroup');
const Task = require('../models/Task');
const User = require("../models/User");
const type = require('mongoose').Types;
const ObjectId = type.ObjectId
const jwt = require('jsonwebtoken');
const jwtSecret = "nighthacks"
const { body, validationResult } = require('express-validator');
const fetchuser= require("../middleware/fetchuser");
const { response } = require("express");


//create user or signup
router.post("/createuser",
  // email must be an email
  body('email').isEmail(),
  // password must be at least 5 chars long
  body('password').isLength({ min: 3 }), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) {
      res.json({ error: " a user already exist" });
    }
    let { firstName, lastName, email, password } = req.body;
    user = new User({ firstName, lastName, email, password });
    user.save().then(() => console.log("new user added")).catch((e) => console.log(e));
    const data = {
      userId: user._id
    }
    const authtoken = jwt.sign(data, jwtSecret);
    res.send(authtoken);
  });
//login user
router.post("/login",// email must be an email
body('email').isEmail(),
body('password').isLength({min:3}), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const {email,password}=req.body;
  let user = await User.findOne({email});
  if(user.password!=password){
    res.status(401).json({error:"invalid credentials"});
  }
  let data = {
    userId:user._id
  }
  let authtoken= await jwt.sign(data,jwtSecret);
  res.send(authtoken);

})

//getuser
router.post("/getuser", fetchuser,async (req, res) => {
    let userId=req.user;
    let user = await User.findOne({_id:userId}).select("-password");
    res.send(user);
  })

//create taskgroup
router
  .post("/create/taskgroup", (req, res) => {
    const task_group = req.body.task;
    const newTaskGroup = new TaskGroup({ task_group });

    // save the todo
    newTaskGroup
      .save()
      .then(() => {
        console.log("Successfully added todo!");
      })
      .catch((err) => console.log(err));
    res.send(newTaskGroup);
  });
//create tasks
router.post("/create/task", (req, res) => {
  const newTask = new Task({ task_id: req.body.task_id, task: req.body.task, due_date: req.body.completed_at, task_status: req.body.task_status });

  newTask.save().then(() => { console.log("added successfully") }).catch((e) => { console.log(e) });
  res.send(newTask);


});
//get taskgroup
router
  .get("/get/taskgroup/:id", async (req, res) => {
    console.log(req.params)
    let id = req.params.id;
    let result = await TaskGroup.aggregate([
      { $match: { _id: new ObjectId(id) } },
      {
        $lookup:
        {
          from: 'tasks',
          localField: '_id',
          foreignField: 'task_id',
          as: 'tasks'
        }
      }
    ])
    res.send(result)

  });
//get task lists
router
  .get("/get/alltask", async (req, res) => {
    let response = await Task.find();
    res.send(response);
  });
//get lists of taskgroup
router
  .get("/taskgroup/all", async (req, res) => {
    let response = await TaskGroup.find();
    res.send(response);
  });

// update taskgroup
router.post("/taskgroup/update", async (req, res) => {
  await TaskGroup.findOneAndUpdate({ _id: req.body.id }, {
    $set: {
      task_group: req.body.task_group
    }
  });
  let result = await TaskGroup.findById({ _id: req.body.id })
  res.send(result);

});
//update tasks
router.post("/task/update", async (req, res) => {
  await Task.findOneAndUpdate({ _id: req.body.id }, {
    $set: { task: req.body.task, due_date: req.body.due_date, task_status: req.body.task_status }
  });
  let result = await Task.findById({ _id: req.body.id })
  res.send(result);

});
//delete tasks
router.delete("/task/delete/:id", async (req, res) => {
  await Task.deleteOne({ _id: req.params.id }).then(() => console.log("task deleted"));
  let Tasks = await Task.find();
  res.send(Tasks);

});
//delete taskgroup
router.delete("/taskgroup/delete/:id", async (req, res) => {
  await TaskGroup.deleteOne({ _id: req.params.id }).then(() => console.log("taskgroup deleted")).catch((e) => console.log(e));
  let Taskgroups = await TaskGroup.find();
  res.send(Taskgroups);

});
//filter today's task
router.get("/tasks/today", async (req, res) => {
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let result = await Task.find({ created_At: { $gte: `${year}-${month}-${day}` }, });
  res.send(result);
  console.log(`${year}-${month}-${day}`)

})


module.exports = router;