import { View, Text ,StyleSheet,Image, TouchableOpacity, BackHandler, FlatList} from 'react-native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../params/RootStackParamList';


type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Cart'>;

const Cart = () => {
    const navigation = useNavigation<NavigationProp>();

    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        fetchCartItems();
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
      
    
      const fetchCartItems = async () => {
        const storedCart = await AsyncStorage.getItem('cart');
        const cart = storedCart ? JSON.parse(storedCart) : [];
        setCartItems(cart);
      };
      const addToCart = async (product) => {
        try {
          const storedCart = await AsyncStorage.getItem('cart');
          let cart = storedCart ? JSON.parse(storedCart) : [];
    
          const index = cart.findIndex(item => item.id === product.id);
    
          if (index !== -1) {
            cart[index].quantity += 1;
          } else {
            cart.push({ ...product, quantity: 1 });
          }
    
          await AsyncStorage.setItem('cart', JSON.stringify(cart));
          setCartItems(cart);
        } catch (error) {
          console.error('Error adding to cart:', error);
        }
      };
    
      const removeFromCart = async (productId) => {
        try {
          const storedCart = await AsyncStorage.getItem('cart');
          let cart = storedCart ? JSON.parse(storedCart) : [];
    
          const index = cart.findIndex(item => item.id === productId);
    
          if (index !== -1) {
            cart[index].quantity -= 1;
            if (cart[index].quantity <= 0) {
              cart.splice(index, 1);
            }
          }
    
          await AsyncStorage.setItem('cart', JSON.stringify(cart));
          setCartItems(cart);
        } catch (error) {
          console.error('Error removing from cart:', error);
        }
      };
    
      const deleteItem = async (productId) => {
        try {
          const storedCart = await AsyncStorage.getItem('cart');
          let cart = storedCart ? JSON.parse(storedCart) : [];
    
          cart = cart.filter(item => item.id !== productId);
    
          await AsyncStorage.setItem('cart', JSON.stringify(cart));
          setCartItems(cart);
        } catch (error) {
          console.error('Error deleting item:', error);
        }
      };

      const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <View style={styles.details}>
            <Text style={styles.name}>{item.title}</Text>
            <Text style={styles.price}>₹{item.price * item.quantity}</Text>
            <View style={styles.quantityRow}>
              <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.qBtn}>
                <Ionicons name="remove-circle" size={22} color="#444" />
              </TouchableOpacity>
              <Text style={styles.quantity}>{item.quantity}</Text>
              <TouchableOpacity onPress={() => addToCart(item)} style={styles.qBtn}>
                <Ionicons name="add-circle" size={22} color="#444" />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity onPress={() => deleteItem(item.id)} style={styles.deleteBtn}>
            <Ionicons name="trash" size={24} color="#4a221b" />
          </TouchableOpacity>
        </View>
      );
      const totalAmount = useMemo(() => {
        return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      }, [cartItems]);
  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={30} color="#000" />
      </TouchableOpacity>
      <Text style={styles.title}>Your Cart</Text>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>Your cart is empty</Text>}
      />
      <TouchableOpacity style={styles.cart} onPress={() => {}} >
    <Text style={{ fontFamily: 'circular-black', color: 'white', fontSize: 17 }}>Checkout, Total: ₹{totalAmount}</Text>
  </TouchableOpacity>
    </View>
  )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 15,
    },
    cart:{
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
        marginTop:10,
        paddingVertical:11,
        borderRadius: 14,
        marginHorizontal:17,
        backgroundColor: '#6f3c2b',
        justifyContent: 'center',
        alignItems: 'center',
          
    },
    title: {
        fontFamily: 'circular-black',
        fontSize: 29,
        color: '#333',
        marginVertical:26,
      },
    backButton: {
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 10, 
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
    quantityRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    quantity: {
      marginHorizontal: 10,
      fontSize: 16,
    },
    qBtn: {
      padding: 5,
    },
    deleteBtn: {
      padding: 5,
    },
    emptyText: {
      fontFamily: 'circular-black',
      textAlign: 'center',
      marginTop: 30,
      fontSize: 16,
      color: '#333',
    },
  });
  
export default Cart