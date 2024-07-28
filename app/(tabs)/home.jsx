import { View, Text, FlatList, Image, RefreshControl, Platform } from 'react-native'
import { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { images } from '../../constants'
import SearchInput from '../../components/searchInput'
import Trending from '../../components/trending'
import EmptyState from '../../components/emptyState'
import { getAllPosts, getLatestPosts } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/videoCard'
import { useGlobalContext } from '../../context/GlobalProvider'

const Home = () => {
  const { user } = useGlobalContext();
  const { data: posts, refetch: refetchPosts } = useAppwrite(getAllPosts);
  const { data: latestPosts, refetch: refetchLatest } = useAppwrite(getLatestPosts);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);

    // re call videos => check if any new videos appeared
    await refetchPosts();
    await refetchLatest();

    setRefreshing(false); 
  }

  useEffect(()=>{},[user])

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList 
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({item})=>(
          <VideoCard video={item} refreshPosts={onRefresh} />
        )}
        ListHeaderComponent={() => (
          <View className={`my-6 px-4 space-y-6 ${Platform.OS === 'web' ? "w-full max-w-[75vw] mx-auto" : ''}`}>
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome back
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                    {user?.username}
                </Text>
              </View>

              <View className="mt-1.5">
                <Image 
                  source={images.logoSmall}
                  resizeMode='contain'
                  className="w-12 h-12"
                />
              </View>
            </View>

            <SearchInput />

            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-gray-100 text-lg font-pregular mb-3">
                Latest Videos
              </Text>

              <Trending 
                posts={latestPosts ?? []}
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState 
            title="No videos found"
            subtitle="Be the first one to upload a video"
          />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
      />
    </SafeAreaView>
  )
}

export default Home