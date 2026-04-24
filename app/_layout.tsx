import { Stack } from "expo-router";
import '@/global.css';

/**
 * Renders the application's root navigation stack with headers disabled for all screens.
 *
 * @returns The configured React element for the root Stack navigator.
 */
export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
