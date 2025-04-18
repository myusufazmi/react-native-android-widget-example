import { StyleSheet, View } from 'react-native'
import { Dialog } from '@rneui/themed'
import { ThemedText } from './ThemedText'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { Colors } from '@/constants/Colors'

type Props = {
	isAvailable: boolean
	title: string
	description?: string
	backdropStyle?: any
	isCancelable?: boolean
	acceptText: string
	declineText?: string
	onAccept: () => void
	onDecline?: () => void
}

export function ModalDialog(props: Props) {
	const colorScheme = useColorScheme()
	return (
		<Dialog backdropStyle={[styles.backdrop, props.backdropStyle]} overlayStyle={[{ backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }, styles.dialog]} isVisible={props.isAvailable}>
			<Dialog.Title title={props.title} titleStyle={[{ color: Colors[colorScheme ?? 'light'].textSubtitle }, styles.dialogTitle]} />
			<ThemedText type='default' style={styles.dialogText}>
				{props.description}
			</ThemedText>
			<Dialog.Actions>
				<View style={{ flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
					{props.declineText && <Dialog.Button containerStyle={styles.skipButton} titleStyle={styles.textSkipButton} title={props.declineText} onPress={props.onDecline} />}
					<Dialog.Button containerStyle={styles.nextButton} titleStyle={styles.textButton} title={props.acceptText} onPress={props.onAccept} />
				</View>
			</Dialog.Actions>
		</Dialog>
	)
}

const styles = StyleSheet.create({
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
		fontFamily: 'Nunito_700Bold',
		fontSize: 20,
		color: '#F75555',
		textAlign: 'center',
		paddingVertical: 10,
	},
	dialogText: {
		fontFamily: 'Nunito_400Regular',
		fontSize: 20,
		textAlign: 'center',
		paddingVertical: 30,
		borderBottomColor: '#EEE',
		borderBottomWidth: 1,
		borderTopColor: '#EEE',
		borderTopWidth: 1,
		marginBottom: 10,
	},
	backdrop: {
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	nextButton: {
		paddingVertical: 10,
		justifyContent: 'center',
		width: '47%',
		borderRadius: 50,
		backgroundColor: '#59BCB1',
		marginLeft: '5%',
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
