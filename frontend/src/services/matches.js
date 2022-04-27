import axios from "axios"
const baseUrl = "/api/matches"

const create = async (match, token) => {
    const config = {
        headers: { Authorization: `bearer ${token}` },
    }

    const response = await axios.post(baseUrl, match, config)
    return response.data
}

export default { create }