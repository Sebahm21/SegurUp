import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import LoadingScreen from './screens/LoadingScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import Home from './screens/Home'; // ojo: la H debe ser mayúscula en el import

export default function RootLayout() {
  const [screen, setScreen] = useState<'loading' | 'welcome' | 'home'>('loading');

  useEffect(() => {
    const timer = setTimeout(() => {
      setScreen('welcome'); // después de 2s va al Welcome
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const renderScreen = () => {
    switch (screen) {
      case 'loading':
        return <LoadingScreen />;
      case 'welcome':
        return <WelcomeScreen onContinue={() => setScreen('home')} />;
      case 'home':
        return <Home />;
    }
  };

  return <View style={{ flex: 1 }}>{renderScreen()}</View>;
}
