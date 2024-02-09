import React, {FC} from 'react'
import LoggedInNavBar from '../../components/ui/LoggedInNavBar'
import MyAuctionsNavigator from '../../components/ui/navigators/myAuctionsNavigator'
import * as API from 'api/Api'
import {useQuery} from 'react-query'
import {fetchMyAuctions} from '../../api/Auctions'
import {AuctionType} from '../../models/Auction'

const Profile: FC = () => {

    function getAuctionStatusAndTime(auction: AuctionType): [string, number | null] {
        const now = new Date()
        const startTime = new Date(auction.startTime)
        const endTime = new Date(auction.endTime)
        let hoursRemaining: number | null = null

        if (now >= startTime && now <= endTime) {
            const msRemaining = endTime.getTime() - now.getTime()
            hoursRemaining = Math.ceil(msRemaining / (1000 * 60 * 60)) // Convert milliseconds to hours and round up
            return ['In Progress', hoursRemaining]
        } else if (now > endTime) {
            return ['Done', null]
        } else {
            return ['Not Started', null]
        }
    }

    const { data, isLoading, error } = useQuery('fetchMyAuctions', fetchMyAuctions, {
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    })

    // Separate function to render auctions
    // Adjusted function to render auctions
    const renderAuctions = () => {
        if (isLoading) return <p>Loading...</p>
        if (error) return <p>There was an error fetching the auctions.</p>
        if (data && data.length > 0) {
            return data.map((auction: AuctionType) => {
                const [status, hoursRemaining] = getAuctionStatusAndTime(auction)
                const isAuctionInProgress = status === 'In Progress'

                return (
                    <div key={auction.id} className="auction-profile-card ">
                        {/* Conditionally render auction-texts-container based on auction status */}
                        {isAuctionInProgress ? (
                            <div className="auction-texts-container"></div>
                        ) : (
                            <div className="auction-texts-container">
                                {/* Default content */}
                            </div>
                        )}

                        <div className="in-progress-element-container">
                            {status === 'Done' ? (
                                <div className="done-element">
                                    <div className="caption">Done</div>
                                </div>
                            ) : null}

                            {isAuctionInProgress && hoursRemaining !== null ? (
                                <>
                                    <div className="in-progress-element">
                                        <div className="caption" style={{color: 'black'}}>
                                            In progress
                                        </div>
                                    </div>
                                    <div className="hours-remaining-container">
                                        <div className="hours-remaining">
                                            <div className="hours-remaining-text">
                                                {hoursRemaining}h
                                            </div>
                                        </div>
                                        <img
                                            style={{width: '10px', height: '10px'}}
                                            src="/images/icons/hours_left.png"
                                            alt="hours_left_icon"
                                        />
                                    </div>
                                </>
                            ) : null}
                        </div>

                        <div className="element-twohundred">
                            <div className="caption-title">{auction.title}</div>
                        </div>

                        <div className="element-twohundred" style={{marginBottom: '5px', marginTop: '5px'}}>
                            <div className="caption-price">{auction.currentPrice} €</div>
                        </div>

                        <div className="auction-normal-image-container">
                            <img
                                className={isAuctionInProgress ? 'auction-profile-image-editable' : 'auction-profile-image'}
                                src="/images/testing/chair.jpg"
                                alt="Auction Image"
                            />
                            {isAuctionInProgress && (
                                <div className="edit-delete-container">
                                    <div className="delete-btn" >
                                        <img
                                            style={{ width: '9.33px', height: '12px'}}
                                            src="/images/icons/trash_black.png"
                                            alt="black_trash"
                                        />
                                    </div>
                                    <div className="edit-btn">
                                        <div className="edit-btn-content edit-btn-text">
                                            <img
                                                style={{width: '12px', height: '12px', marginRight: '7px' }}
                                                src="/images/icons/pencil_white.png"
                                                alt="white_pencil"
                                            />
                                            Edit
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )
            })
        }
        return <p>No auctions to display.</p>
    }


    return (
        <>
            <LoggedInNavBar/>
            <div className="container-1440 primaryBackground" >
                <div className="parent d-flex flex-column align-items-center">
                    <MyAuctionsNavigator/>
                    <div className="auctions-container" style={{paddingTop: '18px'}}>
                        {renderAuctions()}
                    </div>
                </div>
            </div>
        </>


    )
}

export default Profile
