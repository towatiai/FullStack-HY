import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

export const getAll = async () => {
  return (await axios.get(baseUrl)).data;
}

export const create = async newObject => {
  return (await axios.post(baseUrl, newObject)).data;
}

export const update = async (existingPerson, newPerson) => {
  return (await axios.put(`${baseUrl}/${existingPerson.id}`, newPerson)).data;
}

export const deletePerson = async (person) => {
    return (await axios.delete(`${baseUrl}/${person.id}`)).data;
}