import { Svg, G, Path } from 'react-native-svg'

const CustomLoader = ({ width, height, fill, stroke }) => {
  return (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        width={width}
        height={height}
    >
        <G
        fill={fill ? fill : '#8233c3'}
        stroke={stroke ? stroke : '#055'}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.2}
        >
        <Path
            fillRule="evenodd"
            d="M12 19a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm0 3c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"
            clipRule="evenodd"
            opacity={0.2}
        />
        <Path d="M2 12C2 6.477 6.477 2 12 2v3a7 7 0 0 0-7 7H2Z" />
        </G>
        <G fill={fill ? fill : '#8233c3'}>
        <Path
            fillRule="evenodd"
            d="M12 19a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm0 3c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"
            clipRule="evenodd"
            opacity={0.2}
        />
        <Path d="M2 12C2 6.477 6.477 2 12 2v3a7 7 0 0 0-7 7H2Z" />
        </G>
    </Svg>
  )
}

export default CustomLoader