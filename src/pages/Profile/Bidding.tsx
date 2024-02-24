import React, {FC, useState} from 'react'
import LoggedInNavBar from '../../components/ui/LoggedInNavBar'
import {useQuery} from 'react-query'
import {fetchBidding} from '../../api/Auctions'
import {AuctionType} from '../../models/Auction'
import BiddingNavigator from '../../components/ui/navigators/biddingNavigator'
import {Link} from 'react-router-dom'
import MoreThanADayTagSmall from '../../components/ui/tags/small/time/moreThanADay'
import {BidType} from '../../models/Bid'
import {fetchMe} from 'api/Api'
import WinningSmall from '../../components/ui/tags/small/status/winning'
import OutbidSmall from '../../components/ui/tags/small/status/outbid'

const Profile: FC = () => {
    const [bids, setBids] = useState<BidType[]>([])
    const { data: userData, isLoading: isUserLoading, error: userError,} = useQuery('fetchMe', fetchMe, {
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    })
    const currentUserID = userData ? userData.id : null


    const { data, isLoading, error } = useQuery('fetchBidding', fetchBidding, {
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    })

    if (isUserLoading) return <div>Loading user data...</div>
    if (userError) return <div>Error fetching user data...</div>



    function getAuctionStatusAndTime(auction: AuctionType): [string, number | null, number | null] {
        const now = new Date()
        const startTime = new Date(auction.startTime)
        const endTime = new Date(auction.endTime)
        let daysRemaining: number | null = null
        let hoursRemaining: number | null = null

        if (now >= startTime && now <= endTime) {
            const msRemaining = endTime.getTime() - now.getTime()
            daysRemaining = Math.ceil(msRemaining / (1000 * 60 * 60) / 24)
            hoursRemaining = Math.ceil(msRemaining / (1000 * 60 * 60))
            return ['In Progress', daysRemaining, hoursRemaining]
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
        }
        return 'inProgress' // Default status if there's no winner or if the auction hasn't ended.
    }


    const renderAuctions = () => {
        if (isLoading) return <p>Loading...</p>
        if (error) return <p>There was an error fetching the auctions.</p>
        if (data && data.length > 0) {
            return data.map((auction: AuctionType) => {
                const [status, daysRemaining] = getAuctionStatusAndTime(auction)
                const isAuctionInProgress = status === 'In Progress'
                const biddingStatus = getUserBiddingStatus(auction)
                return (
                    <Link to={`/auction/${auction.id}`} key={auction.id} className="bidding-container" style={{ textDecoration: 'none' }}>
                            <div className="in-progress-element-container " style={{ paddingBottom: '6px' }}>
                                {status === 'Done' ? (
                                    <div className="done-element">
                                        <div className="caption">Done</div>
                                    </div>
                                ) : null}
 
                                {isAuctionInProgress && daysRemaining  !== null ? (
                                    <>
                                        {biddingStatus === 'winning' && <WinningSmall/>}
                                        {biddingStatus === 'outbid' && <OutbidSmall/>}

                                        <MoreThanADayTagSmall time={daysRemaining} />
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
                                    src={`${process.env.REACT_APP_API_URL}${auction.imageUrl}`}
                                    alt="Auction Image"
                                />
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
            <div className="container-1440 primaryBackground" >
                <div className="parent d-flex flex-column align-items-center">
                    <BiddingNavigator/>
                    <div className="auctions-container" style={{paddingTop: '18px'}}>
                        {renderAuctions()}
                    </div>
                </div>
            </div>
        </>


    )
}

export default Profile
