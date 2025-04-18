import React, { useEffect, useState } from 'react'
import { StyleSheet, AppState, Platform, Linking } from 'react-native'
import { supabase } from '@/utils/supabase'
import { SafeAreaView } from 'react-native-safe-area-context'
import AuthGoogle from '@/components/auth/GoogleAuth'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import AppleAuth from '@/components/auth/AppleAuth'
import { getSdkStatus, initialize, requestPermission, getGrantedPermissions, SdkAvailabilityStatus } from 'react-native-health-connect'
import { Pedometer } from 'expo-sensors'
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

	const checkAvailabiliySensor = async () => {
		const isAvailable = await Pedometer.isAvailableAsync()
		console.log('check', isAvailable)
		if (isAvailable) {
			const permission = await Pedometer.getPermissionsAsync()
			console.log('check2', permission)
			if (!permission.granted) {
				await Pedometer.requestPermissionsAsync()
			}
			if (Platform.OS === 'android') {
				checkAvailability()
			}
			// } else {
			// console.log('check3', Platform.OS)
			// if (Platform.OS === 'android') {
			// 	checkAvailability()
			// }
		}
	}

	const checkAvailability = async () => {
		const status = await getSdkStatus()
		console.log('check Connect', status)
		if (status === SdkAvailabilityStatus.SDK_AVAILABLE) {
			console.log('SDK is available')
			const isInitialized = await initialize()
			const checkConnectPermission = await getGrantedPermissions()
			console.log('checkConnectPermission', checkConnectPermission)
			if (checkConnectPermission.length === 0) {
				const request = await requestPermission([
					{
						accessType: 'read',
						recordType: 'Steps',
					},
					{
						accessType: 'write',
						recordType: 'Steps',
					},
					{
						accessType: 'read',
						recordType: 'StepsCadence',
					},
					{
						accessType: 'write',
						recordType: 'StepsCadence',
					},
				])
				console.log('request2', request)
			}
		}
		if (status === SdkAvailabilityStatus.SDK_UNAVAILABLE) {
			console.log('SDK is not available')
			setModalVisible(true)
		}

		if (status === SdkAvailabilityStatus.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED) {
			console.log('SDK is not available, provider update required')
			setModalVisible(true)
		}
	}

	useEffect(() => {
		checkAvailabiliySensor()
	}, [])

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
