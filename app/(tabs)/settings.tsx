import { useClerk } from '@clerk/expo'
import { useRouter } from 'expo-router'
import React from 'react'
import { Pressable, Text } from 'react-native'
import { styled } from 'nativewind'
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context'

const SafeAreaView = styled(RNSafeAreaView)

const Settings = () => {
  const { signOut } = useClerk()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.replace('/(auth)/sign-in')
  }

  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
      <Text>Settings</Text>
      <Pressable
        onPress={handleSignOut}
        className="mt-6 rounded-2xl bg-destructive p-4 items-center"
      >
        <Text className="text-sm font-sans-semibold text-white">Sign out</Text>
      </Pressable>
    </SafeAreaView>
  )
}

export default Settings