import React, {FC} from 'react'
import LoggedInNavBar from '../../components/ui/LoggedInNavBar'
import {useQuery} from 'react-query'
import {fetchAllAuctions} from '../../api/Auctions'
import {AuctionType} from '../../models/Auction'
import {Link} from 'react-router-dom'
import DoneSmall from '../../components/ui/tags/small/status/done'
import InProgressSmall from '../../components/ui/tags/small/status/inprogress'
import MoreThanADayTagSmall from '../../components/ui/tags/small/time/moreThanADay'
import LastDayTagSmall from '../../components/ui/tags/small/time/lastDay'
import {fetchMe} from '../../api/User'
import WinningSmall from '../../components/ui/tags/small/status/winning'
import OutbidSmall from '../../components/ui/tags/small/status/outbid'
import MoreThanADayTagWordSmall from '../../components/ui/tags/small/time/moreThanADayWord'

const Profile: FC = () => {
    const { data: userData, isLoading: isUserLoading, error: userError,} = useQuery('fetchMe', fetchMe, {
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    })
    const currentUserID = userData ? userData.id : null
    function getAuctionStatusAndTime(auction: AuctionType): [string, number | null, number | null] {
        const now = new Date()
        const startTime = new Date(auction.startTime)
        const endTime = new Date(auction.endTime)
        let hoursRemaining: number | null = null
        let daysRemaining: number | null = null

        if (now >= startTime && now <= endTime) {
            const msRemaining = endTime.getTime() - now.getTime()
            hoursRemaining = Math.ceil(msRemaining / (1000 * 60 * 60))
            daysRemaining = Math.ceil(msRemaining / (1000 * 60 * 60) / 24)
            return ['In Progress', hoursRemaining, daysRemaining]
        } else if (now > endTime) {
            return ['Done', null, null]
        } else {
            return ['Not Started', null, null]
        }
    }

    const getUserBiddingStatus = (auction: AuctionType) => {
        // Assuming `auction.currentWinner` holds the user ID of the current highest bidder.
        // This will directly compare the current user's ID with the auction's current winner.
        if (auction.currentWinner === currentUserID) {
            return 'winning'
        } else if (auction.currentWinner && auction.currentWinner !== currentUserID) {
            return 'outbid'
        } else if (auction.currentWinner == null) {
            return 'empty'
        }
        return 'inProgress' // Default status if there's no winner or if the auction hasn't ended.
    }


    const { data, isLoading, error } = useQuery('fetchAllAuctions', fetchAllAuctions, {
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    })

    const renderAuctions = () => {
        if (isLoading) return <p>Loading...</p>
        if (error) return <p>There was an error fetching the auctions.</p>
        if (data && data.length > 0) {
            return data.map((auction: AuctionType) => {
                const [status, hoursRemaining, daysRemaining] = getAuctionStatusAndTime(auction)
                const isAuctionInProgress = status === 'In Progress'
                const biddingStatus = getUserBiddingStatus(auction)

                return (
                    <Link to={`/auction/${auction.id}`} key={auction.id} className="bidding-container" style={{ textDecoration: 'none' }}>
                        <div key={auction.id} className="bidding-container">
                            <div className="in-progress-element-container">
                                {/* tega tu nebi smelo prikazvat ! */}
                                {status === 'Done' ? (
                                    <DoneSmall/>
                                ) : null}


                                {daysRemaining !== null && hoursRemaining !== null ? (
                                    <>
                                        {biddingStatus === 'winning' && <WinningSmall/>}
                                        {biddingStatus === 'outbid' && <InProgressSmall/>}
                                        {biddingStatus === 'empty' && <InProgressSmall/>}
                                        {hoursRemaining > 25 ? (
                                            <MoreThanADayTagWordSmall time={daysRemaining}/>
                                        ) : (
                                            <LastDayTagSmall/>
                                        )}

                                    </>
                                ) : null}
                            </div>

                            <div className="element-twohundred">
                                <div className="caption-title">{auction.title}</div>
                            </div>

                            <div className="element-twohundred" style={{marginBottom: '5px', marginTop: '5px'}}>
                                {auction.currentPrice !== null ? (
                                    <div className="caption-price">{auction.currentPrice} €</div>
                                ) : (
                                    <div className="caption-price">{auction.startPrice} €</div>
                                )}

                            </div>


                            <div className="auction-normal-image-container">
                                {isAuctionInProgress ? (
                                    <img
                                        className={isAuctionInProgress ? 'auction-profile-image-editable' : 'auction-profile-image'}
                                        src={`${process.env.REACT_APP_API_URL}${auction.imageUrl}`}
                                        alt="Auction Image"
                                    />
                                ) : (
                                    <img
                                        className={isAuctionInProgress ? 'auction-profile-image-editable' : 'auction-profile-image'}
                                        src={`${process.env.REACT_APP_API_URL}${auction.imageUrl}`}
                                        alt="Auction Image"
                                    />
                                )}
                            </div>
                        </div>
                    </Link>
                )
            })
        }
        return <p>No auctions to display.</p>
    }

    return (
        <>
            <LoggedInNavBar/>
            <div className="container-1440 primaryBackground">
                <div className="parent d-flex flex-column align-items-center">
                    <div className="auctions-container" style={{paddingTop: '18px'}}>
                        {renderAuctions()}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile
