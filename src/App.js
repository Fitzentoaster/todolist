import "./normalize.css";
import "./styles.css";

import { useState, useEffect } from "react";

function sortArray(entryArray, sortType) {
  switch (sortType) {
    case "alpha": {
      entryArray.sort((a, b) => {
        if (a.text.toUpperCase() > b.text.toUpperCase()) {
          return 1;
        } else if (b.text.toUpperCase() > a.text.toUpperCase()) {
          return -1;
        } else {
          return 0;
        }
      });
      break;
    }
    case "priority": {
      entryArray.sort((a, b) => a.priority - b.priority);
      break;
    }
    case "datetime": {
      entryArray.sort((a, b) => a.timestamp - b.timestamp);
      break;
    }
    case "compfirst": {
      entryArray.sort((a, b) => b.isDone - a.isDone);
      break;
    }
    case "complast": {
      entryArray.sort((a, b) => a.isDone - b.isDone);
      break;
    }
    default:
      entryArray.sort((a, b) => a.priority - b.priority);
      break;
  }
}

export default function App() {
  const [entryArray, setEntryArray] = useState([]);
  const [sortType, setSortType] = useState("priority");

  //useEffect Hook to load from localstorage, if it exists
  useEffect(() => {
    if (localStorage.getItem("entryArray")) {
      let arrStr = localStorage.getItem("entryArray");
      setEntryArray(JSON.parse(arrStr));
    }
  }, []);

  return (
    <div className="App">
      <img src="./doitlogo.png" alt="Doit Logo" />
      <p className="subtitle">The EZPZ To-Do List</p>
      <NewEntrySubmit
        setEntryArray={setEntryArray}
        entryArray={entryArray}
        setSortType={setSortType}
        sortType={sortType}
      />
      <hr />
      {entryArray.map((entry, idx) => {
        return (
          <>
            <div className="entryRow" key={entry.timestamp}>
              <ListEntry
                idx={idx}
                entryArray={entryArray}
                setEntryArray={setEntryArray}
                sortType={sortType}
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
 * @param sortType a string denoting the type of sort to utilize
 * @param setSortType the setter function of sortType
 *****************************************************************************/
function NewEntrySubmit({ entryArray, setEntryArray, sortType, setSortType }) {
  const [entryText, setEntryText] = useState("");
  const [priorityVal, setPriorityVal] = useState(1);

  function handleSubmit(event) {
    event.preventDefault();

    const dt = new Date();
    const ts = Date.now();

    if (entryText) {
      let newEntry = {
        text: entryText,
        isDone: false,
        dt: dt,
        timestamp: ts,
        dtstring: dt.toLocaleString(),
        priority: priorityVal
      };
      //Update entryArray state
      entryArray.push(newEntry);
      sortArray(entryArray, sortType);
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
      <SortSelector
        sortType={sortType}
        setSortType={setSortType}
        entryArray={entryArray}
        setEntryArray={setEntryArray}
      />
    </div>
  );
}

/******************************************************************************
 * SortSelector component, renders the sort-by dropdown and the sort
 * submit button
 *
 * @param entryArray the array of ToDo entries
 * @param setEntryArray the setter function of the entryArray
 * @param sortType a string denoting the type of sort to utilize
 * @param setSortType the setter function of sortType
 *****************************************************************************/
function SortSelector({ entryArray, setEntryArray, sortType, setSortType }) {
  function handleSubmit(event) {
    event.preventDefault();
    sortArray(entryArray, sortType);
    setEntryArray(entryArray.slice());
  }
  return (
    <div className="sortSelector">
      <form onSubmit={handleSubmit}>
        <select
          className="sortDropDown"
          value={sortType}
          onChange={function (e) {
            setSortType(e.target.value);
          }}
        >
          <option value="priority">Priority</option>
          <option value="datetime">Date/Time Added</option>
          <option value="alpha">Alphabetical</option>
          <option value="compfirst">Completed First</option>
          <option value="complast">Completed Last</option>
        </select>
        <button type="submit" className="sortButton">
          Sort
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
 * @param sortType a string denoting the sort type to utilize
 *****************************************************************************/
function ListEntry({ idx, entryArray, setEntryArray, sortType }) {
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
          Added: {entryArray[idx].dtstring}
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
        sortType={sortType}
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
 * @param sortType a string denoting what type of sort to utilize
 *****************************************************************************/
function DeleteButton({ idx, entryArray, setEntryArray, sortType }) {
  //Delete an entry from the array state
  function delEntry() {
    entryArray.splice(idx, 1);
    sortArray(entryArray, sortType);
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
