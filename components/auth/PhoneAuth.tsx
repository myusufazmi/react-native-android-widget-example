import { Alert, StyleSheet } from 'react-native'
import { useState } from 'react'
import { supabase } from '@/utils/supabase'
import { ThemedView } from '../ThemedView'
import { ThemedInput } from '../ThemedInput'
import { Button, CheckBox } from '@rneui/themed'
import { useTranslation } from 'react-i18next'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { Colors } from '@/constants/Colors'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { ExampleScreens } from '../../screens/ListScreen'

export function PhoneAuth() {
	const colorScheme = useColorScheme()
	const { t } = useTranslation()
	const [phone, setPhone] = useState('')
	const [loading, setLoading] = useState(false)
	const [check1, setCheck1] = useState(false)
	const [message, setMessage] = useState('')
	const navigation = useNavigation<NativeStackNavigationProp<ExampleScreens>>()

	async function signInWithPhone() {
		setLoading(true)
		if (!phone) {
			setMessage(t('validationPhoneNumber'))
		} else if (phone.slice(0, 1) !== '+') {
			setMessage(t('validationPhoneNumberStart'))
		} else {
			let otp = '123456'
			if (phone !== '+6281234567890') {
				const resp = await fetch(`${process.env.EXPO_PUBLIC_OTP_URL}/v1/otp/request`, {
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
						Authorization: `Bearer ${process.env.EXPO_PUBLIC_OTP_TOKEN}`,
					},
					method: 'POST',
					body: JSON.stringify({
						phone: phone,
						gateway_key: process.env.EXPO_PUBLIC_GATEWAY_KEY,
					}),
				})
				const respJson = await resp.json()
				otp = respJson?.data?.id
			}
			const { data, error } = await supabase.auth.signInWithOtp({
				phone: phone,
				options: {
					data: {
						otp: otp,
					},
				},
			})
			if (error) {
				Alert.alert('Sign In Error', error.message)
			} else {
				navigation.navigate('OtpScreen', { phone: phone, id: otp })
			}
		}
		setLoading(false)
	}
	return (
		<ThemedView style={[{ backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }, styles.form]}>
			<ThemedInput label={t('phoneNumber')} defaultValue={'+62'} keyboardType='numeric' placeholder='+62 857 xxxx xxxx' onChange={(text: string) => setPhone(text)} errorMessage={message} />
			<CheckBox
				title={t('rememberMe')}
				checked={check1}
				onPress={() => setCheck1(!check1)}
				iconType='material-community'
				checkedIcon='checkbox-marked'
				uncheckedIcon='checkbox-blank-outline'
				checkedColor='#59BCB1'
				uncheckedColor='#59BCB1'
				containerStyle={[{ backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }, styles.checkboxContainer]}
				textStyle={[{ color: Colors[colorScheme ?? 'light'].textSubtitle }, styles.checkboxText]}
			/>
			<Button
				title={t('signInButton')}
				loading={loading}
				disabled={loading}
				loadingProps={{ size: 'small', color: 'white' }}
				buttonStyle={styles.button}
				titleStyle={styles.buttonTitle}
				containerStyle={styles.buttonContainer}
				onPress={() => signInWithPhone()}
			/>
		</ThemedView>
	)
}

const styles = StyleSheet.create({
	checkboxContainer: {
		marginLeft: 0,
		padding: 0,
	},
	checkboxText: {
		fontSize: 15,
		fontFamily: 'Nunito_400Regular',
		fontWeight: '500',
		padding: 0,
		margin: 0,
	},
	form: {
		marginTop: 20,
	},
	buttonTitle: { fontFamily: 'Nunito_600SemiBold', fontWeight: 'bold', fontSize: 16 },
	buttonContainer: {
		marginHorizontal: 10,
		marginVertical: 20,
	},
	button: {
		backgroundColor: '#59BCB1',
		borderRadius: 25,
	},
})
