import { useSignUp, useAuth } from '@clerk/expo'
import { clsx } from 'clsx'
import { Link, useRouter, type Href } from 'expo-router'
import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context'
import { styled } from 'nativewind'

const SafeAreaView = styled(RNSafeAreaView)

export default function SignUpScreen() {
  const { signUp, errors, fetchStatus } = useSignUp()
  const { isSignedIn } = useAuth()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [code, setCode] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [passwordMismatch, setPasswordMismatch] = useState(false)

  const isLoading = fetchStatus === 'fetching'

  const handleSignUp = async () => {
    setPasswordMismatch(false)
    if (password !== confirmPassword) {
      setPasswordMismatch(true)
      return
    }
    const { error } = await signUp.password({ emailAddress: email, password })
    if (error) return
    await signUp.verifications.sendEmailCode()
  }

  const handleVerify = async () => {
    await signUp.verifications.verifyEmailCode({ code })
    if (signUp.status === 'complete') {
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) return
          const url = decorateUrl('/(tabs)')
          router.replace(url as Href)
        },
      })
    }
  }

  if (signUp.status === 'complete' || isSignedIn) return null

  // ── Verification step ──────────────────────────────────────────
  if (
    signUp.status === 'missing_requirements' &&
    signUp.unverifiedFields?.includes('email_address') &&
    (signUp.missingFields?.length ?? 0) === 0
  ) {
    return (
      <SafeAreaView className="auth-safe-area">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            className="auth-scroll"
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="auth-content">
              <View className="auth-brand-block">
                <View className="auth-logo-wrap">
                  <View className="auth-logo-mark">
                    <Text className="auth-logo-mark-text">S</Text>
                  </View>
                  <View>
                    <Text className="auth-wordmark">SubTrack</Text>
                    <Text className="auth-wordmark-sub">Subscription Manager</Text>
                  </View>
                </View>
                <Text className="auth-title">Check your inbox</Text>
                <Text className="auth-subtitle">
                  We sent a 6-digit code to{'\n'}{email}
                </Text>
              </View>

              <View className="auth-card">
                <View className="auth-form">
                  {errors?.global && (
                    <View className="rounded-2xl bg-destructive/10 p-3">
                      <Text className="text-sm font-sans-medium text-destructive">
                        {errors.global.message}
                      </Text>
                    </View>
                  )}

                  <View className="auth-field">
                    <Text className="auth-label">Verification code</Text>
                    <TextInput
                      className={clsx('auth-input', errors?.fields?.code && 'auth-input-error')}
                      value={code}
                      onChangeText={setCode}
                      placeholder="6-digit code"
                      placeholderTextColor="rgba(8,17,38,0.35)"
                      keyboardType="number-pad"
                      autoFocus
                    />
                    {errors?.fields?.code && (
                      <Text className="auth-error">{errors.fields.code.message}</Text>
                    )}
                  </View>

                  <Pressable
                    className={clsx('auth-button', (!code || isLoading) && 'auth-button-disabled')}
                    onPress={handleVerify}
                    disabled={!code || isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#081126" />
                    ) : (
                      <Text className="auth-button-text">Confirm account</Text>
                    )}
                  </Pressable>

                  <Pressable
                    className={clsx('auth-secondary-button', isLoading && 'opacity-50')}
                    onPress={() => signUp.verifications.sendEmailCode()}
                    disabled={isLoading}
                  >
                    <Text className="auth-secondary-button-text">Resend code</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }

  // ── Sign-up form ───────────────────────────────────────────────
  const canSubmit = !!email && !!password && !!confirmPassword && !isLoading

  return (
    <SafeAreaView className="auth-safe-area">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          className="auth-scroll"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="auth-content">
            {/* Brand block */}
            <View className="auth-brand-block">
              <View className="auth-logo-wrap">
                <View className="auth-logo-mark">
                  <Text className="auth-logo-mark-text">S</Text>
                </View>
                <View>
                  <Text className="auth-wordmark">SubTrack</Text>
                  <Text className="auth-wordmark-sub">Subscription Manager</Text>
                </View>
              </View>
              <Text className="auth-title">Create account</Text>
              <Text className="auth-subtitle">
                Track every subscription in one place — no surprises, no overspending.
              </Text>
            </View>

            {/* Form card */}
            <View className="auth-card">
              <View className="auth-form">
                {errors?.global && (
                  <View className="rounded-2xl bg-destructive/10 p-3">
                    <Text className="text-sm font-sans-medium text-destructive">
                      {errors.global.message}
                    </Text>
                  </View>
                )}

                {/* Email */}
                <View className="auth-field">
                  <Text className="auth-label">Email address</Text>
                  <TextInput
                    className={clsx(
                      'auth-input',
                      errors?.fields?.emailAddress && 'auth-input-error',
                    )}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="you@example.com"
                    placeholderTextColor="rgba(8,17,38,0.35)"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="email"
                  />
                  {errors?.fields?.emailAddress && (
                    <Text className="auth-error">{errors.fields.emailAddress.message}</Text>
                  )}
                </View>

                {/* Password */}
                <View className="auth-field">
                  <Text className="auth-label">Password</Text>
                  <View style={{ position: 'relative' }}>
                    <TextInput
                      className={clsx(
                        'auth-input',
                        errors?.fields?.password && 'auth-input-error',
                      )}
                      style={{ paddingRight: 56 }}
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Min. 8 characters"
                      placeholderTextColor="rgba(8,17,38,0.35)"
                      secureTextEntry={!showPassword}
                      autoComplete="new-password"
                    />
                    <Pressable
                      style={{
                        position: 'absolute',
                        right: 14,
                        top: 0,
                        bottom: 0,
                        justifyContent: 'center',
                      }}
                      onPress={() => setShowPassword((v) => !v)}
                      hitSlop={8}
                    >
                      <Text className="text-sm font-sans-semibold text-muted-foreground">
                        {showPassword ? 'Hide' : 'Show'}
                      </Text>
                    </Pressable>
                  </View>
                  {errors?.fields?.password && (
                    <Text className="auth-error">{errors.fields.password.message}</Text>
                  )}
                </View>

                {/* Confirm password */}
                <View className="auth-field">
                  <Text className="auth-label">Confirm password</Text>
                  <TextInput
                    className={clsx('auth-input', passwordMismatch && 'auth-input-error')}
                    value={confirmPassword}
                    onChangeText={(v) => {
                      setConfirmPassword(v)
                      if (passwordMismatch) setPasswordMismatch(false)
                    }}
                    placeholder="Re-enter password"
                    placeholderTextColor="rgba(8,17,38,0.35)"
                    secureTextEntry={!showPassword}
                    autoComplete="new-password"
                  />
                  {passwordMismatch && (
                    <Text className="auth-error">Passwords do not match</Text>
                  )}
                </View>

                <Pressable
                  className={clsx('auth-button', !canSubmit && 'auth-button-disabled')}
                  onPress={handleSignUp}
                  disabled={!canSubmit}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#081126" />
                  ) : (
                    <Text className="auth-button-text">Create account</Text>
                  )}
                </Pressable>
              </View>
            </View>

            <View className="auth-link-row">
              <Text className="auth-link-copy">Already have an account?</Text>
              <Link href="/(auth)/sign-in">
                <Text className="auth-link">Sign in</Text>
              </Link>
            </View>

            {/* Required for Clerk bot-signup protection */}
            <View nativeID="clerk-captcha" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
