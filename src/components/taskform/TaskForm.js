import { useState } from 'react';
import './taskform.css';

export default function TaskForm({ handleAdd }) {
  const [task, setTask] = useState('');
  const addTask = () => {
    handleAdd(task);
    setTask('');
  };
  return (
    <div className="tform">
      <h3>Add Task</h3>
      <input
        type="text"
        name="task"
        id="task"
        placeholder="Enter Task"
        onChange={(e) => setTask(e.target.value)}
        value={task}
      />
      <button onClick={addTask}>Add</button>
    </div>
  );
}
