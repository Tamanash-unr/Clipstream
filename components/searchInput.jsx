import { View, TextInput, TouchableOpacity, Image } from 'react-native'
import { useState } from 'react'
import { router, usePathname } from 'expo-router'

import { icons } from "../constants"
import { useGlobalContext } from '../context/GlobalProvider' 

const SearchInput = ({ initialQuery, doOnError }) => {
    const pathname = usePathname();
    const [query, setQuery] = useState(initialQuery || '');

    const { flashMessage } = useGlobalContext();

  return (
        <View className="border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row space-x-4">
            <TextInput 
                className="text-base mt-0.5 text-white flex-1 font-pregular"
                value={query}
                placeholder="Search for a video topic.."
                placeholderTextColor='#CDCDE0'
                onChangeText={(evt) => setQuery(evt)}
            />

            <TouchableOpacity
                onPress={() => {
                    if(!query) {
                        if(doOnError){
                            doOnError('Missing Query','Please input something to search results across database.', 5000);
                        }

                        return flashMessage.current.showMessage({
                                    message: 'Missing Query',
                                    description: 'Please input something to search results across database.',
                                    type: "danger",
                                    duration: 5000
                                });
                    }

                    if(pathname.startsWith('/search')) {
                        router.setParams({ query });
                    } else {
                        router.push(`/search/${query}`)
                    }
                }}
            >
                <Image 
                    source={icons.search}
                    resizeMode='contain'
                    className="w-5 h-5"
                />
            </TouchableOpacity>
        </View>
  )
}

export default SearchInput