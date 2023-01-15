import { useState } from 'react'
import { useEffect } from 'react'

import axios from 'axios'

import Person from './components/Person'
import Filter from './components/Filter'
import PersonsForm from './components/PersonsForm'
import personsService from './services/persons'
import Notification from './components/Notification'

const App = () => {

  const [persons, setPersons] = useState([])                //  Will Store Input 
  const [filteredPersons, setFilteredPersons] = useState([]) //  Will store Filtered Input              

  const [newName, setNewName] = useState('')      //  Will control form input
  const [newPhone, setNewPhone] = useState('')    //  Will control form input
  const [newFilter, setNewFilter] = useState('')  //  Will control form input
  const [notificationMessage, setNotificationMessage] = useState('')


  //  EFFECT HOOKS DEFINITIONS (Things that are outside the normal scope of the program)
  //  By definition, state hooks will allow state components to handle side effects
  //  Side effects are anything that affects something outside of the scope of the current function that's being executed  
  //  Basically, effect hooks will be functions that manage things like data fetching, setting up a subscription, 
  //  manually changing the DOM in React components, and stuff of that sort.

  // Will fetch data from server at the given URL7
  // When the HTTP request is successful, the promise returns the data sent back in the response from the backend.
  useEffect(() => {
    personsService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  //  EVENT HANDLER DEFINITIONS (Things that will be executed in response to different events in our app)
  //  Basically, they are functions that will be executed as a result of a 'change' in our program
  //  This may be a change of state of a component or JXL element

  //  Add person to the phonebook
  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newPhone,
      // ERROR: DELETING PERSONS CHANGES THE LENGTH AND MAY LEAD TO REPEATE IDs
      // Proposed solution: Find the max ID and set id to maxID+1
      /*
      id: persons.length > 0? (Math.max(...persons.map(n => n.id)) + 1) : 0
      */
      id: persons.length > 0 ? (Math.max(...persons.map(n => n.id)) + 1) : 0
    }
    //  Do nothing if it already exists in phonebook
    if (persons.some(person => (person.name) === (personObject.name))) {
      //alert(`${newName} is already added to phonebook`)
      //return
      let existingPerson = persons.find(person => (person.name) === (personObject.name))
      let existingPersonId = existingPerson.id
      personsService
        .update(existingPersonId, personObject)
        .then(returnedPerson => {
          console.log("The returned person's name: ", returnedPerson.name)
          setPersons(persons.map(p => p.name === personObject.name ? { ...p, number: personObject.number } : p))
          setNewName('')
          setNewPhone('')
        })
      console.log(persons)
      setNotificationMessage(
        `${personObject.name}'s number updated on server`
      )
      setTimeout(() => {
        setNotificationMessage(null)
      }, 4000)
    } else {
      personsService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewPhone('')
        })
      console.log(persons)
      setNotificationMessage(
        `${personObject.name} added to server`
      )
      setTimeout(() => {
        setNotificationMessage(null)
      }, 4000)
    }

  }

  //  delete person from phonebook
  const deletePerson = (person) => {
    if (!(window.confirm(`Delete ${person.name}?`))) {
      return;
    }
    personsService.delete_(person.id)
    setPersons(persons.filter(p => p.id !== person.id))
  }

  //  Will be triggered on submision of a new name -> submission of a name
  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  //  Will be triggered on submission of a new form -> submission of a phone number
  const handlePhoneChange = (event) => {
    console.log(event.target.value)
    setNewPhone(event.target.value)
  }

  //  Will be triggered on submission of a new filter
  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setNewFilter(event.target.value)
    setFilteredPersons(persons.filter(person => person.name.toUpperCase().includes(event.target.value.toUpperCase())))
  }

  // Our React App Will:
  //  Display a filter option for our elements 
  //  Add a form of persons whose state can change 
  //  Print the elements on the form
  //  The persons array is the most important element. It's displayed on the scren through a form. 
  //  It's state may change as a result of:
  //   Inputting a new filter
  //   Adding a new person 
  //   Adding data to it extracted from an external server

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} />
      <Filter filter={newFilter} handler={handleFilterChange} />
      <h2>Add New</h2>
      <PersonsForm handler={addPerson} name={newName} nameHandler={handleNameChange} phone={newPhone} phoneHandler={handlePhoneChange} />
      <h2>Numbers</h2>
      <ul>
        {newFilter === '' ?
          persons.map(person => <Person key={person.id} name={person.name} number={person.number} deletePerson={() => deletePerson(person)} />)
          :
          filteredPersons.map(person => <Person key={person.id} name={person.name} number={person.number} deletePerson={() => deletePerson(person)} />)
        }
      </ul>
    </div>
  )
}

export default App
