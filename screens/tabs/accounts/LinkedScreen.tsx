import { Image, StyleSheet } from 'react-native'
import { ThemedView } from '@/components/ThemedView'
import { Button, Icon, ListItem } from '@rneui/themed'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { Colors } from '@/constants/Colors'
import { useNavigation } from '@react-navigation/native'
import { useLayoutEffect } from 'react'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { ExampleScreens } from '../../ListScreen'

export default function LinkedScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ExampleScreens>>()
  const colorScheme = useColorScheme()
  const { t } = useTranslation()
  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('linkedAccount'),
      headerStyle: { backgroundColor: Colors[colorScheme ?? 'light'].background },
      headerShadowVisible: false,
      headerTitleAlign: 'center',
      headerTintColor: Colors[colorScheme ?? 'light'].textSubtitle,
      headerTitleStyle: { fontWeight: 'normal', fontFamily: 'Nunito_700Bold' },
    })
  }, [navigation, colorScheme, t])
  return (
    <SafeAreaView edges={['right', 'bottom', 'left']} style={{ paddingTop: 10, flex: 1, backgroundColor: Colors[colorScheme ?? 'light'].background }}>
      <ThemedView style={[{ backgroundColor: Colors[colorScheme ?? 'light'].background }, styles.container]}>
        <ListItem containerStyle={{ backgroundColor: Colors[colorScheme ?? 'light'].cardBackground, borderRadius: 10, marginBottom: 10 }}>
          <Image source={require('@/assets/images/google.png')} style={{ width: 25, height: 25 }} />
          <ListItem.Content>
            <ListItem.Title style={[{ color: Colors[colorScheme ?? 'light'].textSubtitle }, styles.list]}>Google</ListItem.Title>
          </ListItem.Content>
          <ListItem.Content right>
            <Button type='clear' title={t('connect')} onPress={() => console.log('Unlink Apple')} />
          </ListItem.Content>
        </ListItem>
        <ListItem containerStyle={{ backgroundColor: Colors[colorScheme ?? 'light'].cardBackground, borderRadius: 10, marginBottom: 10 }}>
          <Icon name='apple' type='material-community' size={30} color='#000000' />
          <ListItem.Content>
            <ListItem.Title style={[{ color: Colors[colorScheme ?? 'light'].textSubtitle }, styles.list]}>Apple</ListItem.Title>
          </ListItem.Content>
          <ListItem.Content right>
            <Button type='clear' title={t('connect')} onPress={() => console.log('Unlink Apple')} />
          </ListItem.Content>
        </ListItem>
      </ThemedView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
  },
  description: {
    color: '#616161',
    marginTop: 20,
  },
  list: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
  },
})
