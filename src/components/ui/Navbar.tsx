import React, { FC, useState } from 'react'
import { NavLink, useNavigate, Link } from 'react-router-dom'
import authStore from 'stores/auth.store'
import * as API from 'api/Api'
import { StatusCode } from 'constants/errorConstants'
import ToastContainer from 'react-bootstrap/ToastContainer'
import Toast from 'react-bootstrap/Toast'
import 'bootstrap/js/src/collapse.js'
import { routes } from 'constants/routesConstants'


const Navbar: FC = () => {
  const navigate = useNavigate()
  const [apiError, setApiError] = useState('')
  const [showError, setShowError] = useState(false)

  const signout = async () => {
      authStore.signout()
      navigate('/')
  }

  return (
      <>
        <header>
          {/* Adjust the container div to include your styling requirements */}
            <div className="navbar">
                <div className="circle">
                    <img
                        src="/images/vector.png"
                        alt="AuctionBay"
                    />
                </div>
                <div className="fs-6" style={{display: 'flex', alignItems: 'center'}}>
                    <Link
                        to={routes.LOGIN}
                        style={{
                            marginRight: '8px',
                            textDecoration: 'none',
                            fontWeight: '700',
                            color: 'black',
                            fontSize: '16px',
                            lineHeight: '24px',
                            letterSpacing: '0em',
                            textAlign: 'left',
                        }}
                    >
                        Log in
                    </Link>
                    or
                    <Link
                        to={routes.SIGNUP}
                        style={{
                            marginLeft: '8px',
                            fontWeight: '700',
                            textDecoration: 'none',
                            color: 'white',
                            backgroundColor: 'black',
                            padding: '8px 16px',
                            borderRadius: '17px',
                            fontSize: '16px',
                            lineHeight: '24px',
                            letterSpacing: '0em',

                        }}
                    >
                        Sign Up
                    </Link>
                </div>

            </div>
        </header>
          {showError && (
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

export default Navbar
