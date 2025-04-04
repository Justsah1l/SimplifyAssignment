import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {StyleSheet, View,Text, TouchableOpacity, Animated, TextInput, Easing,Image, FlatList, Modal, ActivityIndicator, Alert, BackHandler } from 'react-native';
import { RootStackParamList } from '../params/RootStackParamList';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import FIcon from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Slider from '@react-native-community/slider';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  
        const [products, setProducts] = useState([]);
        const [loading, setLoading] = useState(false); 
        const [dynamicPlaceholder, setDynamicPlaceholder] = useState('Authentic clothes');
        const [isFocused, setIsFocused] = useState(false);
        const [searchQuery, setSearchQuery] = useState('');
        const [cartCount, setCartCount] = useState(0);
        const [wishlist, setWishlist] = useState([]);
        const [cartItems, setCartItems] = useState([]);
        const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
        const [selectedCategory, setSelectedCategory] = useState('');
        const [selectedRating, setSelectedRating] = useState('');
        const [priceRange, setPriceRange] = useState([1, 1000]);
        const [activeFilterTab, setActiveFilterTab] = useState('Price');
        const slideAnim = useRef(new Animated.Value(0)).current;
        
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
              setCartCount(cart.reduce((acc, item) => acc + item.quantity, 0));
              setCartItems(cart); // optional, for rendering
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
    setCartCount(cart.reduce((acc, item) => acc + item.quantity, 0));
    setCartItems(cart);
  } catch (error) {
    console.error('Error removing from cart:', error);
  }}

        useEffect(() => {
            let index = 0;
        
            const cyclePlaceholder = () => {
            if (!isFocused && searchQuery === '') {
            Animated.timing(translateYAnim, {
                toValue: 10, 
                duration: 300,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start(() => {
                index = (index + 1) % placeholderOptions.length;
                setDynamicPlaceholder(placeholderOptions[index]);
                translateYAnim.setValue(-11);
                Animated.timing(translateYAnim, {
                toValue: 0, 
                duration: 200,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
                }).start();
            });
            }
            };
            
            
        
            const interval = setInterval(cyclePlaceholder, 2200); 
            return () => clearInterval(interval);
        }, []);
        const translateYAnim = useRef(new Animated.Value(0)).current;
        const placeholderOptions = ['Mens wear', 'Quality clothes', 'Trendy fashion', 'Top brands'];


        useEffect(() => {
        const fetchProducts = async () => {
            try {
            setLoading(true)
            const response = await axios.get('https://fakestoreapi.com/products');
            setProducts(response.data);
            console.log('Stored Products:', response.data);
            
            } catch (error) {
            console.error('Error fetching products:', error);
           
            } finally{
                setLoading(false)
            }
        };
    
        fetchProducts();
        }, []);


        const getItemQuantity = (id) => {
            const item = cartItems.find(p => p.id === id);
            return item ? item.quantity : 0;
          };

        const openFilterModal = () => {
            setIsFilterModalVisible(true)
        };

        useFocusEffect(
            useCallback(() => {
            const fetchWishlist = async () => {
                const stored = await AsyncStorage.getItem('wishlist');
                const parsed = stored ? JSON.parse(stored) : [];
                setWishlist(parsed);
              };
            
            const fetchCart = async () => {
              const storedCart = await AsyncStorage.getItem('cart');
              const parsedCart = storedCart ? JSON.parse(storedCart) : [];
              setCartItems(parsedCart);
              const totalQuantity = parsedCart.reduce((acc, item) => acc + item.quantity, 0);
              setCartCount(totalQuantity);
            };
          
            fetchCart();
            fetchWishlist();
          }, []))

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

    const isInWishlist = (id) => {
        return wishlist.some(i => i.id === id);
      };
      useFocusEffect(
        useCallback(() => {
          const onBackPress = () => {
            Alert.alert(
              'Exit App',
              'Are you sure you want to exit the app?',
              [
                { text: 'Cancel', onPress: () => null, style: 'cancel' },
                { text: 'Exit', onPress: () => BackHandler.exitApp() },
              ],
              { cancelable: false }
            );
            return true;
          };
      
          const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
          return () => backHandler.remove();
        }, [])
      );
    
      const renderItem = ({ item }) => {
        const quantity = getItemQuantity(item.id);
        return(
        
        <TouchableOpacity style={styles.productBox} onPress={() => navigation.navigate('Detail', { item })}>
          <TouchableOpacity style={styles.heartIcon} onPress={() => toggleWishlistItem(item)}>
        {isInWishlist(item.id) ? (
          <FIcon name="heart" size={20} color="red" />
        ) : (
          <FIcon name="hearto" size={20} color="black" />
        )}
      </TouchableOpacity>
    
          <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="contain" />
    
          <Text numberOfLines={2} style={styles.title}>{item.title}</Text>
    
          <View style={styles.bottomRow}>
            <Text style={styles.price}>₹{item.price}</Text>
            {quantity > 0 ? (
          <View style={styles.quantityControls}>
            <TouchableOpacity style={styles.qtyButton} onPress={() => removeFromCart(item.id)}>
              <Ionicons name="remove" size={18} color="white" />
            </TouchableOpacity>
            <Text style={styles.qtyText}>{quantity}</Text>
            <TouchableOpacity style={styles.qtyButton} onPress={() => addToCart(item)}>
              <Ionicons name="add" size={18} color="white" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>
            <Ionicons name="add" size={18} color="white" />
          </TouchableOpacity>
        )}
          </View>
        </TouchableOpacity>
        
      );}

      const filteredProducts = useMemo(() => {
        let filtered = [...products];
      
        if (searchQuery.trim() !== '') {
          filtered = filtered.filter(product =>
            product.title.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
      
        if (selectedCategory !== '') {
          filtered = filtered.filter(product => product.category === selectedCategory);
        }
      
        filtered = filtered.filter(product => product.price >= priceRange[0] && product.price <= priceRange[1]);
      
        if (selectedRating === 'highToLow') {
          filtered = filtered.sort((a, b) => b.rating.rate - a.rating.rate);
        } else if (selectedRating === 'lowToHigh') {
          filtered = filtered.sort((a, b) => a.rating.rate - b.rating.rate);
        }
      
        return filtered;
      }, [searchQuery, products, selectedCategory, selectedRating, priceRange]);
      
    
  return (
    <View style={styles.container}>
        <View style={styles.nav}>
        <TouchableOpacity  style={{ marginRight: 15 }} onPress={() => navigation.navigate('Cart')}>
            <Icon name="basket-outline" size={40} color="#4a221b" />
                {cartCount > 0 && (
                    <View style={{
                    position: 'absolute',
                    right: -2,
                    top: -2,
                    backgroundColor: '#4a221b',
                    borderRadius: 10,
                    paddingHorizontal: 6,
                    paddingVertical: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    minWidth: 18,
                    }}>
                    <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>{cartCount}</Text>
                    </View>
                )}
        </TouchableOpacity>
        <TouchableOpacity style={{ marginRight: 5, }} onPress={() => navigation.navigate('Wishlist')}>
        <FIcon name="hearto" size={32} color="#4a221b"/>
                {wishlist.length > 0 && (
                    <View style={{
                    position: 'absolute',
                    right: -7,
                    top: -4,
                    backgroundColor: '#4a221b',
                    borderRadius: 10,
                    paddingHorizontal: 6,
                    paddingVertical: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    minWidth: 18,
                    }}>
                    <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>{wishlist.length}</Text>
                    </View>
                )}
        </TouchableOpacity>
        
        
        </View>
        <View style={{maxWidth: 280,marginVertical:10 }}>
        <Text style={{ fontSize: 22 }}>
        <Text style={{ color: 'black', fontFamily: 'circular-regular' }}>Hello user, </Text>
        <Text style={{ color: '#4a221b', fontFamily: 'circular-black' }}>what product you want to buy today?</Text>
        </Text>
        </View>

        <View style={{height:17}}/>
        <View style={styles.rowContainer}>
        <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="gray" style={styles.searchIcon} />
        {!isFocused && searchQuery === '' && (
        <View style={styles.placeholderWrapper}>
        <Text style={styles.constantText}>Search best </Text>
        <Animated.Text
          style={[
            styles.animatedText,
            { transform: [{ translateY: translateYAnim }] },
          ]}
        >
          "{dynamicPlaceholder}"
        </Animated.Text>
        
      </View>
        )}
      <TextInput
        style={styles.searchBox}
        placeholder="" 
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholderTextColor="#80625d"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
         
      </View>
      <View style={{width:10}}/>
      <View style={styles.filtercontainer}>
      <TouchableOpacity onPress={openFilterModal}>
          <Icon name="filter" size={26} color="#fcf4ec" style={styles.searchIcon} />
        </TouchableOpacity>
        </View>
      </View>

      <Text style={{ color: 'black', fontFamily: 'circular-black', marginVertical:10, fontSize:19 }}>Recommended Products</Text>

      <FlatList
      data={filteredProducts}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      numColumns={2}
      contentContainerStyle={{ padding: 10 }}
      columnWrapperStyle={{ justifyContent: 'space-between' }}
        />

    <Modal visible={loading} transparent={true} animationType="fade">
        <View style={styles.modalContainerr}>
          <View style={styles.modalContentt}>
            <ActivityIndicator size="large" color="#4a221b" />
          </View>
        </View>
    </Modal>


    <Modal visible={isFilterModalVisible} animationType="slide" transparent>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
        <View style={{flexDirection:'row'}}>
    <TouchableOpacity
  onPress={() => setIsFilterModalVisible(false)}
  style={{
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 8,
    zIndex: 999,
  }}
>
  <Ionicons name="close" size={28} color="#000" />
    </TouchableOpacity>
      <View style={styles.filterTabs}>
        {['Price', 'Category', 'Rating'].map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveFilterTab(tab)}>
            <Text style={[styles.tabText, activeFilterTab === tab && styles.activeTab]}>
              {tab}
            </Text>
            </TouchableOpacity>
        ))}
      </View>

      <View style={styles.filterContent}>
        {activeFilterTab === 'Price' && (
          <>
            <Text>₹{priceRange[0]} - ₹{priceRange[1]}</Text>
            <Slider
              minimumValue={1}
              maximumValue={1000}
              step={1}
              value={priceRange[1]}
              onValueChange={(value) => setPriceRange([1, value])}
            />
          </>
        )}

        {activeFilterTab === 'Category' && (
          ['women\'s clothing', 'electronics', 'jewelery', 'men\'s clothing'].map((cat) => (
            <TouchableOpacity key={cat} onPress={() => setSelectedCategory(cat)}>
              <Text style={[
                styles.categoryText,
                selectedCategory === cat && styles.activeCategory
              ]}>{cat}</Text>
            </TouchableOpacity>
          ))
        )}

        {activeFilterTab === 'Rating' && (
          <>
            <TouchableOpacity onPress={() => setSelectedRating('highToLow')}>
              <Text style={selectedRating === 'highToLow' && styles.activeRating}>High to Low</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectedRating('lowToHigh')}>
              <Text style={selectedRating === 'lowToHigh' && styles.activeRating}>Low to High</Text>
            </TouchableOpacity>
          </>
        )}
      </View>


      

    </View>
    <View style={styles.modalButtons}>
        <TouchableOpacity
          style={styles.resetBtn}
          onPress={() => {
            setSelectedCategory('');
            setSelectedRating('');
            setPriceRange([1, 1000]);
            setIsFilterModalVisible(false);
          }}
        >
          <Text style={{color:'black', fontFamily: 'circular-black'}}>Reset</Text>
        </TouchableOpacity>
          <View style={{width:10}}/>
        <TouchableOpacity
          style={styles.applyBtn}
          onPress={() => {
            setIsFilterModalVisible(false);
          }}
        >
          <Text style={{color:'white', fontFamily: 'circular-black'}}>Apply</Text>
        </TouchableOpacity>
      </View>
    
    </View>
  </View>
</Modal>
    </View>
    
    
  );
};

     

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',  
    padding:10  
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    height: '40%',
    backgroundColor: '#fff',
    borderRadius: 10,
    flexDirection: 'column',
    padding: 10,
  },
  filterTabs: {
    width: '30%',
    borderRightWidth: 1,
    borderColor: '#ddd',
  },
  filterContent: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical:29,
  },
  tabText: {
    paddingVertical: 10,
    color: '#444',
  },
  activeTab: {
    fontWeight: 'bold',
    color: '#000',
  },
  modalButtons: {
    flexDirection: 'row',
    
    marginTop: 20,
  },
  resetBtn: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  applyBtn: {
    padding: 10,
    height:50,
    backgroundColor: '#4a221b',
    borderRadius: 5,
  },
  categoryText: {
    padding: 8,
  },
  activeCategory: {
    fontWeight: 'bold',
    color: '#000',
  },
  activeRating: {
    fontWeight: 'bold',
    color: '#000',
  },
  modalContainerr: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4a221b',
    borderRadius: 20,
    paddingHorizontal: 7,
    paddingVertical: 5,
  },
  
  qtyButton: {
    width: 17,
    height: 17,
    borderRadius: 14,
    backgroundColor: '#6f3c2b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  qtyText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
  
  modalContentt: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  productBox: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    width: '48%',
    position: 'relative',
  },
  heartIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  productImage: {
    width: '100%',
    height: 100,
    marginTop: 20,
    marginBottom: 10,
  },
  title: {
    fontFamily: 'circular-black',
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontFamily: 'circular-black',
    color: '#000',
  },
  addButton: {
    backgroundColor:'#4a221b',
    borderRadius: 999,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nav:{
    flexDirection: 'row', 
    justifyContent: 'flex-end',
    alignItems:'center', 
    padding: 10
  },
  searchBox: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 17,
    color: 'black',
  },
  placeholderWrapper: {
    flexDirection: 'row',
    position: 'absolute',
    left: 40,
    top: 15,
  },
  constantText: {
    fontFamily: 'circular-regular',
    fontSize: 12,
    fontWeight:'500',
    color: '#80625d',
  },
  animatedText: {
    fontSize: 12,
    fontWeight:'bold',
    color: '#80625d',
    fontFamily: 'circular-regular'
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  filtercontainer:{
    paddingHorizontal:10,
    backgroundColor:'#4a221b',
    paddingVertical:10,
    borderRadius:8,
    
  },
  searchContainer: {
    width:260,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6dbd1',
    borderRadius: 12,
  },
  searchIcon: {
    paddingHorizontal: 10,
  },
  
});

export default HomeScreen;
