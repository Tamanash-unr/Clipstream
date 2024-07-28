import { Image, Text, View } from 'react-native'
import { Tabs } from 'expo-router'

import { icons } from "../../constants"
import { useGlobalContext } from '../../context/GlobalProvider';
import CustomFlashMessage from '../../components/customFlashMessage';

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="items-center justify-center gap-1">
      <Image 
        source={icon}
        resizeMode='contain'
        tintColor={color}
        className="w-6 h-6"
      />
      <Text className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`} style={{ color: color }}>
        {name}
      </Text>
    </View>
  )
}

const TabsLayout = () => {
  const { flashMessage } = useGlobalContext();

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#FFA001',
          tabBarInactiveTintColor: '#CDCDE0',
          tabBarStyle: {
            backgroundColor: '#161622',
            borderTopWidth: 1,
            borderTopColor: '#232533',
            height: 75,
          },
        }}
      >
        <Tabs.Screen 
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
              <TabIcon
                icon={icons.home}
                name="Home"
                color={color}
                focused={focused}
              />
            )
          }}
        />
        <Tabs.Screen 
          name="bookmark"
          options={{
            title: "Bookmark",
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
              <TabIcon
                icon={icons.bookmark}
                name="Bookmark"
                color={color}
                focused={focused}
              />
            )
          }}
        />
        <Tabs.Screen 
          name="create"
          options={{
            title: "Create",
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
              <TabIcon
                icon={icons.plus}
                name="Create"
                color={color}
                focused={focused}
              />
            )
          }}
        />
        <Tabs.Screen 
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            href: {
              pathname: '/profile',
              params: {
                creatorId: null,
                creatorName: null,
                creatorAvatar: null
              }
            },
            tabBarIcon: ({color, focused}) => (
              <TabIcon
                icon={icons.profile}
                name="Profile"
                color={color}
                focused={focused}
              />
            )
          }}
        />
      </Tabs>
      
      <CustomFlashMessage ref={flashMessage}/>  
    </>
  )
}

export default TabsLayout