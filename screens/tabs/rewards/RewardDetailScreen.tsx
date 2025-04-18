import { Image, StyleSheet, ScrollView } from 'react-native'
import { ThemedView } from '@/components/ThemedView'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useLayoutEffect } from 'react'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { RouteProp } from '@react-navigation/native'
import type { ExampleScreens } from '../../ListScreen'
import { ThemedText } from '@/components/ThemedText'
import { getStorageData, supabase } from '@/utils/supabase'
import { useTranslation } from 'react-i18next'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { Colors } from '@/constants/Colors'
import { useEffect, useState } from 'react'
import { Button, Overlay, Skeleton } from '@rneui/themed'

export default function DetailRewardScreen() {
	const colorScheme = useColorScheme()
	const { i18n, t } = useTranslation()
	const currentLanguage = i18n.language
	const [loading, setLoading] = useState(false)
	const [dataRewards, setDataRewards] = useState<any>()
	const [myCoin, setMyCoin] = useState(0)
	const [overlay, setOverlay] = useState(false)
	const navigation = useNavigation<NativeStackNavigationProp<ExampleScreens>>()
	const route = useRoute<RouteProp<ExampleScreens, 'RewardDetailScreen'>>()
	const { id } = route.params

	useLayoutEffect(() => {
		navigation.setOptions({
			title: t('detailreward'),
			headerStyle: { backgroundColor: Colors[colorScheme ?? 'light'].background },
			headerShadowVisible: false,
			headerTitleAlign: 'center',
			headerTintColor: Colors[colorScheme ?? 'light'].textSubtitle,
			headerTitleStyle: { fontWeight: 'normal', fontFamily: 'Nunito_700Bold' },
		})
	}, [navigation, colorScheme, t])

	useEffect(() => {
		getData()
	}, [])

	async function getData() {
		try {
			setLoading(true)
			const { data, error, status } = await supabase.from('rewards').select(`id, category, imageurl, coin, expired, language_rewards (id,name,description)`).eq('id', id).single()
			if (error && status !== 406) {
				console.log('error', error)
				throw error
			}
			if (data) {
				const getCoin = await supabase.from('profiles').select(`id, coins`).eq('id', id).single()
				setMyCoin(getCoin?.data?.coins || 0)
				setDataRewards(data)
			}
		} catch (error) {
			if (error instanceof Error) {
				console.log('error', error.message)
			}
		} finally {
			setLoading(false)
		}
	}

	async function handleRedeem() {
		try {
			setLoading(true)
			const {
				data: { user },
			} = await supabase.auth.getUser()

			const newData = {
				coin: dataRewards?.coin,
				type: 'out',
				reference_id: dataRewards?.id,
				reference_name: 'rewards',
				creator: user?.id as string,
			}
			const saveCoin = await supabase.from('coins').insert(newData)
			if (!saveCoin?.error) {
				setOverlay(true)
			}
		} catch (error) {
			if (error instanceof Error) {
				console.log('error', error.message)
			}
		} finally {
			setLoading(false)
		}
	}

	const toggleOverlay = () => {
		setOverlay(!overlay)
	}

	return (
		<SafeAreaView edges={['right', 'bottom', 'left']} style={{ flex: 1, backgroundColor: Colors[colorScheme ?? 'light'].background }}>
			<ThemedView style={styles.container}>
				<ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: Colors[colorScheme ?? 'light'].background }}>
					{dataRewards ? (
						<>
							<ThemedView style={{ backgroundColor: Colors[colorScheme ?? 'light'].cardBackground, alignContent: 'center', alignItems: 'center' }}>
								<Image source={{ uri: getStorageData('rewards', dataRewards.imageurl as string) }} style={styles.image} />
							</ThemedView>
							<ThemedView style={{ backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }}>
								<ThemedText style={[styles.name, { color: Colors[colorScheme ?? 'light'].textSubtitle }]}>
									{currentLanguage === 'en' ? dataRewards.language_rewards[0]?.name : dataRewards.language_rewards[1]?.name}
								</ThemedText>
							</ThemedView>
							<ThemedView style={{ backgroundColor: Colors[colorScheme ?? 'light'].cardBackground, width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
								<ThemedText style={[styles.text, { color: Colors[colorScheme ?? 'light'].textSubtitle }]}>{t('category')}</ThemedText>
								<ThemedText style={styles.textValue}>{dataRewards?.category}</ThemedText>
							</ThemedView>
							<ThemedView style={{ backgroundColor: Colors[colorScheme ?? 'light'].cardBackground, width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
								<ThemedText style={[styles.text, { color: Colors[colorScheme ?? 'light'].textSubtitle }]}>{t('yourcoin')}</ThemedText>
								<ThemedText style={styles.textValue}>{myCoin} Coins</ThemedText>
							</ThemedView>
							<ThemedView style={{ backgroundColor: Colors[colorScheme ?? 'light'].cardBackground, width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
								<ThemedText style={[styles.text, { color: Colors[colorScheme ?? 'light'].textSubtitle }]}>{t('coin')}</ThemedText>
								<ThemedText style={styles.textValue}>{dataRewards?.coin} Coins</ThemedText>
							</ThemedView>
							<ThemedText style={styles.desc}>{currentLanguage === 'en' ? dataRewards.language_rewards[0]?.description : dataRewards.language_rewards[1]?.description}</ThemedText>
							<Button
								title={t('redeemnow')}
								loading={loading}
								disabled={loading || myCoin < dataRewards?.coin}
								loadingProps={{ size: 'small', color: 'white' }}
								buttonStyle={styles.button}
								titleStyle={styles.buttonTitle}
								containerStyle={styles.buttonContainer}
								onPress={() => handleRedeem()}
							/>
						</>
					) : (
						<ThemedText style={styles.text}>loading...</ThemedText>
					)}
				</ScrollView>
				<Overlay isVisible={overlay} onBackdropPress={toggleOverlay}>
					<ThemedText style={{ padding: 20 }}>Your Redeem Successfull!</ThemedText>
				</Overlay>
			</ThemedView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		marginHorizontal: 15,
	},
	card: {
		width: '48%',
		borderRadius: 13,
		marginTop: 20,
	},
	image: {
		borderRadius: 13,
		width: '95%',
		height: 200,
		objectFit: 'cover',
	},
	name: {
		fontFamily: 'Nunito_700Bold',
		fontSize: 16,
		paddingVertical: 15,
		paddingHorizontal: 10,
	},
	text: {
		fontFamily: 'Nunito_700Bold',
		fontSize: 16,
		paddingVertical: 15,
		paddingHorizontal: 10,
	},
	textValue: {
		fontFamily: 'Nunito_400Regular',
		fontSize: 16,
		paddingVertical: 10,
		paddingRight: 10,
	},
	desc: {
		fontFamily: 'Nunito_400Regular',
		fontSize: 15,
		textAlign: 'justify',
		paddingVertical: 10,
		paddingHorizontal: 10,
	},
	buttonTitle: { fontFamily: 'Nunito_600SemiBold', fontWeight: 'bold', fontSize: 16 },
	buttonContainer: {
		marginHorizontal: 10,
		marginVertical: 20,
	},
	button: {
		backgroundColor: '#59BCB1',
		borderRadius: 10,
	},
})
