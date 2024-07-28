import { View, Text, Image, Platform } from 'react-native'
import { router } from 'expo-router'

import { images } from '../constants'
import CustomButton from './customButton'

const EmptyState = ({ title, subtitle, showButton }) => {
  return (
    <View className={`justify-center items-center px-4 ${Platform.OS === 'web' ? "w-full max-w-[75vw] mx-auto" : ''}`}> 
        <Image 
            source={images.empty}
            resizeMode='contain'
            className="w-[270px] h-[215px]"
        />
        
        <Text className="text-xl text-center font-psemibold text-white mt-2">
            {title}
        </Text>
        <Text className="font-pmedium text-sm text-gray-100">
            {subtitle}
        </Text>
        
        {
            showButton &&
            <CustomButton 
                title="Create Video"
                handlePress={() => router.push('/create')}
                containerStyles="w-full my-5 max-w-[450px]"
            />
        }        
    </View>
  )
}

export default EmptyState