import { StyleSheet } from 'react-native'
import { ThemedView } from '@/components/ThemedView'
import { CheckBox, Dialog, ListItem } from '@rneui/themed'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useEffect, useState, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { Colors } from '@/constants/Colors'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { ExampleScreens } from '../../ListScreen'

export default function AppearanceScreen() {
	const colorScheme = useColorScheme()
	const { i18n, t } = useTranslation()
	const currentLanguage = i18n.language
	const [showModalTheme, setShowModalTheme] = useState(false)
	const [showModalLanguage, setShowModalLanguage] = useState(false)
	const [theme, setTheme] = useState('system')
	const [language, setLanguage] = useState(currentLanguage)
	const navigation = useNavigation<NativeStackNavigationProp<ExampleScreens>>()

	useEffect(() => {
		const loadLanguage = async () => {
			const savedLanguage = await AsyncStorage.getItem('language')
			if (savedLanguage) {
				i18n.changeLanguage(savedLanguage)
			}
		}
		loadLanguage()
	}, [i18n])

	useLayoutEffect(() => {
		navigation.setOptions({
			title: t('appApperance'),
			headerStyle: { backgroundColor: Colors[colorScheme ?? 'light'].background },
			headerShadowVisible: false,
			headerTitleAlign: 'center',
			headerTintColor: Colors[colorScheme ?? 'light'].textSubtitle,
			headerTitleStyle: { fontWeight: 'normal', fontFamily: 'Nunito_700Bold' },
		})
	}, [navigation, colorScheme, t])

	async function handleModalLanguage() {
		await AsyncStorage.setItem('language', language)
		i18n.changeLanguage(language)
		setShowModalLanguage(false)
	}

	async function handleModalTheme() {
		await AsyncStorage.setItem('theme', theme)

		setShowModalTheme(false)
	}

	return (
		<SafeAreaView edges={['right', 'bottom', 'left']} style={{ paddingTop: 10, flex: 1, backgroundColor: Colors[colorScheme ?? 'light'].background }}>
			<ThemedView style={[{ backgroundColor: Colors[colorScheme ?? 'light'].background }, styles.container]}>
				<ListItem onPress={() => setShowModalTheme(true)} containerStyle={{ backgroundColor: Colors[colorScheme ?? 'light'].cardBackground, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
					<ListItem.Content>
						<ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
							<ListItem.Title style={[{ color: Colors[colorScheme ?? 'light'].textSubtitle }, styles.list]}>{t('theme')}</ListItem.Title>
							<ListItem.Title style={[{ color: Colors[colorScheme ?? 'light'].textSubtitle }, styles.list2]}>{t(theme)}</ListItem.Title>
						</ThemedView>
					</ListItem.Content>
					<ListItem.Chevron color={Colors[colorScheme ?? 'light'].textSubtitle} />
				</ListItem>
				<ListItem
					containerStyle={{ backgroundColor: Colors[colorScheme ?? 'light'].cardBackground, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}
					onPress={() => setShowModalLanguage(true)}
				>
					<ListItem.Content>
						<ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
							<ListItem.Title style={[{ color: Colors[colorScheme ?? 'light'].textSubtitle }, styles.list]}>{t('language')}</ListItem.Title>
							<ListItem.Title style={[{ color: Colors[colorScheme ?? 'light'].textSubtitle }, styles.list2]}>{currentLanguage === 'id' ? t('bahasa') : t('english')}</ListItem.Title>
						</ThemedView>
					</ListItem.Content>
					<ListItem.Chevron color={Colors[colorScheme ?? 'light'].textSubtitle} />
				</ListItem>
				<Dialog overlayStyle={[{ backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }, styles.dialog]} isVisible={showModalTheme} onBackdropPress={() => setShowModalTheme(false)}>
					<Dialog.Title title={`${t('choose')} ${t('theme')}`} titleStyle={[{ color: Colors[colorScheme ?? 'light'].textSubtitle }, styles.dialogTitle]} />
					<ThemedView style={styles.dialogView}>
						<CheckBox
							containerStyle={{ backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }}
							textStyle={{ color: Colors[colorScheme ?? 'light'].textSubtitle }}
							title={t('system')}
							checked={theme === 'system'}
							onPress={() => setTheme('system')}
							checkedIcon='dot-circle-o'
							uncheckedIcon='circle-o'
						/>
						<CheckBox
							containerStyle={{ backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }}
							textStyle={{ color: Colors[colorScheme ?? 'light'].textSubtitle }}
							title={t('light')}
							checked={theme === 'light'}
							onPress={() => setTheme('light')}
							checkedIcon='dot-circle-o'
							uncheckedIcon='circle-o'
						/>
						<CheckBox
							containerStyle={{ backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }}
							textStyle={{ color: Colors[colorScheme ?? 'light'].textSubtitle }}
							title={t('dark')}
							checked={theme === 'dark'}
							onPress={() => setTheme('dark')}
							checkedIcon='dot-circle-o'
							uncheckedIcon='circle-o'
						/>
					</ThemedView>
					<Dialog.Actions>
						<Dialog.Button containerStyle={styles.nextButton} titleStyle={styles.textButton} title='OK' onPress={() => handleModalTheme()} />
						<Dialog.Button containerStyle={styles.skipButton} titleStyle={styles.textSkipButton} title='Cancel' onPress={() => setShowModalTheme(false)} />
					</Dialog.Actions>
				</Dialog>
				<Dialog overlayStyle={[{ backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }, styles.dialog]} isVisible={showModalLanguage} onBackdropPress={() => setShowModalLanguage(false)}>
					<Dialog.Title title={`${t('choose')} ${t('language')}`} titleStyle={[{ color: Colors[colorScheme ?? 'light'].textSubtitle }, styles.dialogTitle]} />
					<ThemedView style={styles.dialogView}>
						<CheckBox
							containerStyle={{ backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }}
							textStyle={{ color: Colors[colorScheme ?? 'light'].textSubtitle }}
							title='English'
							checked={language === 'en'}
							onPress={() => setLanguage('en')}
							checkedIcon='dot-circle-o'
							uncheckedIcon='circle-o'
						/>
						<CheckBox
							containerStyle={{ backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }}
							textStyle={{ color: Colors[colorScheme ?? 'light'].textSubtitle }}
							title='Bahasa'
							checked={language === 'id'}
							onPress={() => setLanguage('id')}
							checkedIcon='dot-circle-o'
							uncheckedIcon='circle-o'
						/>
					</ThemedView>
					<Dialog.Actions>
						<Dialog.Button containerStyle={styles.nextButton} titleStyle={styles.textButton} title='OK' onPress={() => handleModalLanguage()} />
						<Dialog.Button containerStyle={styles.skipButton} titleStyle={styles.textSkipButton} title='Cancel' onPress={() => setShowModalLanguage(false)} />
					</Dialog.Actions>
				</Dialog>
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
	list2: {
		fontFamily: 'Nunito_600SemiBold',
		fontSize: 14,
	},
	dialog: {
		position: 'absolute',
		width: '100%',
		bottom: 0,
		marginHorizontal: 0,
		left: 0,
		right: 0,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
	},
	dialogTitle: {
		fontSize: 20,
		textAlign: 'center',
		paddingVertical: 10,
	},
	dialogView: {
		borderBottomColor: '#EEE',
		borderBottomWidth: 1,
		borderTopColor: '#EEE',
		borderTopWidth: 1,
	},
	nextButton: {
		marginLeft: '5%',
		paddingVertical: 10,
		justifyContent: 'center',
		width: '47%',
		borderRadius: 50,
		backgroundColor: '#59BCB1',
	},
	skipButton: {
		paddingVertical: 10,
		justifyContent: 'center',
		width: '47%',
		borderRadius: 50,
		backgroundColor: '#EEEFE7',
	},
	textButton: {
		color: 'white',
		fontFamily: 'Nunito_600SemiBold',
		fontSize: 16,
	},
	textSkipButton: {
		color: '#59BCB1',
		fontFamily: 'Nunito_600SemiBold',
		fontSize: 16,
	},
})
