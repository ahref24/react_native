import React from 'react';
import { View, Text } from 'react-native';
import {Link} from "expo-router";

const SignUp = () => {
  return (
    <View>
      <Text>SignUp</Text>
        <Link href="/(auth)/sign-in" className="mt-4 rounded bg-primary text-white p-4">Sign In</Link>
    </View>
  );
};

export default SignUp;