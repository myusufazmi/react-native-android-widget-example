import React, { useState } from 'react'
import { StyleSheet, AppState, Platform, Linking } from 'react-native'
import { supabase } from '@/utils/supabase'
import { SafeAreaView } from 'react-native-safe-area-context'
import AuthGoogle from '@/components/auth/GoogleAuth'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import AppleAuth from '@/components/auth/AppleAuth'
import { ModalDialog } from '@/components/ModalDialog'
import { PhoneAuth } from '@/components/auth/PhoneAuth'
import { useTranslation } from 'react-i18next'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { Colors } from '@/constants/Colors'

AppState.addEventListener('change', (state) => {
	if (state === 'active') {
		supabase.auth.startAutoRefresh()
	} else {
		supabase.auth.stopAutoRefresh()
	}
})

export default function SignInScreen() {
	const colorScheme = useColorScheme()
	const [modalVisible, setModalVisible] = useState(false)
	const { t } = useTranslation()

	return (
		<SafeAreaView edges={['top', 'right', 'bottom', 'left']} style={{ flex: 1, backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }}>
			<ThemedView style={[{ backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }, styles.container]}>
				<ThemedText type='subtitle' style={{ color: Colors[colorScheme ?? 'light'].textSubtitle }}>
					{t('signInTitle')}
				</ThemedText>
				<ThemedText type='default' style={[{ color: Colors[colorScheme ?? 'light'].textSubtitle }, styles.description]}>
					{t('signInDesc')}
				</ThemedText>
				<PhoneAuth />
				<ThemedView style={[{ backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }, styles.orContainer]}>
					<ThemedView style={{ flex: 1, height: 1, backgroundColor: '#EEE' }} />
					<ThemedView style={{ backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }}>
						<ThemedText style={{ width: 50, textAlign: 'center', color: Colors[colorScheme ?? 'light'].textSubtitle }}>{t('or')}</ThemedText>
					</ThemedView>
					<ThemedView style={{ flex: 1, height: 1, backgroundColor: '#EEE' }} />
				</ThemedView>
				<ThemedView style={{ marginTop: 20, backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }}>
					<AuthGoogle />
					<AppleAuth />
				</ThemedView>
			</ThemedView>
			<ModalDialog
				isAvailable={modalVisible}
				title={t('gotoTitle')}
				description={t('gotoDesc')}
				onAccept={() => Linking.openURL('https://play.google.com/store/apps/details?id=com.google.android.apps.healthdata')}
				acceptText={t('gotoPlayStore')}
				declineText=''
			/>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		marginTop: 20,
		padding: 20,
	},
	description: {
		marginTop: 20,
	},
	orContainer: { flexDirection: 'row', alignItems: 'center' },
})
