import { Image, Platform, ScrollView, StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { Pedometer } from "expo-sensors";
import { ThemedText } from "@/components/ThemedText";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Dropdown } from "react-native-element-dropdown";
import { Icon, Button } from "@rneui/themed";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { Colors } from "@/constants/Colors";
import { supabase } from "@/utils/supabase";

import {
  readRecords,
  insertRecords,
  getSdkStatus,
  initialize,
  requestPermission,
  getGrantedPermissions,
  SdkAvailabilityStatus,
  ReadRecordsOptions,
} from "react-native-health-connect";

import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ExampleScreens } from '../../ListScreen';

export default function HomeScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [todayStepCount, setTodayStepCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const navigation = useNavigation<NativeStackNavigationProp<ExampleScreens>>();
  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('home'),
      headerStyle: { backgroundColor: Colors[colorScheme ?? 'light'].background },
      headerShadowVisible: false,
      headerTitleAlign: 'center',
      headerTintColor: Colors[colorScheme ?? 'light'].textSubtitle,
      headerLeft: () => <Image source={require('@/assets/images/icon.png')} style={{ width: 30, height: 30, alignSelf: 'center' }} />,
      headerTitleStyle: { fontWeight: 'normal', fontFamily: 'Nunito_700Bold' },
    });
  }, [navigation, colorScheme, t]);

  useEffect(() => {
    checkAvailabiliySensor();
    getData();
    readHealthConnect();
  }, []);

  async function getData() {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data, error, status }: any = await supabase
        .from("profiles")
        .select(`id, height, weight, stepgoal, steps, coins`)
        .eq("id", user?.id)
        .single();
      if (error && status !== 406) {
        console.log("error", error);
        throw error;
      }
      if (data) {
        setData(data);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log("error", error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  const checkAvailabiliySensor = async () => {
    const isAvailable = await Pedometer.isAvailableAsync();
    console.log("check", isAvailable);
    if (isAvailable) {
      const permission = await Pedometer.getPermissionsAsync();
      console.log("check2", permission);
      if (!permission.granted) {
        await Pedometer.requestPermissionsAsync();
      }
      if (Platform.OS === "android") {
        // Keep this for Pedometer
      }
    }
  };

  const subscribe = async () => {
    return Pedometer.watchStepCount((result: any) => {
      console.log("results", result);
      setCurrentStepCount(result.steps);
      writeHealthConnect(result.steps);
    });
  };

  const writeHealthConnect = async (step: number) => {
    try {
      // Check and request permissions first
      const status = await getSdkStatus();
      if (status === SdkAvailabilityStatus.SDK_AVAILABLE) {
        const isInitialized = await initialize();
        if (!isInitialized) {
          console.log("Health Connect not initialized");
          return;
        }

        // Check if we have write permission
        const permissions = await getGrantedPermissions();
        const hasWritePermission = permissions.some(
          (permission) =>
            permission.recordType === "Steps" &&
            permission.accessType === "write"
        );

        if (!hasWritePermission) {
          console.log("Requesting write permission for steps");
          await requestPermission([
            {
              accessType: "write",
              recordType: "Steps",
            },
          ]);
        }

        // Try to insert the record
        const result = await insertRecords([
          {
            recordType: "Steps",
            count: step,
            startTime: new Date().toISOString(),
            endTime: dayjs().add(1, "second").toISOString(),
          },
        ]);
        console.log("Records inserted ", { result });
      } else {
        console.log("Health Connect SDK not available");
      }
    } catch (error) {
      console.error("Error inserting records: ", error);
    }
  };

  const readHealthConnect = async () => {
    // Ensure Health Connect SDK is available
    const sdkStatus = await getSdkStatus();
    if (sdkStatus !== SdkAvailabilityStatus.SDK_AVAILABLE) {
      console.log("Health Connect SDK not available");
      return;
    }
    // Initialize and request permissions
    await initialize();
    try {
      // @ts-ignore: default requestPermission signature
      await requestPermission();
    } catch (err) {
      console.error("Health Connect permission denied", err);
      return;
    }
    // Now read step records
    readRecords("Steps", {
      timeRangeFilter: {
        operator: "between",
        startTime: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
        endTime: new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),
      },
    })
      .then(({ records }) => {
        const totalSteps = records.reduce((sum, cur) => sum + cur.count, 0);
        setTodayStepCount(totalSteps);
        console.log(
          "Retrieved records: ",
          JSON.stringify({ records }, null, 2)
        ); // Retrieved records:  {"records":[{"startTime":"2023-01-09T12:00:00.405Z","endTime":"2023-01-09T23:53:15.405Z","energy":{"inCalories":15000000,"inJoules":62760000.00989097,"inKilojoules":62760.00000989097,"inKilocalories":15000},"metadata":{"id":"239a8cfd-990d-42fc-bffc-c494b829e8e1","lastModifiedTime":"2023-01-17T21:06:23.335Z","clientRecordId":null,"dataOrigin":"com.healthconnectexample","clientRecordVersion":0,"device":0}}]}
      })
      .catch((error) => {
        console.error("Error reading records: ", error);
      });
  };

  useEffect(() => {
    const subscription: any = subscribe();
    console.log("subscribe", subscription);
    return () => {
      console.log("unsubscribe", subscription);
      return subscription;
    };
  }, []);

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
        paddingTop: 10,
        flex: 1,
        backgroundColor: Colors[colorScheme ?? "light"].background,
      }}
    >
      <ThemedView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: Colors[colorScheme ?? "light"].background }}
        >
          {/* Header configured via useLayoutEffect */}
          <ThemedView
            style={[
              {
                backgroundColor: Colors[colorScheme ?? "light"].cardBackground,
              },
              styles.pedoContainer,
            ]}
          >
            <AnimatedCircularProgress
              dashedBackground={{ width: 1, gap: 1 }}
              dashedTint={{ width: 1, gap: 1 }}
              rotation={210}
              arcSweepAngle={300}
              size={250}
              width={30}
              fill={
                (currentStepCount + todayStepCount) / data?.stepgoal || 6000
              }
              tintColor="#59bcb1"
              backgroundColor={"#EEEEEE"}
            >
              {(fill) => (
                <ThemedView
                  style={{
                    backgroundColor:
                      Colors[colorScheme ?? "light"].cardBackground,
                  }}
                >
                  <ThemedText style={styles.step}>{t("steps")}</ThemedText>
                  <ThemedText
                    style={[
                      { color: Colors[colorScheme ?? "light"].textSubtitle },
                      styles.fill,
                    ]}
                  >
                    {currentStepCount + todayStepCount}
                  </ThemedText>
                  <ThemedText style={styles.step}>
                    /{data?.stepgoal || 6000}
                  </ThemedText>
                </ThemedView>
              )}
            </AnimatedCircularProgress>
          </ThemedView>

          <ThemedView
            style={[
              {
                backgroundColor: Colors[colorScheme ?? "light"].cardBackground,
              },
              styles.card,
            ]}
          >
            <ThemedView
              style={[
                {
                  backgroundColor:
                    Colors[colorScheme ?? "light"].cardBackground,
                },
                {
                  width: "50%",
                  alignItems: "center",
                  flexDirection: "row",
                  borderRightWidth: 1,
                  borderRightColor: "#EEE",
                },
              ]}
            >
              <Icon
                name="paid"
                type="material"
                color="#F9B438"
                style={{ paddingLeft: 10 }}
              />
              <ThemedText
                style={{
                  marginLeft: 10,
                  fontFamily: "Nunito_600SemiBold",
                  fontSize: 20,
                  color: Colors[colorScheme ?? "light"].textSubtitle,
                }}
              >
                0
              </ThemedText>
            </ThemedView>
            <ThemedView
              style={[
                {
                  backgroundColor:
                    Colors[colorScheme ?? "light"].cardBackground,
                },
                { marginLeft: 10 },
              ]}
            >
              <Button
                disabled
                type="solid"
                title={t("collectCoin")}
                onPress={() => console.log("Unlink Apple")}
                buttonStyle={{ backgroundColor: "#F9B438", borderRadius: 10 }}
              />
            </ThemedView>
          </ThemedView>
          <ThemedView
            style={[
              {
                backgroundColor: Colors[colorScheme ?? "light"].cardBackground,
              },
              styles.card,
            ]}
          >
            <ThemedView
              style={[
                {
                  backgroundColor:
                    Colors[colorScheme ?? "light"].cardBackground,
                },
                { width: "50%", borderRightWidth: 1, borderRightColor: "#EEE" },
              ]}
            >
              <Icon name="fire-circle" type="material-community" color="red" />
              <ThemedText
                style={{
                  textAlign: "center",
                  fontFamily: "Nunito_700Bold",
                  fontSize: 20,
                  paddingVertical: 5,
                  color: Colors[colorScheme ?? "light"].textSubtitle,
                }}
              >
                0
              </ThemedText>
              <ThemedText
                style={{
                  textAlign: "center",
                  fontFamily: "Nunito_500Regular",
                  fontWeight: "normal",
                  fontSize: 16,
                  color: "#616161",
                }}
              >
                kcal
              </ThemedText>
            </ThemedView>
            <ThemedView
              style={[
                {
                  backgroundColor:
                    Colors[colorScheme ?? "light"].cardBackground,
                },
                { width: "50%" },
              ]}
            >
              <Icon name="map-pin" type="feather" color="green" />
              <ThemedText
                style={{
                  textAlign: "center",
                  fontFamily: "Nunito_700Bold",
                  fontSize: 20,
                  paddingVertical: 5,
                  color: Colors[colorScheme ?? "light"].textSubtitle,
                }}
              >
                0.0
              </ThemedText>
              <ThemedText
                style={{
                  textAlign: "center",
                  fontFamily: "Nunito_500Regular",
                  fontWeight: "normal",
                  fontSize: 16,
                  color: "#616161",
                }}
              >
                km
              </ThemedText>
            </ThemedView>
          </ThemedView>
          <ThemedView
            style={[
              {
                backgroundColor: Colors[colorScheme ?? "light"].cardBackground,
              },
              styles.card,
            ]}
          >
            <ThemedView
              style={[
                {
                  backgroundColor:
                    Colors[colorScheme ?? "light"].cardBackground,
                },
                { width: "50%" },
              ]}
            >
              <ThemedText
                style={{
                  fontFamily: "Nunito_700Bold",
                  fontSize: 20,
                  paddingVertical: 5,
                  color: Colors[colorScheme ?? "light"].textSubtitle,
                }}
              >
                {t("history")}
              </ThemedText>
            </ThemedView>
            <ThemedView
              style={[
                {
                  backgroundColor:
                    Colors[colorScheme ?? "light"].cardBackground,
                },
                { width: "50%" },
              ]}
            >
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
              style={[
                {
                  backgroundColor:
                    Colors[colorScheme ?? "light"].cardBackground,
                },
                {
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "flex-start",
                  marginTop: 10,
                },
              ]}
            >
              <AnimatedCircularProgress
                style={{ marginRight: 10 }}
                rotation={210}
                arcSweepAngle={300}
                size={43}
                width={5}
                fill={80}
                tintColor="#59bcb1"
                backgroundColor="#d6eed9"
              >
                {(fill) => (
                  <ThemedView>
                    <ThemedText style={styles.fillSmall}>{12}</ThemedText>
                  </ThemedView>
                )}
              </AnimatedCircularProgress>
              <AnimatedCircularProgress
                style={{ marginRight: 5, marginBottom: 10 }}
                rotation={210}
                arcSweepAngle={300}
                size={43}
                width={5}
                fill={80}
                tintColor="#59bcb1"
                backgroundColor="#d6eed9"
              >
                {(fill) => (
                  <ThemedView>
                    <ThemedText style={styles.fillSmall}>{13}</ThemedText>
                  </ThemedView>
                )}
              </AnimatedCircularProgress>
              <AnimatedCircularProgress
                style={{ marginRight: 5, marginBottom: 10 }}
                size={43}
                width={5}
                fill={100}
                tintColor="#59bcb1"
                backgroundColor="#d6eed9"
              >
                {(fill) => (
                  <ThemedView>
                    <ThemedText style={styles.fillSmall}>{14}</ThemedText>
                  </ThemedView>
                )}
              </AnimatedCircularProgress>
              <AnimatedCircularProgress
                style={{ marginRight: 5, marginBottom: 10 }}
                size={43}
                width={5}
                fill={30}
                tintColor="#59bcb1"
                backgroundColor="#d6eed9"
              >
                {(fill) => (
                  <ThemedView>
                    <ThemedText style={styles.fillSmall}>{15}</ThemedText>
                  </ThemedView>
                )}
              </AnimatedCircularProgress>
              <AnimatedCircularProgress
                style={{ marginRight: 5, marginBottom: 10 }}
                size={43}
                width={5}
                fill={90}
                tintColor="#59bcb1"
                backgroundColor="#d6eed9"
              >
                {(fill) => (
                  <ThemedView>
                    <ThemedText style={styles.fillSmall}>{16}</ThemedText>
                  </ThemedView>
                )}
              </AnimatedCircularProgress>
              <AnimatedCircularProgress
                style={{ marginRight: 5, marginBottom: 10 }}
                size={43}
                width={5}
                fill={80}
                tintColor="#59bcb1"
                backgroundColor="#d6eed9"
              >
                {(fill) => (
                  <ThemedView>
                    <ThemedText style={styles.fillSmall}>{17}</ThemedText>
                  </ThemedView>
                )}
              </AnimatedCircularProgress>
              <AnimatedCircularProgress
                style={{ marginRight: 5, marginBottom: 10 }}
                size={43}
                width={5}
                fill={70}
                tintColor="#59bcb1"
                backgroundColor="#d6eed9"
              >
                {(fill) => (
                  <ThemedView>
                    <ThemedText style={styles.fillSmall}>{18}</ThemedText>
                  </ThemedView>
                )}
              </AnimatedCircularProgress>
              <AnimatedCircularProgress
                style={{ marginRight: 5, marginBottom: 10 }}
                size={43}
                width={5}
                fill={60}
                tintColor="#59bcb1"
                backgroundColor="#d6eed9"
              >
                {(fill) => (
                  <ThemedView>
                    <ThemedText style={styles.fillSmall}>{19}</ThemedText>
                  </ThemedView>
                )}
              </AnimatedCircularProgress>
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
  pedoContainer: {
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginTop: 20,
    borderRadius: 10,
    padding: 15,
  },
  step: {
    fontFamily: "Nunito_500Regular",
    fontSize: 16,
    textAlign: "center",
  },
  fill: {
    fontFamily: "Nunito_700Bold",
    fontSize: 50,
    textAlign: "center",
  },
  fillSmall: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 12,
    textAlign: "center",
  },
  description: {
    color: "#616161",
    marginTop: 20,
  },
  list: {
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    color: "#212121",
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
  dialog: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    marginHorizontal: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  dialogTitle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 20,
    color: "#F75555",
    textAlign: "center",
    paddingVertical: 10,
  },
  dialogText: {
    fontFamily: "Nunito_400Regular",
    fontSize: 20,
    color: "#212121",
    textAlign: "center",
    paddingVertical: 30,
    borderBottomColor: "#EEE",
    borderBottomWidth: 1,
    borderTopColor: "#EEE",
    borderTopWidth: 1,
    marginBottom: 10,
  },
  nextButton: {
    marginLeft: "5%",
    paddingVertical: 10,
    justifyContent: "center",
    width: "47%",
    borderRadius: 50,
    backgroundColor: "#59BCB1",
  },
  skipButton: {
    paddingVertical: 10,
    justifyContent: "center",
    width: "47%",
    borderRadius: 50,
    backgroundColor: "#EEEFE7",
  },
  textButton: {
    color: "white",
    fontFamily: "Nunito_600SemiBold",
    fontSize: 16,
  },
  textSkipButton: {
    color: "#59BCB1",
    fontFamily: "Nunito_600SemiBold",
    fontSize: 16,
  },
});
