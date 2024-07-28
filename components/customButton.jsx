import { TouchableOpacity, Text } from 'react-native'
import * as Animatable from 'react-native-animatable'
import CustomLoader from './customLoader'


const CustomButton = ({ title, handlePress, containerStyles, textStyles, isLoading }) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      className={`bg-secondary rounded-xl min-h-[62px] justify-center items-center ${containerStyles} ${isLoading ? 'opacity-70' : ''}`}
      disabled={isLoading}
    >
      {
        isLoading ?
        <Animatable.View 
          animation="rotate" 
          iterationCount="infinite" 
          duration={800}
          easing='linear'
        >
          <CustomLoader height="50px" width="50px" />
        </Animatable.View>
        :
        <Text className={`text-primary font-psemibold text-lg ${textStyles}`}>
          {title}
        </Text>
      }
        
    </TouchableOpacity>
  )
}

export default CustomButton