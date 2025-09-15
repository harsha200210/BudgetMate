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

interface UserProfile {
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

  type EditProfileModalProps = {
  showEditModal: boolean;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  editForm: UserProfile;
  setEditForm: React.Dispatch<React.SetStateAction<UserProfile>>;
};

  const EditProfileModal: React.FC<EditProfileModalProps> = ({ showEditModal, setShowEditModal, editForm, setEditForm }: EditProfileModalProps) => {
    const handleUpdateProfile = () => {
      setUser(editForm);
      setShowEditModal(false);
      Alert.alert('Success', 'Profile updated successfully!');
    };

    return (
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowEditModal(false)}
      >
        <SafeAreaView className="flex-1 bg-slate-50">
          <View className="bg-white px-6 py-4 border-b border-slate-200">
            <View className="flex-row justify-between items-center">
              <TouchableOpacity
                onPress={() => setShowEditModal(false)}
                className="w-8 h-8 bg-slate-100 rounded-full items-center justify-center"
              >
                <MaterialIcons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
              <Text className="text-xl font-bold text-slate-900">Edit Profile</Text>
              <TouchableOpacity
                onPress={handleUpdateProfile}
                className="px-4 py-2 bg-emerald-500 rounded-xl"
              >
                <Text className="text-white font-semibold">Save</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView className="flex-1 px-6 py-6">
            {/* Form Fields */}
            <View className="space-y-6">
              <View>
                <Text className="text-slate-700 font-semibold mb-2">Full Name</Text>
                <TextInput
                  value={editForm.name}
                  onChangeText={(value) => setEditForm({ ...editForm, name: value })}
                  className="bg-white p-4 rounded-2xl border border-slate-200 text-slate-900"
                  placeholder="Enter your full name"
                />
              </View>

              <View>
                <Text className="text-slate-700 font-semibold mb-2">Email Address</Text>
                <TextInput
                  value={editForm.email}
                  onChangeText={(value) => setEditForm(prev => ({ ...prev, email: value }))}
                  className="bg-white p-4 rounded-2xl border border-slate-200 text-slate-900"
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View>
                <Text className="text-slate-700 font-semibold mb-2">Phone Number</Text>
                <TextInput
                  value={editForm.phone}
                  onChangeText={(value) => setEditForm(prev => ({ ...prev, phone: value }))}
                  className="bg-white p-4 rounded-2xl border border-slate-200 text-slate-900"
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );

  }

  const ChangePasswordModal = () => (
    <Modal
      visible={showPasswordModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowPasswordModal(false)}
    >
      <SafeAreaView className="flex-1 bg-slate-50">
        <View className="bg-white px-6 py-4 border-b border-slate-200">
          <View className="flex-row justify-between items-center">
            <TouchableOpacity
              onPress={() => setShowPasswordModal(false)}
              className="w-8 h-8 bg-slate-100 rounded-full items-center justify-center"
            >
              <MaterialIcons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-slate-900">Change Password</Text>
            <TouchableOpacity
              onPress={handleChangePassword}
              className="px-4 py-2 bg-emerald-500 rounded-xl"
            >
              <Text className="text-white font-semibold">Save</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1 px-6 py-6">
          <View className="space-y-6">
            <View>
              <Text className="text-slate-700 font-semibold mb-2">Current Password</Text>
              <TextInput
                value={passwordForm.currentPassword}
                onChangeText={(value) => setPasswordForm(prev => ({ ...prev, currentPassword: value }))}
                className="bg-white p-4 rounded-2xl border border-slate-200 text-slate-900"
                placeholder="Enter current password"
                secureTextEntry
              />
            </View>

            <View>
              <Text className="text-slate-700 font-semibold mb-2">New Password</Text>
              <TextInput
                value={passwordForm.newPassword}
                onChangeText={(value) => setPasswordForm(prev => ({ ...prev, newPassword: value }))}
                className="bg-white p-4 rounded-2xl border border-slate-200 text-slate-900"
                placeholder="Enter new password"
                secureTextEntry
              />
              <Text className="text-slate-500 text-sm mt-1">Password must be at least 6 characters</Text>
            </View>

            <View>
              <Text className="text-slate-700 font-semibold mb-2">Confirm New Password</Text>
              <TextInput
                value={passwordForm.confirmPassword}
                onChangeText={(value) => setPasswordForm(prev => ({ ...prev, confirmPassword: value }))}
                className="bg-white p-4 rounded-2xl border border-slate-200 text-slate-900"
                placeholder="Confirm new password"
                secureTextEntry
              />
            </View>
          </View>

          {/* Security Tips */}
          <View className="bg-blue-50 p-4 rounded-2xl mt-8">
            <View className="flex-row items-center mb-2">
              <MaterialIcons name="security" size={20} color="#3B82F6" />
              <Text className="text-blue-700 font-semibold ml-2">Security Tips</Text>
            </View>
            <Text className="text-blue-600 text-sm leading-5">
              • Use a mix of uppercase and lowercase letters{'\n'}
              • Include numbers and special characters{'\n'}
              • Avoid common words or personal information{'\n'}
              • Make it at least 8 characters long
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  // const CurrencyModal = () => (
  //   <Modal
  //     visible={showCurrencyModal}
  //     animationType="slide"
  //     presentationStyle="pageSheet"
  //     onRequestClose={() => setShowCurrencyModal(false)}
  //   >
  //     <SafeAreaView className="flex-1 bg-slate-50">
  //       <View className="bg-white px-6 py-4 border-b border-slate-200">
  //         <View className="flex-row justify-between items-center">
  //           <Text className="text-xl font-bold text-slate-900">Select Currency</Text>
  //           <TouchableOpacity
  //             onPress={() => setShowCurrencyModal(false)}
  //             className="w-8 h-8 bg-slate-100 rounded-full items-center justify-center"
  //           >
  //             <MaterialIcons name="close" size={20} color="#64748B" />
  //           </TouchableOpacity>
  //         </View>
  //       </View>

  //       <ScrollView className="flex-1">
  //         {currencies.map((currency) => (
  //           <TouchableOpacity
  //             key={currency.code}
  //             onPress={() => {
  //               setUser(prev => ({ ...prev, currency: currency.code }));
  //               setShowCurrencyModal(false);
  //             }}
  //             className="flex-row items-center justify-between px-6 py-4 border-b border-slate-100"
  //           >
  //             <View className="flex-row items-center">
  //               <Text className="text-2xl mr-3">{currency.symbol}</Text>
  //               <View>
  //                 <Text className="text-slate-900 font-medium">{currency.name}</Text>
  //                 <Text className="text-slate-500 text-sm">{currency.code}</Text>
  //               </View>
  //             </View>
  //             {user.currency === currency.code && (
  //               <MaterialIcons name="check-circle" size={20} color="#10B981" />
  //             )}
  //           </TouchableOpacity>
  //         ))}
  //       </ScrollView>
  //     </SafeAreaView>
  //   </Modal>
  // );

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
          {/* <MenuItem
            icon="account-balance-wallet"
            title="Currency"
            value={user.currency}
            onPress={() => setShowCurrencyModal(true)}
            color="#10B981"
          /> */}
        </MenuSection>

        {/* Settings Section */}
        {/* <MenuSection title="Settings">
          <MenuItem
            icon="notifications"
            title="Push Notifications"
            subtitle="Get notified about your transactions"
            showArrow={false}
            color="#F59E0B"
            rightElement={
              <Switch
                value={settings.notifications}
                onValueChange={(value) => setSettings(prev => ({ ...prev, notifications: value }))}
                trackColor={{ false: '#E2E8F0', true: '#10B981' }}
                thumbColor={settings.notifications ? '#FFFFFF' : '#FFFFFF'}
              />
            }
          />
          <MenuItem
            icon="dark-mode"
            title="Dark Mode"
            subtitle="Switch to dark theme"
            showArrow={false}
            color="#6366F1"
            rightElement={
              <Switch
                value={settings.darkMode}
                onValueChange={(value) => setSettings(prev => ({ ...prev, darkMode: value }))}
                trackColor={{ false: '#E2E8F0', true: '#10B981' }}
                thumbColor={settings.darkMode ? '#FFFFFF' : '#FFFFFF'}
              />
            }
          />
          <MenuItem
            icon="fingerprint"
            title="Biometric Authentication"
            subtitle="Use Face ID or fingerprint"
            showArrow={false}
            color="#EC4899"
            rightElement={
              <Switch
                value={settings.biometricAuth}
                onValueChange={(value) => setSettings(prev => ({ ...prev, biometricAuth: value }))}
                trackColor={{ false: '#E2E8F0', true: '#10B981' }}
                thumbColor={settings.biometricAuth ? '#FFFFFF' : '#FFFFFF'}
              />
            }
          />
          <MenuItem
            icon="backup"
            title="Auto Backup"
            subtitle="Automatically backup your data"
            showArrow={false}
            color="#059669"
            rightElement={
              <Switch
                value={settings.autoBackup}
                onValueChange={(value) => setSettings(prev => ({ ...prev, autoBackup: value }))}
                trackColor={{ false: '#E2E8F0', true: '#10B981' }}
                thumbColor={settings.autoBackup ? '#FFFFFF' : '#FFFFFF'}
              />
            }
          />
        </MenuSection> */}

        {/* Data & Privacy Section */}
        {/* <MenuSection title="Data & Privacy">
          <MenuItem
            icon="file-download"
            title="Export Data"
            subtitle="Download your financial data"
            onPress={handleExportData}
            color="#3B82F6"
          />
          <MenuItem
            icon="privacy-tip"
            title="Privacy Policy"
            subtitle="Learn how we protect your data"
            onPress={() => console.log('Privacy Policy')}
            color="#8B5CF6"
          />
          <MenuItem
            icon="description"
            title="Terms of Service"
            subtitle="Read our terms and conditions"
            onPress={() => console.log('Terms of Service')}
            color="#64748B"
          />
        </MenuSection> */}

        {/* Support Section */}
        {/* <MenuSection title="Support">
          <MenuItem
            icon="help"
            title="Help Center"
            subtitle="Get help and find answers"
            onPress={() => console.log('Help Center')}
            color="#10B981"
          />
          <MenuItem
            icon="feedback"
            title="Send Feedback"
            subtitle="Help us improve the app"
            onPress={() => console.log('Send Feedback')}
            color="#F59E0B"
          />
          <MenuItem
            icon="star-rate"
            title="Rate App"
            subtitle="Rate us on the App Store"
            onPress={() => console.log('Rate App')}
            color="#EC4899"
          />
        </MenuSection> */}

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
      <ChangePasswordModal />
      {/* <CurrencyModal /> */}
    </SafeAreaView>
  );
};

export default ProfileScreen;