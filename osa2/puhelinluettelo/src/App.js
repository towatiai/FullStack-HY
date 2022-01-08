import React, { useState, useEffect } from 'react';
import * as services from "./services";
import "./index.css";

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
  .map(person => <li key={person.id}>
  <span>{person.name}{person.number}</span>
  <button onClick={() => props.delete(person)}>Delete</button>
  </li>)

const Notification = ({ message, type }) => (
  <p className={`${type} notification`}>{message}</p>
)

const App = () => {
  const [persons, setPersons] = useState([]);
  const [ filter, setFilter ] = useState('');
  const [notification, setNotification] = useState();

  const showNotification = notification => {
    setNotification(notification);
    setTimeout(() => setNotification(null), 3000);
  }

  const addPerson = async (newPerson) => {
    const existingPerson = persons.find(person => person.name === newPerson.name);
    if (existingPerson) {
      if (!window.confirm(`${newPerson.name} is already added to phonebook, replace old number with the new one?`)) {
        return;
      }
      
      try {
        const updatedPerson = await services.update(existingPerson, newPerson);
        // Simple replace logic
        setPersons(persons.map(p => p.id !== updatedPerson.id ? p : updatedPerson));
        showNotification({ message: `Updated ${updatedPerson.name}`, type: "success"});
      } catch {
        showNotification({message: `Information of ${existingPerson.name} has already been removed from the server.`, type: "error"});
      }
      
      return;
    }

    try {
      const response = await services.create(newPerson);
      setPersons([...persons, response]);
      showNotification({ message: `Added ${newPerson.name}`, type: "success"});
    } catch(e) {
      showNotification({message: e.response.data.error, type: "error"});
    }
  }

  const deletePerson = async (person) => {
    if (!window.confirm(`Delete ${person.name}?`)) {
      return;
    }
    
    await services.deletePerson(person);
    setPersons(persons.filter(p => p.id !== person.id));
    showNotification({ message: `Removed ${person.name}`, type: "success"});
  }
  
  useEffect(() => {
    // Because of react's limitations...
    (async () => {
      setPersons(await services.getAll());
    })();
    
  }, []);

  return (
    <div>
      <h2>Phonebook</h2>
        { notification?.message && 
        <Notification message={notification.message} type={notification.type}/>
        }
        <Filter filter={filter} setFilter={binder(setFilter)}/>
      <h3>Add new</h3>
      <PersonForm addPerson={addPerson}/>
      <h2>Numbers</h2>
      <ul>
      <Persons persons={persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))}
        delete={deletePerson}/>
      </ul>
    </div>
  )

}

export default App