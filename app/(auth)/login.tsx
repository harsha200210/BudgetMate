import { Login } from "@/service/authService";
import { useRouter } from "expo-router";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, ShieldCheck, Smartphone, UserCheck, Wallet, Zap } from "lucide-react-native";
import React, { useState } from "react";
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

export default function LoginScreen() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigation = useRouter();

  const handleSignIn = async () => {
    if (!email || !password) {
      Toast.show({
      type: "error",
      text1: "Email and Password required",
      text2: "Please enter your email and password to continue.",
    });
      return;
    }

    setLoading(true);
    try {
      await Login(email, password);
      Toast.show({
        type: "success",
        text1: "Logged in successfully!",
      });
      navigation.push("/home");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Login failed.",
        text2: "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-900">
      {/* Floating background blobs */}
      <View className="absolute inset-0">
        <View className="absolute top-20 left-10 w-32 h-32 bg-emerald-400 rounded-full opacity-10" />
        <View className="absolute top-40 right-20 w-24 h-24 bg-teal-300 rounded-full opacity-15" />
        <View className="absolute bottom-32 left-1/4 w-40 h-40 bg-green-300 rounded-full opacity-10" />
        <View className="absolute top-1/2 right-10 w-16 h-16 bg-emerald-300 rounded-full opacity-10" />
      </View>

      {/* Top Navigation */}
      <View className="flex flex-row justify-between items-center p-6 pt-12">
        <View className="flex-row items-center space-x-2">
          <View className="w-8 h-8 bg-emerald-400 rounded-lg items-center justify-center">
            <Wallet size={20} color="#0f172a" />
          </View>
          <Text className="text-white font-bold text-lg">  BudgetMate</Text>
        </View>
      </View>

      {/* Main Content */}
      <View className="flex-1 items-center justify-center px-6">
        <View className="w-full max-w-md">
          {/* Header */}
          <View className="items-center mb-8">
            <View className="w-16 h-16 bg-white rounded-2xl items-center justify-center mb-6">
              <UserCheck size={32} color="#059669" />
            </View>
            <Text className="text-3xl font-bold text-white mb-2">Welcome Back!</Text>
            <Text className="text-emerald-100">Sign in to continue your financial journey</Text>
          </View>

          {/* Login Card */}
          <View className="bg-white/90 rounded-3xl p-8">
            {/* Email Input */}
            <View className="mb-6">
              <Text className="text-slate-700 font-semibold mb-2">Email Address</Text>
              <View className="flex-row items-center border border-slate-200 rounded-2xl px-4">
                <Mail size={20} color="#94a3b8" />
                <TextInput
                  placeholder="Enter your email"
                  placeholderTextColor="#94a3b8"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  className="flex-1 ml-2 py-3 text-slate-700"
                />
              </View>
            </View>

            {/* Password Input */}
            <View className="mb-6">
              <Text className="text-slate-700 font-semibold mb-2">Password</Text>
              <View className="flex-row items-center border border-slate-200 rounded-2xl px-4">
                <Lock size={20} color="#94a3b8" />
                <TextInput
                  placeholder="Enter your password"
                  placeholderTextColor="#94a3b8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!passwordVisible}
                  className="flex-1 ml-2 py-3 text-slate-700"
                />
                <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                  {passwordVisible ? (
                    <Eye size={20} color="#94a3b8" />
                  ) : (
                    <EyeOff size={20} color="#94a3b8" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
              onPress={handleSignIn}
              disabled={loading} // disable while signing in
              className={`bg-emerald-600 py-4 rounded-2xl items-center mb-6 ${loading ? "opacity-70" : ""}`}
            >
              {loading ? (
                <View className="flex-row items-center">
                  <ActivityIndicator size="small" color="#fff" />
                  <Text className="text-white font-bold text-lg ml-2">Signing in...</Text>
                </View>
              ) : (
                <Text className="text-white font-bold text-lg">Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Sign Up Link */}
            <Text className="text-center text-slate-600 mt-6">
              Don't have an account?{" "}
              <TouchableOpacity onPress={() => navigation.push("/register")}>
                <Text className="text-emerald-600 font-semibold">Sign up here</Text>
              </TouchableOpacity>
            </Text>
          </View>
        </View>

        {/* Quick Benefits */}
        <View className="flex-row justify-between mt-8 w-full max-w-md">
          <View className="items-center flex-1">
            <View className="w-12 h-12 bg-white/10 rounded-2xl items-center justify-center mb-2">
              <Zap size={24} color="#6ee7b7" />
            </View>
            <Text className="text-emerald-100 text-sm">Fast Setup</Text>
          </View>
          <View className="items-center flex-1">
            <View className="w-12 h-12 bg-white/10 rounded-2xl items-center justify-center mb-2">
              <ShieldCheck size={24} color="#6ee7b7" />
            </View>
            <Text className="text-emerald-100 text-sm">Secure Data</Text>
          </View>
          <View className="items-center flex-1">
            <View className="w-12 h-12 bg-white/10 rounded-2xl items-center justify-center mb-2">
              <Smartphone size={24} color="#6ee7b7" />
            </View>
            <Text className="text-emerald-100 text-sm">Works Online</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View className="bg-slate-900 py-8 px-6">
        <Text className="text-slate-400 text-sm text-center mb-4">
          By signing in, you agree to our{" "}
          <Text className="text-emerald-400 underline">Terms of Service</Text> and{" "}
          <Text className="text-emerald-400 underline">Privacy Policy</Text>
        </Text>
      </View>
    </ScrollView>
  );
}
