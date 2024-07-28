import { Text, Modal, View } from 'react-native'
import CustomButton from './customButton'

const ConfirmationBox = ({ title, dialogResult, isVisible }) => {
  return (
    <Modal
        visible={isVisible}
        transparent
        animationType='slide'
    >
        <View className="flex-1 justify-center items-center bg-seeThrough">
            <View 
                className="justify-center items-center bg-primary p-6 rounded-xl border-2 border-black-200"
            >
                <Text className="text-white font-psemibold text-lg">
                    {title}
                </Text>
                <View className="flex-row mt-4">
                    <CustomButton 
                        title="Confirm"
                        containerStyles="mx-2 min-w-[85px] min-h-[50px]"
                        textStyles="text-sm"
                        handlePress={() => dialogResult(true)}
                    />
                    <CustomButton 
                        title="Cancel"
                        containerStyles="mx-2 min-w-[85px] min-h-[50px]"
                        textStyles="text-sm"
                        handlePress={() => dialogResult(false)}
                    />
                </View>
            </View>
        </View>
    </Modal>
  )
}

export default ConfirmationBox