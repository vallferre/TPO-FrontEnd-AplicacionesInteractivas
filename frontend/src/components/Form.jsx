import { useState } from "react"
import App from "../App"

const Form = () => {
  const[todos, setTodos] = useState([]);

  const [todo, setTodo] = useState('');

  const handleChange = (e) => {setTodo(e.target.value)}

  const handleClick = () => {
    if (todo.trim() === '') {
      alert('Por favor ingresa una tarea válida.');
      return;
    }
    
    setTodos([...todos, {todo}]); //spread operator

  }

  const deleteTodo = (index) => {
    const newTodos = [...todos];
    newTodos.splice(index, 1); //que indice y cuantos va a borrar
    setTodos(newTodos);
  }

  return (
    <>
    <form onSubmit={(e)=> e.preventDefault()}>
        <label>Tareas pendientes</label><br/>
        <input type="text" name="todo" placeholder="Enter your task" onChange={handleChange}/>
        <button onClick={handleClick}>Agregar</button>
    </form>
    {todos.map((value, index) => <App todo={value.todo} key={index} deleteTodo={deleteTodo} index={index}/>)}
    </>
  )
}

export default Form