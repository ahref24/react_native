import React from 'react';
import { View, Text } from 'react-native';
import signUp from "@/app/(auth)/sign-up";
import {Link} from "expo-router";

const SignIn = () => {
  return (
    <View>
      <Text>SignIn</Text>
        <Link href="/(auth)/sign-up">Create Account</Link>
    </View>
  );
};

export default SignIn;