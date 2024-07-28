import { Text, Modal, View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'

import CustomButton from './customButton'

const useConfirm = () => {
    const [ visible, setVisible ] = useState(false);
    const [ resolver, setResolver ] = useState({ resolver: null })
    const [ title, setTitle ] = useState('')

    const createPromise = () => {
        let resolver;

        return [ new Promise(( resolve, reject ) => {
            resolver = resolve
        }), resolver]
    }

    const getConfirmation = async (text) => {
        setTitle(text);
        setVisible(true);
        const [ promise, resolve ] = await createPromise()
        setResolver({ resolve })
        return promise;
    }

    const onClick = async (status) => {
        setVisible(false)
        await resolver.resolve(status)
    }

    const ConfirmationBox = () => { 
        return (
          <Modal
              visible={visible}
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
                        <TouchableOpacity
                            onPress={() => onClick(true)}
                            className={`bg-secondary rounded-xl mx-2 min-w-[85px] min-h-[50px] justify-center items-center`}
                        >
                            <Text className={`text-primary font-psemibold text-sm`}>
                                Confirm
                            </Text>
                        </TouchableOpacity>    
                        <TouchableOpacity
                            onPress={() => onClick(false)}
                            className={`bg-secondary rounded-xl mx-2 min-w-[85px] min-h-[50px] justify-center items-center`}
                        >
                            <Text className={`text-primary font-psemibold text-sm`}>
                                Cancel
                            </Text>
                        </TouchableOpacity> 
                      </View>
                  </View>
              </View>
          </Modal>
        )
      }

      return [ getConfirmation, ConfirmationBox ]
}

export default useConfirm;