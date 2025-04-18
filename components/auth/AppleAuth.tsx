import { Button } from '@rneui/themed'
import * as AppleAuthentication from 'expo-apple-authentication'
import { View, StyleSheet } from 'react-native'

export default function AppleAuth() {
	return (
		<Button
			title='Continue with Apple'
			icon={{
				name: 'apple',
				type: 'font-awesome',
				size: 20,
				color: 'black',
			}}
			onPress={async () => {
				console.log('apple sign in')
				try {
					const credential = await AppleAuthentication.signInAsync({
						requestedScopes: [AppleAuthentication.AppleAuthenticationScope.FULL_NAME, AppleAuthentication.AppleAuthenticationScope.EMAIL],
					})
					console.log('credential', credential)
					// signed in
				} catch (e: any) {
					if (e.code === 'ERR_REQUEST_CANCELED') {
						// handle that the user canceled the sign-in flow
					} else {
						// handle other errors
					}
				}
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
		// <View style={styles.container}>
		// 	<AppleAuthentication.AppleAuthenticationButton
		// 		buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
		// 		buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
		// 		cornerRadius={5}
		// 		style={styles.button}
		// 		onPress={async () => {
		// 			try {
		// 				const credential = await AppleAuthentication.signInAsync({
		// 					requestedScopes: [AppleAuthentication.AppleAuthenticationScope.FULL_NAME, AppleAuthentication.AppleAuthenticationScope.EMAIL],
		// 				})
		// 				// signed in
		// 			} catch (e: any) {
		// 				if (e.code === 'ERR_REQUEST_CANCELED') {
		// 					// handle that the user canceled the sign-in flow
		// 				} else {
		// 					// handle other errors
		// 				}
		// 			}
		// 		}}
		// 	/>
		// </View>
	)
}

const styles = StyleSheet.create({
	container: {
		// flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	button: {
		width: 200,
		height: 44,
	},
})
