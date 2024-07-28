import { View, Image, FlatList, TouchableOpacity, RefreshControl, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState, useEffect } from 'react'
import { router, useLocalSearchParams } from 'expo-router'

import EmptyState from '../../components/emptyState'
import { useGlobalContext } from '../../context/GlobalProvider'
import { getUserPosts, signOut } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/videoCard'
import { icons } from '../../constants'
import InfoBox from '../../components/infoBox'

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const { creatorId, creatorName, creatorAvatar } = useLocalSearchParams();

  const { data: posts, refetch } = useAppwrite(() => getUserPosts(creatorId ? creatorId : user.$id));
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);

    // re call videos => check if any new videos appeared
    await refetch();

    setRefreshing(false); 
  }

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLoggedIn(false);

    router.replace('/sign-in')
  }

  useEffect(() => {
    onRefresh()
  }, [creatorId])

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList 
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({item})=>(
          <VideoCard video={item} refreshPosts={onRefresh} />
        )}
        ListHeaderComponent={() => (
          <View className={`justify-center items-center mt-6 mb-12 px-4 ${Platform.OS === 'web' ? "w-full max-w-[60vw] mx-auto" : 'w-full'}`}>
            {
              creatorId ?
              <></> :
              <TouchableOpacity
                className="w-full items-end mb-10"
                onPress={logout}
              >
                <Image 
                  source={icons.logout}
                  resizeMode='contain'
                  className="w-6 h-6"
                />
              </TouchableOpacity>
            }

            <View
              className="w-16 h-16 border border-secondary rounded-lg justify-center items-center"
            >
              <Image 
                source={{ uri: creatorId ? creatorAvatar : user?.avatar }}
                resizeMode='cover'
                className="w-[90%] h-[90%] rounded-lg"
              />
            </View>

            <InfoBox 
              title={creatorId ? creatorName : user?.username}
              containerStyles="mt-5"
              titleStyles="text-lg"
            />

            <View className="flex-row">
              <InfoBox
                title={posts.length || 0}
                subtitle="Posts"
                containerStyles="mr-10"
                titleStyles="text-xl"
              />
              <InfoBox
                title="0"
                subtitle="Followers"
                titleStyles="text-xl"
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState 
            title="No videos found"
            subtitle="No videos found for this search query"
          />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
      />
    </SafeAreaView>
  )
}

export default Profile