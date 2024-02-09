import axios from 'axios'
import Cookies from 'js-cookie'
import { apiRoutes } from '../constants/apiConstants'

const getJwtTokenFromCookie = () => {
    const jwtToken = Cookies.get('token')
    if (!jwtToken) {
        throw new Error('JWT token not found or expired')
    }
    return jwtToken
}

export const fetchAllAuctions = async () => {
    const response = await axios.get(apiRoutes.FETCH_ALLAUCTIONS, {
        baseURL: process.env.REACT_APP_API_URL,
        headers: {
            'Content-Type': 'application/json',
        },
    })
    return response.data
}

export const fetchMyAuctions = async () => {
    const jwtToken = getJwtTokenFromCookie()
    const response = await axios.get(apiRoutes.FETCH_MYAUCTIONS, {
        baseURL: process.env.REACT_APP_API_URL,
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
        },
    })
    return response.data
}

export const fetchBidding = async () => {
    const jwtToken = getJwtTokenFromCookie()
    const response = await axios.get(apiRoutes.FETCH_BIDDING, {
        baseURL: process.env.REACT_APP_API_URL,
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
        },
    })
    return response.data
}
export const fetchWon = async () => {
    const jwtToken = getJwtTokenFromCookie()
    const response = await axios.get(apiRoutes.FETCH_WON, {
        baseURL: process.env.REACT_APP_API_URL,
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
        },
    })
    return response.data
}