import React, {FC} from 'react'
import LoggedInNavBar from '../../components/ui/LoggedInNavBar'
import BiddingNavigator from '../../components/ui/navigators/biddingNavigator'

const Bidding: FC = () => {
    return (
        <>
            <LoggedInNavBar />
            <p>
                Bidding on these auctions
            </p>
            <BiddingNavigator/>
        </>

    )
}

export default Bidding