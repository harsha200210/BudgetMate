import { register } from "@/service/authService";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  User,
  UserPlus,
  Wallet,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function RegisterScreen() {
  const navigation = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Toast.show({
        type: "error",
        text1: "All fields are required",
        text2: "Please fill in all the fields to continue.",
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Passwords do not match",
        text2: "Please make sure your passwords match.",
      });
      return;
    }

    setLoading(true);
    try {
      await register(email, password, fullName, phoneNumber);
      Toast.show({
        type: "success",
        text1: "Registration successful!",
      });
      navigation.push("/home");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Registration failed.",
        text2: "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#0f172a", "#1e293b", "#059669"]} // slate-900 → slate-800 → emerald-600
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1, position: "relative" }}
    >
      <ScrollView className="flex-1 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-600 relative">
        {/* Floating background blobs */}
        <View className="absolute inset-0">
          <View className="absolute top-20 left-10 w-32 h-32 bg-emerald-400 rounded-full opacity-10" />
          <View className="absolute top-40 right-20 w-24 h-24 bg-teal-300 rounded-full opacity-15" />
          <View className="absolute bottom-32 left-1/4 w-40 h-40 bg-green-300 rounded-full opacity-10" />
          <View className="absolute top-1/2 right-10 w-16 h-16 bg-emerald-300 rounded-full opacity-10" />
        </View>

        {/* Top Navigation */}
        <View className="flex flex-row justify-between items-center p-6 pt-12 z-10">
          <View className="flex-row items-center">
            <View className="w-8 h-8 bg-emerald-400 rounded-lg items-center justify-center mr-2">
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
                <UserPlus size={32} color="#059669" />
              </View>
              <Text className="text-3xl font-bold text-white mb-2">
                Create Account
              </Text>
              <Text className="text-emerald-100">
                Join us and start tracking your expenses
              </Text>
            </View>

            {/* Register Card */}
            <View className="bg-white/90 rounded-3xl p-8">
              {/* Full Name Input */}
              <View className="mb-6">
                <Text className="text-slate-700 font-semibold mb-2">
                  Full Name
                </Text>
                <View className="flex-row items-center border border-slate-200 rounded-2xl px-4">
                  <User size={20} color="#94a3b8" />
                  <TextInput
                    placeholder="Enter your full name"
                    placeholderTextColor="#94a3b8"
                    value={fullName}
                    onChangeText={setFullName}
                    className="flex-1 ml-2 py-3 text-slate-700"
                  />
                </View>
              </View>

              {/* Email Input */}
              <View className="mb-6">
                <Text className="text-slate-700 font-semibold mb-2">
                  Email Address
                </Text>
                <View className="flex-row items-center border border-slate-200 rounded-2xl px-4">
                  <Mail size={20} color="#94a3b8" />
                  <TextInput
                    placeholder="Enter your email"
                    placeholderTextColor="#94a3b8"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                    className="flex-1 ml-2 py-3 text-slate-700"
                  />
                </View>
              </View>

              {/* Phone Number Input */}
              <View className="mb-6">
                <Text className="text-slate-700 font-semibold mb-2">
                  Phone Number
                </Text>
                <View className="flex-row items-center border border-slate-200 rounded-2xl px-4">
                  <Phone size={20} color="#94a3b8" />
                  <TextInput
                    placeholder="Enter your phone number"
                    placeholderTextColor="#94a3b8"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    className="flex-1 ml-2 py-3 text-slate-700"
                  />
                </View>
              </View>

              {/* Password Input */}
              <View className="mb-6">
                <Text className="text-slate-700 font-semibold mb-2">
                  Password
                </Text>
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
                  <TouchableOpacity
                    onPress={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? (
                      <Eye size={20} color="#94a3b8" />
                    ) : (
                      <EyeOff size={20} color="#94a3b8" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password Input */}
              <View className="mb-6">
                <Text className="text-slate-700 font-semibold mb-2">
                  Confirm Password
                </Text>
                <View className="flex-row items-center border border-slate-200 rounded-2xl px-4">
                  <Lock size={20} color="#94a3b8" />
                  <TextInput
                    placeholder="Re-enter your password"
                    placeholderTextColor="#94a3b8"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!confirmPasswordVisible}
                    className="flex-1 ml-2 py-3 text-slate-700"
                  />
                  <TouchableOpacity
                    onPress={() =>
                      setConfirmPasswordVisible(!confirmPasswordVisible)
                    }
                  >
                    {confirmPasswordVisible ? (
                      <Eye size={20} color="#94a3b8" />
                    ) : (
                      <EyeOff size={20} color="#94a3b8" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Sign Up Button */}
              <TouchableOpacity 
                onPress={handleSignUp}
                disabled={loading}
                className="bg-emerald-600 py-4 rounded-2xl items-center mb-6">

                  {loading ? (
                    <View className="flex-row items-center">
                      <ActivityIndicator size="small" color="#fff" />
                      <Text className="text-white font-bold text-lg ml-2">Signing up...</Text>
                    </View>
                  ) : (
                    <Text className="text-white font-bold text-lg">Sign Up</Text>
                  )}
              </TouchableOpacity>

              {/* Already have account? */}
              <Text className="text-center text-slate-600 mt-2">
                Already have an account?{" "}
                <TouchableOpacity onPress={() => navigation.push("/login")}>
                  <Text className="text-emerald-600 font-semibold">
                    Sign in here
                  </Text>
                </TouchableOpacity>
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View className="bg-slate-900 py-8 px-6 mt-8">
          <Text className="text-slate-400 text-sm text-center mb-4">
            By signing up, you agree to our{" "}
            <Text className="text-emerald-400 underline">Terms of Service</Text>{" "}
            and <Text className="text-emerald-400 underline">Privacy Policy</Text>
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
    
  );
}
