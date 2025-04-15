import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { WidgetPreview } from 'react-native-android-widget';

import { ProgressWidget } from './ProgressWidget';

export function ProgressWidgetPreviewScreen() {
  return (
    <View style={styles.container}>
      <WidgetPreview
        renderWidget={() => <ProgressWidget />}
        width={320}
        height={200}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});