import React from 'react';
import { Modal, SafeAreaView, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Category } from '@/app/(dashboard)/add';

interface CategoryModalProps {
  showCategoryModal: boolean;
  setShowCategoryModal: React.Dispatch<React.SetStateAction<boolean>>;
  transactionType: 'income' | 'expense';
  expenseCategories: Category[];
  incomeCategories: Category[];
  handleCategorySelect: (category: Category) => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  showCategoryModal,
  setShowCategoryModal,
  transactionType,
  expenseCategories,
  incomeCategories,
  handleCategorySelect,
}) => {
  const categories = transactionType === 'expense' ? expenseCategories : incomeCategories;

  return (
    <Modal
      visible={showCategoryModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowCategoryModal(false)}
    >
      <SafeAreaView className="flex-1 bg-slate-50">
        <View className="bg-white px-6 py-4 border-b border-slate-200">
          <View className="flex-row justify-between items-center">
            <Text className="text-xl font-bold text-slate-900">
              Select {transactionType === 'expense' ? 'Expense' : 'Income'} Category
            </Text>
            <TouchableOpacity
              onPress={() => setShowCategoryModal(false)}
              className="w-8 h-8 bg-slate-100 rounded-full items-center justify-center"
            >
              <MaterialIcons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1 px-6 py-6">
          <View className="flex-row flex-wrap justify-between">
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => handleCategorySelect(category)}
                className="w-[30%] bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-4 items-center"
              >
                <View
                  className="w-12 h-12 rounded-2xl items-center justify-center mb-3"
                  style={{ backgroundColor: category.color + '20' }}
                >
                  <MaterialIcons
                    name={category.icon as any}
                    size={24}
                    color={category.color}
                  />
                </View>
                <Text className="text-slate-700 font-medium text-sm text-center">
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export default CategoryModal;
