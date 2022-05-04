import React, { useState, useEffect } from "react"

import ParseData from "../../utilities/DataParser"

import CommonStyles from "../../styles/common.module.scss"

const FileUploader = ({ setParsedData }) => {
    const [rawData, setRawData] = useState("")

    const handleChange = (e) => {
        const fileReader = new FileReader()
        fileReader.readAsText(e.target.files[0], "UTF-8")
        fileReader.onload = e => {
            setRawData(e.target.result)
        }
    }

    useEffect(() => {
        if (rawData && rawData !== "") {
            setParsedData(ParseData(rawData))
        }
    }, [rawData])

    return (
        <>
            <input
                type="file"
                onChange={handleChange}
                className={CommonStyles.highlighLinkButton}
            />
        </>
    )
}

export default FileUploader