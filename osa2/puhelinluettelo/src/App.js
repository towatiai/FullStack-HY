import React, { useState, useEffect } from 'react';
import axios from "axios";

// Helper function for binding setValue functions
const binder = (set) => (e) => set(e.target.value);

const Filter = (props) => (
  <div>
    Filter shown with <input value={props.filter} onChange={props.setFilter}/>
  </div>
);

const PersonForm = (props) => {
  const [ name, setNewName ] = useState('')
  const [ number, setNewNumber ] = useState('')

  const addPerson = (e) => {
    e.preventDefault();

    props.addPerson({ name, number });
  }

  return (
    <form onSubmit={addPerson}>
        <div>
          name: <input value={name} onChange={binder(setNewName)}/>
        </div>
        <div>
          number: <input value={number} onChange={binder(setNewNumber)}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  );
}

const Persons = props =>
  props.persons
  .map(person => <p key={person.name}>{person.name}{person.number}</p>)



const App = () => {
  const [persons, setPersons] = useState([]);
  const [ filter, setFilter ] = useState('')

  const addPerson = (newPerson) => {
    if (persons.some(person => person.name === newPerson.name)) {
      alert(`${newPerson.name} is already added to phonebook`);
      return;
    }

    setPersons([...persons, newPerson]);
  }
  
  useEffect(() => {
    // Because of react's limitations...
    (async () => {
      setPersons((await axios.get('http://localhost:3001/persons'))?.data ?? []);
    })();
    
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>
        <Filter filter={filter} setFilter={binder(setFilter)}/>
      <h3>Add new</h3>
      <PersonForm addPerson={addPerson}/>
      <h2>Numbers</h2>
      <Persons persons={persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))}/>
    </div>
  )

}

export default App