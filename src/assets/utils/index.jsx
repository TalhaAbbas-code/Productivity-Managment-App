
export const getToday = () => new Date().toISOString().split("T")[0];

export const groupTasks = (tasks) => {
  const today = getToday();
  const grouped = { Today: [], Upcoming: [], Completed: [] };
  tasks.forEach((task) => {
    if (task.status === "Completed") {
      grouped.Completed.push(task);
    } else if (task.dueDate === today) {
      grouped.Today.push(task);
    } else if (task.dueDate > today) {
      grouped.Upcoming.push(task);
    }
  });
  return grouped;
};