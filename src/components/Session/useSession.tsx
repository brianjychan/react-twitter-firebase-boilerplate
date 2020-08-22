import { createContext, useContext } from 'react'
import firebase from 'firebase'

export interface SessionObject {
    initializing: boolean,
    auth: firebase.User | null,
    prof: any, // profile
}

const SessionContext = createContext<SessionObject>({
    auth: null,
    initializing: true,
    prof: null,
})

const useSession = () => {
    const session = useContext(SessionContext)
    return session
}

export { SessionContext, useSession }

