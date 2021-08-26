import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './src/hooks/useCachedResources';
import useColorScheme from './src/hooks/useColorScheme';
import Navigation from './src/navigation';
import AppContext from "./src/utils/AppContext";

import Amplify from 'aws-amplify';
import config from './aws-exports';
Amplify.configure(config);

export default function App() {
  const [userId, setUserId] = useState(null);
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();


  useEffect(() => {
    console.log("User id is updated 🔥", userId);
  }, [userId]);


  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
    {/*// @ts-ignore*/}
        <AppContext.Provider value={{userId, setUserId}}>
          <Navigation colorScheme={colorScheme} />
          <StatusBar style="auto" />
        </AppContext.Provider>
      </SafeAreaProvider>
    );
  }
}

