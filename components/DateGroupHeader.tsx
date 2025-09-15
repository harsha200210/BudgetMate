import React from 'react';
import { View, Text } from 'react-native';

// Small helper function to format your date
const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    weekday: 'short', // e.g. Mon
    month: 'short',   // e.g. Jan
    day: 'numeric',   // e.g. 3
  });
};

type DateGroupHeaderProps = {
  date: string;        // "2025-09-14" etc.
  totalIncome: number;
  totalExpense: number;
};

const DateGroupHeader: React.FC<DateGroupHeaderProps> = ({
  date,
  totalIncome,
  totalExpense,
}) => (
  <View className="bg-slate-50 px-6 py-3 border-b border-slate-200">
    <View className="flex-row justify-between items-center">
      <Text className="text-slate-700 font-semibold">
        {formatDate(new Date(date))}
      </Text>
      <View className="flex-row space-x-4">
        {totalIncome > 0 && (
          <Text className="text-emerald-600 font-semibold text-sm">
            +LKR {totalIncome.toFixed(2)}
          </Text>
        )}
        {totalExpense > 0 && (
          <Text className="text-red-600 font-semibold text-sm">
            -LKR {totalExpense.toFixed(2)}
          </Text>
        )}
      </View>
    </View>
  </View>
);

export default DateGroupHeader;
