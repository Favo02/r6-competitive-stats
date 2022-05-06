import { useState, useEffect, useRef } from "react"

import teamService from "../../services/teams"

const NewTeamForm = ({ user }) => {

    // name the user has written in the input field
    const [search, setSearch] = useState("")
    // list of the teams matching the search
    const [searchedTeams, setSearchedTeams] = useState([])
    const [searchStatus, setSearchStatus] = useState("")

    useEffect(() => {
        if (search.length > 2) {
            try {
                teamService
                    .getTeamByName(search)
                    .then(teams => {
                        setSearchedTeams(
                            teams
                                .map(t => (
                                    {
                                        name: t.name,
                                        id: t.id,
                                        member: t.members.map(member => member.id).includes(user.id) ? true : false,
                                        waitingMember: t.waitingMembers.includes(user.id) ? true : false,
                                    }
                                ))
                        )
                        teams.length === 0
                            ? setSearchStatus("No teams found")
                            : setSearchStatus("")
                    })
            }
            catch (exception) {
                console.log(exception)
                if (exception.response) {
                    console.log("Error", exception.response.status, ":", exception.response.data.error)
                }
            }
        }
        else {
            setSearchedTeams([])
            setSearchStatus("Type at least 3 characters to search a team")
        }
    }, [search])

    const teamInput = useRef()
    const handleSearch = () => {
        setSearch(teamInput.current.value)
    }

    const handleJoinRequest = (team) => {
        try {
            teamService
                .addWaitingMember(team.id, user.id, user.token)
                .then(response => {
                    setSearchedTeams([])
                    setSearchStatus(`Added to waiting list of ${response.name}`)
                })
        }
        catch (exception) {
            console.log(exception)
            if (exception.response) {
                console.log("Error", exception.response.status, ":", exception.response.data.error)
            }
        }
    }

    return (
        <div>
            <label>Search a team by his name:</label>
            <input type="text" ref={teamInput} onChange={handleSearch} />
            <h2>Teams found with this name:</h2>
            <h3>{searchStatus}</h3>
            <div>{searchedTeams.map(t =>
                <h3 key={t.id}>
                    {t.name} - {t.id}
                    {t.member && <button disabled>Already in this team</button>}
                    {t.waitingMember && <button disabled>Already requested to join this team</button>}
                    {!t.member && !t.waitingMember &&
                        <button onClick={() => handleJoinRequest(t)}>Request to join</button>
                    }
                </h3>
            )}</div>
        </div>
    )
}

export default NewTeamForm