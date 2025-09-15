import React, { use, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Modal,
  Alert,
  Switch,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { logout } from '@/service/authService';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/hooks/useAuth';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '@/firebase';
import { getUserProfile } from '@/service/userService';
import EditProfileModal from '@/components/EditProfileModal';
import ChangePasswordModal from '@/components/ChangePasswordModal';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  joinDate: Date;
}

interface Settings {
  notifications: boolean;
  darkMode: boolean;
  biometricAuth: boolean;
  autoBackup: boolean;
  dataExport: boolean;
}

const ProfileScreen: React.FC = () => {
  const { user: userDetail } = useAuth();
  const [user, setUser] = useState<UserProfile>({
    name: "",
    email: "",
    phone: "",
    joinDate: new Date(),
  });

  useEffect(() => {
    if (!userDetail?.uid) return; // guard

    const fetchProfile = async () => {
      try {
        const data = await getUserProfile(userDetail.uid);
        console.log("Fetched user profile data:", data);
        setUser({
          name: data.name,
          email: data.email,
          phone: data.phone,
          joinDate:
          data.joinDate instanceof Timestamp
            ? data.joinDate.toDate()
            : data.joinDate || new Date(),
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchProfile();
    console.log("Fetched user profile for UID:", userDetail.uid);
    console.log(user);
  }, []); // re-run if uid changes


  const [settings, setSettings] = useState<Settings>({
    notifications: true,
    darkMode: false,
    biometricAuth: true,
    autoBackup: true,
    dataExport: false,
  });

  const navigation = useRouter();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [editForm, setEditForm] = useState(user);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  ];


  const handleOpenEditModal = () => {
  // Deep clone to avoid mutating the original user object
  setEditForm({ ...user });
  setShowEditModal(true);
};


  const handleChangePassword = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }
    
    // Add password change logic here
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowPasswordModal(false);
    Alert.alert('Success', 'Password changed successfully!');
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Your financial data will be exported as a CSV file. This may take a few moments.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => console.log('Export data') },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => console.log('Delete account'),
        },
      ]
    );
  };

  const MenuSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View className="mb-8">
      <Text className="text-slate-900 font-bold text-lg mb-4 px-6">{title}</Text>
      <View className="bg-white mx-6 rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {children}
      </View>
    </View>
  );

  const MenuItem = ({
    icon,
    title,
    subtitle,
    value,
    onPress,
    showArrow = true,
    color = '#64748B',
    rightElement,
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    value?: string;
    onPress?: () => void;
    showArrow?: boolean;
    color?: string;
    rightElement?: React.ReactNode;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center p-4 border-b border-slate-100 last:border-b-0"
      disabled={!onPress}
    >
      <View
        className="w-10 h-10 rounded-xl items-center justify-center mr-4"
        style={{ backgroundColor: color + '20' }}
      >
        <MaterialIcons name={icon as any} size={20} color={color} />
      </View>
      
      <View className="flex-1">
        <Text className="text-slate-900 font-medium text-base">{title}</Text>
        {subtitle && (
          <Text className="text-slate-500 text-sm mt-1">{subtitle}</Text>
        )}
      </View>
      
      {rightElement || (
        <View className="flex-row items-center">
          {value && (
            <Text className="text-slate-500 text-sm mr-2">{value}</Text>
          )}
          {showArrow && (
            <MaterialIcons name="chevron-right" size={20} color="#94A3B8" />
          )}
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
                  colors={["#10B981", "#0D9488"]} // emerald-500 → teal-600
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 32 }}
        >
          {/* Profile Header */}
          <View className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-8">
            <View className="items-center">
              <View className="relative mb-4">
                <Image
                  source={{ uri: `https://ui-avatars.com/api/?name=${user.name.trim().split(' ')[0]}&background=10B981&color=fff&size=200` }}
                  className="w-24 h-24 rounded-full border-4 border-white/20"
                />
                <View className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-400 rounded-full items-center justify-center">
                  <MaterialIcons name="verified" size={16} color="#0F172A" />
                </View>
              </View>
              
              <Text className="text-white text-2xl font-bold mb-1">{user.name}</Text>
              <Text className="text-emerald-100 text-base mb-2">{user.email}</Text>
              <Text className="text-emerald-200 text-sm">
                Member since {user.joinDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Quick Stats */}
        <View className="mx-6 -mt-6 mb-8">
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <View className="flex-row justify-between">
              <View className="flex-1 items-center">
                <Text className="text-slate-500 text-sm mb-1">Total Transactions</Text>
                <Text className="text-slate-900 text-2xl font-bold">127</Text>
              </View>
              <View className="w-px bg-slate-200" />
              <View className="flex-1 items-center">
                <Text className="text-slate-500 text-sm mb-1">This Month</Text>
                <Text className="text-emerald-600 text-2xl font-bold">+$2,450</Text>
              </View>
              <View className="w-px bg-slate-200" />
              <View className="flex-1 items-center">
                <Text className="text-slate-500 text-sm mb-1">Savings</Text>
                <Text className="text-blue-600 text-2xl font-bold">$8,750</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Account Section */}
        <MenuSection title="Account">
          <MenuItem
            icon="person"
            title="Personal Information"
            subtitle="Name, email, phone number"
             onPress={handleOpenEditModal}
            color="#3B82F6"
          />
          <MenuItem
            icon="lock"
            title="Change Password"
            subtitle="Update your password"
            onPress={() => setShowPasswordModal(true)}
            color="#EF4444"
          />
        </MenuSection>
        
        {/* Danger Zone */}
        <MenuSection title="Danger Zone">
          <MenuItem
            icon="logout"
            title="Sign Out"
            subtitle="Sign out of your account"
            onPress={() => { logout(); navigation.navigate('/(auth)/login'); }}
            color="#EF4444"
          />
          <MenuItem
            icon="delete-forever"
            title="Delete Account"
            subtitle="Permanently delete your account"
            onPress={handleDeleteAccount}
            color="#DC2626"
          />
        </MenuSection>

        {/* App Version */}
        <View className="items-center py-8">
          <Text className="text-slate-400 text-sm">BudgetMate v1.0.0</Text>
          <Text className="text-slate-400 text-xs mt-1">Made with ❤️ for better finances</Text>
        </View>
      </ScrollView>

      <EditProfileModal
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        editForm={editForm}
        setEditForm={setEditForm}
      />
      <ChangePasswordModal
        showPasswordModal={showPasswordModal}
        setShowPasswordModal={setShowPasswordModal}
        passwordForm={passwordForm}
        setPasswordForm={setPasswordForm}
        handleChangePassword={handleChangePassword}
      />
      {/* <CurrencyModal /> */}
    </SafeAreaView>
  );
};

export default ProfileScreen;