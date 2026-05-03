import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";

function ProjectPage() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({ name: "", projectId: "", userId: "" });

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch {
      alert("Failed to load projects");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get("/auth/users");
      setUsers(res.data);
    } catch {
      alert("Failed to load users");
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const createProject = async () => {
    if (!formData.name) {
      alert("Enter project name");
      return;
    }

    try {
      await API.post("/projects", { name: formData.name });
      alert("Project created");
      setFormData({ ...formData, name: "" });
      fetchProjects();
    } catch (error) {
      alert(error.response?.data?.msg || "Error creating project");
    }
  };

  const addMember = async () => {
    const { projectId, userId } = formData;

    if (!projectId || !userId) {
      alert("Select project and user");
      return;
    }

    try {
      await API.post("/projects/add-member", { projectId, userId });
      alert("Member added");
      setFormData({ ...formData, projectId: "", userId: "" });
      fetchProjects();
    } catch (error) {
      alert(error.response?.data?.msg || "Error adding member");
    }
  };

  return (
    <div>
      <Navbar />

      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Projects</h2>

        {user?.role === "admin" && (
          <div className="bg-white p-4 rounded shadow mb-4">
            <h3 className="font-semibold mb-3">Create Project</h3>

            <input
              name="name"
              placeholder="Project Name"
              className="w-full border p-2 mb-3 rounded focus:outline-none focus:ring-1 focus:ring-[#8494FF]"
              value={formData.name}
              onChange={handleChange}
            />

            <button className="w-full bg-[#8494FF] text-white p-2 rounded" onClick={createProject}>
              Create Project
            </button>
          </div>
        )}

        {user?.role === "admin" && (
          <div className="bg-white p-4 rounded shadow mb-4">
            <h3 className="font-semibold mb-3">Add Member</h3>

            <select
              name="projectId"
              className="w-full border p-2 mb-2 rounded focus:outline-none focus:ring-1 focus:ring-[#8494FF]"
              value={formData.projectId}
              onChange={handleChange}
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>

            <select
              name="userId"
              className="w-full border p-2 mb-3 rounded focus:outline-none focus:ring-1 focus:ring-[#8494FF]"
              value={formData.userId}
              onChange={handleChange}
            >
              <option value="">Select User</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>{u.name}</option>
              ))}
            </select>

            <button className="w-full bg-[#8494FF] text-white p-2 rounded" onClick={addMember}>
              Add Member
            </button>
          </div>
        )}

        <h3 className="text-lg font-semibold mb-3">Project List</h3>

        <div className="space-y-3">
          {projects.map((project) => (
            <div key={project._id} className="bg-white p-3 rounded shadow">
              <h3 className="font-semibold">{project.name}</h3>
              <p className="text-sm text-gray-600">Members: {project.members?.length || 0}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProjectPage;