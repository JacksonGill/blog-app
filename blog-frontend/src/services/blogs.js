import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null;

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const setToken = userToken => {
  token = `bearer ${userToken}`
}

const create = async blogObject => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, blogObject, config)
  return response.data
}

const update = async blogObject => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.put(`${baseUrl}/${blogObject.id}`, blogObject, config)
  return response.data
}

const deleteBlog = async (blogObject) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.delete(`${baseUrl}/${blogObject.id}`, config)
  return response.data
}

export default { getAll, setToken, create, update, deleteBlog }