import React, { useEffect, useState } from 'react'
import { useFirebase } from '../Firebase'
import Button from 'react-bootstrap/Button'
import { useSession } from '../Session'
import { Redirect } from 'react-router-dom'
import { ROUTES } from '../../constants'

import styles from './Home.module.css'

const HomePage: React.FC = () => {
    const firebase = useFirebase()
    const session = useSession()
    const [twitterSignIn, setTwitterSignIn] = useState(false)

    useEffect(() => {
        // Sample write to Firestore
        const accessFirestore = async () => {
            if (session.auth?.uid) {
                try {
                    await firebase.db.collection('profiles').doc(session.auth.uid).set({
                        key: 'value'
                    })
                } catch (error) {
                    console.log('Error writing Firestore', error)
                }
            }
        }

        accessFirestore()
    }, [session.auth, firebase])

    if (twitterSignIn) {
        return (
            <Redirect to={ROUTES.TWITTER} />
        )
    }
    if (session.auth) {
        return (
            <div className={styles.window}>
                <p>Home</p>
                <p>Logged in!</p>
                <p>Hi, {session.prof?.username}</p>
                <Button variant="outline-primary" onClick={() => { firebase.doSignOut() }}>Sign Out</Button>

            </div>
        )
    } else {
        return (
            <div className={styles.window}>
                <p>Home</p>
                <Button variant="primary" onClick={() => { setTwitterSignIn(true) }}>Sign In to Twitter</Button>
            </div>
        )
    }
}

export { HomePage }
