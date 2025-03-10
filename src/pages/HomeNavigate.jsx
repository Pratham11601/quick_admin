import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const HomeNavigate = () => {


    useEffect(() => {
        window.location.href = 'https://quickcabpune.com'
    }, [])
    return (
        <div></div>
    )
}

export default HomeNavigate