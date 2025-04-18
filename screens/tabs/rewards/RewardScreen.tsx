import { Image, StyleSheet, ScrollView, TouchableOpacity, Pressable } from 'react-native'
import { ThemedView } from '@/components/ThemedView'
import { SearchBar } from '@rneui/themed'
import { useNavigation } from '@react-navigation/native'
import { useLayoutEffect } from 'react'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { ExampleScreens } from '../../ListScreen'
import { ThemedText } from '@/components/ThemedText'
import { getStorageData, supabase } from '@/utils/supabase'
import { useTranslation } from 'react-i18next'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { Colors } from '@/constants/Colors'
import { useEffect, useState } from 'react'

export default function RewardScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ExampleScreens>>()
  const colorScheme = useColorScheme()
  const { i18n, t } = useTranslation()
  const currentLanguage = i18n.language
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [data, setData] = useState<any>([])

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('reward'),
      headerStyle: { backgroundColor: Colors[colorScheme ?? 'light'].background },
      headerShadowVisible: false,
      headerTitleAlign: 'center',
      headerTintColor: Colors[colorScheme ?? 'light'].textSubtitle,
      headerLeft: () => <Image source={require('@/assets/images/icon.png')} style={{ width: 30, height: 30, alignSelf: 'center' }} />,
      headerTitleStyle: { fontWeight: 'normal', fontFamily: 'Nunito_700Bold' },
    })
  }, [navigation, colorScheme, t])

  useEffect(() => {
    getData()
  }, [])

  async function getData() {
    try {
      setLoading(true)
      const { data, error, status } = await supabase.from('rewards').select(`id, category, imageurl, coin, expired, language_rewards (id,name,description, languages (id,name,code))`).eq('status', 3)
      if (error && status !== 406) {
        console.log('error', error)
        throw error
      }
      if (data) {
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

  const updateSearch = (search: string) => {
    setSearch(search)
  }

  return (
    <SafeAreaView edges={['right', 'bottom', 'left']} style={{ flex: 1, backgroundColor: Colors[colorScheme ?? 'light'].background }}>
      <ThemedView style={styles.container}>
        {/* Header set with useLayoutEffect */}
        <ThemedView style={{ backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }}>
          <SearchBar
            containerStyle={{ backgroundColor: Colors[colorScheme ?? 'light'].cardBackground, borderColor: Colors[colorScheme ?? 'light'].cardBackground }}
            inputContainerStyle={{ backgroundColor: '#ECF2FE' }}
            inputStyle={{ color: Colors[colorScheme ?? 'light'].text, backgroundColor: '#ECF2FE' }}
            placeholder={t('search')}
            onChangeText={updateSearch}
            value={search}
          />
        </ThemedView>
        <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: Colors[colorScheme ?? 'light'].background }}>
          <ThemedView style={{ backgroundColor: Colors[colorScheme ?? 'light'].background, flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', width: '100%' }}>
            {data.map((item: any, index: number) => (
              <ThemedView key={index} style={[{ backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }, styles.card]}>
                <Image style={styles.image} source={{ uri: getStorageData('rewards', item.imageurl as string) }} />
                <Pressable onPress={() => navigation.navigate('RewardDetailScreen', { id: item.id })}>
                  <ThemedText style={[{ color: Colors[colorScheme ?? 'light'].textSubtitle }, styles.text]}>
                    {currentLanguage === 'en' ? item.language_rewards[0]?.name : item.language_rewards[1]?.name}
                  </ThemedText>
                </Pressable>
                <ThemedText style={[{ color: Colors[colorScheme ?? 'light'].textSubtitle }, styles.point]}>{item.coin} Coins</ThemedText>
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
    marginHorizontal: 15,
    marginBottom: 80,
  },
  card: {
    width: '48%',
    borderRadius: 13,
    marginTop: 20,
  },
  image: {
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
    width: '100%',
    height: 180,
    objectFit: 'contain',
  },
  text: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  point: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
})
