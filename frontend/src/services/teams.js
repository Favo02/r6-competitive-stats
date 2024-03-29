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

// AUTH - create a new team (creator set as admin)
const create = async (newTeam, token) => {
    const config = {
        headers: { Authorization: `bearer ${token}` },
    }

    const response = await axios.post(baseUrl, { name: newTeam }, config)
    return response.data
}

// AUTH - edit a team (editor should be admin)
const edit = async (teamId, newTeamName, token) => {
    const config = {
        headers: { Authorization: `bearer ${token}` },
    }

    const response = await axios.put(`${baseUrl}/${teamId}`, { name: newTeamName }, config)
    return response.data
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

// AUTH - promote to admin a member
// userId: id of the user to be promoted
// teamId: id of the team the user will be promoted in
const promoteMember = async (userId, teamId, token) => {
    const config = {
        headers: { Authorization: `bearer ${token}` },
    }

    const request = axios.put(`${baseUrl}/promote/${userId}`, { teamId: teamId }, config)
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

// AUTH - leave a team
// teamId: id of the team the user will leave
const leaveTeam = async (teamId, token) => {
    const config = {
        headers: { Authorization: `bearer ${token}` },
    }

    const request = axios.put(`${baseUrl}/leave/${teamId}`, {}, config)
    return request.then(response => response.data)
}

// AUTH - disband a team
// teamId: id of the team the user will disband
const disbandTeam = async (teamId, token) => {
    const config = {
        headers: { Authorization: `bearer ${token}` },
    }

    const request = axios.delete(`${baseUrl}/disband/${teamId}`, config)
    return request.then(response => response.data)
}

// -------------- TEAM CATEGORIES SYSTEM

// AUTH - team admin adds a category to the team
// teamId: id of the team to get categories from
const getCategories = async (teamId, token) => {
    const config = {
        headers: { Authorization: `bearer ${token}` },
    }

    const request = axios.get(`${baseUrl}/categories/${teamId}`, config)
    return request.then(response => response.data)
}

// AUTH - team admin adds a category to the team
// teamId: id of the team to add category to
// category: name of the category
const addCategory = async (teamId, category, token) => {
    const config = {
        headers: { Authorization: `bearer ${token}` },
    }

    const request = axios.put(`${baseUrl}/categories/${teamId}`, { category: category }, config)
    return request.then(response => response.data)
}

// AUTH - team admin remove a category from a team
// teamId: id of the team to remove category from
// category: name of the category
const removeCategory = async (teamId, category, token) => {

    // special axios request to pass body parameter in delete request
    const request = axios.delete(`${baseUrl}/categories/${teamId}`,
        {
            headers: { Authorization: `bearer ${token}` },
            data: { category: category }
        }
    )
    return request.then(response => response.data)
}

export default {
    getAll, getTeamByName, create, edit,
    kickMember, promoteMember,
    addWaitingMember, acceptWaitingMember, declineWaitingMember,
    leaveTeam, disbandTeam,
    getCategories, addCategory, removeCategory
}