import "./styles.css";

import { useState, useEffect } from "react";

export default function App() {
  const [entryArray, setEntryArray] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("entryArray")) {
      let arrStr = localStorage.getItem("entryArray");
      setEntryArray(JSON.parse(arrStr));
    }
  }, []);

  return (
    <div className="App">
      <h1>To-Do-List</h1>
      <NewEntrySubmit setEntryArray={setEntryArray} entryArray={entryArray} />
      <hr />
      {entryArray.map((entry, idx) => {
        return (
          <>
            <div className="entryRow" key={idx}>
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

function NewEntrySubmit({ entryArray, setEntryArray }) {
  const [entryText, setEntryText] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const dt = new Date().toLocaleString();
    if (entryText) {
      let newEntry = {
        text: entryText,
        isDone: false,
        dt: dt
      };
      entryArray.push(newEntry);
      setEntryArray(entryArray.slice());
      let str = JSON.stringify(entryArray);
      localStorage.setItem("entryArray", str);
      setEntryText("");
    }
  }
  return (
    <div className="newEntrySubmit">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={entryText}
          placeholder="Enter A To-Do Item"
          onChange={function (e) {
            setEntryText(e.target.value);
          }}
        />
        <button type="submit">Add Entry</button>
      </form>
    </div>
  );
}

function ListEntry({ idx, entryArray, setEntryArray }) {
  return (
    <div className="entryRow">
      <CrossOutButton
        entryArray={entryArray}
        setEntryArray={setEntryArray}
        idx={idx}
        crossOut={entryArray[idx].isDone}
      />
      <p className={entryArray[idx].isDone ? "crossedOut" : "entry"}>
        {entryArray[idx].text} - Added: {entryArray[idx].dt}
      </p>
      <DeleteButton
        entryArray={entryArray}
        setEntryArray={setEntryArray}
        idx={idx}
      />
      <br />
    </div>
  );
}

function DeleteButton({ idx, entryArray, setEntryArray }) {
  function delEntry() {
    entryArray.splice(idx, 1);
    setEntryArray(entryArray.slice());
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

function CrossOutButton({ idx, entryArray, setEntryArray }) {
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
