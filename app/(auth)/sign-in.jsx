import { View, Image, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Link, router } from "expo-router";

import { images } from "../../constants";
import FormField from "../../components/formField";
import CustomButton from "../../components/customButton";
import { getCurrentUser, signIn } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

const SignIn = () =>{
    const { setUser, setIsLoggedIn, flashMessage } = useGlobalContext();

    const [form, setForm] = useState({
        email:"",
        password:""
    });

    const [isSubmitting, setIsSubmitting] = useState(false)

    // Handle function for when user tries to sign in
    const submit= async () => {
        if(!form.email || !form.password){
            return flashMessage.current.showMessage({
                        message: 'Error',
                        description: 'Please Fill in all the Fields!',
                        type: "danger",
                        duration: 2000
                    });
        }

        setIsSubmitting(true);

        try {
            await signIn(form.email, form.password);

            const result = await getCurrentUser();
            setUser(result);
            setIsLoggedIn(true);

            router.replace('/home');
        } catch (error) {
            return flashMessage.current.showMessage({
                message: 'Error',
                description: error.message,
                type: "danger",
                duration: 5000
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <SafeAreaView className="bg-primary h-full">
            <ScrollView>
                <View className="w-full max-w-[600px] justify-center min-h-[90vh] px-4 mx-auto my-6">
                    <Image 
                        source={images.logo}
                        resizeMode="contain"
                        className="w-[200px] h-[35px]"
                    />

                    <Text className="text-2xl text-white mt-10 font-psemibold">
                        Log in to ClipStream
                    </Text>

                    <FormField 
                        title='Email'
                        value={form.email}
                        handleChangeText={(evt) => { setForm({...form,email: evt}) }}
                        otherStyles="mt-7"
                        keyboardType="email-address"
                    />
                    <FormField 
                        title='Password'
                        value={form.password}
                        handleChangeText={(evt) => { setForm({...form,password: evt}) }}
                        otherStyles="mt-7"
                    />

                    <CustomButton 
                        title="Sign In"
                        handlePress={submit}
                        containerStyles="mt-7 w-full max-w-[400px] mx-auto"
                        isLoading={isSubmitting}
                    />

                    <View className="justify-center pt-5 flex-row gap-2">
                        <Text className="text-lg text-gray-100 font-pregular">
                            Don't have an account?
                        </Text>
                        <Link href="/sign-up" className="text-lg font-psemibold text-secondary">Sign Up</Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default SignIn;