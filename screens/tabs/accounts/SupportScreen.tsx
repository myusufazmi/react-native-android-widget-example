import { StyleSheet } from 'react-native'
import { ThemedView } from '@/components/ThemedView'
import { Icon, ListItem } from '@rneui/themed'
import { useNavigation } from '@react-navigation/native'
import { useLayoutEffect } from 'react'
import { Linking } from 'react-native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { ExampleScreens } from '../../ListScreen'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { Colors } from '@/constants/Colors'

export default function SupportScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ExampleScreens>>()
  const colorScheme = useColorScheme()
  const { t } = useTranslation()
  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('contactSupport'),
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
        {/* Header configured via useLayoutEffect */}
        <ListItem containerStyle={{ backgroundColor: Colors[colorScheme ?? 'light'].cardBackground, borderRadius: 10, marginVertical: 10 }}>
          <Icon name='headphones' type='material-community' color='#59BCB1' />
          <ListItem.Content>
            <ListItem.Title style={[{ color: Colors[colorScheme ?? 'light'].textSubtitle }, styles.list]}>{t('customerSupport')}</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron color={Colors[colorScheme ?? 'light'].textSubtitle} />
        </ListItem>
        <ListItem onPress={() => Linking.openURL('https://greensteps.id')} containerStyle={{ backgroundColor: Colors[colorScheme ?? 'light'].cardBackground, borderRadius: 10, marginVertical: 10 }}>
          <Icon name='web' type='material-community' color='#59BCB1' />
          <ListItem.Content>
            <ListItem.Title style={[{ color: Colors[colorScheme ?? 'light'].textSubtitle }, styles.list]}>{t('website')}</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron color={Colors[colorScheme ?? 'light'].textSubtitle} />
        </ListItem>
        <ListItem onPress={() => Linking.openURL('https://www.whatsapp.com')} containerStyle={{ backgroundColor: Colors[colorScheme ?? 'light'].cardBackground, borderRadius: 10, marginVertical: 10 }}>
          <Icon name='whatsapp' type='font-awesome' color='#59BCB1' />
          <ListItem.Content>
            <ListItem.Title style={[{ color: Colors[colorScheme ?? 'light'].textSubtitle }, styles.list]}>WhatsApp</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron color={Colors[colorScheme ?? 'light'].textSubtitle} />
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
