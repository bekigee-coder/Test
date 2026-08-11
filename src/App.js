import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function emptyWeek() {
  return [false, false, false, false, false, false, false];
}

const DEFAULT_TASKS = [
  {
    id: 1,
    name: "Make Bed",
    reward: 1,
    days: emptyWeek(),
  },
  {
    id: 2,
    name: "Feed Pet",
    reward: 2,
    days: emptyWeek(),
  },
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
  const [newReward, setNewReward] = useState(1);

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
      particleCount: 75,
      spread: 70,
      origin: { y: 0.7 },
    });
  };

  const celebrateEverything = () => {
    confetti({
      particleCount: 250,
      spread: 120,
    });

    setTimeout(() => {
      confetti({
        particleCount: 250,
        spread: 120,
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

        const completedCount = updatedDays.filter(Boolean).length;

        if (completedCount === 7) {
          celebrateRow();
        }

        return {
          ...task,
          days: updatedDays,
        };
      })
    );
  };

  const addTask = () => {
    if (!newTask.trim()) return;

    const task = {
      id: Date.now(),
      name: newTask,
      reward: Number(newReward),
      days: emptyWeek(),
    };

    setTasks([...tasks, task]);

    setNewTask("");
    setNewReward(1);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const resetWeek = () => {
    setTasks(
      tasks.map((task) => ({
        ...task,
        days: emptyWeek(),
      }))
    );
  };

  const taskProgress = (task) => {
    return Math.round((task.days.filter(Boolean).length / 7) * 100);
  };

  const totalCompleted = tasks.reduce(
    (sum, task) => sum + task.days.filter(Boolean).length,
    0
  );

  const totalPossible = tasks.length * 7;

  const overallProgress =
    totalPossible === 0
      ? 0
      : Math.round((totalCompleted / totalPossible) * 100);

  const allTasksCompleted =
    tasks.length > 0 && tasks.every((task) => task.days.every(Boolean));

  useEffect(() => {
    if (allTasksCompleted && !previousAllDone.current) {
      celebrateEverything();
    }

    previousAllDone.current = allTasksCompleted;
  }, [allTasksCompleted]);

  const choreEarnings = tasks.reduce(
    (sum, task) => sum + task.days.filter(Boolean).length * task.reward,
    0
  );

  const weeklyTotal = choreEarnings + (allTasksCompleted ? bonusAmount : 0);

  const bankWeek = () => {
    setBankBalance((current) => current + weeklyTotal);

    if (allTasksCompleted) {
      setStreak((current) => current + 1);
    } else {
      setStreak(0);
    }

    resetWeek();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 20,
        background: "#eef7ff",
        fontFamily: "Arial",
      }}
    >
      <h1 style={{ textAlign: "center" }}>⭐ Chore Champion ⭐</h1>

      <div
        style={{
          background: "#FFD54F",
          borderRadius: 12,
          padding: 20,
          textAlign: "center",
          marginBottom: 15,
        }}
      >
        <h2>🐷 Bank Balance</h2>
        <h1>${bankBalance.toFixed(2)}</h1>
      </div>

      <div
        style={{
          background: "white",
          borderRadius: 12,
          padding: 15,
          marginBottom: 15,
        }}
      >
        <h2>
          🔥 Streak: {streak} Week
          {streak === 1 ? "" : "s"}
        </h2>
      </div>

      <div
        style={{
          background: "white",
          borderRadius: 12,
          padding: 15,
          marginBottom: 20,
        }}
      >
        <strong>Overall Progress</strong>

        <div
          style={{
            height: 20,
            background: "#ddd",
            borderRadius: 10,
            marginTop: 10,
          }}
        >
          <div
            style={{
              width: `${overallProgress}%`,
              height: "100%",
              background: "#4CAF50",
              borderRadius: 10,
            }}
          />
        </div>

        <div style={{ marginTop: 8 }}>{overallProgress}% complete</div>
      </div>

      {allTasksCompleted && (
        <div
          style={{
            background: "#FFF59D",
            border: "3px solid gold",
            borderRadius: 12,
            padding: 20,
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          <h2>🎉 CHORE CHAMPION! 🎉</h2>
          <p>Every chore for every day has been completed!</p>
          <strong>⭐ Weekly Bonus Unlocked ⭐</strong>
        </div>
      )}

      <div
        style={{
          background: "white",
          borderRadius: 12,
          padding: 20,
        }}
      >
        <h2>📅 Weekly Chore Chart</h2>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Chore</th>
              {DAYS.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {tasks.map((task) => (
              <React.Fragment key={task.id}>
                <tr
                  style={{
                    background: task.days.every(Boolean)
                      ? "#E8F5E9"
                      : "transparent",
                  }}
                >
                  <td style={{ padding: 10 }}>
                    <strong>{task.name}</strong>

                    <div>${task.reward}/day</div>

                    <button
                      onClick={() => deleteTask(task.id)}
                      style={{
                        marginTop: 5,
                      }}
                    >
                      Delete
                    </button>
                  </td>

                  {task.days.map((completed, index) => (
                    <td
                      key={index}
                      style={{
                        textAlign: "center",
                      }}
                    >
                      <button
                        onClick={() => toggleCell(task.id, index)}
                        style={{
                          width: 45,
                          height: 45,
                          fontSize: 22,
                          borderRadius: 10,
                          border: "none",
                          cursor: "pointer",
                          background: completed ? "#FFE082" : "#E0E0E0",
                        }}
                      >
                        {completed ? "⭐" : "⬜"}
                      </button>

                      <div
                        style={{
                          fontSize: 12,
                        }}
                      >
                        ${task.reward}
                      </div>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td colSpan={8}>
                    <div
                      style={{
                        height: 10,
                        background: "#ddd",
                        borderRadius: 10,
                        margin: "8px 0 20px 0",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${taskProgress(task)}%`,
                          background: task.days.every(Boolean)
                            ? "#FFD700"
                            : "#4CAF50",
                          borderRadius: 10,
                        }}
                      />
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>

        <div
          style={{
            marginTop: 20,
            display: "flex",
            gap: 10,
          }}
        >
          <input
            value={newTask}
            placeholder="New chore"
            onChange={(e) => setNewTask(e.target.value)}
          />

          <input
            type="number"
            value={newReward}
            onChange={(e) => setNewReward(Number(e.target.value))}
            style={{ width: 80 }}
          />

          <button onClick={addTask}>Add Chore</button>
        </div>
      </div>

      <div
        style={{
          background: "white",
          borderRadius: 12,
          padding: 20,
          marginTop: 20,
        }}
      >
        <h2>💰 Weekly Earnings</h2>

        <p>Chore Earnings: ${choreEarnings.toFixed(2)}</p>

        <p>
          Completion Bonus:
          {allTasksCompleted ? ` +$${bonusAmount}` : " Not Earned Yet"}
        </p>

        <h2>Total This Week: ${weeklyTotal.toFixed(2)}</h2>

        <div style={{ marginBottom: 10 }}>
          Bonus Amount:
          <input
            type="number"
            value={bonusAmount}
            onChange={(e) => setBonusAmount(Number(e.target.value))}
            style={{
              width: 80,
              marginLeft: 10,
            }}
          />
        </div>

        <button onClick={bankWeek}>Bank This Week</button>

        <button onClick={resetWeek} style={{ marginLeft: 10 }}>
          Reset Week
        </button>
      </div>
    </div>
  );
}
