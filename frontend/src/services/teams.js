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

// id: id of the team to join
// userId: id of the user that requests to join
const addWaitingMember = async (id, userId, token) => {
    const config = {
        headers: { Authorization: `bearer ${token}` },
    }

    const request = axios.put(`${baseUrl}/request/${id}`, userId, config)
    return request.then(response => response.data)
}

// userId: id of the user to accept
// teamId: id of the team the user will be accepted to
const acceptWaitingMember = async (userId, teamId, token) => {
    const config = {
        headers: { Authorization: `bearer ${token}` },
    }

    const request = axios.put(`${baseUrl}/accept/${userId}`, { teamId: teamId }, config)
    return request.then(response => response.data)
}

// userId: id of the user to decline
// teamId: id of the team the user will be decline to
const declineWaitingMember = async (userId, teamId, token) => {
    const config = {
        headers: { Authorization: `bearer ${token}` },
    }

    const request = axios.put(`${baseUrl}/decline/${userId}`, { teamId: teamId }, config)
    return request.then(response => response.data)
}

export default { getAll, getTeamByName, addWaitingMember, acceptWaitingMember, declineWaitingMember }