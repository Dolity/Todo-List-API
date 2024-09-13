const { Op } = require('sequelize');
const { Task } = require('../models')

module.exports = {
    taskHealth: (req, res) => {
        res.status(200).send('Task API is working!');
    },

    createTask: async (req, res) => {
        const user = req.user
        const { title, description } = req.body

        try {
            const task = await Task.create({
                userId: user.id,
                title: title,
                description: description,
                dueDate: new Date(Date.now())
            })

            return res.status(200).send({ message: 'Task Created Successfully', task: task });
        } catch (error) {
            return res.status(500).send({ message: 'Internal Server Error || Task Created Failed', error: error });
        }
    },

    tasks: async (req, res) => {
        const user = req.user
        const { page = 1, limit = 10 } = req.query

        try {
            const { rows: tasks, count: countTasks } = await Task.findAndCountAll({
                where: {
                    userId: user.id
                },
                limit: parseInt(limit),
                offset: (page - 1) * limit
            })

            return res.status(200).send({
                tasks: tasks,
                currentPage: parseInt(page),
                totalPages: Math.ceil(countTasks / limit),
                task: tasks.length,
                totalTask: countTasks,
            });
        } catch (error) {
            return res.status(500).send({ message: 'Internal Server Error || Tasks Get Failed', error: error });
        }
    },

    task: async (req, res) => {
        const taskId = req.params.taskId

        try {
            const task = await Task.findOne({
                where: {
                    id: taskId,
                }
            })

            if (!task) {
                return res.status(404).send({ message: 'Task Not Found' });
            }

            return res.status(200).send(task);
        } catch (error) {
            return res.status(500).send({ message: 'Internal Server Error || Task Get Failed', error: error });
        }
    },

    updateTask: async (req, res) => {
        const taskId = req.params.taskId
        const { title, description } = req.body

        try {
            const task = await Task.update({
                title: title,
                description: description,
                dueDate: new Date(Date.now())
            }, {
                where: {
                    id: taskId
                }
            })

            return res.status(200).send({ message: 'Task Updated Successfully', task: task });
        } catch (error) {
            return res.status(500).send({ message: 'Internal Server Error || Task Update Failed', error: error });
        }
    },

    deleteTask: async (req, res) => {
        const taskId = req.params.taskId

        try {
            const task = await Task.destroy({
                where: {
                    id: taskId
                }
            })

            return res.status(200).send({ message: 'Task Deleted Successfully', task: task });
        } catch (error) {
            return res.status(500).send({ message: 'Internal Server Error || Task Delete Failed', error: error });
        }
    },

    filterTasks: async (req, res) => {
        const { title, priority, status } = req.query

        try {
            const tasks = await Task.findAll({
                where: {
                    [Op.or]: [
                        {
                            title: {
                                [Op.like]: `%${title}%`
                            }
                        },
                        {
                            priority: {
                                [Op.like]: `%${priority}%`
                            }
                        },
                        {
                            status: {
                                [Op.like]: `%${status}%`
                            }
                        }
                    ]
                }
            })

            return res.status(200).send(tasks);
        } catch (error) {
            return res.status(500).send({ message: 'Internal Server Error || Task Filter Failed', error: error });
        }
    },

    sortTasks: async (req, res) => {
        const { sortBy, order } = req.query

        try {
            const tasks = await Task.findAll({
                order: [
                    [sortBy, order]
                ]
            })

            return res.status(200).send(tasks);
        } catch (error) {
            return res.status(500).send({ message: 'Internal Server Error || Task Sort Failed', error: error });
        }
    }
}