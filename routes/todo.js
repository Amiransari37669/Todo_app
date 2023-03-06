const router = require("express").Router();
const TaskGroup = require('../models/TaskGroup');
const Task = require('../models/Task');
const type = require('mongoose').Types;
const ObjectId = type.ObjectId

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

router.post("/create/task", (req, res) => {
  const newTask = new Task({ task_id: req.body.task_id, task: req.body.task, due_date: req.body.completed_at, task_status: req.body.task_status });

  newTask.save().then(() => { console.log("added successfully") }).catch((e) => { console.log(e) });
  res.send(newTask);


});
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
router.post("/task/update", async (req, res) => {
  await Task.findOneAndUpdate({ _id: req.body.id }, {
    $set: { task: req.body.task, due_date: req.body.due_date, task_status: req.body.task_status }
  });
  let result = await Task.findById({ _id: req.body.id })
  res.send(result);

});
router.delete("/task/delete/:id", async (req, res) => {
  await Task.deleteOne({ _id: req.params.id }).then(()=>console.log("task deleted"));
  let Tasks = await Task.find();
  res.send(Tasks);

})

module.exports = router;