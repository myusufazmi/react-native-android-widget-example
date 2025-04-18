import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';
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
  return (
    <NavigationContainer linking={linkingOptions}>
      <Stack.Navigator>
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
  );
}