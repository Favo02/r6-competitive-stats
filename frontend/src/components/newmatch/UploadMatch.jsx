import { useState, useRef } from "react"

import matchService from "../../services/matches"

import FileUploader from "./FileUploader"
import Loading from "../common/Loading"
import Match from "../home/Match"

// import classnames from "classnames"
import MatchStyles from "../home/Matches.module.scss"
import CommonStyles from "../../styles/common.module.scss"
import UploadMatchStyles from "./UploadMatch.module.scss"

const UploadMatch = ({ user }) => {

    // match data uploaded (not stored yet)
    const [parsedData, setParsedData] = useState(null)

    // upload loading and status
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState("")

    const newMatch = async (match) => {
        if (match) {
            try {
                setLoading(true)
                setStatus("Saving match...")
                await matchService.create(match, user.token)
                setLoading(false)
                setStatus("Match saved")
            }
            catch (exception) {
                setLoading(false)
                setStatus(`Error saving the match: ${exception}`)
                if (exception.response) {
                    setStatus(`Error ${exception.response.status}: ${exception.response.data.error}`)
                }
            }
        }
    }

    const categoryInput = useRef()
    const handleNewMatch = () => {
        const cat = categoryInput.current.value
        if (cat) {
            parsedData.info.category = cat
            newMatch(parsedData)
        }
        else {
            setStatus("Insert a valid category")
        }
    }

    return (
        <div className={UploadMatchStyles.uploadDiv}>
            <h1 className={UploadMatchStyles.descText}>Upload your JSON file exported from <a href="https://r6analyst.com/" target="_blank" rel="noreferrer">R6Analyst</a> to store the match into your team database.</h1>

            <div className={UploadMatchStyles.fileUploader}>
                <FileUploader setParsedData={setParsedData} />
            </div>

            { parsedData &&
                <>
                    <div className={UploadMatchStyles.categoryDiv}>
                        <label>Category:</label>
                        <input
                            type="text"
                            placeholder="Insert category name"
                            ref={categoryInput}
                        />
                    </div>

                    <div className={MatchStyles.matchesDiv}>
                        <Match match={parsedData}/>
                    </div>

                    <div className={UploadMatchStyles.saveButton}>
                        <button
                            onClick={handleNewMatch}
                            className={CommonStyles.highlighLinkButton}
                        >Save match</button>
                    </div>
                </>
            }

            {loading && <Loading />}
            <h2 className={UploadMatchStyles.statusText}>{status}</h2>
        </div>
    )
}

export default UploadMatch