import React from 'react';
import {
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type ChangePasswordModalProps = {
  showPasswordModal: boolean;
  setShowPasswordModal: React.Dispatch<React.SetStateAction<boolean>>;
  passwordForm: PasswordForm;
  setPasswordForm: React.Dispatch<React.SetStateAction<PasswordForm>>;
  handleChangePassword: () => void;
};

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  showPasswordModal,
  setShowPasswordModal,
  passwordForm,
  setPasswordForm,
  handleChangePassword,
}) => {
  return (
    <Modal
      visible={showPasswordModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowPasswordModal(false)}
    >
      <SafeAreaView className="flex-1 bg-slate-50">
        {/* Header */}
        <View className="bg-white px-6 py-4 border-b border-slate-200">
          <View className="flex-row justify-between items-center">
            <TouchableOpacity
              onPress={() => setShowPasswordModal(false)}
              className="w-8 h-8 bg-slate-100 rounded-full items-center justify-center"
            >
              <MaterialIcons name="close" size={20} color="#64748B" />
            </TouchableOpacity>

            <Text className="text-xl font-bold text-slate-900">
              Change Password
            </Text>

            <TouchableOpacity
              onPress={handleChangePassword}
              className="px-4 py-2 bg-emerald-500 rounded-xl"
            >
              <Text className="text-white font-semibold">Save</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Form */}
        <ScrollView className="flex-1 px-6 py-6">
          <View className="space-y-6">
            {/* Current Password */}
            <View>
              <Text className="text-slate-700 font-semibold mb-2">
                Current Password
              </Text>
              <TextInput
                value={passwordForm.currentPassword}
                onChangeText={(value) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    currentPassword: value,
                  }))
                }
                className="bg-white p-4 rounded-2xl border border-slate-200 text-slate-900"
                placeholder="Enter current password"
                secureTextEntry
              />
            </View>

            {/* New Password */}
            <View>
              <Text className="text-slate-700 font-semibold mb-2">
                New Password
              </Text>
              <TextInput
                value={passwordForm.newPassword}
                onChangeText={(value) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    newPassword: value,
                  }))
                }
                className="bg-white p-4 rounded-2xl border border-slate-200 text-slate-900"
                placeholder="Enter new password"
                secureTextEntry
              />
              <Text className="text-slate-500 text-sm mt-1">
                Password must be at least 6 characters
              </Text>
            </View>

            {/* Confirm New Password */}
            <View>
              <Text className="text-slate-700 font-semibold mb-2">
                Confirm New Password
              </Text>
              <TextInput
                value={passwordForm.confirmPassword}
                onChangeText={(value) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    confirmPassword: value,
                  }))
                }
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
              <Text className="text-blue-700 font-semibold ml-2">
                Security Tips
              </Text>
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
};

export default ChangePasswordModal;
