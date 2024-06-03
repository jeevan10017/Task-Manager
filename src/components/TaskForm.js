import React, { useState } from 'react';

const TaskForm = ({ addTask }) => {
  const [task, setTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (task.trim() && dueDate && dueTime) {
      const dueDateTime = new Date(`${dueDate}T${dueTime}`);
      addTask({ task, dueDate, dueTime, dueDateTime });
      setTask('');
      setDueDate('');
      setDueTime('');
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter a task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <input
        type="time"
        value={dueTime}
        onChange={(e) => setDueTime(e.target.value)}
      />
      <button type="submit" className="create-task-button">
        Create Task
      </button>
    </form>
  );
};

export default TaskForm;
