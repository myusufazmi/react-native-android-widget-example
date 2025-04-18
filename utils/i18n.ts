import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as Localization from 'expo-localization'
import AsyncStorage from '@react-native-async-storage/async-storage'
import id from '../lang/id.json'
import en from '../lang/en.json'

const resources = {
	id: { translation: id },
	en: { translation: en },
}

const initI18n = async () => {
	let savedLanguage = await AsyncStorage.getItem('language')

	if (!savedLanguage) {
		savedLanguage = Localization.getLocales()[0].languageCode as string
	}

	i18n.use(initReactI18next).init({
		compatibilityJSON: 'v4',
		resources,
		lng: savedLanguage,
		fallbackLng: 'en',
		interpolation: {
			escapeValue: false,
		},
	})
}

initI18n()

export default i18n
