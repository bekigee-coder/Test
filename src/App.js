import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function emptyWeek() {
  return [false, false, false, false, false, false, false];
}

const DEFAULT_TASKS = [
  {
    id: 1,
    name: "Homework",
    reward: 5,
    days: emptyWeek()
  },
  {
    id: 2,
    name: "Make Bed",
    reward: 3,
    days: emptyWeek()
  },
  {
    id: 3,
    name: "Feed Pet",
    reward: 4,
    days: emptyWeek()
  }
];

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : DEFAULT_TASKS;
  });

  const [bankBalance, setBankBalance] = useState(() => {
    return Number(localStorage.getItem("bankBalance")) || 0;
  });

  const [streak, setStreak] = useState(() => {
    return Number(localStorage.getItem("streak")) || 0;
  });

  const [bonusAmount, setBonusAmount] = useState(() => {
    return Number(localStorage.getItem("bonusAmount")) || 5;
  });

  const [newTask, setNewTask] = useState("");
  const [newReward, setNewReward] = useState(5);

  const previousAllDone = useRef(false);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("bankBalance", bankBalance);
  }, [bankBalance]);

  useEffect(() => {
    localStorage.setItem("streak", streak);
  }, [streak]);

  useEffect(() => {
    localStorage.setItem("bonusAmount", bonusAmount);
  }, [bonusAmount]);

  const celebrateRow = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 }
    });
  };

  const celebrateEverything = () => {
    confetti({
      particleCount: 250,
      spread: 120
    });

    setTimeout(() => {
      confetti({
        particleCount: 250,
        spread: 120
      });
    }, 400);
  };

  const toggleCell = (taskId, dayIndex) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) => {
        if (task.id !== taskId) {
          return task;
        }

        const updatedDays = [...task.days];
        updatedDays[dayIndex] = !updatedDays[dayIndex];

        const completedDays =
          updatedDays.filter(Boolean).length;

        if (completedDays === 7) {
          celebrateRow();
        }

        return {
          ...task,
          days: updatedDays
        };
      })
    );
  };

  const addTask = () => {
    if (!newTask.trim()) return;

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        name: newTask,
        reward: Number(newReward),
        days: emptyWeek()
      }
    ]);

    setNewTask("");
    setNewReward(5);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const resetWeek = () => {
    setTasks(
      tasks.map
