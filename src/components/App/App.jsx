import { useEffect, useState } from "react";
import { Header } from "../Header/Header";
import { v4 as uuid } from "uuid";
import Board from "../Board/Board";
import { Footer } from "../Footer/Footer";
import { getAll, create, update, del } from '../../services/tasks'

function App() {
  const [boards, setBoards] = useState([]);
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    getAll('boards')
      .then(response => response.json())
      .then(data => setBoards([...data]));
    getAll('tasks')
      .then(response => response.json())
      .then(data => setTasks([...data]));
  },[])
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
        color: '#ffff94',
      };
      if (existingBoard !== undefined) {
        board.id = existingBoard.id;
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
          update('boards', board);
      } else {
        setBoards([...boards, board]);
        create('boards', board);
      }
    }
    e.target.board_name.value = "";
  };
  const deleteBoard = (board) => {
    if (tasks.find((task_) => task_.board === board.id) !== undefined) {
      window.alert(
        "You must complete or delete all tasks of this board before deleting it"
      )
    } else {
      setBoards([...boards.filter((board_) => board_.id !== board.id)]);
      del('boards', board.id); // TODO Last done
    }
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
  const changeColor = (color, id) => {
    setBoards([...boards.map(board_ => board_.id == id ? {...board_, color} : board_)])
  }
  return (
    <div className="main_app">
      <Header onSubmit={addBoard} />
      <div className="boards">
        {boards.map((board_) => (
          <div className="board_item" key={board_.id} style={{backgroundColor:board_.color}}>
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
                changeColor
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
