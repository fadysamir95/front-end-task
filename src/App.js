import React, { useState } from 'react';
import './App.css';
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import {v4} from "uuid";
import _ from "lodash";

const task1 = {
  id: v4(),
  name: "Make daily morning routine"
}

const task2 = {
  id: v4(),
  name: "Buy some fruits"
}

function App() {
  const [text, setText] = useState("")
  const [state, setState] = useState({
    "todo": {
      title: "Todo",
      tasks: [task1, task2]
    },
    "in-progress": {
      title: "In Progress",
      tasks: []
    },
    "done": {
      title: "Done",
      tasks: []
    }
  })

  const handleDragEnd = ({destination, source}) => {
    if (!destination) {
      return
    }

    if (destination.index === source.index && destination.droppableId === source.droppableId) {
      return
    }

    // Creating a copy of task before removing it from the state
    const taskCopy = {...state[source.droppableId].tasks[source.index]}

    setState(prev => {
      prev = {...prev}

      // Remove from previous tasks array
      prev[source.droppableId].tasks.splice(source.index, 1)

      // Adding to new tasks array location
      prev[destination.droppableId].tasks.splice(destination.index, 0, taskCopy)

      return prev
    })
  }

  const addTask = () => {
    setState(prev => {
      return {
        ...prev,
        todo: {
          title: "Todo",
          tasks: [
            {
              id: v4(),
              name: text
            },
            ...prev.todo.tasks
          ]
        }
      }
    })
    setText("")
  }

  return (
    <div className="App">
      <h1>Todo App</h1>
      <div class="input-wrapper">
        <input type="text" placeholder="Write your task here" value={text} onChange={(e) => setText(e.target.value)}/>
        <button onClick={addTask}>Add</button>
      </div>
      <div class="container">
      <div class="columns-wrapper">
      <DragDropContext onDragEnd={handleDragEnd}>
        {_.map(state, (data, key) => {
          return(
            <div key={key} className={"column"}>
              <h3>{data.title}</h3>
              <Droppable droppableId={key}>
                {(provided, snapshot) => {
                  return (
                    <div ref={provided.innerRef} {...provided.droppableProps} className={"droppable-col"}>
                      {data.tasks.map((el, index) => {
                        return(
                          <Draggable key={el.id} index={index} draggableId={el.id}>
                            {(provided, snapshot) => {
                              console.log(snapshot)
                              return (
                                <div className={`task ${snapshot.isDragging && "dragging"}`} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                  {el.name}
                                </div>
                              )
                            }}
                          </Draggable>
                        )
                      })}
                      {provided.placeholder}
                    </div> )}}
              </Droppable>
            </div>
          )
        })}
      </DragDropContext>
      </div>
      </div>
    </div>
  );
}

export default App;
