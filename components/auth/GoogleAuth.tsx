import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin'
import { supabase } from '../../utils/supabase'
import { Button } from '@rneui/themed'
import dayjs from 'dayjs'
import { useNavigation } from '@react-navigation/native'
import { Linking } from 'react-native'
import { CommonActions } from '@react-navigation/native'

export default function AuthGoogle() {
	GoogleSignin.configure({
		scopes: ['https://www.googleapis.com/auth/drive.readonly'],
		webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
	})

	const navigation = useNavigation();

	async function handlePress() {
		try {
			await GoogleSignin.hasPlayServices()
			const userInfo: any = await GoogleSignin.signIn()
			console.log('info', userInfo)
			if (userInfo.data.idToken) {
				const { data, error } = await supabase.auth.signInWithIdToken({
					provider: 'google',
					token: userInfo.data.idToken,
				})
				console.log('data', data)
				console.log('error', error)
				console.log('day', dayjs(data?.user?.created_at).toDate())
				console.log('day', dayjs(data?.user?.last_sign_in_at).toDate())
				console.log('day', dayjs(data?.user?.created_at).diff(dayjs(data?.user?.last_sign_in_at), 'minute'))
				if (dayjs(data?.user?.last_sign_in_at).diff(dayjs(data?.user?.created_at, 'minute')) <= 2) {
					navigation.dispatch(
						CommonActions.reset({ index: 0, routes: [{ name: 'ProfileScreen' }] })
					)
				} else {
					navigation.dispatch(
						CommonActions.reset({ index: 0, routes: [{ name: 'HomeTabs' }] })
					)
				}
			} else {
				throw new Error('no ID token present!')
			}
		} catch (error: any) {
			if (error.code === statusCodes.SIGN_IN_CANCELLED) {
				console.log('user cancelled the login flow', error)
				// user cancelled the login flow
			} else if (error.code === statusCodes.IN_PROGRESS) {
				console.log('user in progress the login flow', error)
				// operation (e.g. sign in) is in progress already
			} else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
				console.log('user not available the login flow', error)
				// play services not available or outdated
			} else {
				console.log('user error the login flow', error)
				// some other error happened
			}
		}
	}

	return (
		<Button
			title='Continue with Google'
			onPress={() => handlePress()}
			icon={{
				name: 'google',
				type: 'font-awesome',
				size: 20,
				color: 'black',
			}}
			iconContainerStyle={{ marginRight: 10 }}
			titleStyle={{ fontWeight: '500', color: 'black' }}
			buttonStyle={{
				backgroundColor: '#FFF',
				borderColor: '#EEE',
				borderWidth: 1,
				borderRadius: 25,
			}}
			containerStyle={{
				marginHorizontal: 10,
				marginVertical: 10,
			}}
		/>
	)
}
