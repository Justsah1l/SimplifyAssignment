import { View, Text,Image, BackHandler,StyleSheet, TouchableOpacity, Alert, Modal, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import FIcon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
const Detail = ({ route}) => {
const navigation = useNavigation();
const [wishlist, setWishlist] = useState([]);
const [quantity, setquantity] = useState(1);
const [price, setprice] = useState(0);
const [isModalVisible, setIsModalVisible] = useState(false);


const { item } = route.params;
useEffect(() => {
    setprice(item.price)
    const fetchWishlist = async () => {
        const stored = await AsyncStorage.getItem('wishlist');
        const parsed = stored ? JSON.parse(stored) : [];
        setWishlist(parsed);
      };
      fetchWishlist()
    const onBackPress = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => backHandler.remove();
    
  }, []);

  const isInWishlist = (id) => {
    return wishlist.some(i => i.id === id);
  };
  const remove = () => {
    if(quantity > 1)
    setquantity(quantity - 1)
  }
  const add = () => {
    setquantity(quantity + 1)
  }

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
      setWishlist(wishlist); 
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
};

const addToCart = async (product) => {
    try {
      const storedCart = await AsyncStorage.getItem('cart');
      let cart = storedCart ? JSON.parse(storedCart) : [];
  
      const index = cart.findIndex(item => item.id === product.id);
  
      if (index !== -1) {
        cart[index].quantity += quantity;
      } else {
        cart.push({ ...product, quantity: quantity });
      }
  
      await AsyncStorage.setItem('cart', JSON.stringify(cart));
      setIsModalVisible(true);
    } catch (error) {
        Alert.alert(
            'Error',
            'Something went wrong while adding the item to cart.',
            [
              { text: 'OK', onPress: () => {} }
            ]
          );
      console.error('Error adding to cart:', error);
    }
  };
  const gocartpage = () => {

  }

  return (
    <View style={styles.container}>
        <ScrollView
    contentContainerStyle={{ paddingBottom: 70 }} // add space for Add to Cart button
    showsVerticalScrollIndicator={false}
  >
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={30} color="#000" />
      </TouchableOpacity>
      <Image source={{ uri: item.image }} style={{ width: "100%", height: 280, backgroundColor: '#fff' }} resizeMode="contain" />
      <View style={styles.subcon}>
      <View>
      <Text style={styles.title}>{item.title}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center',marginTop:10 }}>
        <Text style={styles.title}>{item.rating.rate}</Text>
            <View style={{ flexDirection: 'row', marginLeft: 10, }}>
            {Array.from({ length: Math.round(item.rating.rate) }).map((_, index) => (
            <Icon key={index} name="star" size={19} color="#4a221b" style={{ marginHorizontal: 1 }} />
            ))}
            </View>
            <TouchableOpacity style={styles.heartIcon} onPress={() => toggleWishlistItem(item)}>
            {isInWishlist(item.id) ? (
          <FIcon name="heart" size={25} color="red" />
        ) : (
            <FIcon name="hearto" size={25} color="red"  />
         
        )}
        </TouchableOpacity>
            
     </View>
     <Text style={{fontWeight:'bold'}}>({item.rating.count} reviews)</Text>
     <View style={styles.category}>
        <Text style={{fontFamily: 'circular-black',color:'white'}}>{item.category}</Text>
     </View>
     <Text style={styles.description}>{item.description}</Text>
     
     <View style={styles.quantityControls}>
            <TouchableOpacity style={styles.qtyButton} onPress={() => remove()}>
              <Ionicons name="remove" size={18} color="black" />
            </TouchableOpacity>
            <Text style={styles.qtyText}>{quantity}</Text>
            <TouchableOpacity style={styles.qtyButton} onPress={() => add()}>
              <Ionicons name="add" size={18} color="white" />
            </TouchableOpacity>
            <View style={{marginLeft: 'auto',marginRight: 20}}>
                <Text style={{fontFamily: 'circular-black',color:'black',fontSize:20}}>₹{price*quantity}</Text>
            </View>
    </View>
    </View>
    

  
    </View>
    </ScrollView>
    <TouchableOpacity style={styles.cart} onPress={() => addToCart(item)} >
    <Text style={{ fontFamily: 'circular-black', color: 'white', fontSize: 20 }}>Add To Cart</Text>
  </TouchableOpacity>

  <Modal
  transparent={true}
  animationType="fade"
  visible={isModalVisible}
  onRequestClose={() => setIsModalVisible(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <TouchableOpacity style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
        <Text style={styles.closeText}>×</Text>
      </TouchableOpacity>
      
      <Text style={styles.modalText}>Item added to cart!{'\n'}Please visit the cart page to checkout</Text>
      <TouchableOpacity style={styles.gocart} onPress={() => gocartpage()} >
    <Text style={{ fontFamily: 'circular-black', color: 'white', fontSize: 20 }}>Go To Cart</Text>
  </TouchableOpacity>
    </View>
  </View>
</Modal>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#e6dbd1',
      position: 'relative',
    },
    backButton: {
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 10, 
      },
    gocart:{
       
        marginTop:10,
        paddingVertical:11,
        paddingHorizontal:20,
        borderRadius: 14,
        marginHorizontal:17,
        backgroundColor: '#6f3c2b',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
      },
      
      modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        position: 'relative',
      },
      
      modalText: {
        marginVertical:10,
        fontSize: 18,
        fontFamily: 'circular-black',
        color: '#333',
      },
      
      closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
      },
      
      closeText: {
        fontSize: 29,
        color: '#999',
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
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e6dbd1',
        marginTop:20,
        
      },
      
      qtyButton: {
        width: 40,
        height: 40,
        borderRadius: 14,
        backgroundColor: '#6f3c2b',
        justifyContent: 'center',
        alignItems: 'center',
      },
      
      qtyText: {
        color: 'black',
        fontSize: 19,
        fontWeight: 'bold',
        marginHorizontal: 8,
      },
    category:{
        borderRadius: 9,
        backgroundColor: '#4a221b',
        paddingVertical:7,
        paddingHorizontal:10,
        alignSelf: 'flex-start',
        marginVertical:10,

       
    },
    heartIcon:{
        marginLeft: 'auto',
        marginRight: 20
    },
    title: {
        fontFamily: 'circular-black',
        fontSize: 22,
        color: '#333',
        marginBottom: 5,
      },
      description: {
        fontFamily: 'circular-black',
        fontSize: 15,
        color: '#333',
        marginBottom: 5,
        marginTop: 9,
      },
      subcon:{
        marginTop: -28,
        backgroundColor: '#e6dbd1',
        borderTopStartRadius:21,
        borderEndStartRadius:21,
        padding:17,
        flex:1,
        
      },

      price: {
        fontSize: 16,
        fontFamily: 'circular-black',
        color: '#000',
      },
});


export default Detail