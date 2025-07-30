import React, { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import NavBar from "../components/Navbar";
import { AnimatedProgressBar, StatCard } from "../components/ui/StatComponents"
const getTodayDate = () => new Date().toISOString().split("T")[0];

const Home = () => {
  const [habits, setHabits] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const storedHabits = JSON.parse(localStorage.getItem("habits") || "[]");
    const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    setHabits(storedHabits);
    setTasks(storedTasks);
  }, []);

  const today = getTodayDate();

  // Habit completion count for today
  const habitsCompletedToday = habits.filter((habit) =>
    habit.completed?.find((c) => c.date === today && c.done === true)
  ).length;
  const habitsCompletedTodayList = habits.filter((habit) =>
    habit.completed?.find((c) => c.date === today && c.done === true)
  );

  // Weekly habit progress per habit
  const habitProgress = habits.map((habit) => {
    const totalPossibleDays =
      habit.frequency === "Daily" ? 7 : habit.days.length || 0;
    const doneCount = (habit.completed || []).filter(
      (c) => c.done === true
    ).length;
    return {
      name: habit.title,
      done: doneCount,
      total: totalPossibleDays,
    };
  });

  // Tasks due today
  const tasksDueTodayList = tasks.filter((task) => task.dueDate === today && task.status !== "Completed");
  const tasksDueToday = tasksDueTodayList.length;

  // Completed tasks
  const completedToday = tasks.filter((t) => t.status === "Completed").length;
  const taskCompletionRate = tasks.length
    ? (completedToday / tasks.length) * 100
    : 0;

  const [animatedProgress, setAnimatedProgress] = useState(0);

  // Animate circular bar
  useEffect(() => {
    let start = 0;
    const end = taskCompletionRate;
    const duration = 1000;
    const stepTime = 10;
    const steps = duration / stepTime;
    const increment = end / steps;

    const interval = setInterval(() => {
      start += increment;
      if (start >= end) {
        setAnimatedProgress(end);
        clearInterval(interval);
      } else {
        setAnimatedProgress(start);
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, [taskCompletionRate]);

  return (
    <div className="text-primarytext bg-secondary bg-opacity-90 min-h-screen">
      <NavBar />
      <div className="p-6 min-h-screen ">
        <h1 className="text-4xl font-extrabold mb-8 text-primarytext">
           My Dashboard
        </h1>

        {/* Summary Cards */}
        <section className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-md flex flex-col items-center justify-center">
            <h2 className="text-2xl font-semibold mb-2 text-gray-700">
              Task Completion
            </h2>
            <div className="w-52 h-52">
              <CircularProgressbar
                value={animatedProgress}
                text={`${Math.round(animatedProgress)}%`}
                styles={buildStyles({
                  textSize: "30px",
                  pathColor: "#10B981",
                  textColor: "#1F2937",
                  trailColor: "#E5E7EB",
                  pathTransitionDuration: 0.15,
                })}
              />
            </div>
          </div>
          <StatCard
            title="Tasks Due Today"
            value={tasksDueToday}
            extra={
              tasksDueTodayList.length > 0 ? (
                <ul className="mt-2 text-lg text-black list-disc list-inside">
                  {tasksDueTodayList.map((task, index) => (
                    <li key={index}>{task.title}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400 mt-2">No tasks due today</p>
              )
            }
          />

          <StatCard
  title="Habits Completed Today"
  value={`${habitsCompletedToday}/${habits.length}`}
  extra={
    habitsCompletedTodayList.length > 0 ? (
      <ul className="mt-2 text-lg text-black list-disc list-inside">
        {habitsCompletedTodayList.map((habit, index) => (
          <li key={index}>{habit.title}</li>
        ))}
      </ul>
    ) : (
      <p className="text-sm text-gray-400 mt-2">No habits completed today</p>
    )
  }
/>
        </section>

        {/* Habit Progress */}
        <section>
          <h2 className="text-xl font-bold text-primarytext mb-4">
            Weekly Habit Progress
          </h2>
          <div className="space-y-4">
            {habitProgress.map((habit, idx) => (
              <AnimatedProgressBar
                key={idx}
                label={habit.name}
                value={habit.done}
                total={habit.total}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};



export default Home;
