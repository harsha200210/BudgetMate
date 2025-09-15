import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Transaction } from '@/app/(dashboard)/transactions';

type TransactionItemProps = {
  item: Transaction;
  setSelectedTransaction: React.Dispatch<
    React.SetStateAction<Transaction | null>
  >;
  setShowTransactionModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const TransactionItem: React.FC<TransactionItemProps> = ({
  item,
  setSelectedTransaction,
  setShowTransactionModal,
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        setSelectedTransaction(item);
        setShowTransactionModal(true);
      }}
      className="bg-white mx-6 p-4 rounded-2xl shadow-sm border border-slate-100 mb-3"
    >
      <View className="flex-row items-center">
        {/* Icon */}
        <View
          className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
          style={{
            backgroundColor: item.category
              ? item.category.color + '20'
              : '#00000020',
          }}
        >
          <MaterialIcons
            name={
              (item.category?.icon as keyof typeof MaterialIcons.glyphMap) ||
              'help-outline'
            }
            size={24}
            color={item.category ? item.category.color : '#000000'}
          />
        </View>

        {/* Content */}
        <View className="flex-1">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-slate-900 font-semibold text-base">
              {item.category ? item.category.name : 'Unknown'}
            </Text>
            <Text
              className={`font-bold text-lg ${
                item.type === 'income'
                  ? 'text-emerald-600'
                  : 'text-red-600'
              }`}
            >
              {item.type === 'income' ? '+' : '-'}LKR{' '}
              {item.amount.toFixed(2)}
            </Text>
          </View>

          <Text
            className="text-slate-500 text-sm mb-1"
            numberOfLines={1}
          >
            {item.description}
          </Text>

          <View className="flex-row justify-between items-center">
            <Text className="text-slate-400 text-xs">
              {item.date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TransactionItem;
