import { ScrollView, StyleSheet } from 'react-native'
import { ThemedView } from '@/components/ThemedView'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ThemedInput } from '@/components/ThemedInput'
import { useEffect, useState } from 'react'
import { Avatar, Button } from '@rneui/themed'
import { ThemedText } from '@/components/ThemedText'
import { Dropdown } from 'react-native-element-dropdown'
import { supabase } from '@/utils/supabase'
import { Session } from '@supabase/supabase-js'
import DatePicker from 'react-native-date-picker'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { Colors } from '@/constants/Colors'
import * as ImagePicker from 'expo-image-picker'
import { textToChar } from '@/utils/helper'
import { useNavigation } from '@react-navigation/native'
import { useLayoutEffect } from 'react'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { ExampleScreens } from '../../ListScreen'

export default function PersonalScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ExampleScreens>>()
  const colorScheme = useColorScheme()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [provider, setProvider] = useState<string | undefined>('')
  const [open, setOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  const [message, setMessage] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    gender: '',
    birthdate: '',
    weight: '',
    height: '',
    stepgoal: '',
  })
  const [profile, setProfile] = useState<any>({
    id: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    gender: '',
    birthdate: '',
    weight: 0,
    height: 0,
    stepgoal: 0,
  })

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('personal'),
      headerStyle: { backgroundColor: Colors[colorScheme ?? 'light'].background },
      headerShadowVisible: false,
      headerTitleAlign: 'center',
      headerTintColor: Colors[colorScheme ?? 'light'].textSubtitle,
      headerTitleStyle: { fontWeight: 'normal', fontFamily: 'Nunito_700Bold' },
    })
  }, [navigation, colorScheme, t])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      getData(session)
    })

    // supabase.auth.onAuthStateChange((_event, session) => {
    // 	getData(session)
    // })
  }, [])

  async function getData(session: Session | null = null) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      const { data, error, status } = await supabase.from('profiles').select(`gender, birthdate, avatarurl, height, weight, stepgoal`).eq('id', session?.user.id).single()
      console.log('data', data)
      console.log('error', error)
      console.log('status', user)
      if (error && status !== 406) {
        console.log('error', error)
        throw error
      }
      if (user?.user_metadata && data) {
        if (data.avatarurl) {
          downloadImage(data.avatarurl)
        }
        setProvider(user?.app_metadata.provider)
        setProfile({
          id: session?.user.id || '',
          fullName: user?.user_metadata?.full_name || '',
          email: user?.email || '',
          phoneNumber: `+${user?.phone}`,
          gender: data?.gender,
          birthdate: data?.birthdate,
          weight: data?.weight,
          height: data?.height,
          stepgoal: data?.stepgoal,
        })
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log('error', error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const onHandleChange = (text: string, name: string) => {
    setMessage({ ...message, [name]: '' })
    setProfile({ ...profile, [name]: text })
  }

  async function handleSaveProfile() {
    console.log('message', message)
    try {
      setLoading(true)
      if (!profile.phoneNumber) {
        setMessage({ ...message, phoneNumber: 'Phone number is required' })
        return false
      } else if (profile.phoneNumber.slice(0, 1) !== '+') {
        console.log('profile.phoneNumber', profile.phoneNumber.slice(1))
        setMessage({ ...message, phoneNumber: 'Phone number must be start "+"' })
        return false
      }
      if (!profile.weight) {
        setMessage({ ...message, birthdate: 'Weight is required' })
        return false
      }
      if (!profile.height) {
        setMessage({ ...message, birthdate: 'Height is required' })
        return false
      }
      if (!profile.stepgoal) {
        setMessage({ ...message, birthdate: 'Step Goal is required' })
        return false
      }
      const updates = {
        id: profile?.id || '',
        gender: profile?.gender,
        birthdate: profile?.birthdate ? profile?.birthdate : null,
        weight: profile?.weight,
        height: profile?.height,
        stepgoal: profile?.stepgoal,
        updatedat: new Date(),
      }
      const { data, error } = await supabase.auth.updateUser({
        data: {
          full_name: profile.fullName,
          name: profile.fullName,
        },
        email: profile.email,
        phone: profile.phoneNumber,
      })
      const updateProfile = await supabase.from('profiles').upsert(updates)
      console.log('data', data)
      console.log('error', error)
      console.log('data2', updateProfile)
    } catch (error) {
      if (error instanceof Error) {
        console.log('error', error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function uploadAvatar() {
    try {
      setUploading(true)

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'], // Restrict to only images
        allowsMultipleSelection: false, // Can only select one image
        allowsEditing: true, // Allows the user to crop / rotate their photo before uploading it
        quality: 1,
        exif: false, // We don't want nor need that data.
      })

      if (result.canceled || !result.assets || result.assets.length === 0) {
        console.log('User cancelled image picker.')
        return
      }

      const image = result.assets[0]
      console.log('Got image', image)

      if (!image.uri) {
        throw new Error('No image uri!') // Realistically, this should never happen, but just in case...
      }

      const arraybuffer = await fetch(image.uri).then((res) => res.arrayBuffer())

      const fileExt = image.uri?.split('.').pop()?.toLowerCase() ?? 'jpeg'
      const path = `${Date.now()}.${fileExt}`
      const { data, error: uploadError } = await supabase.storage.from('avatars').upload(path, arraybuffer, {
        contentType: image.mimeType ?? 'image/jpeg',
      })

      if (uploadError) {
        throw uploadError
      }
      console.log('path', data.path)
      const updateProfile = await supabase.from('profiles').update({ avatarurl: data.path }).eq('id', profile.id)
      console.log('updateProfile', updateProfile)
      downloadImage(data.path)
    } catch (error) {
      if (error instanceof Error) {
        console.log('error', error.message)
      } else {
        throw error
      }
    } finally {
      setUploading(false)
    }
  }

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path)

      if (error) {
        throw error
      }

      const fr = new FileReader()
      fr.readAsDataURL(data)
      fr.onload = () => {
        setAvatarUrl(fr.result as string)
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error downloading image: ', error.message)
      }
    }
  }

  const renderItem = (item: any) => {
    return (
      <ThemedView style={styles.item}>
        <ThemedText style={styles.textItem}>{item.label}</ThemedText>
      </ThemedView>
    )
  }

  return (
    <SafeAreaView edges={['right', 'bottom', 'left']} style={{ flex: 1, backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }}>
      <ThemedView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <ThemedView style={{ alignItems: 'center', marginBottom: 20 }}>
            {avatarUrl ? (
              <Avatar size={100} rounded source={{ uri: avatarUrl as string }}>
                <Avatar.Accessory size={30} onPress={uploadAvatar} />
              </Avatar>
            ) : (
              <Avatar size={100} rounded title={textToChar(profile.fullName)} containerStyle={{ backgroundColor: '#3d4db7' }}>
                <Avatar.Accessory size={30} onPress={uploadAvatar} />
              </Avatar>
            )}
          </ThemedView>
          <ThemedInput
            label={t('fullName')}
            value={profile.fullName}
            placeholder={t('fullNamePlaceholder')}
            onChange={(text: string) => onHandleChange(text, 'fullName')}
            errorMessage={message.fullName}
          />
          <ThemedInput
            label={t('email')}
            keyboardType='email'
            disabled={provider === 'google'}
            value={profile.email}
            placeholder={t('emailPlaceholder')}
            onChange={(text: string) => onHandleChange(text, 'email')}
            errorMessage={message.email}
          />
          <ThemedInput
            label={t('phoneNumber')}
            value={profile.phoneNumber}
            disabled={provider === 'phone'}
            placeholder={t('phoneNumberPlaceholder')}
            onChange={(text: string) => onHandleChange(text, 'phoneNumber')}
            errorMessage={message.phoneNumber}
          />
          <ThemedText style={{ color: Colors[colorScheme ?? 'light'].textSubtitle, fontSize: 15, fontFamily: 'Nunito_700Bold', fontWeight: 'normal', paddingBottom: 10 }}>{t('gender')}</ThemedText>
          <Dropdown
            style={[{ backgroundColor: Colors[colorScheme ?? 'light'].background }, styles.dropdown]}
            placeholderStyle={[{ color: Colors[colorScheme ?? 'light'].text }, styles.placeholderStyle]}
            selectedTextStyle={[{ color: Colors[colorScheme ?? 'light'].textSubtitle }, styles.selectedTextStyle]}
            iconStyle={styles.iconStyle}
            data={[
              { label: t('male'), value: 'Male' },
              { label: t('female'), value: 'Female' },
              { label: t('other'), value: 'Other' },
            ]}
            labelField='label'
            valueField='value'
            placeholder={t('genderPlaceholder')}
            value={profile.gender}
            onChange={(item) => {
              onHandleChange(item.value, 'gender')
            }}
            renderItem={renderItem}
          />
          <ThemedText style={{ color: Colors[colorScheme ?? 'light'].textSubtitle, fontSize: 15, fontFamily: 'Nunito_700Bold', fontWeight: 'normal', paddingVertical: 10 }}>
            {t('birthDate')}
          </ThemedText>
          <Button
            buttonStyle={{
              backgroundColor: Colors[colorScheme ?? 'light'].background,
              borderRadius: 10,
              paddingVertical: 13,
              paddingHorizontal: 20,
              margin: 0,
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
            }}
            containerStyle={{ marginBottom: 20, padding: 0 }}
            titleStyle={{ color: Colors[colorScheme ?? 'light'].textSubtitle, alignItems: 'flex-start', textAlign: 'left', fontSize: 17, fontFamily: 'Nunito_400Regular', fontWeight: 'normal' }}
            title={profile.birthdate ? profile.birthdate : t('birhtDatePlaceholder')}
            onPress={() => setOpen(true)}
          />
          <DatePicker
            modal
            mode='date'
            title={t('birthDatePlaceholder')}
            maximumDate={dayjs().subtract(3, 'year').toDate()}
            open={open}
            date={profile.birthdate ? new Date(profile.birthdate) : new Date()}
            onConfirm={(date) => {
              setOpen(false)
              onHandleChange(dayjs(date).format('YYYY-MM-DD'), 'birthdate')
            }}
            onCancel={() => {
              setOpen(false)
            }}
          />
          <ThemedInput
            label={t('weight')}
            keyboardType='numeric'
            value={profile.weight.toString()}
            placeholder={t('weightPlaceholder')}
            onChange={(text: string) => onHandleChange(text, 'weight')}
            errorMessage={message.weight}
          />
          <ThemedInput
            label={t('height')}
            keyboardType='numeric'
            value={profile.height.toString()}
            placeholder={t('heightPlaceholder')}
            onChange={(text: string) => onHandleChange(text, 'height')}
            errorMessage={message.height}
          />
          <ThemedInput
            label={t('stepGoal')}
            keyboardType='numeric'
            value={profile.stepgoal.toString()}
            placeholder={t('stepGoalPlaceholder')}
            onChange={(text: string) => onHandleChange(text, 'stepgoal')}
            errorMessage={message.stepgoal}
          />
          <Button
            title={t('update')}
            loading={loading}
            disabled={loading}
            loadingProps={{ size: 'small', color: 'white' }}
            buttonStyle={styles.button}
            titleStyle={styles.buttonTitle}
            containerStyle={styles.buttonContainer}
            onPress={() => handleSaveProfile()}
          />
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 25,
  },
  description: {
    color: '#616161',
    marginTop: 20,
  },
  buttonTitle: { fontFamily: 'Nunito_600SemiBold', fontWeight: 'bold', fontSize: 16, paddingVertical: 10 },
  buttonContainer: {
    marginHorizontal: 10,
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#59BCB1',
    borderRadius: 25,
  },
  dropdown: {
    height: 50,
    borderRadius: 10,
    padding: 12,
    fontSize: 17,
    fontFamily: 'Nunito_400Regular',
    fontWeight: 'normal',
  },
  item: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 17,
    fontFamily: 'Nunito_400Regular',
    fontWeight: 'normal',
  },
  selectedTextStyle: {
    fontSize: 17,
    fontFamily: 'Nunito_400Regular',
    fontWeight: 'normal',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
})
