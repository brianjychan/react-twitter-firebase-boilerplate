import React, { useEffect, useState } from 'react'
import { useFirebase } from '../Firebase'
import { useSession } from '../Session'
import { Redirect } from 'react-router-dom'
import { ROUTES } from '../../constants'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

import styles from './HomePageWithAuth.module.css'
import { joinStyles } from '../Utilities/joinStyles';


const HomePageWithAuth: React.FC = () => {
    const firebase = useFirebase()
    const session = useSession()
    const [twitterSignIn, setTwitterSignIn] = useState(false)

    const openSessionUserPage = () => { }

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

    const sessionName = session.prof?.name ? session.prof.name : ''

    return (
        <Row className={styles.window}>
            <Col>
                {/* Navbar */}
                <Row>
                    <Col xs="auto">
                        <Row className={"align-items-end"}>
                            {/* Title */}
                            <Col md={"auto"} className={styles.noPaddingRight}>
                                <h1 className={joinStyles("colorGreen", styles.header)}>{"Cool Website™"}</h1>
                            </Col>
                            {session.auth?.uid && <Col xs="auto">
                                <span className={joinStyles(styles.feat, "colorGray")}>
                                    (with
                                    <span className={joinStyles("colorGreen", styles.userName)} onClick={openSessionUserPage}>
                                        {" " + sessionName}
                                    </span>
                                    )
                                </span>
                            </Col>}
                        </Row>
                    </Col>
                </Row >
                {/* Main Content */}
                <Row className={styles.marginTop4}>
                    <Col xs={12} sm={6} md={4}>
                        {session.auth ?
                            <>
                                <p>Logged in!</p>
                                <Button variant="outline-primary" onClick={() => { firebase.doSignOut() }}>Sign Out</Button>
                            </>
                            :
                            <>
                                <h3>Sign In</h3>
                                <h6 className={styles.marginTop4}>With Twitter:</h6>
                                <Button variant="primary" onClick={() => { setTwitterSignIn(true) }}>Sign In With Twitter</Button>
                                <EmailPwAuth />
                            </>
                        }
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

const EmailPwAuth: React.FC = () => {
    const firebase = useFirebase()

    const [inputs, setInputs] = useState({ email: '', pw: '', signInError: false })
    const { email, pw, signInError } = inputs
    // Handle text box change
    const handleInputs = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.persist()
        setInputs(prev => ({ ...prev, [event.target.name]: event.target.value }))
    }
    // Listen for enter key
    const listenEnterKey = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            doSignIn()
        }
    }
    const doSignIn = async () => {
        try {
            setInputs(prev => ({ ...prev, signInError: false }))
            await firebase.doSignInWithEmailAndPassword(email, pw)
        } catch (e) {
            console.error(e)
            setInputs(prev => ({ ...prev, signInError: true }))
        }
    }

    return (
        <div>
            <h6 className={styles.marginTop4}>With Email/Password:</h6>
            <input name='email' onChange={handleInputs} className={styles.marginTopWidth100PaddingSmall} value={inputs.email} placeholder="email" onKeyDown={listenEnterKey} />
            <input name='pw' onChange={handleInputs} className={styles.marginTopWidth100PaddingSmall} value={inputs.pw} placeholder="password" onKeyDown={listenEnterKey} type="password" />
            {signInError && <p className="colorError">Error signing in!</p>}
            <Button className={styles.marginTop1} onClick={doSignIn}>Sign In</Button>
        </div>
    )
}

export { HomePageWithAuth }
