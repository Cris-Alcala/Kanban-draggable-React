import PropTypes from "prop-types";
import { useState } from "react";

const Task = ({ data }) => {
  const { task, deleteTask, updateTask, startDrag } = data;
  const [modifying, setModifying] = useState(false);
  const updateMod = () => {
    setModifying(!modifying);
  };
  const deleteTaskofBoard = (task) => {
    const confirm = window.confirm(
      `Are you sure to delete to delete '${task.title}'`
    );
    if (confirm) {
      deleteTask(task);
    }
  };
  const updateTaskofBoard = (e) => {
    e.preventDefault();
    const title = e.target.mod_task_title.value;
    const description = e.target.mod_task_description.value;
    const task_ = {
      id: task.id,
      title,
      description,
      board: task.board,
    };
    updateTask(task_);
    updateMod();
  };
  return (
    <div draggable onDragStart={(e) => startDrag(e, task)}>
      <div className="task_title">
        <h3>{task.title}</h3>
      </div>
      <div className="task_description">
        <p>{task.description}</p>
      </div>
      <div className="buttons">
        <div className="delete_task">
          <button onClick={() => deleteTaskofBoard(task)}>❌</button>
        </div>
        {!modifying && (
          <div className="modify_button">
            <button onClick={updateMod}>✏️</button>
          </div>
        )}
      </div>
      {modifying && (
        <div className="modify_task">
          <form onSubmit={updateTaskofBoard}>
            <label htmlFor="mod_task_title">Title</label>
            <input
              type="text"
              name="mod_task_title"
              id="mod_task_title"
              defaultValue={task.title}
            />
            <label htmlFor="mod_task_description">Description</label>
            <textarea
              name="mod_task_description"
              id="mod_task_description"
              cols="20"
              rows="3"
            >
              {task.description}
            </textarea>
            <div className="buttons">
              <button type="submit">Update</button>
              <button onClick={updateMod}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

Task.propTypes = {
  data: PropTypes.object,
};

export default Task;
