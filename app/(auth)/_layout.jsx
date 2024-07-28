import { StatusBar } from 'expo-status-bar';
import { Stack } from "expo-router"; 

import { useGlobalContext } from '../../context/GlobalProvider';
import CustomFlashMessage from '../../components/customFlashMessage';

const AuthLayout = () =>{
    const { flashMessage } = useGlobalContext();

    return (
        <>
            <Stack>
                <Stack.Screen
                    name="sign-in"
                    options={{
                        headerShown: false
                    }}
                />
                <Stack.Screen
                    name="sign-up"
                    options={{
                        headerShown: false
                    }}
                />  
            </Stack>

            <CustomFlashMessage ref={flashMessage}/>        
            <StatusBar backgroundColor='#161622' style='light' />
        </>
    )
}

export default AuthLayout;