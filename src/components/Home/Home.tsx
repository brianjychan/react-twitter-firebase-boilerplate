import React, { useCallback, useEffect, useState } from 'react'
import { useFirebase } from '../Firebase'
import { Button } from 'react-bootstrap'
import { useSession } from '../Session'
import { Redirect } from 'react-router-dom'
import { ROUTES } from '../../constants'

const HomePage: React.FC = () => {
    const firebase = useFirebase()
    const session = useSession()
    const [twitterSignIn, setTwitterSignIn] = useState(false)


    // Sample write to Firestore
    const accessFirestore = useCallback(async () => {
        if (session.auth?.uid) {
            try {
                await firebase.db.collection('profiles').doc(session.auth.uid).set({
                    key: 'value'
                })
            } catch (error) {
                console.log('Error writing Firestore', error)
            }
        }
    }, [session.auth, firebase])

    useEffect(() => {
        accessFirestore()
    }, [accessFirestore])

    if (twitterSignIn) {
        return (
            <Redirect to={ROUTES.TWITTER} />
        )
    }
    if (session.auth) {
        return (
            <div>
                <p>Home</p>
                <p>Logged in!</p>
                <Button variant="outline-primary" onClick={() => { firebase.doSignOut() }}>Sign Out</Button>

            </div>
        )
    } else {
        return (
            <div>
                <p>Home</p>
                <Button variant="primary" onClick={() => { setTwitterSignIn(true) }}>Sign In to Twitter</Button>
            </div>
        )
    }
}

export { HomePage }
