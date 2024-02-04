import React, { FC } from 'react'
import Layout from '../../components/ui/Layout'
import ForgotPassForm from '../../components/user/ForgotPassForm'

const ForgotPassword: FC = () => {
    return (
        // Set the parent container to take up the full viewport height
        <div style={{ display: 'flex', height: '100vh' }}>
            <div style={{ flex: 2, backgroundColor: 'lightgray' }}>
                <Layout>
                    <img
                        src="/images/login_page.png"
                        alt="AuctionBay"
                        style={{
                            width: '968px', // Hug to 64px
                            height: '1024px', // Hug to 64px
                        }}
                    />
                </Layout>
            </div>

            <div style={{
                backgroundColor: 'lightgray',
                padding: '10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
            }}>
                <div style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '30px',
                    minHeight: '100%',
                    minWidth: '450px',
                    maxWidth: '400px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <img src="/images/img.png" alt="logo" width={50} style={{ marginBottom: '170px', marginTop: '20px' }} />
                    <ForgotPassForm />
                    <div style={{ flex: 1 }}></div> {/* Create space to push the link to the bottom */}
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword
