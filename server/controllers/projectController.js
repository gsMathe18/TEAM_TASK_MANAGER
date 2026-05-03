const Project = require("../models/Project");
const User = require("../models/User");

exports.createProject = async (req, res) => {
  try {
    const { name, description, members = [] } = req.body;

    if (!name) {
      return res.status(400).json({ msg: "Project name is required" });
    }

    const allMembers = [...members, req.user._id.toString()];
    const uniqueMembers = [...new Set(allMembers)];

    const newProject = await Project.create({
      name,
      description,
      admin: req.user._id,
      members: uniqueMembers
    });

    await User.updateMany(
      { _id: { $in: uniqueMembers } },
      { $push: { projects: newProject._id } }
    );

    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projectList = await Project.find({
      $or: [{ admin: req.user._id }, { members: req.user._id }]
    })
      .populate("members", "name email role")
      .populate("admin", "name email");

    res.json(projectList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { projectId, userId } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    if (project.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Only admin can add members" });
    }

    const alreadyMember = project.members.some(
      (member) => member.toString() === userId
    );

    if (alreadyMember) {
      return res.status(400).json({ msg: "User already a member" });
    }

    project.members.push(userId);
    await project.save();

    await User.findByIdAndUpdate(userId, {
      $push: { projects: projectId }
    });

    res.json({ msg: "Member added successfully", project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    if (project.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Only admin can delete project" });
    }

    await Project.findByIdAndDelete(projectId);

    res.json({ msg: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};