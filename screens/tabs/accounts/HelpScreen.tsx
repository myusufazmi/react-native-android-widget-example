import { StyleSheet } from 'react-native'
import { ThemedView } from '@/components/ThemedView'
import { Icon, ListItem } from '@rneui/themed'
import { useNavigation } from '@react-navigation/native'
import { useLayoutEffect } from 'react'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { ExampleScreens } from '../../ListScreen'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { Colors } from '@/constants/Colors'

export default function HelpScreen() {
	const colorScheme = useColorScheme()
	const { t } = useTranslation()
	const navigation = useNavigation<NativeStackNavigationProp<ExampleScreens>>()
	useLayoutEffect(() => {
		navigation.setOptions({
			title: t('helpSupport'),
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
				<ListItem
					onPress={() => navigation.navigate('ContentScreen', { title: t('faq'), data: 'faq' })}
					containerStyle={{ backgroundColor: Colors[colorScheme ?? 'light'].cardBackground, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
				>
					<ListItem.Content>
						<ListItem.Title style={[{ color: Colors[colorScheme ?? 'light'].textSubtitle }, styles.list]}>{t('faq')}</ListItem.Title>
					</ListItem.Content>
					<ListItem.Chevron color={Colors[colorScheme ?? 'light'].textSubtitle} />
				</ListItem>
				<ListItem containerStyle={{ backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }} onPress={() => navigation.navigate('SupportScreen')}>
					<ListItem.Content>
						<ListItem.Title style={[{ color: Colors[colorScheme ?? 'light'].textSubtitle }, styles.list]}>{t('contactSupport')}</ListItem.Title>
					</ListItem.Content>
					<ListItem.Chevron color={Colors[colorScheme ?? 'light'].textSubtitle} />
				</ListItem>
				<ListItem containerStyle={{ backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }} onPress={() => navigation.navigate('ContentScreen', { title: t('privacyPolicy'), data: 'privacy-policy' })}>
					<ListItem.Content>
						<ListItem.Title style={[{ color: Colors[colorScheme ?? 'light'].textSubtitle }, styles.list]}>{t('privacyPolicy')}</ListItem.Title>
					</ListItem.Content>
					<ListItem.Chevron color={Colors[colorScheme ?? 'light'].textSubtitle} />
				</ListItem>
				<ListItem containerStyle={{ backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }} onPress={() => navigation.navigate('ContentScreen', { title: t('termsofService'), data: 'terms-of-service' })}>
					<ListItem.Content>
						<ListItem.Title style={[{ color: Colors[colorScheme ?? 'light'].textSubtitle }, styles.list]}>{t('termsofService')}</ListItem.Title>
					</ListItem.Content>
					<ListItem.Chevron color={Colors[colorScheme ?? 'light'].textSubtitle} />
				</ListItem>
				<ListItem containerStyle={{ backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }}>
					<ListItem.Content>
						<ListItem.Title style={[{ color: Colors[colorScheme ?? 'light'].textSubtitle }, styles.list]}>{t('partner')}</ListItem.Title>
					</ListItem.Content>
					<ListItem.Chevron color={Colors[colorScheme ?? 'light'].textSubtitle} />
				</ListItem>
				<ListItem containerStyle={{ backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }}>
					<ListItem.Content>
						<ListItem.Title style={[{ color: Colors[colorScheme ?? 'light'].textSubtitle }, styles.list]}>{t('feedback')}</ListItem.Title>
					</ListItem.Content>
					<ListItem.Chevron color={Colors[colorScheme ?? 'light'].textSubtitle} />
				</ListItem>
				<ListItem containerStyle={{ backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }} onPress={() => navigation.navigate('ContentScreen', { title: t('aboutUs'), data: 'about-us' })}>
					<ListItem.Content>
						<ListItem.Title style={[{ color: Colors[colorScheme ?? 'light'].textSubtitle }, styles.list]}>{t('aboutUs')}</ListItem.Title>
					</ListItem.Content>
					<ListItem.Chevron color={Colors[colorScheme ?? 'light'].textSubtitle} />
				</ListItem>
				<ListItem containerStyle={{ backgroundColor: Colors[colorScheme ?? 'light'].cardBackground, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
					<ListItem.Content>
						<ListItem.Title style={[{ color: Colors[colorScheme ?? 'light'].textSubtitle }, styles.list]}>{t('rateUs')}</ListItem.Title>
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
