import { StyleSheet } from 'react-native'
import { WebView } from 'react-native-webview'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { Colors } from '@/constants/Colors'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { useLayoutEffect } from 'react'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { ExampleScreens } from '../../ListScreen'

export default function ContentScreen() {
  const colorScheme = useColorScheme()
  const { i18n } = useTranslation()
  const currentLanguage = i18n.language
  const navigation = useNavigation<NativeStackNavigationProp<ExampleScreens>>()
  const route = useRoute<RouteProp<ExampleScreens, 'ContentScreen'>>()
  const { title, data } = route.params

  useLayoutEffect(() => {
    navigation.setOptions({
      title,
      headerStyle: { backgroundColor: Colors[colorScheme ?? 'light'].background },
      headerShadowVisible: false,
      headerTitleAlign: 'center',
      headerTintColor: Colors[colorScheme ?? 'light'].textSubtitle,
      headerTitleStyle: {
        fontWeight: 'normal',
        fontFamily: 'Nunito_700Bold',
      },
    })
  }, [navigation, title, colorScheme])

  return (
    <SafeAreaView edges={['right', 'bottom', 'left']} style={{ paddingTop: 10, flex: 1, backgroundColor: Colors[colorScheme ?? 'light'].background }}>
      <WebView style={styles.container} source={{ uri: `https://greensteps.id/${currentLanguage}/${data}` }} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 15,
  },
})
