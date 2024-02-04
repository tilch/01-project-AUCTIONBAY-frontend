import React, {FC} from 'react'
import LoggedInNavBar from '../../components/ui/LoggedInNavBar'
import MyAuctionsNavigator from '../../components/ui/navigators/myAuctionsNavigator'

const Profile: FC = () => {
    return (
        <>

            <LoggedInNavBar/>
            <body className="container">
            <div className="top-container">
                <p className="heading-h1">Hello Tilen Hostnik !</p>
            </div>

            <MyAuctionsNavigator/>
            </body>

        </>

    )
}

export default Profile