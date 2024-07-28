import { View, Text, TouchableOpacity } from 'react-native'
import * as Animatable from 'react-native-animatable'
import { useState } from 'react' 

const scaleDown = {
    from: {
        scale: 0,
    },
    to: {
        scale: 1,
    }
}

const scaleUp = {
    from: {
        scale: 1,
    },
    to: {
        scale: 0,
    }
}

const MenuButton = ({ title, onPressed, textStyle }) => {
    const [hover, setHover] = useState(false);
    return (
        <TouchableOpacity
            onPress={onPressed}
            className={`min-w-[80px] min-h-[30px] ${hover ? 'bg-gray-300': ''}`}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <Text className={`text-white font-psemibold my-auto mx-2 ${textStyle}`}>
                {title}
            </Text>
        </TouchableOpacity>
    )
}

const DropdownMenu = ({ visibility, menuItems }) => {  
  return (
    <Animatable.View
        animation={visibility ? scaleDown : scaleUp}
        duration={500}
        className="absolute top-10 right-7 p-2 z-10 rounded-lg bg-primary border-2 border-gray-100"
        style={{transformOrigin: 'top right'}}
        
    >
      {
        menuItems.map((item) => (
            <MenuButton
                key= {item.key} 
                title= {item.title}
                textStyle= {item.textStyle}
                onPressed= {item.onPress}
            />
        ))
      }
    </Animatable.View>
  )
}

export default DropdownMenu