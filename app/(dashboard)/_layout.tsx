// DashboardLayout.tsx
import { MaterialIcons } from "@expo/vector-icons";
import type { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";

const tabs = [
  { label: "Home", name: "home", icon: "home" },
  { label: "Reports", name: "reports", icon: "bar-chart" },
  { label: "Add", name: "add", icon: "add" }, // Middle button
  { label: "Transactions", name: "transactions", icon: "receipt" },
  { label: "Profile", name: "profile", icon: "person" },
] as const;

const DashboardLayout = () => {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#10B981",
        tabBarInactiveTintColor: "#64748B",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 1,
          borderTopColor: "#E2E8F0",
          height: 85,
          paddingTop: 8,
          paddingBottom: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 10,
        },
        tabBarButton:
          route.name === "add"
            ? ({ accessibilityState, onPress }: BottomTabBarButtonProps) => (
                <TouchableOpacity
                  onPress={onPress}
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View className="w-14 h-14 bg-emerald-500 rounded-full items-center justify-center shadow-lg -mt-4">
                    <MaterialIcons name="add" color="white" size={28} />
                  </View>
                </TouchableOpacity>
              )
            : undefined,
      })}
    >
      {tabs.map(({ name, icon, label }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title: label,
            tabBarLabel: name === "add" ? "" : label,
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name={icon as any} color={color} size={size} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
};

export default DashboardLayout;
