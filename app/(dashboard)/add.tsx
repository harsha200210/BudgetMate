import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { addTransaction } from '@/service/transactionService';
import { useRouter } from 'expo-router';
import Toast from "react-native-toast-message";

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense';
}

export interface Transaction {
  id?: string;
  type: 'income' | 'expense';
  amount: string;
  category: Category | null;
  description: string;
  date: Date;
}

type TransactionType = 'income' | 'expense';

const AddTransactionScreen: React.FC = () => {
  const [transactionType, setTransactionType] = useState<TransactionType>('expense');
  const [transaction, setTransaction] = useState<Transaction>({
    type: 'expense',
    amount: '',
    category: null,
    description: '',
    date: new Date(),
  });
  
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useRouter();

  // Categories data
  const expenseCategories: Category[] = [
    { id: '1', name: 'Food & Dining', icon: 'restaurant', color: '#EF4444', type: 'expense' },
    { id: '2', name: 'Transportation', icon: 'directions-car', color: '#F59E0B', type: 'expense' },
    { id: '3', name: 'Shopping', icon: 'shopping-bag', color: '#8B5CF6', type: 'expense' },
    { id: '4', name: 'Entertainment', icon: 'movie', color: '#06B6D4', type: 'expense' },
    { id: '5', name: 'Bills & Utilities', icon: 'receipt', color: '#10B981', type: 'expense' },
    { id: '6', name: 'Healthcare', icon: 'local-hospital', color: '#EC4899', type: 'expense' },
    { id: '7', name: 'Education', icon: 'school', color: '#6366F1', type: 'expense' },
    { id: '8', name: 'Travel', icon: 'flight', color: '#14B8A6', type: 'expense' },
    { id: '9', name: 'Others', icon: 'more-horiz', color: '#64748B', type: 'expense' },
  ];

  const incomeCategories: Category[] = [
    { id: '10', name: 'Salary', icon: 'work', color: '#10B981', type: 'income' },
    { id: '11', name: 'Freelance', icon: 'computer', color: '#3B82F6', type: 'income' },
    { id: '12', name: 'Business', icon: 'business-center', color: '#8B5CF6', type: 'income' },
    { id: '13', name: 'Investments', icon: 'trending-up', color: '#059669', type: 'income' },
    { id: '14', name: 'Rental', icon: 'home', color: '#DC2626', type: 'income' },
    { id: '15', name: 'Gifts', icon: 'card-giftcard', color: '#EC4899', type: 'income' },
    { id: '16', name: 'Others', icon: 'more-horiz', color: '#64748B', type: 'income' },
  ];

  const quickAmounts = ['100', '500', '1000', '10000', '15000', '20000'];

  const handleTypeChange = (type: TransactionType) => {
    setTransactionType(type);
    setTransaction(prev => ({
      ...prev,
      type,
      category: null,
    }));
  };

  const handleCategorySelect = (category: Category) => {
    setTransaction(prev => ({
      ...prev,
      category,
    }));
    setShowCategoryModal(false);
  };

  const handleQuickAmountSelect = (amount: string) => {
    setTransaction(prev => ({
      ...prev,
      amount,
    }));
  };

  const handleSaveTransaction = async () => {
    if (!transaction.amount || !transaction.category) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      await addTransaction(
        transactionType,
        parseFloat(transaction.amount),
        transaction.category,
        transaction.description || ""
      );
      Toast.show({
        type: "success",
        text1: "Transaction added successfully",
        text2: "Your transaction has been recorded.",
      });
      setTransaction({ type: 'expense', amount: '', category: null, description: '', date: new Date() });
      setTransactionType('expense');
      navigation.push('/home');
      
    } catch (error: any) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Failed to save transaction",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const TypeToggle = () => (
    <View className="bg-slate-100 p-1 rounded-2xl flex-row">
      <TouchableOpacity
        onPress={() => handleTypeChange('expense')}
        className={`flex-1 py-3 rounded-xl ${
          transactionType === 'expense' ? 'bg-white shadow-sm' : ''
        }`}
      >
        <Text className={`text-center font-semibold ${
          transactionType === 'expense' ? 'text-red-600' : 'text-slate-500'
        }`}>
          Expense
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={() => handleTypeChange('income')}
        className={`flex-1 py-3 rounded-xl ${
          transactionType === 'income' ? 'bg-white shadow-sm' : ''
        }`}
      >
        <Text className={`text-center font-semibold ${
          transactionType === 'income' ? 'text-emerald-600' : 'text-slate-500'
        }`}>
          Income
        </Text>
      </TouchableOpacity>
    </View>
  );

  const CategoryModal = () => {
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

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-slate-200">
        <View className="flex-row justify-between items-center">
          <TouchableOpacity className="w-10 h-10 bg-slate-100 rounded-full items-center justify-center">
            <MaterialIcons name="close" size={24} color="#64748B" />
          </TouchableOpacity>
          
          <Text className="text-xl font-bold text-slate-900">Add Transaction</Text>
          
          <TouchableOpacity
            onPress={handleSaveTransaction}
            disabled={!transaction.amount || !transaction.category || isLoading}
            className={`px-4 py-2 rounded-xl ${
              transaction.amount && transaction.category && !isLoading
                ? 'bg-emerald-500'
                : 'bg-slate-200'
            }`}
          >
            <Text className={`font-semibold ${
              transaction.amount && transaction.category && !isLoading
                ? 'text-white'
                : 'text-slate-400'
            }`}>
              {isLoading ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          
          {/* Transaction Type Toggle */}
          <View className="px-6 py-6">
            <TypeToggle />
          </View>

          {/* Amount Section */}
          <View className="px-6 mb-6">
            <Text className="text-slate-700 font-semibold mb-3 text-lg">Amount</Text>
            
            {/* Amount Input */}
            <View className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-4">
              <View className="flex-row items-center">
                <Text className="text-slate-400 text-3xl font-light mr-2">LKR</Text>
                <TextInput
                  value={transaction.amount}
                  onChangeText={(value) => setTransaction(prev => ({ ...prev, amount: value }))}
                  placeholder="0.00"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  className="flex-1 text-slate-900 text-3xl font-bold"
                  style={{ fontSize: 32 }}
                />
              </View>
            </View>

            {/* Quick Amount Buttons */}
            <View className="flex-row flex-wrap justify-between">
              {quickAmounts.map((amount) => (
                <TouchableOpacity
                  key={amount}
                  onPress={() => handleQuickAmountSelect(amount)}
                  className="w-[30%] bg-white py-3 rounded-xl shadow-sm border border-slate-100 mb-3"
                >
                  <Text className="text-center text-slate-700 font-semibold">
                    LKR {amount}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Category Selection */}
          <View className="px-6 mb-6">
            <Text className="text-slate-700 font-semibold mb-3 text-lg">Category</Text>
            
            <TouchableOpacity
              onPress={() => setShowCategoryModal(true)}
              className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100"
            >
              <View className="flex-row items-center">
                {transaction.category ? (
                  <>
                    <View
                      className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                      style={{ backgroundColor: transaction.category.color + '20' }}
                    >
                      <MaterialIcons
                        name={transaction.category.icon as any}
                        size={24}
                        color={transaction.category.color}
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-slate-900 font-semibold text-base">
                        {transaction.category.name}
                      </Text>
                      <Text className="text-slate-500 text-sm capitalize">
                        {transaction.category.type}
                      </Text>
                    </View>
                  </>
                ) : (
                  <>
                    <View className="w-12 h-12 bg-slate-100 rounded-2xl items-center justify-center mr-4">
                      <MaterialIcons name="category" size={24} color="#94A3B8" />
                    </View>
                    <Text className="flex-1 text-slate-400 text-base">
                      Select a category
                    </Text>
                  </>
                )}
                <MaterialIcons name="chevron-right" size={24} color="#94A3B8" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Date Selection */}
          <View className="px-6 mb-6">
            <Text className="text-slate-700 font-semibold mb-3 text-lg">Date</Text>
            
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100"
            >
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-blue-100 rounded-2xl items-center justify-center mr-4">
                  <MaterialIcons name="calendar-today" size={24} color="#3B82F6" />
                </View>
                <View className="flex-1">
                  <Text className="text-slate-900 font-semibold text-base">
                    {formatDate(transaction.date)}
                  </Text>
                  <Text className="text-slate-500 text-sm">
                    {transaction.date.toLocaleDateString() === new Date().toLocaleDateString() 
                      ? 'Today' 
                      : 'Custom date'
                    }
                  </Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#94A3B8" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Description */}
          <View className="px-6 mb-8">
            <Text className="text-slate-700 font-semibold mb-3 text-lg">
              Description (Optional)
            </Text>
            
            <View className="bg-white rounded-2xl shadow-sm border border-slate-100">
              <TextInput
                value={transaction.description}
                onChangeText={(value) => setTransaction(prev => ({ ...prev, description: value }))}
                placeholder="Add a note..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                className="p-4 text-slate-700 text-base"
                style={{ minHeight: 80 }}
              />
            </View>
          </View>

          {/* Recent Categories */}
          <View className="px-6 mb-8">
            <Text className="text-slate-700 font-semibold mb-3 text-lg">Recent Categories</Text>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              className="flex-row space-x-3"
              contentContainerStyle={{ paddingRight: 20 }}
            >
              {(transactionType === 'expense' ? expenseCategories : incomeCategories)
                .slice(0, 5)
                .map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    onPress={() => handleCategorySelect(category)}
                    className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 items-center min-w-[80px]"
                  >
                    <View
                      className="w-10 h-10 rounded-xl items-center justify-center mb-2"
                      style={{ backgroundColor: category.color + '20' }}
                    >
                      <MaterialIcons
                        name={category.icon as any}
                        size={20}
                        color={category.color}
                      />
                    </View>
                    <Text className="text-slate-600 text-xs font-medium text-center">
                      {category.name.split(' ')[0]}
                    </Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Save Button */}
      <View className="px-6 pb-6 pt-4 bg-white border-t border-slate-200">
        <TouchableOpacity
          onPress={handleSaveTransaction}
          disabled={!transaction.amount || !transaction.category || isLoading}
          className={`py-4 rounded-2xl shadow-lg ${
            transaction.amount && transaction.category && !isLoading
              ? transactionType === 'expense' 
                ? 'bg-red-500 active:bg-red-600'
                : 'bg-emerald-500 active:bg-emerald-600'
              : 'bg-slate-300'
          }`}
        >
          <Text className={`text-center font-bold text-lg ${
            transaction.amount && transaction.category && !isLoading
              ? 'text-white'
              : 'text-slate-500'
          }`}>
            {isLoading 
              ? 'Saving Transaction...' 
              : `Add ${transactionType.charAt(0).toUpperCase() + transactionType.slice(1)}`
            }
          </Text>
        </TouchableOpacity>
      </View>

      <CategoryModal />
    </SafeAreaView>
  );
};

export default AddTransactionScreen;