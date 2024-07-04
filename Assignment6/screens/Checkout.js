import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Images from "../constants/Images";

const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.log(e);
    return [];
  }
};

const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.log(e);
  }
};

const CheckoutScreen = () => {
  const [Cart, setCart] = useState([]);
  const [sum, setSum] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getData("Cart");
      setCart(data || []);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const calculateSum = () => {
      const total = Cart.reduce((acc, item) => acc + item.price, 0);
      setSum(total);
    };
    calculateSum();
  }, [Cart]);

  const handleRemoveFromCart = async (id) => {
    const updatedCart = Cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    await storeData("Cart", updatedCart);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image
        resizeMode="contain"
        style={styles.itemImage}
        source={item.image}
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <Text style={styles.itemPrice}>${item.price}</Text>
        <Pressable onPress={() => handleRemoveFromCart(item.id)}>
          <Image style={styles.removeIcon} source={Images.remove} />
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={Images.Logo} />
        <Image source={Images.Search} />
      </View>
      <View style={styles.title}>
        <Text style={styles.titleText}>CHECKOUT</Text>
      </View>
      <FlatList
        style={styles.flatList}
        data={Cart}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>EST. TOTAL</Text>
        <Text style={styles.totalAmount}>${sum}</Text>
      </View>
      <View style={styles.checkoutButton}>
        <Text style={styles.checkoutText}>CHECKOUT</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    paddingBottom: 80,
    backgroundColor: "#fff",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  titleText: {
    fontSize: 28,
    fontWeight: "300",
  },
  flatList: {
    flex: 1,
    width: "100%",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  itemImage: {
    width: 120,
    height: 180,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 16,
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 18,
    color: "#BAB02C",
    marginBottom: 10,
  },
  removeIcon: {
    width: 24,
    height: 24,
    alignSelf: "flex-end",
  },
  totalContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  totalText: {
    fontSize: 18,
  },
  totalAmount: {
    fontSize: 20,
    color: "orange",
  },
  checkoutButton: {
    position: "absolute",
    bottom: 0,
    width: Dimensions.get("screen").width,
    height: 60,
    backgroundColor: "#000",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  checkoutIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  checkoutText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "300",
  },
});

export default CheckoutScreen;
