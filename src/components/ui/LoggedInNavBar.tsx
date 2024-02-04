import React, { FC, useState } from 'react'
import {NavLink, useNavigate, Link, useLocation} from 'react-router-dom'
import authStore from 'stores/auth.store'
import * as API from 'api/Api'
import { StatusCode } from 'constants/errorConstants'
import ToastContainer from 'react-bootstrap/ToastContainer'
import Toast from 'react-bootstrap/Toast'
import 'bootstrap/js/src/collapse.js'
import ProfileNavigator from './navigators/profileNavigator'
import AuctionsNavigator from './navigators/auctionsNavigator'


const LoggedInNavBar: FC = () => {
    const navigate = useNavigate()
    const location = useLocation() // Use the useLocation hook to get the current route information
    const [apiError, setApiError] = useState('')
    const [showError, setShowError] = useState(false)

    const signout = async () => {
        const response = await API.signout()
        if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
            setApiError(response.data.message)
            setShowError(true)
        } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
            setApiError(response.data.message)
            setShowError(true)
        } else {
            authStore.signout()
            navigate('/')
        }
    }
    let navigator
    if (location.pathname.startsWith('/profile')) {
        navigator = <ProfileNavigator />
    } else if (location.pathname.startsWith('/auctions')) {
        navigator = <AuctionsNavigator />
    } else if (location.pathname.startsWith('/won')) {
        navigator = <ProfileNavigator />
    } else if (location.pathname.startsWith('/bidding')) {
        navigator = <ProfileNavigator />
    }


        return (
            <>

                <header>
                    <div className="navbar primaryBackground">
                        <div className="left-items" style={{display: 'flex', alignItems: 'center', gap: '30px'}}>
                            <div className="logo-container">
                                <div className="circle">
                                    <img src="/images/vector.png" alt="AuctionBay"/>
                                </div>
                            </div>
                            {navigator}
                        </div>

                        <div className="right-items">
                            <div className="fs-6" style={{display: 'flex', alignItems: 'center'}}>
                                <div className="white-box">
                                    <div style={{display: 'flex', gap: '8px'}}>
                                        <div className="yellow-circle">
                                            <img src="/images/icons/plus_black.png" alt="PlusB"
                                                 style={{width: '14px', height: '14px'}}/>
                                        </div>
                                        <div>
                                            <img
                                                className="profile-circle"
                                                src="/images/profile_pic.png"
                                                alt="ProfilePic"
                                                style={{width: '56px', height: '56px'}}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {
                    showError && (
                        <ToastContainer className="p-3" position="top-end">
                            <Toast onClose={() => setShowError(false)} show={showError} delay={3000} autohide>
                                <Toast.Header>
                                    <strong className="me-auto text-danger">Error</strong>
                                </Toast.Header>
                                <Toast.Body className="text-danger bg-light">{apiError}</Toast.Body>
                            </Toast>
                        </ToastContainer>
                    )}
            </>
        )
    }


export default LoggedInNavBar
