import React, { useState, useEffect, useRef } from "react"

import ParseData from "../../utilities/DataParser"

import CommonStyles from "../../styles/common.module.scss"

const FileUploader = ({ setParsedData, fileUploaderRef }) => {
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
            try {
                setParsedData(ParseData(rawData))
            }
            catch (exception) {
                console.log("Error parsing the JSON file:", exception)
            }
        }
    }, [rawData])

    // ref to reset input file
    const fileInput = useRef()

    // function that resets the file input
    const unloadFile = () => {
        fileInput.current.value = null
        setRawData(null)
        setParsedData(null)
    }

    // "export" the unloadFile function to parent element
    useEffect(() => {
        fileUploaderRef.current = unloadFile
    }, [])

    return (
        <input
            type="file"
            onChange={handleChange}
            ref={fileInput}
            className={CommonStyles.highlighLinkButton}
        />
    )
}

export default FileUploader