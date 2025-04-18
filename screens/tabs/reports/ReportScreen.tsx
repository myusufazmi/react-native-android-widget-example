import { Image, ScrollView, StyleSheet, Text } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { Button, Icon, ListItem } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dropdown } from "react-native-element-dropdown";
import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { Colors } from "@/constants/Colors";
import { SvgScreen } from "@/screens/SvgScreen";
import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ExampleScreens } from '../../ListScreen';
import { useTranslation } from 'react-i18next';

export default function StatisticScreen() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation<NativeStackNavigationProp<ExampleScreens>>();
  const { t } = useTranslation();
  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('reports'),
      headerStyle: { backgroundColor: Colors[colorScheme ?? 'light'].background },
      headerShadowVisible: false,
      headerTitleAlign: 'center',
      headerTintColor: Colors[colorScheme ?? 'light'].textSubtitle,
      headerLeft: () => <Image source={require('@/assets/images/icon.png')} style={{ width: 30, height: 30, alignSelf: 'center' }} />,
      headerTitleStyle: { fontWeight: 'normal', fontFamily: 'Nunito_700Bold' },
    });
  }, [navigation, colorScheme, t]);

  const renderItem = (item: any) => {
    return (
      <ThemedView style={styles.item}>
        <ThemedText style={styles.textItem}>{item.label}</ThemedText>
      </ThemedView>
    );
  };
  return (
    <SafeAreaView
      edges={["right", "bottom", "left"]}
      style={{
        flex: 1,
        backgroundColor: Colors[colorScheme ?? "light"].background,
      }}
    >
      <ThemedView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <ThemedView style={styles.card}>
            <ThemedView
              style={{
                width: "100%",
                borderBottomWidth: 1,
                borderBottomColor: "#EEE",
                paddingBottom: 20,
              }}
            >
              <ThemedText
                style={{
                  textAlign: "center",
                  fontFamily: "Nunito_700Bold",
                  fontSize: 40,
                  paddingVertical: 5,
                }}
              >
                0
              </ThemedText>
              <ThemedText
                style={{
                  textAlign: "center",
                  fontFamily: "Nunito_500Regular",
                  fontWeight: "normal",
                  fontSize: 15,
                  color: "#616161",
                }}
              >
                Total all steps all the time
              </ThemedText>
            </ThemedView>
            <ThemedView
              style={{
                width: "30%",
                borderRightWidth: 1,
                borderRightColor: "#EEE",
                marginTop: 20,
              }}
            >
              <Icon
                name="paid"
                type="material"
                color="#F9B438"
                style={{ paddingLeft: 10 }}
              />
              <ThemedText
                style={{
                  textAlign: "center",
                  fontFamily: "Nunito_700Bold",
                  fontSize: 20,
                  paddingVertical: 5,
                }}
              >
                0
              </ThemedText>
              <ThemedText
                style={{
                  textAlign: "center",
                  fontFamily: "Nunito_500Regular",
                  fontWeight: "normal",
                  fontSize: 15,
                  color: "#616161",
                }}
              >
                coin
              </ThemedText>
            </ThemedView>
            <ThemedView
              style={{
                width: "30%",
                borderRightWidth: 1,
                borderRightColor: "#EEE",
                marginTop: 20,
              }}
            >
              <Icon name="local-fire-department" type="material" color="red" />
              <ThemedText
                style={{
                  textAlign: "center",
                  fontFamily: "Nunito_700Bold",
                  fontSize: 20,
                  paddingVertical: 5,
                }}
              >
                0
              </ThemedText>
              <ThemedText
                style={{
                  textAlign: "center",
                  fontFamily: "Nunito_500Regular",
                  fontWeight: "normal",
                  fontSize: 15,
                  color: "#616161",
                }}
              >
                kcal
              </ThemedText>
            </ThemedView>
            <ThemedView style={{ width: "30%", marginTop: 20 }}>
              <Icon name="place" type="material" color="green" />
              <ThemedText
                style={{
                  textAlign: "center",
                  fontFamily: "Nunito_700Bold",
                  fontSize: 20,
                  paddingVertical: 5,
                }}
              >
                0.0
              </ThemedText>
              <ThemedText
                style={{
                  textAlign: "center",
                  fontFamily: "Nunito_500Regular",
                  fontWeight: "normal",
                  fontSize: 15,
                  color: "#616161",
                }}
              >
                km
              </ThemedText>
            </ThemedView>
          </ThemedView>
          <ThemedView style={[styles.card, { marginTop: 20 }]}>
            <ThemedView style={{ width: "50%" }}>
              <ThemedText
                style={{
                  fontFamily: "Nunito_700Bold",
                  fontSize: 18,
                  paddingVertical: 5,
                }}
              >
                Statistics
              </ThemedText>
            </ThemedView>
            <ThemedView style={{ width: "50%" }}>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                iconStyle={styles.iconStyle}
                data={[
                  { label: "This Week", value: "1" },
                  { label: "This Month", value: "2" },
                  { label: "Last Month", value: "3" },
                  { label: "Last 6 Month", value: "4" },
                  { label: "This Year", value: "5" },
                  { label: "Last Year", value: "6" },
                  { label: "All Time", value: "7" },
                ]}
                labelField="label"
                valueField="value"
                placeholder="Select item"
                value={"1"}
                onChange={(item) => {
                  console.log("Selected item:", item);
                }}
                renderItem={renderItem}
              />
            </ThemedView>
            <ThemedView
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "flex-start",
                marginTop: 10,
              }}
            ></ThemedView>
          </ThemedView>
          <ThemedView style={[styles.card, { marginTop: 20 }]}>
            <ThemedView style={{ width: "70%" }}>
              <ThemedText
                style={{
                  fontFamily: "Nunito_700Bold",
                  fontSize: 18,
                  paddingVertical: 5,
                }}
              >
                Your Progress
              </ThemedText>
            </ThemedView>

            <ThemedView
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "flex-start",
                marginTop: 10,
              }}
            >
              <Text>Oke</Text>
              <SvgScreen />
            </ThemedView>
          </ThemedView>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
  },
  description: {
    color: "#616161",
    marginTop: 20,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    borderRadius: 10,
    padding: 15,
  },
  dropdown: {
    margin: 0,
    height: 40,
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  item: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textItem: {
    flex: 1,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 14,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
