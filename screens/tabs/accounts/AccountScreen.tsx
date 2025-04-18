import { StyleSheet } from 'react-native'
import { ThemedView } from '@/components/ThemedView'
import { Icon, ListItem, Image, Avatar } from '@rneui/themed'
import { useNavigation, CommonActions } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { ExampleScreens } from '../../ListScreen'
import { getStorageData, supabase } from '@/utils/supabase'
import { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ModalDialog } from '@/components/ModalDialog'
import { useTranslation } from 'react-i18next'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { Colors } from '@/constants/Colors'

export default function AccountScreen() {
  const colorScheme = useColorScheme()
  const { i18n, t } = useTranslation()
  const currentLanguage = i18n.language
  const [loading, setLoading] = useState(false)
  const [level, setLevel] = useState({
    name: 'Level 0',
    description: 'You are a rising star! Keep going!',
    image: 'https://randomuser.me/api/portraits',
  })
  const [modalVisible, setModalVisible] = useState(false)
  const [modalContent, setModalContent] = useState({
    id: '',
    title: '',
    description: '',
    accept: '',
    decline: '',
  })
  const navigation = useNavigation<NativeStackNavigationProp<ExampleScreens>>()

  useEffect(() => {
    getData()
  }, [])

  async function getData() {
    try {
      setLoading(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()
      const { data, error, status }: any = await supabase
        .from('profiles')
        .select(`id, level, achievements (id,logourl, language_achievements (id,name,description))`)
        .eq('id', user?.id)
        .single()
      if (error && status !== 406) {
        console.log('error', error)
        throw error
      }
      if (data) {
        if (data.achievements) {
          setLevel({
            name: currentLanguage === 'en' ? data.achievements?.language_achievements[0]?.name : data.achievements?.language_achievements[1]?.name,
            description: currentLanguage === 'en' ? data.achievements?.language_achievements[0]?.description : data.achievements?.language_achievements[1]?.description,
            image: data.achievements.logourl,
          })
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log('error', error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleAccept() {
    if (modalContent.id === 'deleteAccount') {
      navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'SigninScreen' }] }))
    } else if (modalContent.id === 'logout') {
      const { error } = await supabase.auth.signOut()
      if (!error) {
        navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'SigninScreen' }] }))
      } else {
        console.log('Error logging out:', error.message)
      }
    }
  }

  function handleDecline() {
    setModalVisible(false)
    setModalContent({
      id: '',
      title: '',
      description: '',
      accept: '',
      decline: '',
    })
  }

  function handleModal(id: string, title: string, description: string, accept: string, decline: string) {
    setModalVisible(!modalVisible)
    setModalContent({
      id: id,
      title: title,
      description: description,
      accept: accept,
      decline: decline,
    })
  }

  return (
    <SafeAreaView edges={['right', 'bottom', 'left']} style={{ paddingTop: 10, flex: 1, backgroundColor: Colors[colorScheme ?? 'light'].background }}>
      <ThemedView style={[{ backgroundColor: Colors[colorScheme ?? 'light'].background }, styles.container]}>
        <ListItem onPress={() => navigation.navigate('LevelScreen')} containerStyle={{ backgroundColor: Colors[colorScheme ?? 'light'].cardBackground, borderRadius: 10, marginBottom: 10 }}>
          <Avatar source={{ uri: getStorageData('achievements', level.image) }} />
          <ListItem.Content>
            <ListItem.Title style={[{ color: Colors[colorScheme ?? 'light'].textSubtitle }, styles.list]}>{level.name}</ListItem.Title>
            <ListItem.Subtitle style={[{ color: Colors[colorScheme ?? 'light'].textSubtitle }, styles.sublist]}>{level.description}</ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron color={Colors[colorScheme ?? 'light'].textSubtitle} />
        </ListItem>
        <ListItem onPress={() => navigation.navigate('PreferenceScreen')} containerStyle={{ backgroundColor: Colors[colorScheme ?? 'light'].cardBackground, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
          <Icon name='cog-outline' type='material-community' color={Colors[colorScheme ?? 'light'].textSubtitle} />
          <ListItem.Content>
            <ListItem.Title style={[{ color: Colors[colorScheme ?? 'light'].textSubtitle }, styles.list]}>{t('preferences')}</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron color={Colors[colorScheme ?? 'light'].textSubtitle} />
        </ListItem>
        <ListItem containerStyle={{ backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }} onPress={() => navigation.navigate('PersonalScreen')}>
          <Icon name='account-outline' type='material-community' color={Colors[colorScheme ?? 'light'].textSubtitle} />
          <ListItem.Content>
            <ListItem.Title style={[{ color: Colors[colorScheme ?? 'light'].textSubtitle }, styles.list]}>{t('personalInfo')}</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron color={Colors[colorScheme ?? 'light'].textSubtitle} />
        </ListItem>
        <ListItem containerStyle={{ backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }} onPress={() => navigation.navigate('LinkedScreen')}>
          <Icon name='swap-vertical' type='material-community' color={Colors[colorScheme ?? 'light'].textSubtitle} />
          <ListItem.Content>
            <ListItem.Title style={[{ color: Colors[colorScheme ?? 'light'].textSubtitle }, styles.list]}>{t('linkedAccount')}</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron color={Colors[colorScheme ?? 'light'].textSubtitle} />
        </ListItem>
        <ListItem containerStyle={{ backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }} onPress={() => navigation.navigate('AppreanceScreen')}>
          <Icon name='eye-outline' type='material-community' color={Colors[colorScheme ?? 'light'].textSubtitle} />
          <ListItem.Content>
            <ListItem.Title style={[{ color: Colors[colorScheme ?? 'light'].textSubtitle }, styles.list]}>{t('appApperance')}</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron color={Colors[colorScheme ?? 'light'].textSubtitle} />
        </ListItem>
        <ListItem containerStyle={{ backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }} onPress={() => navigation.navigate('AppreanceScreen')}>
          <Icon name='chart-line' type='material-community' color={Colors[colorScheme ?? 'light'].textSubtitle} />
          <ListItem.Content>
            <ListItem.Title style={[{ color: Colors[colorScheme ?? 'light'].textSubtitle }, styles.list]}>{t('dataAnalytics')}</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron color={Colors[colorScheme ?? 'light'].textSubtitle} />
        </ListItem>
        <ListItem containerStyle={{ backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }} onPress={() => navigation.navigate('HelpScreen')}>
          <Icon name='file-document-outline' type='material-community' color={Colors[colorScheme ?? 'light'].textSubtitle} />
          <ListItem.Content>
            <ListItem.Title style={[{ color: Colors[colorScheme ?? 'light'].textSubtitle }, styles.list]}>{t('helpSupport')}</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron color={Colors[colorScheme ?? 'light'].textSubtitle} />
        </ListItem>
        <ListItem containerStyle={{ backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }} onPress={() => handleModal('deleteAccount', t('deleteAccount'), t('areYouSureDelete'), t('ok'), t('cancel'))}>
          <Icon name='trash-can-outline' type='material-community' color='#F75555' />
          <ListItem.Content>
            <ListItem.Title style={[[{ color: Colors[colorScheme ?? 'light'].textSubtitle }, styles.list], { color: '#F75555' }]}>{t('deleteAccount')}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
        <ListItem onPress={() => handleModal('logout', t('logout'), t('areYouSureLogout'), t('yesLogout'), t('cancel'))} containerStyle={{ backgroundColor: Colors[colorScheme ?? 'light'].cardBackground, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
          <Icon name='logout' type='material-community' color='#f99f54' />
          <ListItem.Content>
            <ListItem.Title style={[[{ color: Colors[colorScheme ?? 'light'].textSubtitle }, styles.list], { color: '#f99f54' }]}>{t('logout')}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
        <ModalDialog
          isAvailable={modalVisible}
          title={modalContent.title}
          description={modalContent.description}
          onAccept={() => handleAccept()}
          onDecline={() => handleDecline()}
          acceptText={modalContent.accept}
          declineText={modalContent.decline}
        />
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
  sublist: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
  },
})
