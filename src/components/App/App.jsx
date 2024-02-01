import { useState } from "react";
import { Header } from "../Header/Header";
import { v4 as uuid } from "uuid";
import Board from "../Board/Board";
import { Footer } from "../Footer/Footer";

function App() {
  const [boards, setBoards] = useState([]);
  const [tasks, setTasks] = useState([]);
  const addBoard = (e) => {
    e.preventDefault();
    const title = e.target.board_name.value;
    if (title === "") window.alert("At least you need to specify board title");
    else {
      const existingBoard = boards.find(
        (board) => board.title.toLocaleLowerCase() === title.toLocaleLowerCase()
      );
      const board = {
        id: uuid(),
        title,
      };
      if (existingBoard !== undefined) {
        const confirm = window.confirm(
          "You already have a board with this name, do you want to rewrite it?"
        );
        if (confirm)
          setBoards([
            ...boards.map((board_) =>
              board_.title.toLocaleLowerCase() === title.toLocaleLowerCase()
                ? board
                : board_
            ),
          ]);
      } else setBoards([...boards, board]);
    }
    e.target.board_name.value = "";
  };
  const deleteBoard = (board) => {
    tasks.find((task_) => task_.board === board.id) !== undefined
      ? window.alert(
          "You must complete or delete all tasks of this board before deleting it"
        )
      : setBoards([...boards.filter((board_) => board_.id !== board.id)]);
  };
  const getFilteredTasks = (index) => {
    return tasks.filter((board_) => board_.board == index);
  };
  const createTask = (task) => {
    setTasks((prevTasks) => [...prevTasks, task]);
  };
  const deleteTask = (task) => {
    setTasks([...tasks.filter((task_) => task_.id !== task.id)]);
  };
  const updateTask = (task) => {
    setTasks([...tasks.map((task_) => (task_.id === task.id ? task : task_))]);
  };
  const startDrag = (e, task) => {
    e.dataTransfer.setData("taskID", task.id);
  };
  const draggingOver = (e) => {
    e.preventDefault();
  };
  const onDrop = (e, board) => {
    const taskID = e.dataTransfer.getData("taskID");
    const task_ = tasks.find((task_) => task_.id == taskID);
    task_.board = board;
    const newState = tasks.map((task) => (task.id == task_.id ? task_ : task));
    setTasks([...newState]);
  };
  return (
    <div className="main_app">
      <Header onSubmit={addBoard} />
      <div className="boards">
        {boards.map((board_) => (
          <div className="board_item" key={board_.id}>
            <Board
              data={{
                board_,
                getFilteredTasks,
                createTask,
                deleteTask,
                updateTask,
                deleteBoard,
                startDrag,
                draggingOver,
                onDrop,
              }}
            />
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default App;
