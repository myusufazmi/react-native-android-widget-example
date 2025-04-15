/* eslint-disable react-native/no-inline-styles */
import * as React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import {
  FlexWidget,
  SvgWidget,
  WidgetPreview,
} from "react-native-android-widget";

const svgString = `
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <!-- Background Circle -->
  <circle cx="100" cy="100" r="70" stroke="#E0E0E0" stroke-width="15" fill="none" stroke-linecap="round"
          stroke-dasharray="260" stroke-dashoffset="65" transform="rotate(135 100 100)"/>

  <!-- Progress Circle (75%) -->
  <circle cx="100" cy="100" r="70" stroke="#4CAF50" stroke-width="15" fill="none" stroke-linecap="round"
          stroke-dasharray="195" stroke-dashoffset="65" transform="rotate(135 100 100)"/>

  <!-- Teks -->
  <text x="100" y="85" font-size="18" text-anchor="middle" fill="#666">Steps</text>
  <text x="100" y="110" font-size="30" font-weight="bold" text-anchor="middle" fill="#000">4,805</text>
  <text x="100" y="130" font-size="14" text-anchor="middle" fill="#666">/6000</text>
</svg>
`;

export function SvgScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text>Svg from String</Text>
      <WidgetPreview
        renderWidget={() => (
          <FlexWidget
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: "match_parent",
              width: "match_parent",
            }}
          >
            <SvgWidget svg={svgString} style={{ height: 72, width: 72 }} />
          </FlexWidget>
        )}
        height={150}
        width={320}
      />

      <Text>Svg from File</Text>
      <WidgetPreview
        renderWidget={() => (
          <FlexWidget
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: "match_parent",
              width: "match_parent",
            }}
          >
            <SvgWidget
              svg={require("../assets/SVG_Logo.svg")}
              style={{ height: 72, width: 72 }}
            />
          </FlexWidget>
        )}
        height={150}
        width={320}
      />

      <Text>Svg from URL</Text>
      <WidgetPreview
        renderWidget={() => (
          <FlexWidget
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: "match_parent",
              width: "match_parent",
            }}
          >
            <SvgWidget
              svg="https://upload.wikimedia.org/wikipedia/commons/4/4f/SVG_Logo.svg"
              style={{ height: 72, width: 72 }}
            />
          </FlexWidget>
        )}
        height={150}
        width={320}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f1",
    padding: 8,
  },
  contentContainer: {
    paddingBottom: 64,
  },
});
