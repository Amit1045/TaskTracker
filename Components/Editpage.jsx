import { useTask } from "../customHook/useTask";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Editpage = ({ entity, isOpen, onClose }) => {
  const EditEntity = useTask((state) => state.EditEntity);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
    dueDate: "",
  });

  useEffect(() => {
    if (entity) {
      setFormData({
        title: entity.title || "",
        description: entity.description || "",
        status: entity.status || "",
        priority: entity.priority || "",
        dueDate: entity.dueDate || "",
      });
    }
  }, [entity]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await EditEntity(entity._id, formData);

      if (!res) {
        alert("Something went wrong!");
        return;
      }

      alert(res.message || "Updated successfully!");

      if (res.success) {
        onClose();
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      alert("Update failed: " + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-96 shadow-lg animate-fadeIn">
        <h2 className="text-xl font-semibold mb-4">Edit Task</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            className="border px-3 py-2 rounded-lg outline-none text-black"
            required
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="border px-3 py-2 rounded-lg outline-none resize-none text-black"
            rows={4}
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border px-3 py-2 rounded-lg outline-none text-black"
          >
            <option value="">Select Status</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="border px-3 py-2 rounded-lg outline-none text-black"
          >
            <option value="">Select Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate?.slice(0, 10)}
            onChange={handleChange}
            className="border px-3 py-2 rounded-lg outline-none text-black"
          />

          <div className="flex justify-end gap-3 mt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg cursor-pointer text-white bg-red-500 hover:bg-red-600 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg cursor-pointer bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Editpage;
