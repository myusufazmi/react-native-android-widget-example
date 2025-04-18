import {
    DefaultTheme,
    DarkTheme,
    ThemeProvider,
  } from "@react-navigation/native";
  import * as SplashScreen from "expo-splash-screen";
  import { StatusBar } from "expo-status-bar";
  import { useEffect } from "react";
  import "react-native-reanimated";
  import "@/utils/i18n";
  import { useColorScheme } from "@/hooks/useColorScheme";
  import { Permission, PermissionsAndroid, Platform } from "react-native";
  import { useNavigation, CommonActions } from '@react-navigation/native';
import { supabase } from "@/utils/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from 'react-i18next'
  
  // Prevent the splash screen from auto-hiding before asset loading is complete.
  SplashScreen.preventAutoHideAsync();
  
  export default function RootLayout() {
    const { t } = useTranslation()
    const colorScheme = useColorScheme();
    const navigation = useNavigation();

    useEffect(() => {
		addIntro()
	}, [])

	async function addIntro() {
		const value = await AsyncStorage.setItem('intro', 'true')
	}

	const onCloseButton = () => {
		navigation.dispatch(
			CommonActions.reset({ index: 0, routes: [{ name: 'SigninScreen' }] })
		);
	}

    useEffect(() => {
        checkIntro();
    }, []);
    
      async function checkIntro() {
        try {
          supabase.auth.getSession().then(async ({ data: { session } }: any) => {
            if (session) {
              navigation.dispatch(
                CommonActions.reset({ index: 0, routes: [{ name: 'HomeTabs' }] })
              );
            } else {
              const value = await AsyncStorage.getItem("intro");
              if (value === null) {
                navigation.dispatch(
                  CommonActions.reset({ index: 0, routes: [{ name: 'IntroScreen' }] })
                );
              } else {
                navigation.dispatch(
                  CommonActions.reset({ index: 0, routes: [{ name: 'SigninScreen' }] })
                );
              }
            }
          });
    
          // supabase.auth.onAuthStateChange(async (event, session) => {
          // 	console.log(event)
    
          // 	if (event === 'PASSWORD_RECOVERY') {
          // 		console.log('hit the pw recovery event!')
          // 		const { data, error } = await supabase.auth.updateUser({ password: 'fishfish' })
          // 	}
    
          // 	if (session) {
          // 		router.replace('/(tabs)/home')
          // 	} else {
          // 		const value = await AsyncStorage.getItem('intro')
          // 		console.log('value', value)
          // 		if (value === null) {
          // 			router.replace('/intro')
          // 		} else {
          // 			router.replace('/(auth)/signin')
          // 		}
          // 	}
          // })
        } catch (e) {
          console.log("Error checking intro", e);
        }
      }
    
    useEffect(() => {
      async function requestPermissions() {
        if (Platform.OS === "android") {
          try {
            const granted = await PermissionsAndroid.request(
              "android.permission.health.READ_STEPS" as Permission, // Gunakan tipe Permission
              {
                title: "Health Data Permission",
                message:
                  "This app needs access to your step data to function properly.",
                buttonNeutral: "Ask Me Later",
                buttonNegative: "Cancel",
                buttonPositive: "OK",
              }
            );
            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
              console.warn("Health data permission denied");
            }
          } catch (err) {
            console.error("Failed to request health data permission", err);
          }
        }
      }
  
      requestPermissions();
    }, []);
  
    return (
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>

        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      </ThemeProvider>
    );
  }