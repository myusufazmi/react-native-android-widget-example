import './utils/i18n';
import 'react-native-health-connect';
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Linking } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSdkStatus, initialize, requestPermission, getGrantedPermissions, SdkAvailabilityStatus } from 'react-native-health-connect';
import { Pedometer } from 'expo-sensors';
import { ModalDialog } from '@/components/ModalDialog';
import { useTranslation } from 'react-i18next';
import { BorderScreen } from './screens/BorderScreen';
import { CounterScreen } from './screens/CounterScreen';
import { FlexScreen } from './screens/FlexScreen';
import { ListScreen, type ExampleScreens } from './screens/ListScreen';
import { SvgScreen } from './screens/SvgScreen';
import { TextScreen } from './screens/TextScreen';
import { ClickDemoWidgetPreviewScreen } from './screens/widget-preview/ClickDemoWidgetPreviewScreen';
import { DebugEventsWidgetPreviewScreen } from './screens/widget-preview/DebugEventsWidgetPreviewScreen';
import { FitnessWidgetPreviewScreen } from './screens/widget-preview/FitnessWidgetPreviewScreen';
import { ListDemoWidgetPreviewDeepLinkScreen } from './screens/widget-preview/ListDemoWidgetPreviewDeepLinkScreen';
import { ListDemoWidgetPreviewScreen } from './screens/widget-preview/ListDemoWidgetPreviewScreen';
import { ResizableMusicWidgetPreviewScreen } from './screens/widget-preview/ResizableMusicWidgetPreviewScreen';
import { RotatedWidgetPreviewScreen } from './screens/widget-preview/RotatedWidgetPreviewScreen';
import { ShopifyWidgetPreviewScreen } from './screens/widget-preview/ShopifyWidgetPreviewScreen';
import IntroScreen from './screens/intro/IntroScreen';
import SigninScreen from './screens/auth/SigninScreen';
import OtpScreen from './screens/auth/OtpScreen';
import ProfileScreen from './screens/auth/ProfileScreen';
import HomeScreen from './screens/tabs/home/HomeScreen';
import RewardScreen from './screens/tabs/rewards/RewardScreen';
import ReportScreen from './screens/tabs/reports/ReportScreen';
import AccountScreen from './screens/tabs/accounts/AccountScreen';
import { linkingOptions } from './linking.config';
import * as SplashScreen from "expo-splash-screen";
import { Permission, PermissionsAndroid, Platform } from "react-native";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator<ExampleScreens>();
const Tab = createBottomTabNavigator();

function TabsNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="RewardScreen" component={RewardScreen} options={{ title: 'Rewards' }} />
      <Tab.Screen name="ReportScreen" component={ReportScreen} options={{ title: 'Reports' }} />
      <Tab.Screen name="AccountScreen" component={AccountScreen} options={{ title: 'Account' }} />
    </Tab.Navigator>
  );
}

export function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [initialRoute, setInitialRoute] = useState<keyof ExampleScreens | null>(null);
  const { t } = useTranslation();

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

  useEffect(() => {
    const checkFirstLaunch = async () => {
      const seen = await AsyncStorage.getItem('hasSeenIntro');
      if (seen === 'true') {
        setInitialRoute('SigninScreen');
      } else {
        setInitialRoute('IntroScreen');
      }
    };
    checkFirstLaunch();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {!initialRoute ? (
        <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />
      ) : (
        <NavigationContainer linking={linkingOptions}>
          <Stack.Navigator initialRouteName={initialRoute as keyof ExampleScreens}>
            <Stack.Screen
              name="IntroScreen"
              component={IntroScreen}
              options={{ title: 'Intro' }}
            />
            <Stack.Screen
              name="SigninScreen"
              component={SigninScreen}
              options={{ title: 'Sign In' }}
            />
            <Stack.Screen
              name="OtpScreen"
              component={OtpScreen}
              options={{ title: 'OTP Verification' }}
            />
            <Stack.Screen
              name="ProfileScreen"
              component={ProfileScreen}
              options={{ title: 'Profile' }}
            />
            <Stack.Screen
              name="HomeTabs"
              component={TabsNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ListScreen"
              component={ListScreen}
              options={{ title: 'React Native Android Widget Example' }}
            />
            <Stack.Screen
              name="FlexScreen"
              component={FlexScreen}
              options={{ title: 'Flexbox Demo' }}
            />
            <Stack.Screen
              name="BorderScreen"
              component={BorderScreen}
              options={{ title: 'Border Demo' }}
            />
            <Stack.Screen
              name="SvgScreen"
              component={SvgScreen}
              options={{ title: 'Svg Demo' }}
            />
            <Stack.Screen
              name="TextScreen"
              component={TextScreen}
              options={{ title: 'Text Demo' }}
            />
            <Stack.Screen
              name="CounterScreen"
              component={CounterScreen}
              options={{ title: 'Counter Demo' }}
            />
            <Stack.Screen
              name="FitnessWidgetPreviewScreen"
              component={FitnessWidgetPreviewScreen}
              options={{ title: 'Fitness Widget Preview' }}
            />
            <Stack.Screen
              name="ResizableMusicWidgetPreviewScreen"
              component={ResizableMusicWidgetPreviewScreen}
              options={{ title: 'Resizable Music Widget Preview' }}
            />
            <Stack.Screen
              name="RotatedWidgetPreviewScreen"
              component={RotatedWidgetPreviewScreen}
              options={{ title: 'Rotated Widget Preview' }}
            />
            <Stack.Screen
              name="ShopifyWidgetPreviewScreen"
              component={ShopifyWidgetPreviewScreen}
              options={{ title: 'Shopify Widget Preview' }}
            />
            <Stack.Screen
              name="ClickDemoWidgetPreviewScreen"
              component={ClickDemoWidgetPreviewScreen}
              options={{ title: 'Click Demo Widget Preview' }}
            />
            <Stack.Screen
              name="ListDemoWidgetPreviewScreen"
              component={ListDemoWidgetPreviewScreen}
              options={{ title: 'List Widget Preview' }}
            />
            <Stack.Screen
              name="ListDemoWidgetPreviewDeepLinkScreen"
              component={ListDemoWidgetPreviewDeepLinkScreen}
              options={{ title: 'List Widget Deep Link' }}
            />
            <Stack.Screen
              name="DebugEventsWidgetPreviewScreen"
              component={DebugEventsWidgetPreviewScreen}
              options={{ title: 'Debug Widget Events' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      )}
      <ModalDialog
        isAvailable={modalVisible}
        title={t('gotoTitle')}
        description={t('gotoDesc')}
        onAccept={() => Linking.openURL('https://play.google.com/store/apps/details?id=com.google.android.apps.healthdata')}
        acceptText={t('gotoPlayStore')}
        declineText=""
      />
    </View>
  );
}