import * as functions from 'firebase-functions';
import { CallableContext } from 'firebase-functions/lib/providers/https';
import { db } from '../Firebase';
import { firestore } from 'firebase-admin';
import { TwitterUser, UserProfile } from '../Types';
import { TwitterKeys } from '../Types/TwitterKeys';
import twit from 'twit'
import { getOriginalProfileUrl } from '../Common/getOriginalProfileUrl';


interface CreateNewProfilePayload {
    accessToken?: string;
    accessTokenSecret?: string;

    warmer?: boolean;
}

export const createNewProfile = functions.https.onCall(async (data: CreateNewProfilePayload, context: CallableContext) => {
    const { warmer } = data
    if (warmer) {
        return { success: true }
    }

    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'please authenticate')
    }
    const timestampNow = firestore.Timestamp.now()

    // Check if uid already has a profile
    // TODO: Handle updated data from twitter. Perhaps change this function from 'createNewProfile to 'login' instead?
    let isNewProfile = false
    try {
        const profRef = db.collection('users').doc(context.auth.uid)
        const profDoc = await profRef.get()
        if (!profDoc.exists) {
            isNewProfile = true
        } else {
            const profData = profDoc.data() as UserProfile
            const { name, uid } = profData
            if (!name || !uid) {
                isNewProfile = true
            }
        }
    } catch (e) {
        console.error('Failed to check existing users. // Error: ', e)
    }

    if (!isNewProfile) {
        throw new functions.https.HttpsError('already-exists', 'account already exists')
    }

    const { accessToken, accessTokenSecret } = data

    const newProfData: UserProfile = {
        username: '',
        name: '', lowercaseName: '', firstName: '', lastName: '',
        // Stats
        numFollowers: 0, numFollowing: 0,

        // Twitter Media
        profileImageUrl: 'https://abs.twimg.com/sticky/default_profile_images/default_profile.png', verified: false,
        location: '', description: '',
        // Data
        uid: context.auth.uid, id: '', timeJoined: timestampNow
    }

    // Check for tokens received
    const twitterKeys: TwitterKeys = functions.config().twitter

    const TwitClient = new twit({
        consumer_key: twitterKeys.key, consumer_secret: twitterKeys.secret,
        access_token: accessToken, access_token_secret: accessTokenSecret,
    })

    try {
        // Request Twitter Profile Data
        const getTwitter = TwitClient.get('account/verify_credentials', { skip_status: true, include_email: true })
        const twitterResult = await getTwitter
        const twitterData: TwitterUser = twitterResult.data as TwitterUser

        // Calculate name elements
        const twitterName = twitterData.name
        const twitterNameArr = twitterName.split(' ')
        let twitterFirst = ''
        let twitterLast = ''
        if (twitterNameArr.length) {
            const shiftedItem = twitterNameArr.shift()
            if (shiftedItem) {
                twitterFirst = shiftedItem
            }
            if (twitterNameArr.length) {
                twitterLast = twitterNameArr.join(' ')
            }
        } else {
            twitterFirst = twitterName
        }


        newProfData.username = twitterData.screen_name

        newProfData.name = twitterName
        newProfData.lowercaseName = twitterName.toLowerCase()
        newProfData.firstName = twitterFirst
        newProfData.lastName = twitterLast

        const profile_image_url_https_original = getOriginalProfileUrl(twitterData.profile_image_url_https)
        newProfData.profileImageUrl = profile_image_url_https_original
        newProfData.numFollowers = twitterData.followers_count
        newProfData.numFollowing = twitterData.friends_count

        newProfData.verified = twitterData.verified
        newProfData.location = twitterData.location
        newProfData.description = twitterData.description
        newProfData.id = twitterData.id_str

        // --- Save User Profile---
        const saveUserProfile = db.collection('users').doc(context.auth.uid).set(newProfData)

        // Update Twitter Tokens and Self Data 
        const accessTokenData = { accessToken, accessTokenSecret }
        const saveAccessTokens = db.collection('users').doc(context.auth.uid).collection('sensitive').doc('twitterTokens').set(accessTokenData)
        const saveTwitterData = db.collection('users').doc(context.auth.uid).collection('sensitive').doc('twitterData').set(twitterData)

        await saveUserProfile
        await saveAccessTokens
        await saveTwitterData

        return { prof: newProfData }

    } catch (error) {
        console.error(error)
        console.log('Failed to create Twitter profile with uid: ', context.auth.uid)
        throw new functions.https.HttpsError('internal', 'Failed to create Twitter profile')
    }
})