import { useRouter } from "expo-router";
import { ArrowRight, BarChart3, Brain, GraduationCap, PlusCircle, ShieldCheck, Smartphone, TrendingUp, Wallet, Zap } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-slate-900">
      {/* Floating Background Elements */}
      <View className="absolute inset-0">
        <View className="absolute top-20 left-10 w-32 h-32 bg-emerald-400 rounded-full opacity-10" />
        <View className="absolute top-40 right-20 w-24 h-24 bg-teal-300 rounded-full opacity-15" />
        <View className="absolute bottom-32 left-1/4 w-40 h-40 bg-green-300 rounded-full opacity-10" />
      </View>

      {/* Top Navigation */}
      <View className="flex flex-row justify-between items-center p-6 pt-12 relative z-10">
        <View className="flex flex-row items-center space-x-2">
          <View className="w-8 h-8 bg-emerald-400 rounded-lg flex items-center justify-center">
            <Wallet size={20} color="#0f172a" />
          </View>
          <Text className="text-white font-bold text-lg">  BudgetMate</Text>
        </View>
      </View>

      {/* Hero Section */}
      <View className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center relative z-10">
        {/* App Logo */}
        <View className="mb-8">
          <View className="relative">
            <View className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl">
              <TrendingUp size={48} color="#059669" />
            </View>
            <View className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-400 rounded-full flex items-center justify-center">
              <Text className="text-slate-900 text-xs font-bold">$</Text>
            </View>
          </View>
        </View>

        {/* Title */}
        <Text className="text-5xl font-black text-white mb-4">BudgetMate</Text>
        <Text className="text-xl text-emerald-100 mb-2 font-medium">
          Your Personal Finance Companion
        </Text>
        <Text className="text-emerald-50/90 text-lg leading-relaxed mb-12 max-w-md text-center">
          Take control of your money with ease. Track expenses, monitor income, and build better financial habits.
        </Text>

        {/* Call to Action */}
        <View className="flex flex-col sm:flex-row gap-4 mb-12">
          <TouchableOpacity onPress={() => router.push("/login")} className="bg-white px-8 py-4 rounded-2xl flex flex-row items-center justify-center space-x-2">
            <Text className="text-slate-900 font-bold">Get Started Free</Text>
            <ArrowRight size={20} color="#0f172a" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Feature Cards */}
      <View className="px-6 pb-12 relative z-10">
        <View className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Feature 1 */}
          <View className="bg-white/10 backdrop-blur-md p-6 rounded-2xl">
            <View className="flex flex-row items-center space-x-3 mb-3">
              <View className="w-10 h-10 bg-emerald-400/20 rounded-xl flex items-center justify-center">
                <PlusCircle size={20} color="#6ee7b7" />
              </View>
              <Text className="text-white font-semibold">  Quick Add</Text>
            </View>
            <Text className="text-emerald-100/80 text-sm">
              Add expenses in seconds with smart categories
            </Text>
          </View>

          {/* Feature 2 */}
          <View className="bg-white/10 backdrop-blur-md p-6 rounded-2xl">
            <View className="flex flex-row items-center space-x-3 mb-3">
              <View className="w-10 h-10 bg-blue-400/20 rounded-xl flex items-center justify-center">
                <BarChart3 size={20} color="#93c5fd" />
              </View>
              <Text className="text-white font-semibold">  Smart Reports</Text>
            </View>
            <Text className="text-emerald-100/80 text-sm">
              Beautiful charts show your spending patterns
            </Text>
          </View>

          {/* Feature 3 */}
          <View className="bg-white/10 backdrop-blur-md p-6 rounded-2xl">
            <View className="flex flex-row items-center space-x-3 mb-3">
              <View className="w-10 h-10 bg-purple-400/20 rounded-xl flex items-center justify-center">
                <ShieldCheck size={20} color="#c4b5fd" />
              </View>
              <Text className="text-white font-semibold">  Secure & Private</Text>
            </View>
            <Text className="text-emerald-100/80 text-sm">
              Your data is safely stored in the cloud with Firebase security
            </Text>
          </View>
        </View>
      </View>

      {/* Why Choose Section */}
      <View className="bg-slate-50 py-16 px-6">
        <View className="max-w-4xl mx-auto">
          <Text className="text-3xl font-bold text-slate-900 mb-4 text-center">
            Why Students & Professionals Choose BudgetMate
          </Text>
          <Text className="text-slate-600 text-lg text-center mb-12">
            Simple, powerful, and built for your lifestyle
          </Text>

          {/* Benefits Grid */}
          <View className="flex flex-col gap-8">
            {/* Benefit 1 */}
            <View className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <Zap size={24} color="#059669" />
              <Text className="text-xl font-semibold text-slate-900 mb-3">Lightning Fast</Text>
              <Text className="text-slate-600">
                Add transactions in under 5 seconds. No complicated forms or endless menus - just quick, smart expense tracking.
              </Text>
            </View>

            {/* Benefit 2 */}
            <View className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <Brain size={24} color="#2563eb" />
              <Text className="text-xl font-semibold text-slate-900 mb-3">Smart Insights</Text>
              <Text className="text-slate-600">
                Discover spending patterns you never noticed. Get personalized tips to save more and spend smarter.
              </Text>
            </View>

            {/* Benefit 3 */}
            <View className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <Smartphone size={24} color="#9333ea" />
              <Text className="text-xl font-semibold text-slate-900 mb-3">Cloud Sync</Text>
              <Text className="text-slate-600">
                Your data is securely stored in the cloud with Firebase – access it anytime, on any device.
              </Text>
            </View>

            {/* Benefit 4 */}
            <View className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <GraduationCap size={24} color="#d97706" />
              <Text className="text-xl font-semibold text-slate-900 mb-3">Built for Students</Text>
              <Text className="text-slate-600">
                Perfect for managing allowances, part-time income, and student expenses. Simple enough for daily use.
              </Text>
            </View>
          </View>

          {/* Signup Section */}
          <View className="bg-emerald-600 rounded-3xl p-8 mt-12">
            <Text className="text-2xl font-bold text-white mb-4 text-center">
              Ready to Start Your Financial Journey?
            </Text>
            <Text className="text-emerald-100 mb-8 text-lg text-center">
              Join thousands who've already taken control of their money
            </Text>

            <View className="flex flex-col gap-4">
              <TouchableOpacity onPress={() => router.push("/register")} className="bg-white px-8 py-3 rounded-2xl">
                <Text className="text-emerald-600 font-bold text-center">Sign Up Free</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push("/login")} className="border-2 border-white px-8 py-3 rounded-2xl">
                <Text className="text-white font-semibold text-center">Login</Text>
              </TouchableOpacity>
            </View>

            <Text className="text-emerald-100 text-sm mt-6 text-center">
              No credit card required • 100% free to start
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
