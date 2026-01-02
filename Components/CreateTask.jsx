import React, { useState } from "react";
import { FiSave, FiX, FiCheckCircle, FiTrash2 } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useTask } from "../customHook/useTask.js";
import Navbar from "./Navbar.jsx";


const initialFormState = {
  title: "",
  description: "",
  status: "Pending",
  priority: "Low",
  dueDate: "",
};

const CreateTask = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const navigate = useNavigate();
  const { createEntity } = useTask();

  /* -------------------- Validation -------------------- */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required.";
    } else if (formData.title.length < 5) {
      newErrors.title = "Title must be at least 5 characters.";
    }
    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* -------------------- Input Change -------------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  /* -------------------- Submit -------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionStatus(null);

    if (!validateForm()) {
      setSubmissionStatus("error");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createEntity(formData);

      if (response.success) {
        setSubmissionStatus("success");
        setFormData(initialFormState);
        setErrors({});

        setTimeout(() => {
          navigate("/");
        }, 1200);
      } else {
        setSubmissionStatus("error");
        setErrors({ general: response.message || "Something went wrong." });
      }
    } catch (err) {
      setSubmissionStatus("error");
      setErrors({ general: "Server error. Please try again later." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Navbar – FULL WIDTH */}
      <Navbar />
  
      {/* Page Content */}
      <div className="flex justify-center px-4 py-10">
        <div className="relative max-w-4xl w-full bg-white p-8 rounded-2xl shadow-lg">
  
          {/* Loader Overlay */}
          {isSubmitting && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-2xl z-10">
              <span className="text-blue-600 font-semibold animate-pulse">
                Creating task...
              </span>
            </div>
          )}
  
          {/* Header */}
          <h1 className="text-3xl font-bold text-gray-800">Create New Task</h1>
          <p className="text-sm text-gray-500 mb-6">
            Fill in the details below to create a new task
          </p>
  
          {/* Status Messages */}
          {submissionStatus === "success" && (
            <div className="flex items-center p-4 mb-4 text-green-700 bg-green-100 rounded-lg">
              <FiCheckCircle className="mr-3" />
              Task created successfully! Redirecting...
            </div>
          )}
  
          {submissionStatus === "error" && (
            <div className="flex items-center p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
              <FiX className="mr-3" />
              {errors.general || "Please fix the errors below."}
            </div>
          )}
  
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
  
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`mt-1 w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none
                  ${errors.title ? "border-red-500" : "border-gray-300 hover:border-gray-400"}
                `}
              />
              {errors.title && (
                <p className="text-sm text-red-600 mt-1">{errors.title}</p>
              )}
            </div>
  
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows="5"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`mt-1 w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none
                  ${errors.description ? "border-red-500" : "border-gray-300 hover:border-gray-400"}
                `}
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">{errors.description}</p>
              )}
            </div>
  
            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Due Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className={`mt-1 w-full px-4 py-2 rounded-lg border cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none
                  ${errors.dueDate ? "border-red-500" : "border-gray-300 hover:border-gray-400"}
                `}
              />
              {errors.dueDate && (
                <p className="text-sm text-red-600 mt-1">{errors.dueDate}</p>
              )}
            </div>
  
            {/* Status & Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 w-full cursor-pointer px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                >
                  <option>Pending</option>
                  <option>Completed</option>
                </select>
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="mt-1 w-full cursor-pointer px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
            </div>
  
            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t">
              <Link
                to="/"
                className="flex items-center justify-center px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <FiX className="mr-2" /> Cancel
              </Link>
  
              <button
                type="button"
                onClick={() => setFormData(initialFormState)}
                className="flex items-center justify-center px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
              >
                <FiTrash2 className="mr-2" /> Clear
              </button>
  
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <FiSave className="mr-2" />
                Create Task
              </button>
            </div>
  
          </form>
        </div>
      </div>
    </div>
  );
  
};

export default CreateTask;
