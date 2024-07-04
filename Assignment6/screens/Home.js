import {
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Images from "../constants/Images";
import { Items } from "../../Data/MockupData";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.log(e);
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

export default function HomeScreen() {
  const navigation = useNavigation();
  const [Cart, setCart] = useState([]);

  useFocusEffect(
    useCallback(() => {
      getData("Cart").then((data) => {
        setCart(data || []);
      });
    }, [])
  );

  const handleAddToCart = async (item) => {
    const itemExists = Cart.some((cartItem) => cartItem.id === item.id);
    if (!itemExists) {
      const updatedCart = [...Cart, item];
      setCart(updatedCart);
      await storeData("Cart", updatedCart);
    }
  };

  const renderItem = ({ item }) => (
    <View style={{ width: "50%", padding: 3 }}>
      <View style={{ width: "100%", height: 200 }}>
        <ImageBackground
          resizeMode="contain"
          source={item.image}
          style={{
            justifyContent: "flex-end",
            alignItems: "flex-end",
            width: "100%",
            height: "100%",
          }}
        >
          <Pressable onPress={() => handleAddToCart(item)}>
            <Image style={{ margin: 5 }} source={Images.add_circle} />
          </Pressable>
        </ImageBackground>
      </View>
      <View>
        <Text style={{ fontSize: 16 }}>{item.name}</Text>
        <Text>{item.description}</Text>
        <Text style={{ fontSize: 18, color: "orange" }}>${item.price}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ width: "100%", flex: 1 }}>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Image source={Images.Menu} />
          <Image source={Images.Logo} />
          <View style={{ flexDirection: "row", gap: 15 }}>
            <Image source={Images.Search} />
            <Pressable onPress={() => navigation.navigate("CheckoutScreen")}>
              <ImageBackground
                style={{
                  width: 24,
                  height: 24,
                }}
                source={Images.shoppingBag}
              ></ImageBackground>
            </Pressable>
          </View>
        </View>
        <View
          style={{
            marginTop: 20,
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 20 }}>OUR STORY</Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <View
              style={{
                padding: 10,
                backgroundColor: "#F9F9F9",
                borderRadius: 50,
              }}
            >
              <Image source={Images.Listview} />
            </View>
            <View
              style={{
                padding: 10,
                backgroundColor: "#F9F9F9",
                borderRadius: 50,
              }}
            >
              <Image source={Images.Filter} />
            </View>
          </View>
        </View>
        <FlatList
          data={Items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
