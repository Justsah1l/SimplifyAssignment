import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet, Alert, Image, Animated } from 'react-native';
import { RootStackParamList } from '../params/RootStackParamList';
import Icon from 'react-native-vector-icons/Entypo';
type SplashScreenProps = NativeStackScreenProps<RootStackParamList, 'Splashscreen'>;





const Splashscreen = ({navigation}:SplashScreenProps) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        const timer = setTimeout(async () => {
            navigation.navigate('Home' as never);
        }, 2000); 
      
        return () => clearTimeout(timer);
      }, []);
      
      useEffect(() => {
        Animated.timing(fadeAnim, {
          toValue: 1, 
          duration: 2000, 
          useNativeDriver: true, 
        }).start();
      }, [fadeAnim]);
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.column, { opacity: fadeAnim }]}>
        <View style={styles.row}>
    <Text style={styles.title}>Simply</Text>
    <Icon name="shopping-basket" size={50} color="black" style={{ marginLeft: 10 }} />
    </View>
    <Text style={[styles.title,{marginLeft:50}]}>Store</Text>
    
  </Animated.View>
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  
  title: {
    color: 'black',
    fontFamily:'circular-black',
    fontSize: 45,
    
    
  },
  
});

export default Splashscreen;
