import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";

function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    project: "",
    assignedTo: ""
  });

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch {
      alert("Failed to fetch tasks");
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch {
      alert("Failed to fetch projects");
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const createTask = async () => {
    const { title, description, deadline, project, assignedTo } = formData;

    if (!title || !description || !deadline || !project || !assignedTo) {
      alert("Fill all fields");
      return;
    }

    try {
      await API.post("/tasks", { title, description, project, assignedTo, deadline });

      alert("Task created");
      fetchTasks();

      setFormData({
        title: "",
        description: "",
        deadline: "",
        project: "",
        assignedTo: ""
      });
    } catch (error) {
      alert(error.response?.data?.msg || "Error creating task");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/tasks/${id}`, { status });
      fetchTasks();
    } catch {
      alert("Failed to update task");
    }
  };

  const selectedProject = projects.find((p) => p._id === formData.project);

  return (
    <div>
      <Navbar />

      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Tasks</h2>

        {user?.role === "admin" && (
          <div className="bg-white p-4 rounded shadow mb-6">
            <h3 className="font-semibold mb-3">Create Task</h3>

            <input
              name="title"
              placeholder="Title"
              className="w-full border p-2 mb-2 rounded focus:outline-none focus:ring-1 focus:ring-[#8494FF]"
              value={formData.title}
              onChange={handleChange}
            />

            <input
              name="description"
              placeholder="Description"
              className="w-full border p-2 mb-2 rounded focus:outline-none focus:ring-1 focus:ring-[#8494FF]"
              value={formData.description}
              onChange={handleChange}
            />

            <input
              type="date"
              name="deadline"
              className="w-full border p-2 mb-2 rounded focus:outline-none focus:ring-1 focus:ring-[#8494FF]"
              value={formData.deadline}
              onChange={handleChange}
            />

            <select
              name="project"
              className="w-full border p-2 mb-2 rounded focus:outline-none focus:ring-1 focus:ring-[#8494FF]"
              value={formData.project}
              onChange={handleChange}
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>

            <select
              name="assignedTo"
              className="w-full border p-2 mb-3 rounded focus:outline-none focus:ring-1 focus:ring-[#8494FF]"
              value={formData.assignedTo}
              onChange={handleChange}
              disabled={!selectedProject}
            >
              <option value="">Assign Member</option>
              {selectedProject?.members?.filter((m) => m.role === "member").map((m) => (
                <option key={m._id} value={m._id}>{m.name}</option>
              ))}
            </select>

            <button className="w-full bg-[#8494FF] text-white p-2 rounded" onClick={createTask}>
              Create Task
            </button>
          </div>
        )}

        <h3 className="text-lg font-semibold mb-3">Task List</h3>

        <div className="grid md:grid-cols-2 gap-4">
          {tasks.map((task) => (
            <div key={task._id} className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold">{task.title}</h3>
              <p className="text-sm text-gray-600">{task.description}</p>
              <p className="text-sm">Status: {task.status}</p>
              <p className="text-sm">Deadline: {task.deadline?.slice(0, 10)}</p>

              {user?.role === "member" && task.assignedTo?._id === user?.id && (
                <select
                  className="mt-2 border p-1 rounded focus:outline-none focus:ring-1 focus:ring-[#8494FF]"
                  value={task.status}
                  onChange={(e) => updateStatus(task._id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TaskPage;