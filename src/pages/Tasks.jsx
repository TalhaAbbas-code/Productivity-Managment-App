import React, { useState, useEffect ,useMemo,useCallback} from "react";
import { useForm } from "react-hook-form";
import FormInput from "../components/FormInput";
import Navbar from "../components/Navbar";
import FilterButton from "../components/FilterButton";
import ActionButton from "../components/ActionButton";
import { PRIORITIES, STATUS } from "../assets/constants";
import { getToday, groupTasks } from "../assets/utils";
import { toast } from "react-hot-toast";



const defaultValues = {
  title: "",
  description: "",
  dueDate: getToday(),
  priority: "Medium",
  status: "Pending",
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("dueDate");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onSubmit",
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("tasks") || "[]");
    if (saved.length > 0) {
      setTasks(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const onSubmit = (data) => {
    if (editId !== null) {
      setTasks((ts) =>
        ts.map((t) => (t.id === editId ? { ...data, id: editId } : t))
      );
      setEditId(null);
      toast.success("Task updated successfully!");
    } else {
      setTasks((ts) => [...ts, { ...data, id: Date.now().toString() }]);
      toast.success("Task added successfully!");
    }
    reset(defaultValues);
  };


  const handleEdit = useCallback(
    (task) => {
      setEditId(task.id);
      reset(task);
      toast("Edit mode enabled");
    },
    [reset]
  );


  const handleDelete = useCallback(
    (id) => {
      setTasks((ts) => ts.filter((t) => t.id !== id));
      if (editId === id) {
        reset(defaultValues);
        setEditId(null);
      }
      toast.error("Task deleted!");
    },
    [editId, reset]
  );


  const handleComplete = useCallback((id) => {
    setTasks((ts) =>
      ts.map((t) => (t.id === id ? { ...t, status: "Completed" } : t))
    );
    toast.success("Task marked as completed!");
  }, []);


  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (filter === "All") return true;
      if (filter === "Today")
        return t.dueDate === getToday() && t.status !== "Completed";
      if (filter === "Completed") return t.status === "Completed";
      return true;
    });
  }, [tasks, filter]);

 
  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      if (sort === "dueDate") return a.dueDate.localeCompare(b.dueDate);
      if (sort === "priority")
        return PRIORITIES.indexOf(b.priority) - PRIORITIES.indexOf(a.priority);
      return 0;
    });
  }, [filteredTasks, sort]);

  const grouped = useMemo(() => groupTasks(sortedTasks), [sortedTasks]);

  return (
    <div className="text-primarytext bg-secondary bg-opacity-90 min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl text-primarytext bg-secondary bg-opacity-10 font-bold mb-4">
          Tasks
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-2 bg-secondary bg-opacity-10 p-4 rounded h-fit"
          >
            <FormInput
              label="Title"
              name="title"
              register={register}
              required
              errors={errors}
              minLength={3}
              maxLength={60}
              validation={{
                required: "title is required",
                minLength: {
                  value: 3,
                  message: "Title must be at least 3 characters",
                },
              }}
            />
            <div>
              <label className="block text-secondary font-semibold">
                Description
              </label>
              <textarea
                {...register("description")}
                className="w-full border text-black rounded p-2"
              />
            </div>
            <FormInput
              label="Due Date"
              name="dueDate"
              type="date"
              register={register}
              required
              errors={errors}
              min={getToday()}
              validation={{
                validate: (value) => {
                  const today = getToday();
                  return value >= today || "Date must be today or future";
                },
              }}
            />
            <div>
              <label className="block text-secondary font-semibold">
                Priority *
              </label>
              <div className="flex gap-4">
                {PRIORITIES.map((p) => (
                  <label key={p} className="flex items-center gap-1">
                    <input
                      type="radio"
                      value={p}
                      {...register("priority", {
                        required: "Priority is required",
                      })}
                    />
                    {p}
                  </label>
                ))}
              </div>
              {errors.priority && (
                <div className="text-red-500 text-sm">
                  {errors.priority.message}
                </div>
              )}
            </div>
            <div>
              <label className="block text-secondary font-semibold">
                Status
              </label>
              <select
                {...register("status")}
                className="w-full border text-black rounded p-2"
              >
                {STATUS.map((s) => (
                  <option className="text-black" key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <FilterButton
              type="submit"
              label={editId ? "Update Task" : "Add Task"}
              className="mt-2"
            />
            {editId && (
              <button
                type="button"
                className="ml-2 px-4 py-2 rounded bg-gray-300"
                onClick={() => {
                  reset(defaultValues);
                  setEditId(null);
                }}
              >
                Cancel
              </button>
            )}
          </form>

          {/* Right: Filters and Task List */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex gap-2">
                <FilterButton
                  label="All"
                  isActive={filter === "All"}
                  onClick={() => setFilter("All")}
                />
                <FilterButton
                  label="Today"
                  isActive={filter === "Today"}
                  onClick={() => setFilter("Today")}
                />
                <FilterButton
                  label="Completed"
                  isActive={filter === "Completed"}
                  onClick={() => setFilter("Completed")}
                />
              </div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border text-black rounded p-1"
              >
                <option value="dueDate">Sort by Due Date</option>
                <option value="priority">Sort by Priority</option>
              </select>
            </div>

            {["Today", "Upcoming", "Completed"].map(
              (group) =>
                grouped[group].length > 0 && (
                  <div key={group} className="mb-4">
                    <h2 className="font-bold text-lg mb-2">{group}</h2>
                    <ul className="space-y-2">
                      {grouped[group].map((task) => (
                        <li
                          key={task.id}
                          className={`p-3 rounded border flex flex-col md:flex-row md:items-center md:justify-between gap-2 ${
                            task.status === "Completed"
                              ? "bg-green-100"
                              : "bg-white"
                          }`}
                        >
                          <div>
                            <div className="font-semibold text-black">
                              {task.title}
                            </div>
                            <div className="text-secondarytext text-sm">
                              {task.description}
                            </div>
                            <div className="text-xs text-gray-500">
                              Due: {task.dueDate} | Priority: {task.priority}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {!task.completed && (
                              <ActionButton
                                label="Mark Complete"
                                onClick={() => handleComplete(task.id)}
                                color="green"
                              />
                            )}

                            <ActionButton
                              label="Edit"
                              onClick={() => handleEdit(task)}
                              color="yellow"
                            />

                            <ActionButton
                              label="Delete"
                              onClick={() => handleDelete(task.id)}
                              color="red"
                            />
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
            )}

            {grouped.Today.length === 0 &&
              grouped.Upcoming.length === 0 &&
              grouped.Completed.length === 0 && (
                <div className="text-center text-ptimarytext mt-8">
                  No records found.
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;