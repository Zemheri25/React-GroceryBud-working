import React, { useState, useEffect } from "react";
import List from "./List";
import Alert from "./Alert";


const getFromLocalStorage = () => {
  const items = localStorage.getItem("list");
  if(items) {
    return JSON.parse(localStorage.getItem("list"))
  }
  else {
    return []
  }
}



function App() {
  const [name, setName] = useState("");
  const [list, setList] = useState(getFromLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState({ show: false, msg: "", type: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      showAlert(true, "danger", "please enter value")
     
    } else if (name && isEditing) {
      setList(list.map((item) => {
        if(item.id === editId) {
          return {...item, title : name}
        }
        return item
      }))

      setName("");
      setEditId(null)
      setIsEditing(false)
      showAlert(true, "success", "The item has editted")
    } else {
      showAlert(true, "success", "İtem added to the list")
      const newItem = { id: new Date().getTime().toString(), title: name };
      setList([...list, newItem]);
      setName("");
      

    }
  };


  const showAlert = (show = false, type = "", msg = "") => {
    setAlert({show, type,msg})
    
  }

  const clearItems = () => {
    showAlert(true, "danger", "Empty List")
    setList([]);
  }

  const removeItem = (id) => {
    showAlert(true, "danger", "You deleted the item")
    const newItems = list.filter((item)=> item.id !== id);
    setList(newItems)
  }

  const editItem = (id) => {
    const specification = list.find(item => item.id == id);
    setIsEditing(true)
    setEditId(id)
    setName(specification.title)
  }

  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list))
  }, [list])



  return (
    <div className="section-center">
      <form className="grocery-form" onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert = {showAlert}/>}
        <h3>Grocery Bud</h3>
        <div className="form-control">
          <input
            type="text"
            className="grocery"
            placeholder="e.g. eggs"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" className="submit-btn">
            {isEditing ? "edit" : "submit"}
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div className="grocery-container">
          <List items={list} removeItem = {removeItem} editItem = {editItem}/>
          <button className="clear-btn" onClick={clearItems}>Clear İtems</button>
        </div>
      )}
    </div>
  );
}

export default App;
