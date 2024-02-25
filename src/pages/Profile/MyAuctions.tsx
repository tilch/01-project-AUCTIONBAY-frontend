import React, {FC, useState} from 'react'
import LoggedInNavBar from '../../components/ui/LoggedInNavBar'
import MyAuctionsNavigator from '../../components/ui/navigators/myAuctionsNavigator'
import { useQuery, useQueryClient } from 'react-query'
import {deleteAuction, fetchMyAuctions} from '../../api/Auctions'
import {AuctionType} from '../../models/Auction'
import {Link} from 'react-router-dom'
import DoneSmall from '../../components/ui/tags/small/status/done'
import InProgressSmall from '../../components/ui/tags/small/status/inprogress'
import MoreThanADayTagSmall from '../../components/ui/tags/small/time/moreThanADay'
import LastDayTagSmall from '../../components/ui/tags/small/time/lastDay'
import {queryClient} from '../../index'

const Profile: FC = () => {
    const handleDeleteClick = async (auctionId: string) => {
        const confirmed = window.confirm('Are you sure you want to delete this auction?')
        if (confirmed) {
            try {
                await deleteAuction(auctionId)
                await queryClient.invalidateQueries('fetchMyAuctions')
                console.log(`Auction ${auctionId} deleted successfully.`)
            } catch (error) {
                console.error('Error deleting auction:', error)
            }
        }
    }

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
                const [status, hoursRemaining, daysRemaining] = getAuctionStatusAndTime(auction)
                const isAuctionInProgress = status === 'In Progress'

                return (
                    <div key={auction.id} className="auction-profile-card ">
                        {/* Conditionally render auction-texts-container based on auction status */}
                        <Link to={`/auction/${auction.id}`} key={auction.id} style={{ textDecoration: 'none' }}>
                        <div className="in-progress-element-container">
                            {status === 'Done' ? (
                                <DoneSmall/>
                            ) : null}

                            {daysRemaining !== null && hoursRemaining !== null ? (
                                <>
                                    <InProgressSmall />
                                    {hoursRemaining > 25 ? (
                                        <MoreThanADayTagSmall time={daysRemaining} />
                                    ) : (
                                        <LastDayTagSmall />
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
                        </Link>
                        <div className="auction-normal-image-container">
                            <Link to={`/auction/${auction.id}`} key={auction.id} style={{ textDecoration: 'none' }}>
                            {isAuctionInProgress ? (
                                <img
                                    className={isAuctionInProgress ? 'auction-profile-image-editable' : 'auction-profile-image'}
                                    src={`${process.env.REACT_APP_API_URL}${auction.imageUrl}`}
                                    alt="Auction Image"
                                    style={{ height: '150px' }}
                                />
                            ) : (
                                <img
                                    className={isAuctionInProgress ? 'auction-profile-image-editable' : 'auction-profile-image'}
                                    src={`${process.env.REACT_APP_API_URL}${auction.imageUrl}`}
                                    alt="Auction Image"
                                />
                            )}
                            </Link>
                            {isAuctionInProgress && (
                                <div className="edit-delete-container">
                                    <button className="delete-btn" onClick={() => handleDeleteClick(auction.id)}>
                                        <img style={{width: '9.33px', height: '12px'}}
                                             src="/images/icons/trash_black.png" alt="black_trash"/>
                                    </button>


                                    <div className="edit-btn">
                                        <div className="edit-btn-content edit-btn-text">
                                            <img
                                                style={{width: '12px', height: '12px', marginRight: '7px'}}
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
            <div className="container-1440 primaryBackground">
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
