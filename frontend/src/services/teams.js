import axios from "axios"
const baseUrl = "/api/teams"

const getAll = async (token) => {
    const config = {
        headers: { Authorization: `bearer ${token}` },
    }

    const request = axios.get(baseUrl, config)
    return request.then(response => response.data)
}

const getTeamByName = async (name) => {
    const request = axios.get(`${baseUrl}/${name}`)
    return request.then(response => response.data)
}

const addWaitingMember = async (id, userId, token) => {
    const config = {
        headers: { Authorization: `bearer ${token}` },
    }

    const request = axios.put(`${baseUrl}/request/${id}`, userId, config)
    return request.then(response => response.data)
}

export default { getAll, getTeamByName, addWaitingMember }