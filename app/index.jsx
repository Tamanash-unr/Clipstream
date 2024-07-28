import { StatusBar } from 'expo-status-bar';
import { Image, ScrollView, Text, View, Platform } from 'react-native';
import { Redirect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { images } from "../constants";
import CustomButton from '../components/customButton';
import { useGlobalContext } from '../context/GlobalProvider';

export default function App() {
  const { isLoading, isLoggedIn } = useGlobalContext();

  if(!isLoading && isLoggedIn) return <Redirect href='/home' />

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View className="w-full h-full justify-center items-center px-4">
          <Image
            source={images.logo}
            resizeMode='contain'
            className="w-[300px] h-[80px]"
          />
          <Image 
            source={images.cards}
            resizeMode='contain'
            className="max-w-[380px] w-full h-[300px]"
          />
          <View className="relative mt-5">
            <Text className={`${ Platform.OS == 'web' ? 'text-3xl' : 'text-2xl' } text-white font-bold text-center`}> 
              Discover endless possibilities with <Text className="text-secondary-200">ClipStream</Text>
            </Text>

            <Image 
              source={images.path}
              className={`w-[136px] h-[15px] absolute -bottom-2 ${ Platform.OS == 'web' ? '-right-8' : 'left-36'}`}
              resizeMode='contain'
            />
          </View>

          <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
            Where creativity meets innovation: embark on a journey of limitkess exploration with ClipStream
          </Text>

          <CustomButton 
            title="Continue with Email"
            handlePress={() => {router.push('/sign-in')}}
            containerStyles="w-full max-w-[450px] mt-7"
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor='#161622' style='light' />
    </SafeAreaView>
  )
}
