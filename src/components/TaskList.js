
import React, { useState, useEffect } from 'react';
import Timer from './Timer';
import './RescheduleModal.css';
import './TaskList.css';

const TASK_STORAGE_KEY = 'taskList';

const TaskList = ({ tasks, onTaskDelete, onTaskUpdate }) => {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [taskToReschedule, setTaskToReschedule] = useState(null);
  const [newDueDate, setNewDueDate] = useState('');
  const [newDueTime, setNewDueTime] = useState('');

  const handleTaskComplete = (index) => {
    const completedTask = { ...tasks[index], isCompleted: true };
    const updatedTasks = tasks.filter((_, i) => i !== index);

    setCompletedTasks([...completedTasks, completedTask]);
    onTaskUpdate(updatedTasks);

    localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify([...updatedTasks, ...completedTasks]));
  };

  const handleReschedule = (index) => {
    setTaskToReschedule(index);
    setShowRescheduleModal(true);
  };

  const handleRescheduleSubmit = () => {
    if (newDueDate && newDueTime) {
      const updatedTask = {
        ...tasks[taskToReschedule],
        dueDateTime: new Date(`${newDueDate}T${newDueTime}`),
        dueDate: newDueDate,
        dueTime: newDueTime,
      };

      const updatedTasks = tasks.map((task, i) =>
        i === taskToReschedule ? updatedTask : task
      );

      onTaskUpdate(updatedTasks);

      setShowRescheduleModal(false);
      setTaskToReschedule(null);
      setNewDueDate('');
      setNewDueTime('');
    }
  };

  const handleMarkIncomplete = (index) => {
    const updatedCompletedTasks = completedTasks.filter((_, i) => i !== index);
    const taskToMarkIncomplete = { ...completedTasks[index], isCompleted: false };

    setCompletedTasks(updatedCompletedTasks);
    onTaskUpdate([...tasks, taskToMarkIncomplete]);

    localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify([...tasks, ...updatedCompletedTasks]));
  };

  const activeTasks = tasks.filter((task) => !task.isCompleted);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem(TASK_STORAGE_KEY));
    if (storedTasks) {
      const activeTasksFromStorage = storedTasks.filter((task) => !task.isCompleted);
      const completedTasksFromStorage = storedTasks.filter((task) => task.isCompleted);
      onTaskUpdate(activeTasksFromStorage);
      setCompletedTasks(completedTasksFromStorage);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const updatedTasks = tasks.map((task) => {
        if (!task.isCompleted && task.dueTime && new Date(task.dueDateTime).getTime() <= now) {
          return { ...task, isCompleted: true };
        }
        return task;
      });

      const newActiveTasks = updatedTasks.filter((task) => !task.isCompleted);
      const newCompletedTasks = [...completedTasks, ...updatedTasks.filter((task) => task.isCompleted && !completedTasks.some((t) => t.id === task.id))];

      onTaskUpdate(newActiveTasks);
      setCompletedTasks(newCompletedTasks);

      localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify([...newActiveTasks, ...newCompletedTasks]));
    }, 1000);

    return () => clearInterval(interval);
  }, [tasks, completedTasks, onTaskUpdate]);

  useEffect(() => {
    localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify([...tasks, ...completedTasks]));
  }, [tasks, completedTasks]);

  return (
    <div className="task-list">
      <div>
        <h2>Active Tasks</h2>
        {activeTasks.length > 0 ? (
          activeTasks.map((task, index) => (
            <div key={index} className="task-item">
              <div>
                <strong>Task:</strong> {task.task}
                <br />
                <strong>Due Date:</strong> {task.dueDate}
                <br />
                <strong>Due Time:</strong> {task.dueTime}
                <br />
                <Timer dueDateTime={task.dueDateTime} onTimeOut={() => handleTaskComplete(index)} />
              </div>
              <div className="task-actions">
                <button className="action-button" onClick={() => handleReschedule(index)}>Reschedule</button>
                <button className="action-button" onClick={() => handleTaskComplete(index)}>Completed</button>
                <button className="action-button" onClick={() => onTaskDelete(index)}>Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p>No active tasks available</p>
        )}
      </div>
      <div>
        <h2>Completed Tasks</h2>
        {completedTasks.length > 0 ? (
          completedTasks.map((task, index) => (
            <div key={index} className="task-item completed">
              <div>
                <strong>Task:</strong> {task.task}
                <br />
                <strong>Due Date:</strong> {task.dueDate}
                <br />
                <strong>Due Time:</strong> {task.dueTime}
              </div>
              <div className="task-actions">
                <button className="action-button" onClick={() => handleMarkIncomplete(index)}>Mark Incomplete</button>
              </div>
            </div>
          ))
        ) : (
          <p>No completed tasks yet</p>
        )}
      </div>
      {showRescheduleModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowRescheduleModal(false)}>&times;</span>
            <h2>Reschedule Task</h2>
            <label htmlFor="newDueDate">New Due Date:</label>
            <input
              type="date"
              id="newDueDate"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
            />
            <label htmlFor="newDueTime">New Due Time:</label>
            <input
              type="time"
              id="newDueTime"
              value={newDueTime}
              onChange={(e) => setNewDueTime(e.target.value)}
            />
            <button onClick={handleRescheduleSubmit}>Submit</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
