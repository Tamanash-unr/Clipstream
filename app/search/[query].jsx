import { View, Text, FlatList, Platform } from 'react-native'
import { useEffect, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FlashMessage from 'react-native-flash-message'
import { useLocalSearchParams } from 'expo-router'

import SearchInput from '../../components/searchInput'
import EmptyState from '../../components/emptyState'
import { searchPosts } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/videoCard'

const Search = () => {
  const { query } = useLocalSearchParams();
  const { data: posts, refetch } = useAppwrite(() => searchPosts(query));

  const flashMessage = useRef()

  useEffect(()=>{
    refetch();
  },[query])

  const doOnError = (message, description, duration) => {
    return flashMessage.current.showMessage({
      message,
      description,
      type: "danger",
      duration
    });
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList 
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({item})=>(
          <VideoCard video={item} />
        )}
        ListHeaderComponent={() => (
          <View className={`my-6 px-4 ${Platform.OS === 'web' ? "w-full max-w-[75vw] mx-auto" : ''}`}>
            <Text className="font-pmedium text-sm text-gray-100">
              Search Results
            </Text>
            <Text className="text-2xl font-psemibold text-white">
                {query}
            </Text>

            <View className="mt-6 mb-8">
              <SearchInput initialQuery={query} doOnError={doOnError}/>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState 
            title="No videos found"
            subtitle="No videos found for this search query"
          />
        )}
      />

      <FlashMessage
        ref={flashMessage}
        position="bottom"
        className="rounded-xl w-full max-w-[450px] mx-auto mb-4"
      />
    </SafeAreaView>
  )
}

export default Search