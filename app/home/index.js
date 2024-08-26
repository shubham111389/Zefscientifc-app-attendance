import { StyleSheet, Text, View, ScrollView, Pressable ,Image} from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, Entypo, Ionicons, Octicons,MaterialIcons , FontAwesome6,FontAwesome,FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const index = () => {
    const router = useRouter();
  return (
    <ScrollView>
      <LinearGradient colors={["#7F7FD5", "#E9E4F0"]} style={{ flex: 1 }}>
        <View style={{ padding: 18 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Image style={{ width: 45, height: 26 }} source={require('../../assets/logo.png')} />
            <Text style={{ fontSize: 18, fontWeight: "600" }}>
              ZEF SCIENTIFIC IND PVT LTD
            </Text>
            <FontAwesome name="user-circle" size={26} color="black" />
          </View>

          <View style={{ flexDirection: "column", marginTop: 20 }}>
            <View style={{ flexDirection: "row", gap: 20 }}>
              <Pressable
                onPress={() => router.push("/home/Mark_job_register")}
                style={{
                  backgroundColor: "#D3CCE3",
                  padding: 12,
                  borderRadius: 6,
                  alignItems: "center",
                  justifyContent: "center",
                  flex:  1,
                }}
              >
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: "white",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MaterialIcons name="work" size={24} color="black" />
                </View>
               <Text style={{ marginTop: 7, fontWeight: "600" }}>
                  Mark Job Register
                </Text>
              </Pressable>

              <Pressable
                onPress={() => router.push("/home/Mark_Expense_Report")}
                style={{
                  backgroundColor: "#D3CCE3",
                  padding: 12,
                  borderRadius: 6,
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                }}
              >
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: "white",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FontAwesome6 name="wallet" size={24} color="black" />
                </View>
                <Text style={{ marginTop: 7, fontWeight: "600" }}>
                  Mark Expense Report
                </Text>
              </Pressable>
            </View>

            <View style={{ marginTop: 20 }}>
              <Pressable
                style={{
                  backgroundColor: "#D3CCE3", 
                  borderRadius: 6,
                  padding: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <View
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 7,
                    backgroundColor: "white",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FontAwesome5 name="tools" size={24} color="black" />
                </View>
                <Text style={{ marginTop: 7 ,fontWeight: "600"}}>Stock List</Text>
              </Pressable>
            </View>
          </View>
        </View>
        
          <View
            style={{
              marginTop: 8,
              backgroundColor: "white",
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderRadius: 7,
            }}
          >
            <Pressable
              style={{
                backgroundColor: "#BE93C5",
                borderRadius: 6,
                padding: 10,
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 10,
              }}
            >
              <View
                style={{
                  padding: 7,
                  width: 45,
                  height: 45,
                  borderRadius: 7,
                  backgroundColor: "white",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
            <MaterialIcons name="work-outline" size={24} color="black" />
              </View>
              <Text
                style={{
                  marginLeft: 10,
                  fontSize: 16,
                  fontWeight: "600",
                  flex: 1,
                }}
              >
                Job Register Report
              </Text>
              <View
                style={{
                  width: 35,
                  height: 35,
                  borderRadius: 7,
                  backgroundColor: "white",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Entypo name="chevron-right" size={24} color="black" />
              </View>
            </Pressable>
            <Pressable
                onPress={() => router.push("/(home)/summary")}
              style={{
                backgroundColor: "#BE93C5",
                borderRadius: 6,
                padding: 10,
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 10,
              }}
            >
              <View
                style={{
                  padding: 7,
                  width: 45,
                  height: 45,
                  borderRadius: 7,
                  backgroundColor: "white",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialCommunityIcons name="wallet-outline" size={24} color="black" />
              </View>
              <Text
                style={{
                  marginLeft: 10,
                  fontSize: 16,
                  fontWeight: "600",
                  flex: 1,
                }}
              >
              Expenses Report 
              </Text>
              <View
                style={{
                  width: 35,
                  height: 35,
                  borderRadius: 7,
                  backgroundColor: "white",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Entypo name="chevron-right" size={24} color="black" />
              </View>
            </Pressable>
            <Pressable
              style={{
                backgroundColor: "#BE93C5",
                borderRadius: 6,
                padding: 10,
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 10,
              }}
            >
              <View
                style={{
                  padding: 7,
                  width: 45,
                  height: 45,
                  borderRadius: 7,
                  backgroundColor: "white",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialIcons name="my-library-books" size={24} color="black" />
              </View>
              <Text
                style={{
                  marginLeft: 10,
                  fontSize: 16,
                  fontWeight: "600",
                  flex: 1,
                }}
              >
                All Instruments Manuals
              </Text>
              <View
                style={{
                  width: 35,
                  height: 35,
                  borderRadius: 7,
                  backgroundColor: "white",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Entypo name="chevron-right" size={24} color="black" />
              </View>
            </Pressable>
            <Pressable
              style={{
                backgroundColor: "#BE93C5",
                borderRadius: 6,
                padding: 10,
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 10,
              }}
            >
              <View
                style={{
                  padding: 7,
                  width: 45,
                  height: 45,
                  borderRadius: 7,
                  backgroundColor: "white",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialCommunityIcons name="lightbulb-group-outline" size={24} color="black" />
              </View>
              <Text
                style={{
                  marginLeft: 10,
                  fontSize: 16,
                  fontWeight: "600",
                  flex: 1,
                }}
              >
               Engineers Experiences 
              </Text>
              <View
                style={{
                  width: 35,
                  height: 35,
                  borderRadius: 7,
                  backgroundColor: "white",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Entypo name="chevron-right" size={24} color="black" />
              </View>
            </Pressable>
          </View>
          <View
            style={{
              marginTop: 20,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            <View
              style={{
                backgroundColor: "#99e599",
                borderRadius: 6,
                padding: 12,
                alignItems: "center",

                justifyContent: "center",
                flex: 1,
              }}
            >
              <View
                style={{
                  width: 35,
                  height: 35,
                  borderRadius: 7,
                  backgroundColor: "white",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialCommunityIcons
                  name="guy-fawkes-mask"
                  size={24} 
                  color="black"
                />
              </View>
              <Text style={{ marginTop: 7,fontWeight:"600" }}> Request Leave</Text>
            </View>
            <View
              style={{
                backgroundColor: "#99e599",
                borderRadius: 6,
                padding: 12,
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
              }}
            >
              <View
                style={{
                  width: 35,
                  height: 35,
                  borderRadius: 7,
                  backgroundColor: "white",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialCommunityIcons name="tools" size={24} color="black" />
              </View>
              <Text style={{ marginTop: 7,fontWeight:"600" }}>Request Parts</Text>
            </View>
          </View>
          <View
            style={{
              marginTop: 20,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}
          >
        
          
            
            
          </View>
        
    <View style={{ alignItems: "center", marginTop: 10 }}>
      <Text style={{ color: "#36454F", fontSize: 12 }}>
        © 2024 ZEF SCIENTIFIC IND PVT LTD. All rights reserved.
      </Text>
      <View style={{ flexDirection: "row", marginTop: 12 }}>
        <FontAwesome
          name="facebook"
          size={24}
          color="Gray"
          style={{ marginHorizontal: 10 }}
        />
        <FontAwesome
          name="twitter"
          size={24}
          color="Gray"
          style={{ marginHorizontal: 10 }}
        />
        <FontAwesome
          name="linkedin"
          size={24}
          color="Black"
          style={{ marginHorizontal: 10 }}
        />
        <FontAwesome
          name="instagram"
          size={24}
          color="Black"
          style={{ marginHorizontal: 10 }}
        />
      </View>
    </View>
  
          
        
      </LinearGradient>
    </ScrollView>
  );
};

export default index;

const styles = StyleSheet.create({});