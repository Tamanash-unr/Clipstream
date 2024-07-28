import { View, Text, ScrollView, TouchableOpacity, Image, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState } from 'react'
import { Video, ResizeMode } from 'expo-av'
import { router } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'

import FormField from '../../components/formField'
import CustomButton from '../../components/customButton'
import { icons } from '../../constants'
import { useGlobalContext } from '../../context/GlobalProvider'
import { createVideo } from '../../lib/appwrite'

const Create = () => {
  const { user, flashMessage } = useGlobalContext()
  const [uploading, setUploading] = useState(false)

  const [form, setForm] = useState({
    title: '',
    video: null,
    thumbnail: null,
    prompt: '',
    webVideoData: null,
    webThumbnailData: null
  })

  const openPicker = async (selectType) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: selectType === "image" ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
      aspect: [4, 3],
      quality: 1,
    });

    if(!result.canceled) {
      if(selectType === 'image') {
        if(Platform.OS === 'web'){
          fetch(result.assets[0].uri).then(res => res.blob()).then(blob => {
            const file = new File([blob], `${Date.now().toString()}.${blob.type.split('/')[1]}`, { type: blob.type});

            setForm({...form, thumbnail: result.assets[0], webThumbnailData: file })
          })
        } else {
          setForm({...form, thumbnail: result.assets[0]})
        }
      }

      if(selectType === 'video') {
        if(Platform.OS === 'web'){
          fetch(result.assets[0].uri).then(res => res.blob())
          .then(blob => { 
            const file = new File([blob], `${Date.now().toString()}.${blob.type.split('/')[1]}`, { type: blob.type});

            setForm({...form, video: result.assets[0], webVideoData: file })
          })
        } else {
          setForm({...form, video: result.assets[0]})
        }
      }
    } 
  }

  const submit = async () => {
    if(!form.thumbnail || !form.title || !form.video){
      return flashMessage.current.showMessage({
          message: 'Error',
          description: 'Please Fill in all the Fields!',
          type: "danger",
          duration: 2000
      });
    }

    setUploading(true)

    try {
      await createVideo({ ...form, userId: user.$id}, Platform.OS === 'web');

      flashMessage.current.showMessage({
        message: 'Success',
        description: "Post Uploaded Successfully!",
        type: "success",
        duration: 2000
      });

      router.push('/home')
    } catch (error) {
      console.log("CreateVideo: ", error)

      flashMessage.current.showMessage({
        message: 'Error',
        description: error.message,
        type: "danger",
        duration: 5000
      });

    } finally {
      setForm({
        title: '',
        video: null,
        thumbnail: null,
        prompt: ''
      })
      setUploading(false)
    }
  }

  return (
    <SafeAreaView className="bg-primary h-full">
        <ScrollView className="px-4 my-6 w-full">
          <View className={`${Platform.OS === 'web' ? "w-full max-w-[60vw] mx-auto" : ''}`}>
            <Text className="text-2xl text-white font-psemibold">
              Upload Videos
            </Text>

            <FormField 
              title="Video Title"
              value={form.title}
              placeholder="Give your video a catchy title.."
              handleChangeText={(evt) => setForm({...form, title: evt})}
              otherStyles="mt-10"
            />

            <View className="mt-7 space-y-2">
              <Text className="text-base text-gray-100 font-pmedium">
                Upload Video
              </Text>

              <TouchableOpacity
                onPress={() => openPicker('video')}
              >
                {
                  form.video ? (
                    <Video 
                      source={{ uri: form.video.uri }}
                      className={`w-full rounded-2xl ${ Platform.OS === 'web' ? 'h-[550px] bg-white/10' : 'h-64' }`}
                      resizeMode={ResizeMode.COVER}
                    />
                  ) : (
                    <View className="w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center">
                      <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
                        <Image 
                          source={icons.upload}
                          resizeMode='contain'
                          className="w-1/2 h-1/2"
                        />
                      </View>
                      <Text className="text-sm text-gray-100 font-pmedium mt-2">
                        (Max Size - 50 mb)
                      </Text>
                    </View>
                  )
                }
              </TouchableOpacity>
            </View>

            <View className="mt-7 space-y-2">
              <Text className="text-base text-gray-100 font-pmedium">
                Thumbnail Image
              </Text>

              <TouchableOpacity
                onPress={() => openPicker('image')}
              >
                {
                  form.thumbnail ? (
                    <Image 
                      source={{ uri: form.thumbnail.uri }}
                      resizeMode='cover'
                      className={`w-full rounded-2xl ${ Platform.OS === 'web' ? 'h-[550px]' : 'h-60' }`}
                    />
                  ) : (
                    <View
                      className="w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center border-2 border-black-200 flex-row space-x-2"
                    >
                      <Image 
                        source={icons.upload}
                        resizeMode='contain'
                        className="w-5 h-5"
                      />
                      <Text className="text-sm text-gray-100 font-pmedium">
                        Choose a file (Max Size - 50 mb) ..
                      </Text>
                    </View>
                  )
                }
              </TouchableOpacity>
            </View>

            {/* <FormField 
              title="AI Prompt"
              value={form.prompt}
              placeholder="The prompt used for this video.."
              handleChangeText={(evt) => setForm({...form, prompt: evt})}
              otherStyles="mt-7"
            /> */}

            <CustomButton 
              title="Submit & Publish"
              handlePress={submit}
              containerStyles="mt-7 w-full max-w-[400px] mx-auto"
              isLoading={uploading}
            />
          </View>
        </ScrollView>
    </SafeAreaView>
  )
}

export default Create