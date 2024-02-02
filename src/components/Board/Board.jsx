import PropTypes from "prop-types";
import { v4 as uuid } from "uuid";
import Task from "./Task/Task";
import { useState } from "react";

const Board = ({ data }) => {
  const [adding, setAdding] = useState(false);
  const {
    board_,
    getFilteredTasks,
    createTask,
    deleteTask,
    updateTask,
    deleteBoard,
    startDrag,
    draggingOver,
    onDrop,
    changeColor
  } = data;
  const addTasktoBoard = (e) => {
    e.preventDefault();
    const title = e.target.task_title.value;
    const description = e.target.task_description.value;
    if (title === "") {
      window.alert("At least you need to specify task title");
    } else {
      const task = {
        id: uuid(),
        title: title,
        description: description,
        board: board_.id,
      };
      createTask(task);
      updateAdding();
    }
  };
  const updateAdding = () => {
    setAdding(!adding);
  };
  const handleBgColor = (e) => {
    changeColor(e.target.value, board_.id)
  }
  return (
    <>
      <div className="board_title">
        <h2>{board_.title}</h2>
        <button onClick={() => deleteBoard(board_)} className="animated">
          ❌
        </button>
      </div>
      {!adding ? (
        <button onClick={updateAdding}>+ Add task</button>
      ) : (
        <div className="add_task">
          <form onSubmit={addTasktoBoard}>
            <label htmlFor="task_title">Task name</label>
            <input type="text" name="task_title" id="task_title" />
            <label htmlFor="task_description">Task description</label>
            <textarea
              name="task_description"
              id="task_description"
              cols="20"
              rows="3"
            ></textarea>
            <div className="buttons">
              <button type="submit">Add</button>
              <button onClick={updateAdding}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      <div
        className="tasks"
        onDragOver={(e) => draggingOver(e)}
        onDrop={(e) => onDrop(e, board_.id)}
      >
        {getFilteredTasks(board_.id).length !== 0 ? (
          <>
            <h2>Tasks</h2>
            {getFilteredTasks(board_.id).map((task) => (
              <div className="task_item" key={task.id}>
                <Task data={{ task, deleteTask, updateTask, startDrag }} />
              </div>
            ))}
          </>
        ) : (
          <h2>No tasks to show</h2>
        )}
      </div>
      <input type="color" name="bg_color" id="bg_color" onChange={handleBgColor} defaultValue={board_.color}/>
    </>
  );
};

Board.propTypes = {
  data: PropTypes.object,
};

export default Board;
