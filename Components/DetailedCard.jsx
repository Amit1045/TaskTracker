import React from "react";
import { FiX } from "react-icons/fi";

const DetailedCard = ({ entity, onClose }) => {
  if (!entity) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 md:p-8">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
        >
          <FiX size={22} />
        </button>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-6">
          {entity.title}
        </h1>

        {/* Status & Priority */}
        <div className="flex items-center justify-between mb-5">
          <span className="text-sm font-semibold text-gray-500">
            Status & Priority
          </span>

          <div className="flex gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold
                ${
                  entity.status === "Completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }
              `}
            >
              {entity.status}
            </span>

            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold
                ${
                  entity.priority === "High"
                    ? "bg-red-100 text-red-700"
                    : entity.priority === "Medium"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                }
              `}
            >
              {entity.priority}
            </span>
          </div>
        </div>

        {/* Description */}
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Description
        </h2>
        <div className="bg-gray-50 border-l-4 border-blue-500 rounded-lg p-4 mb-6 text-gray-700 leading-relaxed">
          {entity.description || "No description provided."}
        </div>

        {/* Dates */}
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Due Date</span>
            <span>
              {entity.dueDate
                ? new Date(entity.dueDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "N/A"}
            </span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Created At</span>
            <span>
              {entity.createdAt
                ? new Date(entity.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedCard;
