import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const existingCart = await AsyncStorage.getItem('@cart_items');
        const items = existingCart ? JSON.parse(existingCart) : [];
        setCartItems(items);
        console.log('Cart items retrieved:', items);
      } catch (e) {
        console.error(e);
      }
    };

    fetchCartItems();
  }, []);

  const removeFromCart = async (item) => {
    try {
      const existingCart = await AsyncStorage.getItem('@cart_items');
      const cartItems = existingCart ? JSON.parse(existingCart) : [];
      const updatedCart = cartItems.filter(cartItem => cartItem.id !== item.id);
      await AsyncStorage.setItem('@cart_items', JSON.stringify(updatedCart));
      setCartItems(updatedCart);
      console.log('Item removed from cart:', item);
      console.log('Updated cart:', updatedCart);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.cartScreen}>
      <Text style={styles.checkoutTitle}>CHECKOUT</Text>
      <FlatList
        data={cartItems}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image source={{ uri: item.image }} style={styles.cartItemImage} />
            <View style={styles.cartItemInfo}>
              <Text>{item.name}</Text>
              <Text>{item.description}</Text>
              <Text style={styles.price}>${item.price}</Text>
            </View>
            <TouchableOpacity onPress={() => removeFromCart(item)}>
              <Image source={require('../assets/remove.png')} style={styles.removeButton} />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.cartList}
      />
      <View style={styles.checkoutFooter}>
        <Text style={styles.totalText}>EST. TOTAL</Text>
        <Text style={styles.totalPrice}>
          ${cartItems.reduce((total, item) => total + parseFloat(item.price), 0)}
        </Text>
        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutButtonText}>CHECKOUT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cartScreen: {
    flex: 1,
    padding: 10,
  },
  checkoutTitle: {
    fontSize: 24,
    marginBottom: 20,
  },
  cartList: {
    flexGrow: 0,
    marginBottom: 20,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cartItemImage: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  cartItemInfo: {
    flexGrow: 1,
  },
  price: {
    color: '#ff6347',
  },
  removeButton: {
    width: 24,
    height: 24,
  },
  checkoutFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 16,
  },
  totalPrice: {
    fontSize: 24,
    color: '#ff6347',
  },
  checkoutButton: {
    backgroundColor: '#000',
    padding: 10,
  },
  checkoutButtonText: {
    color: '#fff',
  },
});

export default CartScreen;
