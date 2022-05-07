import axios from "axios"
const baseUrl = "/api/teams"

// AUTH - get every team the user is in
const getAll = async (token) => {
    const config = {
        headers: { Authorization: `bearer ${token}` },
    }

    const request = axios.get(baseUrl, config)
    return request.then(response => response.data)
}

// UNAUTH - get every team with this name
const getTeamByName = async (name) => {
    const request = axios.get(`${baseUrl}/${name}`)
    return request.then(response => response.data)
}


// -------------- TEAM INVITE SYSTEM

// AUTH - kick a member from a team
// userId: id of the user to be kicked
// teamId: id of the team the user will be kicked from
const kickMember = async (userId, teamId, token) => {
    const config = {
        headers: { Authorization: `bearer ${token}` },
    }

    const request = axios.put(`${baseUrl}/kick/${userId}`, { teamId: teamId }, config)
    return request.then(response => response.data)
}

// AUTH - request to join a team, added to waitingMember list
// id: id of the team to join
const addWaitingMember = async (id, token) => {
    const config = {
        headers: { Authorization: `bearer ${token}` },
    }

    const request = axios.put(`${baseUrl}/request/${id}`, {}, config)
    return request.then(response => response.data)
}

// AUTH - accept waiting member, move him to members (accepter should be admin)
// userId: id of the user to accept
// teamId: id of the team the user will be accepted to
const acceptWaitingMember = async (userId, teamId, token) => {
    const config = {
        headers: { Authorization: `bearer ${token}` },
    }

    const request = axios.put(`${baseUrl}/accept/${userId}`, { teamId: teamId }, config)
    return request.then(response => response.data)
}

// AUTH - decline waiting member, remove him from waiting members (decliner should be admin)
// userId: id of the user to decline
// teamId: id of the team the user will be decline to
const declineWaitingMember = async (userId, teamId, token) => {
    const config = {
        headers: { Authorization: `bearer ${token}` },
    }

    const request = axios.put(`${baseUrl}/decline/${userId}`, { teamId: teamId }, config)
    return request.then(response => response.data)
}

export default {
    getAll, getTeamByName,
    kickMember,
    addWaitingMember, acceptWaitingMember, declineWaitingMember
}