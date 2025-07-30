import React, { useState, useEffect ,useCallback} from "react";
import Navbar from "../components/Navbar";
import { toast } from "react-hot-toast";


const getLast7Days = () => {
  const result = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayIndex = date.getDay(); 
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" }); 
    const label = `${dayName} `;
    result.push({ label, date, dayIndex });
  }
  return result;
};
const daysWithDates = getLast7Days();
console.log("Days with dates:", daysWithDates);
const defaultHabit = {
  title: "",
  frequency: "Daily",
  days: [],
};
const Habits = () => {
  const [habits, setHabits] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(defaultHabit);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("habits") || "[]");
    setHabits(saved);
    setLoaded(true);
  }, []);

  // Save to  localStorage
  useEffect(() => {
    if (loaded) {
      localStorage.setItem("habits", JSON.stringify(habits));
    }
  }, [habits, loaded]);

  // Handle form input
  const handleChange = useCallback((e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const toggleDay = useCallback((dayIndex) => {
    setForm((prev) => {
      const days = prev.days.includes(dayIndex)
        ? prev.days.filter((d) => d !== dayIndex)
        : [...prev.days, dayIndex];
      return { ...prev, days };
    });
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      if (!form.title.trim()) {
        toast.error("Title is required");
        return;
      }

      if (form.title.length > 30) {
        toast.error("Title must be under 30 characters");
        return;
      }

      if (editId !== null) {
        setHabits((hs) =>
          hs.map((h) => (h.id === editId ? { ...h, ...form } : h))
        );
        toast.success("Habit updated");
        setEditId(null);
      } else {
        const selectedDays =
          form.frequency === "Custom"
            ? (form.days || []).map(Number)
            : daysWithDates.map((_, idx) => idx);

        const completed = daysWithDates.map((day) => ({
          date: day.date.toISOString().split("T")[0],
          done: selectedDays.includes(day.dayIndex) ? false : null,
        }));

        setHabits((hs) => [
          ...hs,
          {
            ...form,
            id: Date.now().toString(),
            days: selectedDays,
            completed,
            streak: 0,
          },
        ]);
        toast.success("Habit added");
      }

      setForm(defaultHabit);
    },
    [form, editId, setForm, setHabits]
  );

  const handleCheck = useCallback((habitId, dayIdx) => {
    setHabits((hs) =>
      hs.map((h) => {
        if (h.id !== habitId) return h;

        const completed = h.completed.map((entry, i) =>
          i === dayIdx ? { ...entry, done: !entry.done } : entry
        );

        let streak = 0;
        for (let i = dayIdx; i >= 0; i--) {
          if (completed[i].done) streak++;
          else break;
        }

        return { ...h, completed, streak };
      })
    );
  }, []);

  const handleEdit = useCallback((habit) => {
    setEditId(habit.id);
    setForm({
      title: habit.title,
      frequency: habit.frequency,
      days: habit.days || [],
    });
    toast("Editing habit...");
  }, []);

  const handleDelete = useCallback(
    (id) => {
      setHabits((hs) => hs.filter((h) => h.id !== id));
      if (editId === id) {
        setEditId(null);
        setForm(defaultHabit);
      }
      toast.success("Habit deleted");
    },
    [editId]
  );


  return (
    <div className="bg-secondary text-primarytext min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl  font-bold mb-4">Habit Tracker</h1>
        {/* Habit Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row gap-4 mb-8 items-center"
        >
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            maxLength={30}
            required
            placeholder="Habit title (max 30 chars)"
            className="border rounded p-2 text-black w-full md:w-1/3"
          />
          <select
            name="frequency"
            value={form.frequency}
            onChange={handleChange}
            className="border rounded p-2 text-black"
          >
            <option value="Daily">Daily</option>
            <option value="Custom">Custom Days</option>
          </select>
          {form.frequency === "Custom" && (
            <div className="flex gap-2  flex-wrap">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                (dayName, idx) => (
                  <label
                    key={idx}
                    className="flex items-center gap-1 text-primarytext"
                  >
                    <input
                      type="checkbox"
                      value={idx}
                      checked={form.days.includes(idx)}
                      onChange={() => toggleDay(idx)}
                    />
                    {dayName}
                  </label>
                )
              )}
            </div>
          )}
          <button
            type="submit"
            className="bg-primary text-secondarytext px-4 py-2 rounded"
          >
            {editId ? "Update" : "Add"}
          </button>
          {editId && (
            <button
              type="button"
              className="ml-2 px-4 py-2 rounded bg-gray-300"
              onClick={() => {
                setEditId(null);
                setForm(defaultHabit);
              }}
            >
              Cancel
            </button>
          )}
        </form>
        {/* Habit Grid */}
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded bg-secondary bg-opacity-10">
            <thead>
              <tr>
                <th className="p-2 text-left">Habit</th>
                {daysWithDates.map((d) => (
                  <th key={d} className="p-2 text-center">
                    {d.label}
                  </th>
                ))}
                <th className="p-2 text-center">Streak</th>
                <th className="p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {habits.map((habit) => (
                <tr key={habit.id} className="border-t">
                  <td className="p-2 font-semibold">{habit.title}</td>
                  {daysWithDates.map((day, idx) => {
                    const isVisibleDay = habit.days.includes(day.dayIndex); // Only show if selected in Custom
                    return (
                      <td key={idx} className="p-2 text-center">
                        {isVisibleDay ? (
                          <button
                            className={`w-6 h-6 rounded border ${
                              habit.completed[idx]?.done
                                ? "bg-green-500"
                                : "bg-white"
                            }`}
                            onClick={() => handleCheck(habit.id, idx)}
                          >
                            {habit.completed[idx]?.done ? "✓" : ""}
                          </button>
                        ) : (
                          ""
                        )}
                      </td>
                    );
                  })}
                  <td className="p-2 text-center font-bold">{habit.streak}</td>
                  <td className="p-2 text-center">
                    <button
                      className="bg-yellow-400 px-2 py-1 rounded text-xs mr-2"
                      onClick={() => handleEdit(habit)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                      onClick={() => handleDelete(habit.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {habits.length === 0 && (
                <tr>
                  <td
                    colSpan={daysWithDates.length + 3}
                    className="text-center py-8 text-primarytext"
                  >
                    No habits found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Habits;
