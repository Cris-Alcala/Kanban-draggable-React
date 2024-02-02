import { useEffect, useRef, useState } from "react";
import { Header } from "../Header/Header";
import { v4 as uuid } from "uuid";
import Board from "../Board/Board";
import { Footer } from "../Footer/Footer";
import { getAll, save } from '../../services/tasks'

function App() {
  const [boards, setBoards] = useState([]);
  const [tasks, setTasks] = useState([]);
  let timeout = useRef(null);
  useEffect(() => {
    setBoards([...getAll('boards')]);
    setTasks([...getAll('tasks')]);
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
          setBoards((prevBoards) => {
            const updatedBoards = prevBoards.map((board_) =>
              board_.title.toLocaleLowerCase() === title.toLocaleLowerCase()
                ? board
                : board_
            );
            save('boards', updatedBoards);
            return updatedBoards;
          });
      } else {
        setBoards((prevBoards) => {
          const newBoards = [...prevBoards, board];
          save('boards', newBoards);
          return newBoards;
        });
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
      setBoards(prevBoards => {
        const newBoards = prevBoards.filter((board_) => board_.id !== board.id);
        save('boards', newBoards);
        return newBoards
      })
    }
  };
  const getFilteredTasks = (index) => {
    return tasks.filter((board_) => board_.board == index);
  };
  const createTask = (task) => {
    setTasks(prevTasks => {
      const newTasks = [...prevTasks, task];
      save('tasks', newTasks);
      return newTasks
    })
  };
  const deleteTask = (task) => {
    setTasks(prevTasks => {
      const newTasks = prevTasks.filter((task_) => task_.id !== task.id);
      save('tasks', newTasks);
      return newTasks;
    })
  };
  const updateTask = (task) => {
    setTasks(prevTasks => {
      const newTasks = prevTasks.map((task_) => (task_.id === task.id ? task : task_));
      save('tasks', newTasks);
      return newTasks;
    })
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
    setTasks(prevTasks => {
      const newTasks = [...prevTasks.map((task) => (task.id == task_.id ? task_ : task))];
      save('tasks', newTasks)
      return newTasks;
    })
  };
  const changeColor = (color, id) => {
    clearTimeout(timeout.current);
    let updatedBoard = boards.find(board_ => board_.id === id);
    updatedBoard.color = color;
    setBoards(prevBoards => {
      const newBoards = [...prevBoards.map(board_ => board_.id == id ? updatedBoard : board_)] ;
      timeout.current = setTimeout(() => {
        save('boards', newBoards)
      }, 2000);
      return newBoards;
    })
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
