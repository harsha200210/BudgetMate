import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { deleteTransaction, listenToTransactions } from '@/service/transactionService';
import Toast from 'react-native-toast-message';
import TransactionItem from '@/components/TransactionItem';
import DateGroupHeader from '@/components/DateGroupHeader';
import FilterModal from '@/components/FilterModal';
import TransactionDetailModal from '@/components/TransactionDetailModal';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: {
    name: string;
    icon: string;
    color: string;
  } | null;
  description: string;
  date: Date;
}

type FilterType = 'all' | 'income' | 'expense';
export type SortType = 'date' | 'amount' | 'category';
export type TimePeriod = 'all' | 'today' | 'week' | 'month' | 'year';

const TransactionsScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('month');
  const [sortType, setSortType] = useState<SortType>('date');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const unsubscribe = listenToTransactions(setTransactions);
    return () => unsubscribe && unsubscribe();
  }, []);

  // Filter and search transactions
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (transaction) => 
          transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (transaction.category && transaction.category.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter((transaction) => transaction.type === filterType);
    }

    // Filter by time period
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

    switch (timePeriod) {
      case 'today':
        filtered = filtered.filter((transaction) => transaction.date >= today);
        break;
      case 'week':
        filtered = filtered.filter((transaction) => transaction.date >= weekAgo);
        break;
      case 'month':
        filtered = filtered.filter((transaction) => transaction.date >= monthAgo);
        break;
      case 'year':
        filtered = filtered.filter((transaction) => transaction.date >= yearAgo);
        break;
    }

    // Sort transactions
    filtered.sort((a, b) => {
      switch (sortType) {
        case 'date':
          return b.date.getTime() - a.date.getTime();
        case 'amount':
          return b.amount - a.amount;
        case 'category':
          return a.category ? a.category.name.localeCompare(b.category ? b.category.name : '') : -1;
        default:
          return 0;
      }
    });

    return filtered;
  }, [transactions, searchQuery, filterType, timePeriod, sortType]);

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    const groups: { [key: string]: Transaction[] } = {};
    
    filteredTransactions.forEach((transaction) => {
      const dateKey = transaction.date.toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(transaction);
    });

    return Object.entries(groups).map(([date, transactions]) => ({
      date,
      transactions,
      totalIncome: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
      totalExpense: transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
    }));
  }, [filteredTransactions]);

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const handleDeleteTransaction = (transactionId: string) => {
    console.log("Attempting to delete transaction:", transactionId);
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteTransaction(transactionId);

              Toast.show({
                type: "success",
                text1: "Transaction deleted successfully",
                text2: "Your transaction has been removed.",
              });

              setShowTransactionModal(false);
            } catch (error) {
              Toast.show({
                type: "error",
                text1: "Delete failed",
                text2: "Something went wrong while deleting.",
              });
            }
          },
        },
      ]
    );
  };

  const FilterButton = ({ 
    type, 
    label, 
    isActive 
  }: { 
    type: FilterType; 
    label: string; 
    isActive: boolean 
  }) => (
    <TouchableOpacity
      onPress={() => setFilterType(type)}
      className={`px-4 py-2 rounded-full mr-3 ${
        isActive ? 'bg-emerald-500' : 'bg-slate-100'
      }`}
    >
      <Text className={`font-medium ${
        isActive ? 'text-white' : 'text-slate-600'
      }`}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: { date: string; transactions: Transaction[]; totalIncome: number; totalExpense: number } }) => (
    <View>
      <DateGroupHeader
          date={item.date}
          totalIncome={item.totalIncome}
          totalExpense={item.totalExpense}
          />
      {item.transactions.map((transaction) => (
        <TransactionItem
            key={transaction.id}
            item={transaction}
            setSelectedTransaction={setSelectedTransaction}
            setShowTransactionModal={setShowTransactionModal}
          />
      ))}
    </View>
  );

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-slate-200">
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-2xl font-bold text-slate-900">Transactions</Text>
            <Text className="text-slate-500 text-sm">
              {filteredTransactions.length} transactions found
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowFilterModal(true)}
            className="w-10 h-10 bg-slate-100 rounded-full items-center justify-center"
          >
            <MaterialIcons name="filter-list" size={24} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="bg-slate-100 rounded-2xl px-4 py-3 mb-4 flex-row items-center">
          <MaterialIcons name="search" size={20} color="#64748B" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search transactions..."
            placeholderTextColor="#94A3B8"
            className="flex-1 ml-3 text-slate-700 text-base"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialIcons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Buttons */}
        <View className="flex-row">
          <FilterButton type="all" label="All" isActive={filterType === 'all'} />
          <FilterButton type="income" label="Income" isActive={filterType === 'income'} />
          <FilterButton type="expense" label="Expense" isActive={filterType === 'expense'} />
        </View>
      </View>

      {/* Summary */}
      <View className="bg-white px-6 py-4 border-b border-slate-200">
        <View className="flex-row justify-between">
          <View className="flex-1">
            <Text className="text-slate-500 text-sm">Total Income</Text>
            <Text className="text-emerald-600 text-lg font-bold">
              +LKR {totalIncome.toFixed(2)}
            </Text>
          </View>
          <View className="flex-1 items-center">
            <Text className="text-slate-500 text-sm">Net</Text>
            <Text className={`text-lg font-bold ${
              totalIncome - totalExpense >= 0 ? 'text-emerald-600' : 'text-red-600'
            }`}>
              LKR {(totalIncome - totalExpense).toFixed(2)}
            </Text>
          </View>
          <View className="flex-1 items-end">
            <Text className="text-slate-500 text-sm">Total Expense</Text>
            <Text className="text-red-600 text-lg font-bold">
              -LKR {totalExpense.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      {/* Transactions List */}
      <FlatList
        data={groupedTransactions}
        renderItem={renderItem}
        keyExtractor={(item) => item.date}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <View className="items-center justify-center py-12">
            <MaterialIcons name="receipt-long" size={64} color="#CBD5E1" />
            <Text className="text-slate-400 text-lg font-medium mt-4">
              No transactions found
            </Text>
            <Text className="text-slate-400 text-sm">
              Try adjusting your filters
            </Text>
          </View>
        }
      />

      <FilterModal
        showFilterModal={showFilterModal}
        setShowFilterModal={setShowFilterModal}
        timePeriod={timePeriod}
        setTimePeriod={setTimePeriod}
        sortType={sortType}
        setSortType={setSortType}
      />
      <TransactionDetailModal
        selectedTransaction={selectedTransaction}
        showTransactionModal={showTransactionModal}
        setShowTransactionModal={setShowTransactionModal}
        handleDeleteTransaction={handleDeleteTransaction}
      />
    </SafeAreaView>
  );
};

export default TransactionsScreen;