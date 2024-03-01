import React, {FC, useEffect, useState} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import authStore from 'stores/auth.store'
import * as API from 'api/Api'
import {fetchMe, updateUser} from 'api/Api'
import {StatusCode} from 'constants/errorConstants'
import ToastContainer from 'react-bootstrap/ToastContainer'
import Toast from 'react-bootstrap/Toast'
import 'bootstrap/js/src/collapse.js'
import ProfileNavigator from './navigators/profileNavigator'
import AuctionsNavigator from './navigators/auctionsNavigator'
import {useQuery} from 'react-query'
import WhiteNavigatorProfile from './navigators/whiteNavigatorProfile'
import {placeAuction} from '../../api/Auctions'

const LoggedInNavBar: FC = () => {
    const navigate = useNavigate()
    const location = useLocation() // Use the useLocation hook to get the current route information.
    const [apiError, setApiError] = useState('')
    const [showError, setShowError] = useState(false)
    const [showPopup, setShowPopup] = useState(false)
    const [showProfileSettingsPopup, setShowProfileSettingsPopup] = useState(false)
    const [showChangePasswordPopup, setshowChangePasswordPopup] = useState(false)
    const [changeProfilePicturePopup, setchangeProfilePicturePopup] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [image, setImage] = useState<string | null>(null)
    const [addAuctionPopup, setaddAuctionPopup] = useState(false)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [startPrice, setStartPrice] = useState('')
    const [endTime, setEndTime] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const { data, isLoading, error } = useQuery('fetchMe', fetchMe, {
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    })
    // navigator and show the greeting message
    let navigator
    if (location.pathname.startsWith('/profile')) {
        navigator = <ProfileNavigator />
    } else if (location.pathname.startsWith('/auctions')) {
        navigator = <AuctionsNavigator />
    } else if (location.pathname.startsWith('/won')) {
        navigator = <ProfileNavigator />
    } else if (location.pathname.startsWith('/bidding')) {
        navigator = <ProfileNavigator />
    } else if (location.pathname.startsWith('/auction')) {
        navigator = <WhiteNavigatorProfile />
    }
    const showGreeting = !location.pathname.startsWith('/auction')

    useEffect(() => {
        if (data) {
            setFirstName(data.first_name)
            setLastName(data.last_name)
            setEmail(data.email)
        }
    }, [data]) // Make sure to add data as a dependency here

    const handleProfileUpdate = async (e: { preventDefault: () => void }) => {
        e.preventDefault() // Prevent the default form submission behavior

        const userData = {
            first_name: firstName,
            last_name: lastName,
            email: email,
        }

        const userId = data.id // Assuming 'data.id' contains the user's ID.

        try {
            const response = await updateUser(userData, userId)
            console.log('User updated successfully', response)
            setShowProfileSettingsPopup(false) // Close the popup on success
            window.location.reload()
        } catch (error) {
            console.error('Error updating user:', error)
        }
    }

    
    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // check if any of the fields are empty
        if (!title || !description || !startPrice || !endTime || !selectedFile) {
            alert('All fields are required and an image must be selected.')
            return
        }

        // validate date format (dd.mm.yyyy)
        const dateRegex = /^\d{1,2}\.\d{1,2}\.\d{4}$/
        if (!dateRegex.test(endTime)) {
            alert('Date must be in the format dd.mm.yyyy')
            return
        }

        // validate if price is a number
        const price = parseFloat(startPrice)
        if (isNaN(price)) {
            alert('Price must be a number.')
            return
        }
        // Transform "dd.mm.yyyy" into ISO format - you can also do d.m.yyyy :)
        const transformDateToISO = (dateStr: string): string => {
            const parts = dateStr.split('.')
            const day = parseInt(parts[0], 10)
            const month = parseInt(parts[1], 10)
            const year = parseInt(parts[2], 10)
            return new Date(year, month - 1, day).toISOString()
        }

        const formattedEndTime = transformDateToISO(endTime)

        const formData = new FormData()
        formData.append('title', title)
        formData.append('description', description)
        formData.append('startPrice', price.toString())
        formData.append('endTime', formattedEndTime)
        formData.append('image', selectedFile)

        try {
            await placeAuction(formData)
            setTitle('')
            setDescription('')
            setStartPrice('')
            setEndTime('')
            setSelectedFile(null)
            setImage(null)
            setaddAuctionPopup(false)

            // reload the page to reflect the new auction
            window.location.reload()
        } catch (error) {
            console.error('Failed to place auction:', error)
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null
        if (file) {
            setSelectedFile(file)
            const imageUrl = URL.createObjectURL(file)
            setImage(imageUrl)
        }
    }

    const clearImage = () => {
        setImage(null)
    }

    const triggerFileInputClick = () => {
        document.getElementById('fileInput')?.click()
    }

    const signout = async () => {
        const response = await API.signout()
        if (response.data?.statusCode === StatusCode.BAD_REQUEST || response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
            setApiError(response.data.message)
            setShowError(true)
        } else {
            authStore.signout()
            navigate('/')
        }
    }

    return (
        <>
            <header>
                <div className="navbar primaryBackground" style={{ width: '1440px' }}>
                    <div className="left-items" style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                        <div className="logo-container">
                            <div className="circle">
                                <img src="/images/vector.png" alt="AuctionBay" />
                            </div>
                        </div>
                        {navigator}
                    </div>

                    <div className="right-items">
                        <div className="fs-6" style={{ display: 'flex', alignItems: 'center' }}>
                            <div className="white-box">
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <div className="yellow-circle"
                                         onClick={() => setaddAuctionPopup(!showPopup)}
                                    >
                                        <img
                                            src="/images/icons/plus_black.png"
                                            alt="PlusB"
                                            style={{ width: '14px', height: '14px' }}
                                        />
                                    </div>
                                    <div>
                                        <img
                                            className="profile-circle"
                                            src="/images/profile_pic.png"
                                            alt="ProfilePic"
                                            style={{width: '56px', height: '56px'}}
                                            onClick={() => setShowPopup(!showPopup)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            {showGreeting && (
                <div className="heading-container">
                    <div className="heading-h1 custom-heading">
                        {!isLoading && !error && data ? `Hello ${data.first_name} ${data.last_name}!` : 'Loading...'}
                    </div>
                </div>
            )}
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

            {addAuctionPopup && (
                <div className="add-auction-container">
                    <h4>Add auction</h4>
                    <form onSubmit={handleFormSubmit}>
                        {image ? (
                            <div className="add-auction-image-filled" style={{
                                position: 'relative',
                                backgroundImage: `url(${image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}>
                                <button onClick={clearImage} className="trash-button-image">
                                    <img
                                        src="/images/icons/trash_white.png"
                                        alt="euro"
                                        style={{width: '9.33px', height: '12px'}}
                                    />
                                </button>
                            </div>
                        ) : (
                            <div className="add-auction-image-container-empty" onClick={triggerFileInputClick}>
                                <div className="add-image-button add-image-button-text">
                                    Add image
                                </div>
                            </div>
                        )}


                        <input type="file" id="fileInput" style={{display: 'none'}} onChange={handleImageChange}/>


                        <div className="add-auction-inner-container">
                            <div className="add-auction-title-container">
                                <div className="title-desc-text" style={{ paddingTop: '5px' }}>Title</div>
                                <div className="auction-normal-title-container">
                                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                                           placeholder="Title"/>
                                </div>
                            </div>

                            <div className="auction-description-container">
                                <div className="title-desc-text">Description</div>
                                <div className="auction-normal-title-container" style={{height: '123px'}}>
                                    <textarea value={description}
                                              className="custom-description-rich-text"
                                              onChange={(e) => setDescription(e.target.value)}
                                              placeholder="Write description here..."
                                    />
                                </div>
                            </div>

                            <div className="start-price-end-date-container">
                                <div className="start-price-container">
                                    <div className="title-desc-text">Starting price</div>
                                    <div className="starting-price-auction">
                                        <input type="text" value={startPrice}
                                               onChange={(e) => setStartPrice(e.target.value)}
                                               placeholder="Price"/>
                                        <img
                                            src="/images/icons/euro_grey.png"
                                            alt="euro"
                                            style={{width: '12px', height: '12px'}}
                                        />
                                    </div>
                                </div>

                                <div className="start-price-container">
                                    <div className="title-desc-text">End date</div>
                                    <div className="starting-price-auction">
                                        <input
                                            type="text"
                                            value={endTime}
                                            onChange={(e) => setEndTime(e.target.value)}
                                            placeholder="dd.mm.yyyy"
                                            pattern="([0-9]{1,2})\.([0-9]{1,2})\.([0-9]{4})"
                                            title="Date format should be dd.mm.yyyy or d.m.yyyy"
                                        />
                                        <img
                                            src="/images/icons/time_grey.png"
                                            alt="time"
                                            style={{width: '13px', height: '13px'}}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="profile-settings-cancel-save-container">
                                <button className="profile-settings-cancel-btn"
                                        onClick={() => setShowProfileSettingsPopup(false)}>
                                    <h5>Cancel</h5>
                                </button>
                                <div className="profile-settings-save-btn ">
                                    <button type="submit" style={{ border: 'none', outline: 'none', backgroundColor: 'transparent' }}>
                                        <h5>Start auction</h5>
                                    </button>

                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {showPopup && (
                    <div className="signout-popup">
                        <button className="profile-settings-button"
                                onClick={(e) => {
                                    e.stopPropagation() // Prevent click from affecting parent elements
                                    setShowProfileSettingsPopup(!showProfileSettingsPopup) // Toggle the profile settings popup
                                    setShowPopup(false) // Close the first popup
                                }}>
                            <img
                                className="profile-settings-image"
                                src="/images/icons/settings_black.png"
                                alt="setngs"
                                onClick={() => setShowPopup(!showPopup)}
                            />
                            <div className="profile-button-text">Profile settings</div>
                        </button>

                        <button
                            className="logout-container"
                            onClick={signout}>
                            Log Out
                        </button>
                    </div>
            )}

            {showProfileSettingsPopup && (
                <div className="profile-settings-popup">
                    <h4>Profile settings</h4>
                    <form onSubmit={handleProfileUpdate}>
                        <div className="popup-inside-container">
                            <div className="popup-name-surname-container">
                                <div className="popup-name-container">
                                    <div className="prfl-stgs-normal-text">Name</div>
                                    <input
                                        className="profile-settings-input-element"
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </div>
                                <div className="popup-name-container">
                                    <div className="prfl-stgs-normal-text">Surname</div>
                                    <input
                                        className="profile-settings-input-element"
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="profile-settings-email-container">
                                <div className="prfl-stgs-normal-text">Email</div>
                                <input
                                    className="profile-settings-input-element"
                                    style={{width: '501px'}}
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setshowChangePasswordPopup(true)
                                    setShowProfileSettingsPopup(false)
                                }}
                                style={{cursor: 'pointer'}}
                            >
                                <h5>Change password</h5>
                            </div>
                            <div
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setchangeProfilePicturePopup(true)
                                    setShowProfileSettingsPopup(false)
                                }}
                                style={{cursor: 'pointer'}}
                            >
                                <h5>Change profile picture</h5>
                            </div>
                        </div>
                        <div className="profile-settings-cancel-save-container">
                            <button type="button" className="profile-settings-cancel-btn" onClick={() => setShowProfileSettingsPopup(false)}>
                                <h5>Cancel</h5>
                            </button>
                            <button type="submit" className="profile-settings-save-btn">
                                <h5>Save changes</h5>
                            </button>
                        </div>
                    </form>
                </div>
            )}



            {showChangePasswordPopup && (
                <div className="profile-settings-popup">
                <h4>Change password</h4>
                    <div className="popup-inside-container">
                        <div className="pswrd-container">
                            <div className="prfl-stgs-normal-text">Current password</div>
                            <input className="change-pass-container"
                                   type="password"
                            />
                        </div>

                        <div className="pswrd-container">
                            <div className="prfl-stgs-normal-text">New password</div>
                            <input className="change-pass-container"
                                   type="password"
                            />
                        </div>

                        <div className="pswrd-container">
                            <div className="prfl-stgs-normal-text">Repeat new password</div>
                            <input className="change-pass-container"
                                   type="password"
                            />
                        </div>
                    </div>
                    <div className="profile-settings-cancel-save-container">
                        <button className="profile-settings-cancel-btn"
                                onClick={() => setshowChangePasswordPopup(false)}>
                            <h5>Cancel</h5>
                        </button>
                        <div className="profile-settings-save-btn ">
                            <h5>Save changes</h5>
                        </div>
                    </div>
                </div>
            )}

            {changeProfilePicturePopup && (
                <div className="profile-settings-popup">
                    <h4>Change profile picture</h4>
                    <div className="popup-inside-container" style={{display: 'flex', alignItems: 'center'}}>
                        <img
                            className="profile-circle"
                            src="/images/profile_pic.png"
                            alt="ProfilePic"
                            style={{width: '56px', height: '56px'}}
                        />
                        <button className="upload-picture-button">
                            <div className="upload-picture-button-text">
                                Upload new picture
                            </div>
                        </button>
                    </div>

                    <div className="profile-settings-cancel-save-container">
                        <button className="profile-settings-cancel-btn"
                                onClick={() => setchangeProfilePicturePopup(false)}>
                            <h5>Cancel</h5>
                        </button>
                        <div className="profile-settings-save-btn ">
                            <h5>Save changes</h5>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default LoggedInNavBar
