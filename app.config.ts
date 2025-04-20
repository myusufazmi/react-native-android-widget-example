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
    bundleIdentifier: 'com.settlesoft.greensteps',
    usesAppleSignIn: true,
    infoPlist: {
      NSLocationWhenInUseUsageDescription: '[REASON]',
      CFBundleAllowMixedLocalizations: true
    }
  },
  scheme: 'uni-app',
  newArchEnabled: false,
  android: {
    package: 'com.settlesoft.greensteps',
    adaptiveIcon: {
      foregroundImage: './assets/images/icon.png',
      backgroundColor: '#EEEFE7'
    },
    permissions: [
      'android.permission.ACTIVITY_RECOGNITION',
      'android.permission.health.READ_STEPS',
      'android.permission.health.WRITE_STEPS'
    ]
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png'
  },
  extra: {
    eas: {
      projectId: '6285afd8-26f8-48a5-b56a-d3382aad19e4',
    },
  },
  plugins: [
    ['expo-build-properties', {
      android: { compileSdkVersion: 35,
          targetSdkVersion: 35,
          minSdkVersion: 26,
          kotlinVersion: "1.9.25" }
    }],
    [
      "expo-image-picker",
      {
        photosPermission: "The app accesses your photos to let you share them with your friends."
      }
    ],
    ['react-native-android-widget', widgetConfig],
    'expo-apple-authentication',
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 250,
        resizeMode: "contain",
        backgroundColor: "#EEEFE7"
      }
    ],
    [
      "@react-native-google-signin/google-signin",
      {
        iosUrlScheme: "com.googleusercontent.apps._some_id_here_"
      }
    ],
    ['expo-localization']
  ],
});