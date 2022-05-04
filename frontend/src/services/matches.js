import axios from "axios"
const baseUrl = "/api/matches"

const getAll = async (token) => {
    const config = {
        headers: { Authorization: `bearer ${token}` },
    }

    const request = axios.get(baseUrl, config)
    return request.then(response => response.data)
}

const create = async (match, token) => {
    const config = {
        headers: { Authorization: `bearer ${token}` },
    }

    const response = await axios.post(baseUrl, match, config)
    return response.data
}

const remove = async (id, token) => {
    const config = {
        headers: { Authorization: `bearer ${token}` },
    }

    const response = await axios.delete(`${baseUrl}/${id}`, config)
    return response.data
}

export default { getAll, create, remove }