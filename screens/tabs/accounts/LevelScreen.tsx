import { Image, StyleSheet, ScrollView, ImageBackground, Dimensions } from 'react-native'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { getStorageData, supabase } from '@/utils/supabase'
import { useTranslation } from 'react-i18next'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { Colors } from '@/constants/Colors'
import { useEffect, useState } from 'react'
import { formatToUnits } from '@/utils/helper'
import { useNavigation } from '@react-navigation/native'
import { useLayoutEffect } from 'react'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { ExampleScreens } from '../../ListScreen'

const screenHeight = Dimensions.get('window').height
const screenWidth = Dimensions.get('window').width

export default function LevelScreen() {
  const colorScheme = useColorScheme()
  const { i18n, t } = useTranslation()
  const navigation = useNavigation<NativeStackNavigationProp<ExampleScreens>>()
  const currentLanguage = i18n.language
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(0)
  const [level, setLevel] = useState<any>(null)
  const [data, setData] = useState<any>([])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      title: t('achievements'),
      headerStyle: { backgroundColor: 'transparent' },
      headerShadowVisible: false,
      headerTitleAlign: 'center',
      headerTintColor: '#FFFFFF',
      headerTitleStyle: { fontWeight: 'normal', fontFamily: 'Nunito_700Bold' },
    })
  }, [navigation, colorScheme, t])

  useEffect(() => {
    getData()
  }, [])

  async function getData() {
    try {
      setLoading(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()
      const getUser = await supabase.from('profiles').select(`id, level, steps`).eq('id', user?.id).single()
      const { data, error, status } = await supabase.from('achievements').select(`id, logourl, coin, step , language_achievements (id,name,description))`).order('step').eq('status', 3)
      if (error && status !== 406) {
        console.log('error', error)
        throw error
      }
      if (data) {
        const getLevel = data.find((item: any) => item.id > getUser.data?.level)
        setLevel(getLevel)
        setStep(getUser.data?.steps)
        setData(data)
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log('error', error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView edges={['right', 'bottom', 'left']} style={{ flex: 1, backgroundColor: Colors[colorScheme ?? 'light'].background }}>
      <ThemedView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: Colors[colorScheme ?? 'light'].background, position: 'relative' }}>
          <ImageBackground source={require('@/assets/images/achievement_bg.png')} resizeMode='cover' style={styles.img}>
            <Image style={styles.imageHeader} source={{ uri: getStorageData('achievements', level?.logourl as string) }} />
            <ThemedText style={[{ color: '#FFF' }, styles.textHeader]}>{currentLanguage === 'en' ? level?.language_achievements[0]?.name : level?.language_achievements[1]?.name}</ThemedText>
            <ThemedText style={[{ color: '#FFF' }, styles.stepHeader]}>
              {`${t('youPassed')}`} {formatToUnits(level?.step, 0)} {t('steps')}
            </ThemedText>
          </ImageBackground>
          <ThemedView style={[{ backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }, styles.cardWraper]}>
            {data.map((item: any, index: number) => (
              <ThemedView key={index} style={[styles.card]}>
                <Image style={styles.image} source={item.step > step ? require('@/assets/images/badge.png') : { uri: getStorageData('achievements', item.logourl as string) }} />
                <ThemedText style={[{ color: Colors[colorScheme ?? 'light'].textSubtitle }, styles.text]}>
                  {currentLanguage === 'en' ? item.language_achievements[0]?.name : item.language_achievements[1]?.name}
                </ThemedText>
                <ThemedText style={[{ color: Colors[colorScheme ?? 'light'].textSubtitle }, styles.step]}>
                  {item.step <= step ? `${t('youPassed')} ${t('thisLevel')}` : `${t('pass')} ${formatToUnits(item.step, 0)} ${t('steps')}`}
                </ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0,
    padding: 0,
    position: 'relative',
  },
  img: {
    flex: 1,
    height: screenHeight * 0.45,
    width: screenWidth,
    zIndex: 1,
  },
  cardWraper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    flexWrap: 'wrap',
    width: '90%',
    borderRadius: 20,
    paddingHorizontal: 5,
    paddingVertical: 10,
    position: 'absolute',
    top: screenHeight * 0.35,
    zIndex: 100,
  },
  card: {
    width: '33%',
    zIndex: 100,
  },
  imageHeader: {
    width: '100%',
    height: 150,
    objectFit: 'contain',
    marginTop: 50,
  },
  image: {
    width: '100%',
    height: 80,
    objectFit: 'contain',
  },
  textHeader: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 20,
    textAlign: 'center',
  },
  text: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    textAlign: 'center',
  },
  stepHeader: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 15,
    paddingTop: 5,
    textAlign: 'center',
    paddingBottom: 10,
  },
  step: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 10,
    paddingTop: 5,
    textAlign: 'center',
    paddingBottom: 10,
  },
})
