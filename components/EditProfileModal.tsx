import React from 'react';
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { UserProfile } from '@/app/(dashboard)/profile';

type EditProfileModalProps = {
  showEditModal: boolean;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  editForm: UserProfile;
  setEditForm: React.Dispatch<React.SetStateAction<UserProfile>>;
};

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  showEditModal,
  setShowEditModal,
  editForm,
  setEditForm,
}) => {
  // save the edited form and close modal
  const handleUpdateProfile = () => {
    // here you can also call an API to persist the changes
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
        {/* Header */}
        <View className="bg-white px-6 py-4 border-b border-slate-200">
          <View className="flex-row justify-between items-center">
            {/* Close Button */}
            <TouchableOpacity
              onPress={() => setShowEditModal(false)}
              className="w-8 h-8 bg-slate-100 rounded-full items-center justify-center"
            >
              <MaterialIcons name="close" size={20} color="#64748B" />
            </TouchableOpacity>

            <Text className="text-xl font-bold text-slate-900">
              Edit Profile
            </Text>

            {/* Save Button */}
            <TouchableOpacity
              onPress={handleUpdateProfile}
              className="px-4 py-2 bg-emerald-500 rounded-xl"
            >
              <Text className="text-white font-semibold">Save</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Form */}
        <ScrollView className="flex-1 px-6 py-6">
          <View className="space-y-6">
            {/* Full Name */}
            <View>
              <Text className="text-slate-700 font-semibold mb-2">
                Full Name
              </Text>
              <TextInput
                value={editForm.name}
                onChangeText={(value) =>
                  setEditForm((prev) => ({ ...prev, name: value }))
                }
                className="bg-white p-4 rounded-2xl border border-slate-200 text-slate-900"
                placeholder="Enter your full name"
              />
            </View>

            {/* Email */}
            <View>
              <Text className="text-slate-700 font-semibold mb-2">
                Email Address
              </Text>
              <TextInput
                value={editForm.email}
                onChangeText={(value) =>
                  setEditForm((prev) => ({ ...prev, email: value }))
                }
                className="bg-white p-4 rounded-2xl border border-slate-200 text-slate-900"
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Phone */}
            <View>
              <Text className="text-slate-700 font-semibold mb-2">
                Phone Number
              </Text>
              <TextInput
                value={editForm.phone}
                onChangeText={(value) =>
                  setEditForm((prev) => ({ ...prev, phone: value }))
                }
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
};

export default EditProfileModal;
