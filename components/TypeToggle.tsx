import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

interface TypeToggleProps {
  transactionType: 'income' | 'expense';
  handleTypeChange: (type: 'income' | 'expense') => void;
}

const TypeToggle: React.FC<TypeToggleProps> = ({
  transactionType,
  handleTypeChange,
}) => (
  <View className="bg-slate-100 p-1 rounded-2xl flex-row">
    <TouchableOpacity
      onPress={() => handleTypeChange('expense')}
      className={`flex-1 py-3 rounded-xl ${
        transactionType === 'expense' ? 'bg-white shadow-sm' : ''
      }`}
    >
      <Text
        className={`text-center font-semibold ${
          transactionType === 'expense' ? 'text-red-600' : 'text-slate-500'
        }`}
      >
        Expense
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      onPress={() => handleTypeChange('income')}
      className={`flex-1 py-3 rounded-xl ${
        transactionType === 'income' ? 'bg-white shadow-sm' : ''
      }`}
    >
      <Text
        className={`text-center font-semibold ${
          transactionType === 'income' ? 'text-emerald-600' : 'text-slate-500'
        }`}
      >
        Income
      </Text>
    </TouchableOpacity>
  </View>
);

export default TypeToggle;
