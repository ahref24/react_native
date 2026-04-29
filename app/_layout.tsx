import {SplashScreen, Stack} from "expo-router";
import '@/global.css';
import {useFonts} from "expo-font";
import {useEffect} from "react";

/**
 * Renders the application's root navigation stack with headers disabled for all screens.
 *
 * @returns The configured React element for the root Stack navigator.
 */
export default function RootLayout() {
  const [fontLoaded] = useFonts({
    'sans-regular': require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
    'sans-medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
    'sans-bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
    'sans-semibold': require('../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
    'sans-extrabold': require('../assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
    'sans-light': require('../assets/fonts/PlusJakartaSans-Light.ttf')
  })

  useEffect(() => {
    if(fontLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontLoaded])

  if (!fontLoaded) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}
