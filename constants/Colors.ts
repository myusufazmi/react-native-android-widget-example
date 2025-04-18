/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#86C1D3'
const tintColorDark = '#27A99E'

export const Colors = {
	light: {
		text: '#2D3132',
		textSubtitle: '#1D3521',
		textPrice: '#195669',
		background: '#F5F5F5',
		cardBackground: '#FFFFFF',
		tint: tintColorLight,
		icon: '#59BCB1',
		inputPrimary: '#FAFAFA',
		buttonPrimary: '#59BCB1',
		buttonSecondary: '#EEEFE7',
		tabIconDefault: '#B7BEBE',
		tabIconSelected: tintColorLight,
	},
	dark: {
		text: '#616161',
		textSubtitle: '#EFEFE7',
		textPrice: '#195669',
		background: '#282E2F',
		cardBackground: '#303839',
		tint: tintColorDark,
		icon: '#B6BEBE',
		inputPrimary: '#282E2F',
		buttonPrimary: '#59BCB1',
		buttonSecondary: '#EEEFE7',
		tabIconDefault: '#B6BEBE',
		tabIconSelected: tintColorDark,
	},
}
