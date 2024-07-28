import { Client, Account, ID, Avatars, Databases, Query, Storage } from 'react-native-appwrite';

export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_ENDPOINT,
    platform: process.env.EXPO_PUBLIC_PLATFORM,
    projectId: process.env.EXPO_PUBLIC_PROJECTID,
    databaseId: process.env.EXPO_PUBLIC_DATABASEID,
    userCollectionId: process.env.EXPO_PUBLIC_USER_COLLECTION_ID,
    videosCollectionId: process.env.EXPO_PUBLIC_VIDEOS_COLLECTION_ID,
    storageId: process.env.EXPO_PUBLIC_STORAGE_ID
}

// Init React Native SDK
const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint) // Appwrite Endpoint
    .setProject(appwriteConfig.projectId) // Project ID
    .setPlatform(appwriteConfig.platform) // Application ID or Bundle ID.
;

const account = new Account(client);
const avatar = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (username, email, password) => {
    // Register User
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        );

        if(!newAccount) throw Error;

        const avatarUrl = avatar.getInitials(username);
        
        await signIn(email, password);

        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl
            }
        );

        return newUser;
    } catch (error) {
        console.log("Sign Up: ", error);
        throw new Error(error);
    }
}

export const signIn = async (email, password) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);

        return session;
    } catch (error) {
        console.log("Sign In: ", error);
        throw new Error(error);
    }
}

export const getCurrentUser = async () => {
    try { 
        const currentAccount = await account.get();

        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if(!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.log("Current User: ", error);
        throw new Error(error);
    }
}

export const getAllPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videosCollectionId,
            [Query.orderDesc('$createdAt')]
        )

        return posts.documents;
    } catch (error) {
        throw new Error(error)
    }
}

export const getLatestPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videosCollectionId,
            [Query.orderDesc('$createdAt', Query.limit(7))],
        )

        return posts.documents;
    } catch (error) {
        throw new Error(error)
    }
}

export const searchPosts = async (query) => {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videosCollectionId,
            [Query.search('title', query)],
        )

        return posts.documents;
    } catch (error) {
        throw new Error(error)
    }
}

export const getUserPosts = async (userId) => {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videosCollectionId,
            [Query.equal('creator', userId), Query.orderDesc('$createdAt')],
        )

        return posts.documents;
    } catch (error) {
        throw new Error(error)
    }
}

export const signOut = async () => {
    try {
        const session = await account.deleteSession('current');

        return session;
    } catch (error) {
        throw new Error(error)
    }
}

export const getFilePreview = async (fileId, type) => {
    let fileUrl;

    try {
        if(type === 'video'){
            fileUrl = storage.getFileView(appwriteConfig.storageId, fileId)
        } else if(type === 'image') {
            fileUrl = storage.getFilePreview(appwriteConfig.storageId, fileId, 2000, 2000, 'top', 100)
        } else {
            throw new Error('Invalid file type');
        }

        if(!fileUrl) throw Error
        
        return fileUrl
    } catch (error) {
        throw new Error(error)
    }
}

export const uploadFile = async (file, type, isWeb = false) => {
    if(!file) return;

    /* const { mimeType, ...rest } = file;
       const asset = { type: mimeType, ...rest } */

    const asset = {
        name: file.fileName,
        type: file.mimeType,
        size: file.fileSize,
        uri: file.uri,
    }

    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            isWeb ? file : asset
        );

        const fileUrl = await getFilePreview(uploadedFile.$id, type);

        return fileUrl;
    } catch (error) {
        throw new Error('UploadFile: ' + error)
    }
}

export const createVideo = async (form, isWeb = false) => {
    try {
       const [thumbnailUrl, videoUrl] = await Promise.all([
        isWeb ? uploadFile(form.webThumbnailData, 'image', true) : uploadFile(form.thumbnail, 'image'),
        isWeb ? uploadFile(form.webVideoData, 'video', true) : uploadFile(form.video, 'video')
       ])

       const newPost = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.videosCollectionId,
        ID.unique(),
        {
            title: form.title,
            thumbnail: thumbnailUrl,
            video: videoUrl,
            prompt: form.prompt,
            creator: form.userId
        }
       )

       return newPost;
    } catch (error) {
        throw new Error('CreateDoc: ' + error)
    }
}

export const deleteVideo = async (videoId, creatorId, userId, videoFileId, thumbnailFileId) => {
    try {
        if(!creatorId || creatorId !== userId){
            throw new Error('Unauthorized')
        }

        const post = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.videosCollectionId,
            videoId
        )

        // Delete Video file from storage
        await storage.deleteFile(
            appwriteConfig.storageId,
            videoFileId
        )

        // Delete Thumbnail file from storage
        await storage.deleteFile(
            appwriteConfig.storageId,
            thumbnailFileId
        )
        
        console.log(post)
     } catch (error) {
         throw new Error(error)
     }
}

export const getUserBookmarks = async () => {
    try {
        const currentAccount = await account.get();

        const userData = await databases.listDocuments(
            appwriteConfig.databaseId, 
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        return userData.documents[0].videos
    } catch (error) {
        throw new Error(error)
    }
}

export const addToBookmark = async (user, bookmarks) => {
    try {
        const userData = await databases.updateDocument(
            appwriteConfig.databaseId, 
            appwriteConfig.userCollectionId, 
            user.$id,
            {
                videos: bookmarks
            }
        )

        return userData.videos
    } catch (error) {
        throw new Error(error)
    }
}

export const removeFromBookmark = async (userId, filteredBookmarks) => {
    try {
        const userData = await databases.updateDocument(
            appwriteConfig.databaseId, 
            appwriteConfig.userCollectionId, 
            userId,
            {
                videos: filteredBookmarks
            }
        )

        return userData.videos
    } catch (error) {
        throw new Error(error)
    }
}