import React, { useEffect, useState, useRef } from "react";
import { FiEye, FiMoreVertical, FiFilter, FiPlus, FiCheck, FiX, FiRefreshCcw } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useTask } from "../customHook/useTask.js";
import Editpage from "./Editpage.jsx";
import CardSearch from "./DetailedCard.jsx";
import { FiCheckCircle } from "react-icons/fi";

/* ---------------------- Utility: Status Badge Color ---------------------- */
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "pending": return "bg-yellow-100 text-yellow-700";
    case "completed": return "bg-blue-100 text-blue-700";
    default: return "bg-gray-50 text-gray-700";
  }
};


const CardMenu = ({ entity }) => {
  const DeleteEntity = useTask((state) => state.DeleteEntity);
  const [openEdit, setOpenEdit] = useState(false);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;
    const res = await DeleteEntity(entity._id);
    alert(res.message);
  };

  return (
    <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg ring-1 ring-gray-200 divide-y divide-gray-100 z-50">
      <div className="py-1">
        <button
          onClick={() => setOpenEdit(!openEdit)}
          className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 text-left"
        >
          Edit
        </button>
        {openEdit && (
          <Editpage
            entity={entity}
            isOpen={openEdit}
            onClose={() => setOpenEdit(false)}
          />
        )}
      </div>
      <div className="py-1">
        <button
          onClick={handleDelete}
          className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 text-left"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

/* ---------------------------- Entity Card ------------------------------- */
const EntityCard = ({ entity, onView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [viewFullDetail, setviewFullDetail] = useState(false)
  const menuRef = useRef(null);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const statusClasses = getStatusColor(entity.status);

  return (
    <div className="relative bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {entity.title || entity.name}
        </h3>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusClasses}`}>
          {entity.status}
        </span>
      </div>

      <p className="text-gray-500 text-sm mb-4 line-clamp-3">
        {entity.description || "No description Added"}
      </p>

      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>Due Date :{new Date(entity.dueDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}</span>
        <div className="relative flex items-center space-x-2" ref={menuRef}>
          <button
            onClick={() => setviewFullDetail(!viewFullDetail)}
            className="p-2 rounded-full hover:bg-blue-50 hover:text-blue-600 transition"
          >
            <FiEye />
          </button>
          <div className="relative ">
            {viewFullDetail &&
              < CardSearch
                entity={entity}
                onClose={() => setviewFullDetail(false)} />}
          </div>


          <button
            onClick={toggleMenu}
            className="p-2 rounded-full hover:bg-gray-100 hover:text-gray-700 transition"
          >
            <FiMoreVertical />
          </button>

          {isMenuOpen && <CardMenu entity={entity} />}
        </div>
      </div>
    </div>
  );
};

/* ----------------------------- Filter Options --------------------------- */
const filterOptions = {
  status: ["Pending", "Completed"],
  priority: ["Low", "Medium", "High"],
  dueDate: ["Overdue", "Today", "Upcoming"],
};

/* ----------------------------- Filter --------------------------- */
const Filter = ({ onApply, onClear }) => {
  const [selectedFilters, setSelectedFilters] = useState({});
  const popoverRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setSelectedFilters(selectedFilters);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedFilters]);

  const toggleFilter = (group, value) => {
    setSelectedFilters((prev) => {
      const currentValues = prev[group] || [];
      if (currentValues.includes(value)) {
        const newValues = currentValues.filter((v) => v !== value);
        if (newValues.length === 0) {
          const { [group]: _, ...rest } = prev;
          return rest;
        }
        return { ...prev, [group]: newValues };
      } else {
        return { ...prev, [group]: [...currentValues, value] };
      }
    });
  };

  const isFilterSelected = (group, value) =>
    selectedFilters[group] && selectedFilters[group].includes(value);

  return (
    <div
      ref={popoverRef}
      className="absolute left-0 mt-2 w-72 origin-top-left bg-white rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5 z-20 p-4 space-y-4"
    >
      {Object.entries(filterOptions).map(([group, options]) => (
        <div key={group} className="border-b border-gray-100 pb-3 last:border-b-0">
          <h4 className="text-sm font-semibold text-gray-800 mb-2 capitalize">{group}</h4>
          <div className="flex flex-wrap gap-2">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => toggleFilter(group, option)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition duration-150 flex items-center 
                  ${isFilterSelected(group, option)
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                {isFilterSelected(group, option) && <FiCheck className="w-4 h-4 mr-1" />}
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="flex justify-between pt-2">
        <button
          type="button"
          onClick={() => { setSelectedFilters({}); onClear(); }}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 hover:text-red-600 transition duration-150"
        >
          <FiRefreshCcw className="w-4 h-4 mr-1" /> Clear Filters
        </button>
        <button
          type="button"
          onClick={() => onApply(selectedFilters)}
          disabled={Object.keys(selectedFilters).length === 0}
          className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 transition duration-150 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <FiCheck className="w-4 h-4 mr-2" /> Apply Filters
        </button>
      </div>
    </div>
  );
};

/* ----------------------------- Dashboard ------------------------------- */
const Dashboard = () => {

  const { tasks, fetchtasks, loading } = useTask();
  const [showFilter, setShowFilter] = useState(false);
  const [filteredtasks, setFilteredtasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState({});


  useEffect(() => {
    fetchtasks();
  }, [fetchtasks]);

  useEffect(() => {
    applyAllFilters();
  }, [tasks, searchTerm, activeFilters]);

  //  Combine Search + Filters in one function
  const applyAllFilters = () => {
    let result = [...tasks];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 🔍 Search
    if (searchTerm.trim()) {
      result = result.filter(task =>
        task.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // ✅ Status Filter
    if (activeFilters.status?.length) {
      result = result.filter(task =>
        activeFilters.status.includes(task.status)
      );
    }

    // ✅ Priority Filter
    if (activeFilters.priority?.length) {
      result = result.filter(task =>
        activeFilters.priority.includes(task.priority)
      );
    }

    // ✅ Due Date Filter
    if (activeFilters.dueDate?.length) {
      result = result.filter(task => {
        if (!task.dueDate) return false;

        const due = new Date(task.dueDate);
        due.setHours(0, 0, 0, 0);

        return activeFilters.dueDate.some(type => {
          if (type === "Overdue") return due < today;
          if (type === "Today") return due.getTime() === today.getTime();
          if (type === "Upcoming") return due > today;
          return false;
        });
      });
    }

    // 🔥 SORT BY NEAREST DUE DATE
    result.sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1; // a goes last
      if (!b.dueDate) return -1; // b goes last

      return new Date(a.dueDate) - new Date(b.dueDate);
    });

    setFilteredtasks(result);
  };

  const handleFilterApply = (filters) => {
    setActiveFilters(filters);
    setShowFilter(false);
  };

  const handleFilterClear = () => {
    setActiveFilters({});
    setShowFilter(false);
  };

  const handleView = (id) => alert(`Viewing details for Entity ID: ${id}`);

  return (
    <div className="flex bg-gray-100   min-h-screen">


      <section className="flex-1 flex flex-col">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <Link to={'/'}>
            <div className="flex items-center gap-2">
              <FiCheckCircle className="text-blue-600 text-xl" />
              <h1 className="text-xl font-bold text-gray-800">
                Task<span className="text-blue-600">Tracker</span>
              </h1>
            </div></Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-gray-100 rounded-lg px-3">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="bg-transparent outline-none py-2 px-2 text-sm w-48"
              />
              <FiFilter className="text-gray-500" onClick={() => setShowFilter(!showFilter)} />
            </div>
            {showFilter && (
              <div className="relative right-[60%]">
                <Filter onApply={handleFilterApply} onClear={handleFilterClear} />
              </div>
            )}
            <Link to="/create_task">
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
                <FiPlus className="text-lg" /> Create
              </button>
            </Link>
          </div>
        </header>

        <main className="p-6 flex-1 overflow-y-auto">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">

                {/* TOTAL TASKS */}
                <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition">
                  <h4 className="text-gray-500 text-sm">Total Tasks</h4>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {filteredtasks.length}
                  </p>
                </div>

                {/* PENDING TASKS */}
                <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition">
                  <h4 className="text-gray-500 text-sm">Pending Tasks</h4>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {filteredtasks.filter((task) => task.status === "Pending").length}
                  </p>
                </div>

                {/* COMPLETED TASKS */}
                <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition">
                  <h4 className="text-gray-500 text-sm">Completed Tasks</h4>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {filteredtasks.filter((task) => task.status === "Completed").length}
                  </p>
                </div>

              </div>


              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredtasks.length === 0 ? (
                  <p className="text-gray-500 text-center col-span-full">No tasks available.</p>
                ) : (
                  filteredtasks.map((entity) => (
                    <EntityCard key={entity._id} entity={entity} onView={handleView} />
                  ))
                )}
              </div>
            </>
          )}
        </main>
      </section>
    </div>
  );
};

export default Dashboard;
