import FlashMessage from "react-native-flash-message";
import { forwardRef } from 'react'

const CustomFlashMessage = forwardRef(({ type, position, duration, containerStyles }, ref) => {
  return (
    <FlashMessage
        ref={ref}
        position={position ? position : "bottom"}
        className={`rounded-xl w-full max-w-[450px] mx-auto mb-4 ${containerStyles}`}
        type={type}
        duration={duration ? duration : 2000}
    />
  )
})

export default CustomFlashMessage