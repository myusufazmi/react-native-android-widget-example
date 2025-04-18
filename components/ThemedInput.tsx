import { Input } from '@rneui/themed'
import { StyleSheet } from 'react-native'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { Colors } from '@/constants/Colors'

export function ThemedInput(props: any) {
	const colorScheme = useColorScheme()
	return (
		<Input
			label={props.label}
			labelStyle={[{ color: Colors[colorScheme ?? 'light'].textSubtitle }, styles.label, props.labelStyle]}
			containerStyle={[{ backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }, styles.container, props.containerStyle]}
			inputContainerStyle={[
				{ backgroundColor: Colors[colorScheme ?? 'light'].cardBackground, borderColor: Colors[colorScheme ?? 'light'].background },
				styles.inputContainer,
				props.inputContainerStyle,
			]}
			inputStyle={[{ backgroundColor: Colors[colorScheme ?? 'light'].inputPrimary, color: Colors[colorScheme ?? 'light'].textSubtitle }, styles.input, props.inputStyle]}
			placeholder={[{ color: Colors[colorScheme ?? 'light'].text }, props.placeholder]}
			defaultValue={props.defaultValue}
			errorStyle={{ color: 'red' }}
			onChangeText={(value) => {
				props.onChange(value)
			}}
			errorMessage={props.errorMessage}
			{...props}
		/>
	)
}

const styles = StyleSheet.create({
	container: {
		margin: 0,
		paddingHorizontal: 0,
	},
	inputContainer: {
		margin: 0,
		paddingHorizontal: 0,
	},
	input: {
		borderRadius: 10,
		paddingVertical: 13,
		paddingHorizontal: 20,
		margin: 0,
		fontSize: 17,
		fontFamily: 'Nunito_400Regular',
		fontWeight: 'normal',
		// color: '#9E9E9E',
	},
	label: {
		fontSize: 15,
		fontFamily: 'Nunito_700Bold',
		fontWeight: 'normal',
		paddingBottom: 10,
	},
})
