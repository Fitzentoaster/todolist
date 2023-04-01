import "./normalize.css";
import "./styles.css";

import { useState, useEffect } from "react";

export default function App() {
  const [entryArray, setEntryArray] = useState([]);

  //useEffect Hook to load from localstorage, if it exists
  useEffect(() => {
    if (localStorage.getItem("entryArray")) {
      let arrStr = localStorage.getItem("entryArray");
      setEntryArray(JSON.parse(arrStr));
    }
  }, []);

  return (
    <div className="App">
      <img src="doitlogo.png" alt="Doit Logo" />
      <p className="subtitle">The EZPZ To-Do List</p>
      <NewEntrySubmit setEntryArray={setEntryArray} entryArray={entryArray} />
      <hr />
      {entryArray.map((entry, idx) => {
        return (
          <>
            <div className="entryRow" key={entry.dt}>
              <ListEntry
                idx={idx}
                entryArray={entryArray}
                setEntryArray={setEntryArray}
              />
            </div>
            <hr />
          </>
        );
      })}
    </div>
  );
}

/******************************************************************************
 * NewEntrySubmit component, renders the entry box and submit button
 * for entering new toDo entries
 *
 * @param entryArray the array of ToDo entries
 * @param setEntryArray the setter function of the entryArray
 *****************************************************************************/
function NewEntrySubmit({ entryArray, setEntryArray }) {
  const [entryText, setEntryText] = useState("");
  const [priorityVal, setPriorityVal] = useState(1);

  function handleSubmit(event) {
    event.preventDefault();

    const dt = new Date().toLocaleString();

    if (entryText) {
      let newEntry = {
        text: entryText,
        isDone: false,
        dt: dt,
        priority: priorityVal
      };
      //Update entryArray state
      entryArray.push(newEntry);
      entryArray.sort(function (a, b) {
        return a.priority - b.priority;
      });
      setEntryArray(entryArray.slice());

      //Update entryArray in localstorage
      let str = JSON.stringify(entryArray);
      localStorage.setItem("entryArray", str);

      //Clear the entry text from the input box
      setEntryText("");
      setPriorityVal("1");
    }
  }
  return (
    <div className="newEntrySubmit">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="toDoInput"
          maxLength="240"
          value={entryText}
          placeholder="Enter A To-Do Item"
          onChange={function (e) {
            setEntryText(e.target.value);
          }}
        />
        <select
          className="priorityDropDown"
          value={priorityVal}
          onChange={function (e) {
            setPriorityVal(parseInt(e.target.value, 10));
          }}
        >
          <option value="1">1 (High Priority)</option>
          <option value="2">2 (Mid Priority)</option>
          <option value="3">3 (Low Priority)</option>
        </select>
        <button type="submit" className="addEntryButton">
          Add Entry
        </button>
      </form>
    </div>
  );
}

/******************************************************************************
 * ListEntry component, render an entry of the ToDo list
 *
 * @param idx the array index of the entry to display
 * @param entryArray the array of ToDo entries
 * @param setEntryArray the setter function of the entryArray
 *****************************************************************************/
function ListEntry({ idx, entryArray, setEntryArray }) {
  return (
    <div className="entryRow">
      <CrossOutButton
        entryArray={entryArray}
        setEntryArray={setEntryArray}
        idx={idx}
        crossOut={entryArray[idx].isDone}
      />
      <div className="entryText">
        <p className={entryArray[idx].isDone ? "crossedOut" : "entry"}>
          {entryArray[idx].text}
        </p>
        <p className={entryArray[idx].isDone ? "crossedOutDate" : "date"}>
          Added: {entryArray[idx].dt}
        </p>
        <p
          className={entryArray[idx].isDone ? "crossedOutPriority" : "priority"}
        >
          Priority: {entryArray[idx].priority}
        </p>
      </div>
      <DeleteButton
        entryArray={entryArray}
        setEntryArray={setEntryArray}
        idx={idx}
      />
      <br />
    </div>
  );
}

/******************************************************************************
 * DeleteButton component, displays a trash icon to delete entries from the
 * ToDo list.
 *
 * @param idx the array index of the entry to delete
 * @param entryArray the array of ToDo entries
 * @param setEntryArray the setter function of the entryArray
 *****************************************************************************/
function DeleteButton({ idx, entryArray, setEntryArray }) {
  //Delete an entry from the array state
  function delEntry() {
    entryArray.splice(idx, 1);
    entryArray.sort(function (a, b) {
      return a.priority - b.priority;
    });
    setEntryArray(entryArray.slice());
    //Update entryArray in localstorage
    let str = JSON.stringify(entryArray);
    localStorage.setItem("entryArray", str);
  }

  return (
    <img
      src="/delete.png"
      alt="Delete Button"
      className="delButton"
      onClick={delEntry}
    />
  );
}

/******************************************************************************
 * CrossOutButton, to cross out/uncross out specific entries in the
 * ToDo list.
 *
 * @param idx the array index of the entry to cross out
 * @param entryArray the array of ToDo entries
 * @param setEntryArray the setter function of the entryArray
 *****************************************************************************/
function CrossOutButton({ idx, entryArray, setEntryArray }) {
  //Update the entry's crossed-out bool and update localstorage
  function handleChange() {
    entryArray[idx].isDone = !entryArray[idx].isDone;
    setEntryArray(entryArray.slice());
    let str = JSON.stringify(entryArray);
    localStorage.setItem("entryArray", str);
  }
  return (
    <>
      <input
        className="crossOutButton"
        type="checkbox"
        checked={entryArray[idx].isDone}
        onChange={handleChange}
      />
    </>
  );
}
