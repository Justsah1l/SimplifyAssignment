import { View, Text,Image, BackHandler, TouchableOpacity,StyleSheet, FlatList } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import {  useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../params/RootStackParamList';
import FIcon from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Cart'>;
const Wishlist = () => {
    const navigation = useNavigation<NavigationProp>();

    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        fetchwishlistItems();
      }, []);

      useFocusEffect(
        useCallback(() => {
          const backAction = () => {
            navigation.replace('Home');
            return true;
          };
      
          const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
          return () => backHandler.remove();
        }, [])
      );
      
    
      const fetchwishlistItems = async () => {
        const storedCart = await AsyncStorage.getItem('wishlist');
        const cart = storedCart ? JSON.parse(storedCart) : [];
        setCartItems(cart);
      };
      const toggleWishlistItem = async (item) => {
        try {
          const storedWishlist = await AsyncStorage.getItem('wishlist');
          let wishlist = storedWishlist ? JSON.parse(storedWishlist) : [];
      
          const index = wishlist.findIndex(i => i.id === item.id);
      
          if (index !== -1) {
            wishlist.splice(index, 1);
          } else {
            wishlist.push(item);
          }
      
          await AsyncStorage.setItem('wishlist', JSON.stringify(wishlist));
          fetchwishlistItems();
          
        } catch (error) {
          console.error('Error updating wishlist:', error);
        }
};

      const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.itemContainer} onPress={() => navigation.navigate('Detail', { item })}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <View style={styles.details}>
            <Text style={styles.name}>{item.title}</Text>
            
            
          </View>
          <TouchableOpacity onPress={() => toggleWishlistItem(item)} style={styles.deleteBtn}>
            <FIcon name="heart" size={24} color="red" />
          </TouchableOpacity>
        </TouchableOpacity>
      );
      
  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={30} color="#000" />
      </TouchableOpacity>
        <Text style={styles.title}>Your Wishlist</Text>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>Your Wishlist is empty</Text>}
      />
    </View>
  )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 15,
      },
      backButton: {
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 10, 
      },
      emptyText: {
        fontFamily: 'circular-black',
        textAlign: 'center',
        marginTop: 30,
        fontSize: 16,
        color: '#333',
      },
      title: {
        fontFamily: 'circular-black',
        fontSize: 29,
        color: '#333',
        marginVertical:26,
      },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
      },
      image: {
        width: 70,
        height: 70,
        borderRadius: 8,
      },
      details: {
        flex: 1,
        marginLeft: 15,
      },
      deleteBtn: {
        padding: 5,
      },
      name: {
        fontSize: 16,
        color: '#333',
        fontWeight: '600',
        fontFamily: 'circular-black',
      },
      price: {
        fontSize: 14,
        color: '#333',
        marginVertical: 4,
        fontFamily: 'circular-black',
      },

});

export default Wishlist