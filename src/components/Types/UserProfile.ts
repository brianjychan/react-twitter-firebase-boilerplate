// When updating, be sure all frontend versions are updated
// Also search through codebase for where the type is used

import { firestore } from "firebase/app";

// All details are public facing.

// This is the format of the document at /users/{uid}
export interface UserProfile {
    // Identity
    uid: string;
    id: string;


    username: string;
    lowercaseUsername: string;
    name: string;
    lowercaseName: string;
    firstName: string;
    lastName: string;

    // Stats
    numFollowers: number;
    numFollowing: number;

    // Media
    profileImageUrl: string;
    verified: boolean;
    location: string;
    description: string;

    // Data
    timeJoined?: firestore.Timestamp;
}

