import React, {FC} from 'react'
import LoggedInNavBar from '../../components/ui/LoggedInNavBar'
import {useQuery} from 'react-query'
import {fetchWon} from '../../api/Auctions'
import {AuctionType} from '../../models/Auction'
import WonNavigator from '../../components/ui/navigators/wonNavigator'

const Profile: FC = () => {

    function getAuctionStatusAndTime(auction: AuctionType): [string, number | null] {
        const now = new Date()
        const endTime = new Date(auction.endTime)

        if (now > endTime) {
            return ['Done', null]
        } else {
            return ['Not Relevant', null]
        }
    }

    const { data, isLoading, error } = useQuery('fetchWon', fetchWon, {
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    })

    const renderAuctions = () => {
        if (isLoading) return <p>Loading...</p>
        if (error) return <p>There was an error fetching the auctions.</p>
        if (data && data.length > 0) {
            return data.map((auction: AuctionType) => {
                const [status] = getAuctionStatusAndTime(auction)

                if (status === 'Done') {
                    return (
                        <div key={auction.id} className="auction-profile-card">
                            <div className="auction-texts-container"></div>

                            <div className="in-progress-element-container">
                                <div className="done-element">
                                    <div className="caption">Done</div>
                                </div>
                            </div>

                            <div className="element-twohundred">
                                <div className="caption-title">{auction.title}</div>
                            </div>

                            <div className="element-twohundred" style={{marginBottom: '5px', marginTop: '5px'}}>
                                <div className="caption-price">{auction.currentPrice} €</div>
                            </div>

                            <div className="auction-normal-image-container">
                                <img
                                    className='auction-profile-image'
                                    src="/images/testing/chair.jpg"
                                    alt="Auction Image"
                                />
                            </div>
                        </div>
                    )
                }
                return null
            }).filter(Boolean)
        }
        return <p>No auctions to display.</p>
    }

    return (
        <>
            <LoggedInNavBar/>
            <div className="container-1440 primaryBackground" >
                <div className="parent d-flex flex-column align-items-center">
                    <WonNavigator/>
                    <div className="auctions-container" style={{paddingTop: '18px'}}>
                        {renderAuctions()}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile
