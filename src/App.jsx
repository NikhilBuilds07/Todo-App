import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import Navbar from './components/Navbar'
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import { v4 as uuidv4 } from 'uuid';

function App() {
  const [todo, setTodo] = useState("")
  const [todos, setTodos] = useState([])
  const [showFinished, setshowFinished] = useState(true)

  useEffect(() => {
    let todoString = localStorage.getItem("todos")
    if (todoString) {
      setTodos(JSON.parse(todoString))
    }
  }, [])

  const [isEditing, setIsEditing] = useState(false);

  const saveToLS = (newTodos) => {
    localStorage.setItem("todos", JSON.stringify(newTodos))
  }

  const handleEdit = (e, id) => {
    let t = todos.filter(i => i.id == id)
    setTodo(t[0].todo)
    setIsEditing(true);
    let newTodos = todos.filter(item => {
      return item.id !== id
    });
    setTodos(newTodos)
    saveToLS(newTodos)

  }
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && todo.trim() !== "") {
      handleAdd();
    }
  };

  const handleDelete = (e, id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this todo?");

    if (!confirmDelete) return;

    let newTodos = todos.filter(item => {
      return item.id !== id;
    });

    setTodos(newTodos);
    saveToLS(newTodos);
  }

  const handleAdd = () => {
    const newTodos = [...todos, { id: uuidv4(), todo, isCompleted: false }];
    setIsEditing(false);

    setTodos(newTodos);
    setTodo("");
    saveToLS(newTodos);
  }

  const handleChange = (e) => {
    setTodo(e.target.value)
  }

  const ToggleFinished = (e) => {
    setshowFinished(!showFinished)
  }


  const handleCheckbox = (e) => {
    let id = e.target.name;
    let index = todos.findIndex(item => {
      return item.id === id;
    })
    let newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    setTodos(newTodos)
    saveToLS(newTodos)

  }

  return (
    <>
      <div className=" min-h-screen bg-sky-100">
      <Navbar/>
      <div className=" container mx-auto my-5 rounded-xl p-4 bg-sky-700 text-white px-4 py-2 shadow-2xl w-[95%] sm:w-2/3 md:w-1/2 ">
      <h1 className='font-bold text-2xl text-center'>iTask - Manage Your Todos at one place</h1>
      <div className="addTodo w-full my-5 mx-2 flex flex-col gap-4">
        <h2 className='text-lg font-bold'>
          {isEditing ? "Edit Todo" : "Add a Todo"}
        </h2>
        <input onChange={handleChange} onKeyDown={handleKeyDown} value={todo} type="text" className='w-full p-1 my-2 rounded-xl text-black' />
        <button disabled={todo.trim().length < 1} onClick={handleAdd} className='bg-green-600 hover:bg-green-700 text-white p-3 rounded-2xl py-1 font-semibold'>{isEditing ? "Update" : "Add a Todo"}</button>
      </div>
      <input onChange={ToggleFinished} type="checkbox" checked={showFinished} className="w-5 h-5 accent-green-500 cursor-pointer align-middle mr-2" />Show Finished
      <h2 className='text-lg font-bold my-3'>Your Todos</h2>
      <div className="todos">
        {todos.length == 0 && <div className='m-5'>No tasks yet!  <br />Add your first task above.</div>}
        {todos.map(item => {
          return (showFinished || !item.isCompleted) && <div key={item.id} className="todo flex w-full my-3 justify-between items-center">
            <div className='flex gap-5'>
              <input name={item.id} onChange={handleCheckbox} type="checkbox" checked={item.isCompleted} id="" className="w-5 h-5 accent-green-500 cursor-pointer hover:scale-100 transition-transform duration-200" />
              <div className={item.isCompleted ? "line-through" : ""}>{item.todo}</div>
            </div>
            <div className="buttons flex h-full">
              <button onClick={(e) => handleEdit(e, item.id)} className='bg-amber-500 bg hover:bg-amber-600 p-3 rounded-2xl py-1 m-2 font-semibold'><FaEdit /></button>
              <button onClick={(e) => { handleDelete(e, item.id) }} className='bg-red-500 hover:bg-red-600 p-3 rounded-2xl py-1 m-2 font-semibold'><MdDelete /></button>
            </div>
          </div>
        })}
      </div>
    </div >
      </div >
    </>
  )
}

export default App