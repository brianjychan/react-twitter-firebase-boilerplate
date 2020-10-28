import React, { useEffect, useState } from 'react'
import { useFirebase } from '../Firebase'
import { useSession } from '../Session'
import { Redirect } from 'react-router-dom'
import { ROUTES } from '../../constants'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

import styles from './Home.module.css'
import { joinStyles } from '../Utilities/joinStyles';


const HomePage: React.FC = () => {
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
                <Row className={styles.marginTop}>
                    <Col xs={12} sm={6} md={4}>
                        {session.auth ?
                            <>
                                <p>Logged in!</p>
                                <Button variant="outline-primary" onClick={() => { firebase.doSignOut() }}>Sign Out</Button>
                            </>
                            :
                            <>
                                <h3>Sign In</h3>
                                <h6 className={styles.marginTop}>With Twitter:</h6>
                                <Button variant="primary" onClick={() => { setTwitterSignIn(true) }}>Sign In With Twitter</Button>
                                <h6 className={styles.marginTop}>With Email/Password:</h6>
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

    const [inputs, setInputs] = useState({ email: '', pw: '' })
    const { email, pw } = inputs
    // Handle text box change
    const handleInputs = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.persist()
        setInputs(prev => ({ ...prev, [event.target.name]: event.target.value }))
    }
    // Listen for enter key
    const listenEnterKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            firebase.doSignInWithEmailAndPassword(email, pw)
        }
    }

    return (
        <div>
            <input name='email' onChange={handleInputs} className={styles.marginTopWidth100PaddingSmall} value={inputs.email} placeholder="email" onKeyDown={listenEnterKey} />
            <input name='pw' onChange={handleInputs} className={styles.marginTopWidth100PaddingSmall} value={inputs.pw} placeholder="password" onKeyDown={listenEnterKey} />
        </div>

    )
}

export { HomePage }
