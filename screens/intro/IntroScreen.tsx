import React, { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Dimensions, Text, Image } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import SliderIntro from 'react-native-slider-intro';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { Colors } from '@/constants/Colors';

const deviceMaxHeight = Dimensions.get('screen').height;
const { width, height } = Dimensions.get('window');

const renderNextButton = () => (
  <ThemedView style={styles.nextButton}>
    <ThemedText style={styles.textButton}>Next</ThemedText>
  </ThemedView>
);
const renderDoneButton = () => (
  <ThemedView style={styles.doneButton}>
    <ThemedText style={styles.textButton}>Done</ThemedText>
  </ThemedView>
);
const renderPreviousButton = () => (
  <ThemedView style={styles.skipButton}>
    <ThemedText style={styles.textSkipButton}>Skip</ThemedText>
  </ThemedView>
);

import { useLayoutEffect } from 'react';

export default function IntroScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const colorScheme = useColorScheme();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    AsyncStorage.setItem('hasSeenIntro', 'true');
  }, []);

  const onCloseButton = () => {
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: 'SigninScreen' }] })
    );
  };

  return (
    <SliderIntro
      navContainerMaxSizePercent={0.2}
      dotWidth={0}
      numberOfSlides={2}
      onDone={onCloseButton}
      onSkip={onCloseButton}
      renderNextButton={renderNextButton}
      renderDoneButton={renderDoneButton}
      renderSkipButton={renderPreviousButton}
    >
      {[
        {
          index: 1,
          title: {
            title: 'GreenSteps',
            subtitle: t('introSubtitle'),
          },
          text: t('introDescription'),
          image: require('@/assets/images/intro1.png'),
        },
        {
          index: 2,
          title: {
            title: '',
            subtitle: t('introSubtitle2'),
          },
          text: t('introDescription2'),
          image: require('@/assets/images/intro2.png'),
        },
      ].map(({ title, text, image }, index) => {
        const slideHeight = deviceMaxHeight * 0.75;
        return (
          <ThemedView style={{ backgroundColor: '#FFFFFF', width: width }} key={index}>
            <ThemedView style={[{ backgroundColor: '#FFFFFF' }, styles.slide]}>
              <ThemedView
                style={[
                  styles.container,
                  {
                    backgroundColor: '#FFFFFF',
                    height: slideHeight,
                    maxHeight: slideHeight,
                  },
                ]}
              >
                {image && <Image style={styles.image} source={image} />}
                <ThemedView style={[{ backgroundColor: '#FFFFFF' }, styles.textContainer]}>
                  {title?.title && (
                    <ThemedText type='title' style={styles.title}>
                      {title?.title}
                    </ThemedText>
                  )}
                  <ThemedText style={styles.subtitle}>{title?.subtitle}</ThemedText>
                  <ThemedText style={styles.text}>{text}</ThemedText>
                </ThemedView>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        );
      })}
    </SliderIntro>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
    marginTop: 0,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    maxHeight: height * 0.6,
  },
  slide: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  textContainer: {
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 32,
    fontFamily: 'Nunito_600SemiBold',
    textAlign: 'center',
  },
  image: {
    maxWidth: width,
    maxHeight: 500,
  },
  text: {
    paddingTop: 10,
    fontSize: 17,
    lineHeight: 26,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
  },
  skipButton: {
    flex: 1,
    marginBottom: 20,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 150,
    borderRadius: 50,
    backgroundColor: '#EEEFE7',
  },
  nextButton: {
    flex: 1,
    marginBottom: 20,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 150,
    borderRadius: 50,
    backgroundColor: '#59BCB1',
  },
  doneButton: {
    flex: 1,
    marginBottom: 20,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 150,
    borderRadius: 50,
    backgroundColor: '#59BCB1',
  },
  textButton: {
    color: 'white',
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 16,
  },
  textSkipButton: {
    color: '#59BCB1',
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 16,
  },
});