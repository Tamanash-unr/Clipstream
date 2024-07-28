import { View, Text, Image, TouchableOpacity, Platform } from 'react-native'
import { useEffect, useState, useRef } from 'react'
import { ResizeMode, Video } from 'expo-av'
import { router } from 'expo-router'
import * as ScreenOrientation from 'expo-screen-orientation'

import { useGlobalContext } from '../context/GlobalProvider'
import { icons, gifs } from '../constants'
import { addToBookmark, removeFromBookmark, deleteVideo } from '../lib/appwrite'
import useConfirm from './useConfirm' 
import DropdownMenu from './dropdownMenu'

// const VideoCard = ({ video: { $id, title, thumbnail, videoUri, creator: { username, avatar} } }) =>

const VideoCard = ({ video, refreshPosts }) => {
    const { user, setUser, flashMessage } = useGlobalContext()
    const { $id, title, thumbnail, video: videoUri, creator: { username, avatar} } = video;
    const [ getConfirmation, ConfirmationBox ] = useConfirm();

    const [play, setPlay] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);    
    const [showMenu, setShowMenu] = useState(false);
    const [isProcessing, setIsProcessing ] = useState(false);

    const videoRef = useRef(null);

    const onFullscreenUpdate = async ({ fullscreenUpdate }) => {
        switch (fullscreenUpdate) {
          case (0,1):
            if(Platform.OS === 'android'){    
                await ScreenOrientation.unlockAsync();  // Required only for android
            }
            break;
          case (2,3):
            if(Platform.OS === 'android'){
                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT); // Required only for android
            }
            break;
        }
      }
    
    const checkIfBookmarked = () => {
        user.videos.forEach(item => {
            if(item.$id == $id){
                setBookmarked(true)
                return
            }
        });
    }

    const doOnBookmark = async () => {
        try {
            if(bookmarked){
                setBookmarked(false)
                const filteredBookmarks = user.videos.filter((item) => item.$id !== video.$id)

                setUser({...user, videos: filteredBookmarks})                
                await removeFromBookmark(user.$id, filteredBookmarks)
            } else {
                setBookmarked(true)
                const updatedBookmarks = [...user.videos, video]
                
                setUser({...user, videos: updatedBookmarks})
                await addToBookmark(user, updatedBookmarks)
            }
        } catch (error) {
            setBookmarked(false)
            
            return flashMessage.current.showMessage({
                message: 'Error',
                description: error.message,
                type: "danger",
                duration: 2000
            });
        }
    }

    useEffect(()=> {
        if(user)
            checkIfBookmarked();
    },[user])

    
    const goToProfile = () => {
        setShowMenu(false)

        if(video.creator.$id !== user.$id){
            router.push({ pathname: '/profile', 
                          params: { creatorId: video.creator.$id, 
                                    creatorName: video.creator?.username, 
                                    creatorAvatar: video.creator?.avatar 
                        }})
        } else {
            router.push({ pathname: '/profile', 
                          params: { creatorId: null, 
                                    creatorName: null, 
                                    creatorAvatar: null 
                        }})
        }
    }

    const onDeletePost = async () => {
        setShowMenu(false)
        const result = await getConfirmation("Delete Post ?")

        const videoFileId = videoUri.split('/files/')[1].split('/')[0];
        const thumbnailFile = thumbnail.split('/files/')[1].split('/')[0];

        if(result){
            setIsProcessing(true)

            try {
                await deleteVideo(video.$id, video.creator.$id, user.$id, videoFileId, thumbnailFile)
                
                refreshPosts();
            } catch (error) {
                setIsProcessing(false)

                return flashMessage.current.showMessage({
                    message: 'Error',
                    description: error.message,
                    type: "danger",
                    duration: 2000
                });
            }
        }
    }

    const menuItems = [
        {   
            key: video.$id + "_profile",
            title: 'View Profile', 
            onPress: goToProfile
        },
        {
            key: video.$id + "_delete",
            title: 'Delete Post',
            onPress: onDeletePost,
            textStyle: "text-red-600"
        }
    ]

    return (
        (
            isProcessing ?
            <View className="mx-auto my-5">
                <Image 
                        source={gifs.ellipse}
                        className="w-12 h-4"
                />
            </View>
            :
            <View className={`flex-col items-center px-4 mb-14 ${Platform.OS === 'web' ? "w-full max-w-[60vw] mx-auto" : ''}`}>
                <View className="flex-row gap-3 items-start justify-between w-full">
                    <View className="justify-center items-center flex-row flex-1">
                        <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
                            <Image 
                                source={{ uri: avatar }}
                                resizeMode='cover'
                                className="w-full h-full rounded-lg"
                            />
                        </View>

                        <View className="justify-center flex-1 ml-3 gap-y-1">
                            <Text className="text-white font-psemibold text-sm" numberOfLines={1}>
                                {title}
                            </Text>
                            <Text className="text-gray-100 text-xs font-pregular" numberOfLines={1}>
                                {username}
                            </Text>
                        </View>
                    </View>

                    <View className="pt-2 flex-row">
                        <TouchableOpacity
                            className="mx-2"
                            onPress={doOnBookmark}
                        >
                            <Image
                                source={bookmarked ? icons.bookmark : icons.bookmarkAlt}
                                resizeMode='contain'
                                className="w-5 h-5"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setShowMenu(!showMenu)}
                        >
                            <Image
                                source={icons.menu}
                                resizeMode='contain'
                                className="w-5 h-5"
                            />
                        </TouchableOpacity>
                        <ConfirmationBox />
                    </View>
                </View>

                {
                    play ? (
                        <Video
                            ref={videoRef} 
                            source={{ uri: videoUri}}
                            className={`w-full ${ Platform.OS === 'web' ? 'h-[550px] bg-white/10' : 'h-60' } rounded-xl mt-3`}
                            resizeMode={ResizeMode.CONTAIN}
                            useNativeControls
                            shouldPlay
                            onPlaybackStatusUpdate={async (status) => {
                            if(status.didJustFinish){
                                if(Platform.OS === 'android'){
                                    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT); // Required only for android
                                    videoRef.current.dismissFullscreenPlayer();
                                }
                                
                                setPlay(false)
                            }
                            }}
                            onFullscreenUpdate={onFullscreenUpdate}
                            onReadyForDisplay={videoData => {
                                if(Platform.OS === 'web') {
                                videoData.srcElement.style.position = "initial"
                                videoData.srcElement.style.marginLeft = "auto"
                                videoData.srcElement.style.marginRight = "auto"
                                videoData.srcElement.style.height = "550px"
                                }
                            }}
                        />
                    ) : (
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => setPlay(true)}
                            className={`w-full ${ Platform.OS === 'web' ? 'h-[550px]' : 'h-60' } rounded-xl mt-3 relative justify-center items-center z-0`}
                        >
                            <Image
                                source={{ uri: thumbnail }}
                                resizeMode='cover'
                                className="w-full h-full rounded-xl mt-3"
                            />
                            <Image 
                                source={icons.play}
                                resizeMode='contain'
                                className="w-12 h-12 absolute"
                            />
                        </TouchableOpacity>
                    )
                }
                
                { showMenu && <DropdownMenu visibility={showMenu} menuItems={menuItems}/>}
            </View>
        )
    )
}

export default VideoCard