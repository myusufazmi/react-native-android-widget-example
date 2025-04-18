import { Image, StyleSheet } from 'react-native'
import { ThemedView } from '@/components/ThemedView'
import { Button, Icon, ListItem, Switch } from '@rneui/themed'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useEffect, useState, useLayoutEffect } from 'react'
import { supabase } from '@/utils/supabase'
import { Session } from '@supabase/supabase-js'
import dayjs from 'dayjs'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { Colors } from '@/constants/Colors'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { ExampleScreens } from '../../ListScreen'

export default function PreferencesScreen() {
	const navigation = useNavigation<NativeStackNavigationProp<ExampleScreens>>()
	const colorScheme = useColorScheme()
	const [reminder, setReminder] = useState(false)
	const [reminderTime, setReminderTime] = useState('00:00')
	const [sessionId, setSessionId] = useState('')
	const [date, setDate] = useState(new Date())
	const [show, setShow] = useState(false)
	const { t } = useTranslation()

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			getData(session)
		})
	}, [])

	useLayoutEffect(() => {
		navigation.setOptions({
			title: t('preferences'),
			headerStyle: { backgroundColor: Colors[colorScheme ?? 'light'].background },
			headerShadowVisible: false,
			headerTitleAlign: 'center',
			headerTintColor: Colors[colorScheme ?? 'light'].textSubtitle,
			headerTitleStyle: { fontWeight: 'normal', fontFamily: 'Nunito_700Bold' },
		})
	}, [navigation, colorScheme, t])

	async function getData(session: Session | null = null) {
		try {
			const { data, error, status } = await supabase.from('profiles').select(`reminder,remindertime`).eq('id', session?.user.id).single()
			if (error && status !== 406) {
				console.log('error', error)
				throw error
			}
			if (data) {
				setSessionId(session?.user.id as string)
				setReminder(data?.reminder)
				setReminderTime(data?.remindertime ? dayjs(data?.remindertime).format('HH:mm') : '00:00')
			}
		} catch (error) {
			if (error instanceof Error) {
				console.log('error', error.message)
			}
		} finally {
			console.log('finally')
		}
	}

	async function handleSaveReminder(value: boolean) {
		try {
			console.log('value', value)
			const { data, error } = await supabase
				.from('profiles')
				.update({
					reminder: value,
				})
				.eq('id', sessionId)
			if (error) {
				console.log('error', error)
				throw error
			}
			setReminder(value)
			console.log('data', data)
		} catch (error) {
			if (error instanceof Error) {
				console.log('error', error.message)
			}
		} finally {
			console.log('finally')
		}
	}

	async function onChange(event: any, selectedDate: any) {
		const currentDate = selectedDate
		console.log('selectedDate', selectedDate)
		const time = dayjs(selectedDate).format('HH:mm')
		const { data, error } = await supabase
			.from('profiles')
			.update({
				remindertime: selectedDate,
			})
			.eq('id', sessionId)
		if (error) {
			console.log('error', error)
			throw error
		}
		setReminderTime(time)
		setShow(false)
		setDate(currentDate)
	}

	return (
		<SafeAreaView edges={['right', 'bottom', 'left']} style={{ paddingTop: 10, flex: 1, backgroundColor: Colors[colorScheme ?? 'light'].background }}>
			<ThemedView style={[{ backgroundColor: Colors[colorScheme ?? 'light'].background }, styles.container]}>
				<ListItem containerStyle={{ backgroundColor: Colors[colorScheme ?? 'light'].cardBackground, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
					<ListItem.Content>
						<ListItem.Title style={[{ color: Colors[colorScheme ?? 'light'].textSubtitle }, styles.list]}>{t('dailyStepReminder')}</ListItem.Title>
					</ListItem.Content>
					<ListItem.Content right>
						<Switch value={reminder} onValueChange={(value) => handleSaveReminder(value)} />
					</ListItem.Content>
				</ListItem>
				<ListItem containerStyle={{ backgroundColor: Colors[colorScheme ?? 'light'].cardBackground, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
					<ListItem.Content>
						<ListItem.Title style={[{ color: Colors[colorScheme ?? 'light'].textSubtitle }, styles.list]}>{t('reminderTime')}</ListItem.Title>
					</ListItem.Content>
					<ListItem.Content right>
						<Button type='clear' title={reminderTime} onPress={() => setShow(true)} />
					</ListItem.Content>
				</ListItem>
			</ThemedView>
			{show && <DateTimePicker testID='dateTimePicker' value={date} mode={'time'} is24Hour={true} onChange={onChange} />}
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
