/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splashscreen from './screens/Splashscreen';
import HomeScreen from './screens/Home';
import Detail from './screens/Detail';
import Cart from './screens/Cart';
import Wishlist from './screens/Wishlist';


const Stack = createNativeStackNavigator(); 




function App() {
  return (  
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splashscreen">
        <Stack.Screen
          name="Splashscreen"
          component={Splashscreen}
          options={{ headerShown: false }} 
        />
         <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }} 
        />
        <Stack.Screen
          name="Detail"
          component={Detail}
          options={{ headerShown: false }} 
        />
        <Stack.Screen
          name="Cart"
          component={Cart}
          options={{ headerShown: false }} 
        />
        <Stack.Screen
          name="Wishlist"
          component={Wishlist}
          options={{ headerShown: false }} 
        />
        
        
      </Stack.Navigator>
    </NavigationContainer>

  );
}

export default App;