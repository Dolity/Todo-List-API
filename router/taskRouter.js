

const express = require('express')
const userAuth = require('../middleware/auth')

const taskRouter = express.Router()

const taskController = require('../controller/TaskController')

taskRouter.get('/health', userAuth, taskController.taskHealth)
taskRouter.post('/create', userAuth, taskController.createTask)
taskRouter.get('/tasks', userAuth, taskController.tasks)
taskRouter.get('/task/:taskId', userAuth, taskController.task)
taskRouter.put('/task/:taskId', userAuth, taskController.updateTask)
taskRouter.delete('/task/:taskId', userAuth, taskController.deleteTask)
taskRouter.get('/filter', userAuth, taskController.filterTasks)
taskRouter.get('/sort', userAuth, taskController.sortTasks)

module.exports = taskRouter