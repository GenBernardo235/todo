import './tasklist.css';

import { FaTrash } from 'react-icons/fa';

export default function TaskList({ tasks, handleUpdate, handleDelete }) {
  return (
    <div className="tlist">
      {tasks.map((task) => (
        <Task
          task={task}
          key={task.id}
          handleUpdate={handleUpdate}
          handleDelete={handleDelete}
        />
      ))}
    </div>
  );
}

function Task({ task, handleUpdate, handleDelete }) {
  return (
    <div className={task.done ? 't done' : 't undone'}>
      <p>{task.text}</p>
      <div className="t-actions">
        <FaTrash size={18} onClick={() => handleDelete(task.id)} />
        <input
          type="checkbox"
          id="isdone"
          name="isdone"
          checked={task.done}
          onClick={() => handleUpdate(task.id, {...task, done: !task.done})}
        />
      </div>
    </div>
  );
}
