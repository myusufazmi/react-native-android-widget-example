import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { supabase } from '@/utils/supabase'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useEffect, useState } from 'react'
import { Alert, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { Colors } from '@/constants/Colors'
import { useNavigation, CommonActions, useRoute, RouteProp } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { ExampleScreens } from '../../screens/ListScreen'
import { OtpInput } from 'react-native-otp-entry'
import { Button } from '@rneui/themed'

export default function OTPScreen() {
  const colorScheme = useColorScheme()
  const { t } = useTranslation()
  const navigation = useNavigation<NativeStackNavigationProp<ExampleScreens>>()
  const route = useRoute<RouteProp<ExampleScreens, 'OtpScreen'>>()
  const { id, phone } = route.params
  const [loading, setLoading] = useState(false)
  const [timerCount, setTimer] = useState(60)
  const [idOTP, setIdOTP] = useState(id)

  useEffect(() => {
    changeTimer()
  }, [])

  const changeTimer = () => {
    let interval = setInterval(() => {
      setTimer((lastTimerCount) => {
        if (lastTimerCount == 0) {
          //your redirection to Quit screen
          return lastTimerCount
        } else {
          lastTimerCount <= 1 && clearInterval(interval)
          return lastTimerCount - 1
        }
      })
    }, 1000) //each count lasts for a second
    //cleanup the interval on complete
    return () => clearInterval(interval)
  }

  async function onResendCode() {
    setLoading(true)
    console.log('phone', idOTP)
    console.log('id', id)
    const resp = await fetch(`${process.env.EXPO_PUBLIC_OTP_URL}/v1/otp/request`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_OTP_TOKEN}`,
      },
      method: 'POST',
      body: JSON.stringify({
        phone: phone,
        gateway_key: process.env.EXPO_PUBLIC_GATEWAY_KEY,
      }),
    })
    const respJson = await resp.json()
    console.log('respJson', respJson)
    setIdOTP(respJson.data.id)
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: phone,
      options: {
        data: {
          avatarUrl: '',
          otp: respJson?.data?.id,
        },
      },
    })
    setTimer(60)
    setLoading(false)
    console.log('data', data)
    if (error) {
      Alert.alert('Sign In Error', error.message)
    }
  }

  async function signInWithOTP(text: string) {
    try {
      if (phone !== '+6281234567890') {
        const resp = await fetch(`${process.env.EXPO_PUBLIC_OTP_URL}/v1/otp/verify`, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_OTP_TOKEN}`,
          },
          method: 'POST',
          body: JSON.stringify({
            otp: text,
            otp_id: idOTP,
          }),
        });
        const respJson = await resp.json();
        if (!respJson || typeof respJson.status === 'undefined') {
          Alert.alert('Sign In Error', 'OTP server tidak merespon dengan benar.');
          return;
        }
        if (respJson.status) {
          const { data, error } = await supabase.auth.verifyOtp({
            phone: phone,
            token: idOTP,
            type: 'sms',
          });
          if (error) {
            Alert.alert('Sign In Error', error.message);
          } else if (!data || !data.user) {
            Alert.alert('Sign In Error', 'User data tidak ditemukan.');
          } else {
            if (!data.user.email) {
              navigation.dispatch(
                CommonActions.reset({ index: 0, routes: [{ name: 'ProfileScreen' }] })
              );
            } else {
              navigation.dispatch(
                CommonActions.reset({ index: 0, routes: [{ name: 'HomeTabs' }] })
              );
            }
          }
        } else {
          Alert.alert('Sign In Error', respJson.message || 'OTP tidak valid.');
        }
      } else {
        // fallback test bypass
        const { data, error } = await supabase.auth.verifyOtp({
          phone: phone,
          token: idOTP,
          type: 'sms',
        });
        if (error) {
          Alert.alert('Sign In Error', error.message);
        } else if (!data || !data.user) {
          Alert.alert('Sign In Error', 'User data tidak ditemukan.');
        } else {
          if (!data.user.email) {
            navigation.dispatch(
              CommonActions.reset({ index: 0, routes: [{ name: 'ProfileScreen' }] })
            );
          } else {
            navigation.dispatch(
              CommonActions.reset({ index: 0, routes: [{ name: 'HomeTabs' }] })
            );
          }
        }
      }
    } catch (err: any) {
      Alert.alert('Sign In Error', err?.message || 'Terjadi error saat verifikasi OTP.');
    }
  }

  return (
    <SafeAreaView edges={['top', 'right', 'bottom', 'left']} style={{ flex: 1, backgroundColor: Colors[colorScheme ?? 'light'].background }}>
      <ThemedView style={[{ backgroundColor: Colors[colorScheme ?? 'light'].background }, styles.container]}>
        <ThemedText type='subtitle' style={{ color: Colors[colorScheme ?? 'light'].textSubtitle }}>
          {t('otpTitle')}
        </ThemedText>
        <ThemedText type='default' style={[styles.description, { marginBottom: 40, color: Colors[colorScheme ?? 'light'].textSubtitle }]}>
          {t('otpDesc')}
        </ThemedText>
        <OtpInput numberOfDigits={6} focusColor='#59BCB1' onFilled={(text) => signInWithOTP(text)} />
        <ThemedView style={{ backgroundColor: Colors[colorScheme ?? 'light'].background, flexDirection: 'row', justifyContent: 'center' }}>
          <ThemedText type='default' style={[styles.description, { marginTop: 30, color: Colors[colorScheme ?? 'light'].textSubtitle }]}>
            {t('otpResendCode')}
          </ThemedText>
          <ThemedText type='default' style={[styles.description, { marginTop: 30, paddingHorizontal: 5, color: '#59BCB1' }]}>
            {timerCount}
          </ThemedText>
          <ThemedText type='default' style={[styles.description, { marginTop: 30, color: Colors[colorScheme ?? 'light'].textSubtitle }]}>
            seconds
          </ThemedText>
        </ThemedView>
        <Button loading={loading} title={t('otpResendButton')} type='clear' onPress={() => onResendCode()} />
      </ThemedView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    paddingHorizontal: 20,
  },
  description: {
    marginTop: 20,
  },
})
