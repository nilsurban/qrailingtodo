import "./Tasks.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Task } from "../../types/task";


const Tasks = () => {
  //#region states
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({ title: false, description: false });
  //#endregion

  //#region useEffect
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/tasks`).then((res) => setTasks(res.data));
  }, []);
  //#endregion

  //#region functions
    //#region validation
    const handleInputChange = (setter: any, field: any) => (e: any) => {
      setter(e.target.value);
      setErrors((prev) => ({ ...prev, [field]: false })); // Fehler entfernen, sobald getippt wird
    };
    //#endregion

    //#region CRUD functions for task
    const handleAddTask = async () => {
      let newErrors = {
        title: !title.trim(),
        description: !description.trim(),
      };

      setErrors(newErrors);

      if (newErrors.title || newErrors.description) return;

      try {
        const newTask: Task  = {
          id: Date.now(), // temp
          title: title,
          description: description, 
          completed: false,
        };

        // API-Request an das Backend
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/tasks`, newTask);

        if (response.status === 201) {
          setTasks([...tasks, response.data]);
          setTitle(""); 
          setDescription("");
        }
      } catch (error) {
        console.error("Error adding task:", error);
      }
    };
   

    //#region todoList
    const handleCheckboxChange = async (taskId: number) => {
      try {
        const taskToUpdate = tasks.find((task) => task.id === taskId);
          
        if (taskToUpdate) {
          const updatedTask: Task = { ...taskToUpdate, completed: !taskToUpdate.completed };
  
          const response = await axios.patch(`${process.env.REACT_APP_API_URL}/tasks/${taskId}`, {
            completed: updatedTask.completed
          });
  
          if (response.status === 200) {
            setTasks((prevTasks) =>
              prevTasks.map((task) =>
                task.id === taskId ? updatedTask : task
              )
            );
          }
        }
      } catch (error) {
        console.error("Error updating task:", error);
      }
    };
  
    const handleDeleteTask = async (taskId: number) => {
      try {
        const response = await axios.delete(`${process.env.REACT_APP_API_URL}/tasks/${taskId}`);
    
        if (response.status === 200) {
          setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
        }
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    };
    //#endregion

  //#endregion
  //#endregion
  
  //#region  rendering
  return (
    <div>
    <div className="container">
    <div className="input-container">
      <div className={`combined-input ${errors.title || errors.description ? "error-border" : ""}`}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={handleInputChange(setTitle, "title")}
          className={errors.title ? "error" : ""}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={handleInputChange(setDescription, "description")}
          className={errors.description ? "error" : ""}
        />
      </div>
      <button onClick={handleAddTask} className="add-button">+</button>
    </div>
  </div>


  {/* ToDo list */}
  <div className="container">
    {tasks && tasks.length > 0 ?
      <ul>
        {tasks.map((task) => (
        <li
          key={task.id}
          onClick={() => handleCheckboxChange(task.id)} 
        >
          <label>
            <div className="task">

              <div className="task-details" >
                <span className={`task-title ${task.completed ? "completed" : ""}`}>
                  {task.title}
                </span>
                <span className={`task-description ${task.completed ? "completed" : ""}`} >
                  {task.description}
                </span>
              </div>
        
              <div className="task-actions">
                <input
                  type="checkbox"
                  checked={task.completed}
                  readOnly 
                />
                <button
                  className="delete-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTask(task.id); 
                  }}
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          </label>
        </li>
        ))}
      </ul>
      :
      <label className={"emptylist"}>Nothing to do 😊</label>
    }
  </div>
</div>
  );
  //#endregion
}

export default Tasks;