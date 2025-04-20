import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/Colors';
import { useColorScheme } from '../../../hooks/useColorScheme';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Dropdown } from 'react-native-element-dropdown';
import { Icon } from '@rneui/themed';
import { useTranslation } from 'react-i18next';


export default function HomeScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();

  const [currentStepCount] = useState(0);
  const [todayStepCount] = useState(0);
  const [data] = useState<any>({ stepgoal: 6000 });
  const [loading] = useState(false);

  // Fungsi renderItem untuk Dropdown
  const renderItem = (item: { label: string; value: string }) => (
    <ThemedView style={styles.item}>
      <ThemedText style={styles.textItem}>{item.label}</ThemedText>
    </ThemedView>
  );

  return (
    <SafeAreaView
      edges={["right", "bottom", "left"]}
      style={{
        paddingTop: 10,
        flex: 1,
        backgroundColor: Colors[colorScheme ?? "light"].background,
      }}
    >
      {/* Seluruh isi tampilan utama HomeScreen di sini, pastikan semua tag JSX terbuka dan tertutup dengan benar */}
      {/* ... (lanjutan kode yang sudah ada, pastikan struktur JSX benar) ... */}
      {/* Tempelkan seluruh struktur JSX HomeScreen yang valid di sini */}
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
              fill={(currentStepCount + todayStepCount) / data?.stepgoal || 6000}
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
                    {(currentStepCount + todayStepCount).toLocaleString()}
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
                {data?.stepgoal}
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
                {data?.distance}
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
