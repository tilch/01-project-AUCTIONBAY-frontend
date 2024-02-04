import React, {FC} from 'react'
import LoggedInNavBar from '../../components/ui/LoggedInNavBar'
import WonNavigator from '../../components/ui/navigators/wonNavigator'

const Won: FC = () => {
    return (
        <>
            <LoggedInNavBar />
            <p>
                Won auctions
            </p>
            <WonNavigator />
        </>

    )
}

export default Won