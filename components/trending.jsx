import { FlatList, TouchableOpacity, ImageBackground, Image, Platform } from 'react-native'
import { useState, useRef } from 'react'
import * as Animatable from 'react-native-animatable'
import { ResizeMode, Video } from 'expo-av'
import * as ScreenOrientation from 'expo-screen-orientation'

import { icons } from '../constants'

const zoomIn = {
  0: {
    scale: 0.9
  },
  1: {
    scale: 1.08
  }
}

const zoomOut = {
  0: {
    scale: 1.08
  },
  1: {
    scale: 0.9
  }
}

const TrendingItem = ({ activeItem, item }) => {

  const [play, setPlay] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const videoRef = useRef(null)

  const onFullscreenUpdate = async ({ fullscreenUpdate }) => {
    switch (fullscreenUpdate) {
      case (0,1):
        if(Platform.OS === 'android'){
          await ScreenOrientation.unlockAsync();  // Required only for android
        }
        setIsFullscreen(true)
        break;
      case (2,3):
        if(Platform.OS === 'android'){
          await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT); // Required only for android
        }
        setIsFullscreen(false)
        break;
    }
  }

  const videoStyle =  Platform.OS === 'web' ? 
                      "w-[350px] h-[500px] rounded-[35px] mt-3.5 bg-white/10" : 
                      "w-52 h-72 rounded-[35px] mt-3.5 bg-white/10";

  const thumbnailStyle =  Platform.OS === 'web' ? 
                          "w-[350px] h-[500px] rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40" : 
                          "w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40";

  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {
        play ? (
          <Video
            ref={videoRef} 
            source={{ uri: item.video }}
            className={videoStyle}
            resizeMode={ isFullscreen ? ResizeMode.CONTAIN : ResizeMode.COVER}
            useNativeControls
            shouldPlay
            onPlaybackStatusUpdate={async (status) => {
              if(status.didJustFinish){
                if(Platform.OS === 'android'){
                  await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT); // Required only for android
                  videoRef.current.dismissFullscreenPlayer();
                }

                setIsFullscreen(false)
                setPlay(false)
              }
            }}
            onFullscreenUpdate={onFullscreenUpdate}
            onReadyForDisplay={videoData => {
              if(Platform.OS === 'web') {
                videoData.srcElement.style.position = "initial"
                isFullscreen ? videoData.srcElement.style.marginLeft = "auto" : videoData.srcElement.style.marginLeft = "none"
                isFullscreen ? videoData.srcElement.style.marginRight = "auto" : videoData.srcElement.style.marginRight = "none"
              }
            }}
          />
        ) : (
          <TouchableOpacity
            className="relative justify-center items-center"
            activeOpacity={0.7}
            onPress={() => setPlay(true)}
          >
            <ImageBackground 
              source={{ uri: item.thumbnail }}
              className={thumbnailStyle}
              resizeMode="cover"
            />
            <Image 
              source={icons.play}
              resizeMode='contain'
              className="w-12 h-12 absolute"
            />
          </TouchableOpacity>
        )
      }
    </Animatable.View>
  )
}

const Trending = ({ posts }) => {
  const [activeItem, setActiveItem] = useState(posts[1])

  const onViewableItemsChanged = ({ viewableItems }) => {
    if(viewableItems.length > 0 && Platform.OS !== 'web') {
      setActiveItem(viewableItems[0].key)
    }
  }

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 70
  }

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ]);

  return (
    <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({item})=>(
            <TrendingItem activeItem={activeItem} item={item} />
        )}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        // onViewableItemsChanged={onViewableItemsChanged}
        // viewabilityConfig={{
        //   itemVisiblePercentThreshold: 70
        // }}
        contentOffset={{ x: 170 }}
        horizontal
        className={ Platform.OS === 'web' ? 'w-full' : '' }
    />
  )
}

export default Trending