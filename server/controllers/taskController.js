const Task = require("../models/Task");
const Project = require("../models/Project");

exports.createTask = async (req, res) => {
  try {
    const { title, description, project, assignedTo, deadline, priority } = req.body;

    if (!title || !project || !assignedTo || !deadline) {
      return res.status(400).json({ msg: "All required fields must be provided" });
    }

    const projectData = await Project.findById(project);

    if (!projectData) {
      return res.status(404).json({ msg: "Project not found" });
    }

    if (projectData.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Only admin can create tasks" });
    }

    const isMember = projectData.members.some((member) => member.toString() === assignedTo);

    if (!isMember) {
      return res.status(400).json({ msg: "User is not a project member" });
    }

    const newTask = await Task.create({
      title,
      description,
      project,
      assignedTo,
      deadline,
      priority
    });

    projectData.tasks.push(newTask._id);
    await projectData.save();

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    let taskList;

    if (req.user.role === "admin") {
      taskList = await Task.find()
        .populate("project", "name")
        .populate("assignedTo", "name email");
    } else {
      taskList = await Task.find({ assignedTo: req.user._id })
        .populate("project", "name")
        .populate("assignedTo", "name email");
    }

    res.json(taskList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    const validStatus = ["pending", "in-progress", "completed"];
    if (!validStatus.includes(status)) {
      return res.status(400).json({ msg: "Invalid status value" });
    }

    const assignedUserId = task.assignedTo?._id
      ? task.assignedTo._id.toString()
      : task.assignedTo.toString();

    if (assignedUserId !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({
        msg: "Only assigned user or admin can update this task"
      });
    }

    task.status = status;
    await task.save();

    res.json(task);
  } catch (error) {
    console.error("Update Task Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    let taskList;

    if (req.user.role === "admin") {
      taskList = await Task.find();
    } else {
      taskList = await Task.find({ assignedTo: req.user._id });
    }

    const total = taskList.length;
    const completed = taskList.filter((t) => t.status === "completed").length;
    const pending = taskList.filter((t) => t.status === "pending").length;
    const inProgress = taskList.filter((t) => t.status === "in-progress").length;

    const today = new Date();

    const overdue = taskList.filter(
      (t) =>
        t.deadline &&
        new Date(t.deadline) < today &&
        t.status !== "completed"
    ).length;

    res.json({
      total,
      completed,
      pending,
      inProgress,
      overdue
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};