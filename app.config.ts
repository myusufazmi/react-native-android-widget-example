import type { ConfigContext, ExpoConfig } from 'expo/config';
import type { WithAndroidWidgetsParams } from 'react-native-android-widget';

const widgetConfig: WithAndroidWidgetsParams = {
  fonts: [
    './assets/fonts/material.ttf',
    './assets/fonts/material_outlined.otf',
    './assets/fonts/Ndot-55.otf',
  ],
  widgets: [
    {
      name: 'Fitness',
      minHeight: '120dp',
      minWidth: '300dp',
      description: 'Track your fitness level',
      previewImage: './assets/widget-preview/fitness.png',
    },
    {
      name: 'Resizable',
      minHeight: '100dp',
      minWidth: '180dp',
      description: 'Check your music in different formats',
      previewImage: './assets/widget-preview/resizable.png',
      resizeMode: 'horizontal|vertical',
    },
    {
      name: 'Rotated',
      minHeight: '150dp',
      minWidth: '180dp',
      previewImage: './assets/widget-preview/rotated.png',
    },
    {
      name: 'Shopify',
      label: 'Shopify Insights',
      minHeight: '200dp',
      minWidth: '300dp',
      description: "Get quick access to your store's performance",
      previewImage: './assets/widget-preview/shopify.png',
    },
    {
      name: 'Counter',
      minHeight: '100dp',
      minWidth: '300dp',
      previewImage: './assets/widget-preview/counter.png',
    },
    {
      name: 'ClickDemo',
      label: 'Click Demo',
      minHeight: '100dp',
      minWidth: '300dp',
      previewImage: './assets/widget-preview/clickdemo.png',
    },
    {
      name: 'List',
      label: 'List Widget Demo',
      description: 'See your emails on the home screen',
      minHeight: '120dp',
      minWidth: '300dp',
      previewImage: './assets/widget-preview/list.png',
    },
    {
      name: 'DebugEvents',
      label: 'Debug Events',
      description: 'Debug Widget Events',
      minHeight: '100dp',
      minWidth: '300dp',
      previewImage: './assets/widget-preview/debugevents.png',
      updatePeriodMillis: 30 * 60 * 1000,
    },
    {
      name: 'Configurable',
      label: 'Configurable Widget',
      minHeight: '100dp',
      minWidth: '300dp',
      previewImage: './assets/widget-preview/counter.png',
      widgetFeatures: 'reconfigurable',
    },
  ],
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  owner: 'schifferania',
  name: 'Uni Apps',
  slug: 'uni-app',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
  },
  scheme: 'uni-app',
  newArchEnabled: false,
  android: {
    package: 'com.myusufazmi.uniapp',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#FFFFFF',
    },
  },
  extra: {
    eas: {
      projectId: '6285afd8-26f8-48a5-b56a-d3382aad19e4',
    },
  },
  plugins: [
    // Configure Android minSdk via expo-build-properties
    ['expo-build-properties', {
      android: { minSdkVersion: 26 }
    }],
    ['react-native-android-widget', widgetConfig],
    // Enable Apple Authentication plugin
    'expo-apple-authentication',
  ],
});