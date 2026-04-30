import { useSignIn } from '@clerk/expo'
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

const GlobalErrors = ({ errors }: { errors: ReturnType<typeof useSignIn>['errors'] }) => {
  if (!errors?.global?.length) return null
  return (
    <View className="rounded-2xl bg-destructive/10 p-3">
      {errors.global.map((err, i) => (
        <Text key={i} className="text-sm font-sans-medium text-destructive">
          {err.message}
        </Text>
      ))}
    </View>
  )
}

const BrandBlock = () => (
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
  </View>
)

export default function SignInScreen() {
  const { signIn, errors, fetchStatus } = useSignIn()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showMfa, setShowMfa] = useState(false)

  const isLoading = fetchStatus === 'fetching'

  const navigate = (decorateUrl: (u: string) => string) => {
    const url = decorateUrl('/(tabs)')
    router.replace(url as Href)
  }

  const handleSignIn = async () => {
    const { error } = await signIn.password({ emailAddress: email, password })
    if (error) return

    if (signIn.status === 'complete') {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) return
          navigate(decorateUrl)
        },
      })
    } else if (
      signIn.status === 'needs_second_factor' ||
      signIn.status === 'needs_client_trust'
    ) {
      const emailFactor = signIn.supportedSecondFactors?.find(
        (f: { strategy: string }) => f.strategy === 'email_code',
      )
      if (emailFactor) {
        await signIn.mfa.sendEmailCode()
        setShowMfa(true)
      }
    }
  }

  const handleVerifyMfa = async () => {
    await signIn.mfa.verifyEmailCode({ code })
    if (signIn.status === 'complete') {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) return
          navigate(decorateUrl)
        },
      })
    }
  }

  // ── MFA verification step ──────────────────────────────────────
  if (showMfa) {
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
              <BrandBlock />
              <Text className="auth-title text-center">Two-step verification</Text>
              <Text className="auth-subtitle">
                We sent a code to your email address. Enter it below to continue.
              </Text>

              <View className="auth-card">
                <View className="auth-form">
                  <GlobalErrors errors={errors} />

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
                    onPress={handleVerifyMfa}
                    disabled={!code || isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#081126" />
                    ) : (
                      <Text className="auth-button-text">Verify</Text>
                    )}
                  </Pressable>

                  <Pressable
                    className={clsx('auth-secondary-button', isLoading && 'opacity-50')}
                    onPress={() => setShowMfa(false)}
                    disabled={isLoading}
                  >
                    <Text className="auth-secondary-button-text">← Back to sign in</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }

  // ── Sign-in form ───────────────────────────────────────────────
  const canSubmit = !!email && !!password && !isLoading

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
            <BrandBlock />
            <Text className="auth-title text-center">Welcome back</Text>
            <Text className="auth-subtitle">
              Sign in to continue managing your subscriptions
            </Text>

            {/* Form card */}
            <View className="auth-card">
              <View className="auth-form">
                <GlobalErrors errors={errors} />

                {/* Email */}
                <View className="auth-field">
                  <Text className="auth-label">Email address</Text>
                  <TextInput
                    className={clsx(
                      'auth-input',
                      errors?.fields?.identifier && 'auth-input-error',
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
                  {errors?.fields?.identifier && (
                    <Text className="auth-error">Email address is invalid</Text>
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
                      placeholder="Enter your password"
                      placeholderTextColor="rgba(8,17,38,0.35)"
                      secureTextEntry={!showPassword}
                      autoComplete="current-password"
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

                <Pressable
                  className={clsx('auth-button', !canSubmit && 'auth-button-disabled')}
                  onPress={handleSignIn}
                  disabled={!canSubmit}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#081126" />
                  ) : (
                    <Text className="auth-button-text">Sign in</Text>
                  )}
                </Pressable>
              </View>
            </View>

            <View className="auth-link-row">
              <Text className="auth-link-copy">Don't have an account?</Text>
              <Link href="/(auth)/sign-up">
                <Text className="auth-link">Create one</Text>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
