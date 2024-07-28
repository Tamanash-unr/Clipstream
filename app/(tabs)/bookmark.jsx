import { Text, View, FlatList, RefreshControl, Platform } from 'react-native'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useGlobalContext } from '../../context/GlobalProvider'
import { getUserBookmarks } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import EmptyState from '../../components/emptyState'
import VideoCard from '../../components/videoCard'

const Bookmark = () => {
  const { user, setUser } = useGlobalContext();
  const { data, refetch } = useAppwrite(() => getUserBookmarks(user.$id));
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);

    // re call videos => check if any new videos appeared
    await refetch();
    setUser({ ...user, videos: data })

    setRefreshing(false); 
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList 
        data={user.videos}
        keyExtractor={(item) => item.$id}
        renderItem={({item})=>(
          <VideoCard video={item} />
        )}
        ListHeaderComponent={() => (
          <View className={`px-4 my-6 ${Platform.OS === 'web' ? "w-full max-w-[60vw] mx-auto" : ''}`}>
            <Text className="text-2xl text-white font-psemibold">
              Bookmarks
            </Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState 
            title="No videos found"
            subtitle="Bookmark your favorite videos.."
            showButton={false}
          />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
      />
    </SafeAreaView>
  )
}

export default Bookmark