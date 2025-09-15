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
import { deleteTransaction, getAllTransactions, listenToTransactions } from '@/service/transactionService';
import { Transaction as Transactions} from './add';
import { Timestamp } from 'firebase/firestore';
import Toast from 'react-native-toast-message';

interface Transaction {
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
type SortType = 'date' | 'amount' | 'category';
type TimePeriod = 'all' | 'today' | 'week' | 'month' | 'year';

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
    // const fetchTransactions = async () => {
    //   try {
    //     const txs: Transactions[] = await getAllTransactions();
    //     const formatted: Transaction[] = txs.map(tx => ({
    //       id: tx.id || '',
    //       type: tx.type,
    //       amount: parseFloat(tx.amount),
    //       category: tx.category ? {
    //         name: tx.category.name || "",
    //         icon: tx.category.icon || "",
    //         color: tx.category.color || "",
    //       } : null,
    //       description: tx.description || "",
    //       date: tx.date instanceof Timestamp ? tx.date.toDate() : new Date(tx.date),
    //     }));

    //     setTransactions(formatted);
        
    //   } catch (error) {
    //     console.error("Failed to fetch transactions:", error);
    //   }
    // };
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

  const TransactionItem = ({ item }: { item: Transaction }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedTransaction(item);
        setShowTransactionModal(true);
      }}
      className="bg-white mx-6 p-4 rounded-2xl shadow-sm border border-slate-100 mb-3"
    >
      <View className="flex-row items-center">
        <View
          className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
          style={{ backgroundColor: item.category ? item.category.color + '20' : '#00000020' }}
        >
          <MaterialIcons
            name={(item.category?.icon as keyof typeof MaterialIcons.glyphMap) || 'help-outline'} as any
            size={24}
            color={item.category ? item.category.color : '#000000'}
          />
        </View>

        <View className="flex-1">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-slate-900 font-semibold text-base">
              {item.category ? item.category.name : 'Unknown'}
            </Text>
            <Text className={`font-bold text-lg ${
              item.type === 'income' ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {item.type === 'income' ? '+' : '-'}LKR {item.amount.toFixed(2)}
            </Text>
          </View>
          
          <Text className="text-slate-500 text-sm mb-1" numberOfLines={1}>
            {item.description}
          </Text>
          
          <View className="flex-row justify-between items-center">
            <Text className="text-slate-400 text-xs">
              {item.date.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const DateGroupHeader = ({ 
    date, 
    totalIncome, 
    totalExpense 
  }: { 
    date: string; 
    totalIncome: number; 
    totalExpense: number 
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

  const FilterModal = () => (
    <Modal
      visible={showFilterModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowFilterModal(false)}
    >
      <SafeAreaView className="flex-1 bg-slate-50">
        <View className="bg-white px-6 py-4 border-b border-slate-200">
          <View className="flex-row justify-between items-center">
            <Text className="text-xl font-bold text-slate-900">Filter & Sort</Text>
            <TouchableOpacity
              onPress={() => setShowFilterModal(false)}
              className="w-8 h-8 bg-slate-100 rounded-full items-center justify-center"
            >
              <MaterialIcons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-1 px-6 py-6">
          {/* Time Period */}
          <Text className="text-slate-900 font-bold text-lg mb-4">Time Period</Text>
          <View className="flex-row flex-wrap mb-8">
            {[
              { key: 'all', label: 'All Time' },
              { key: 'today', label: 'Today' },
              { key: 'week', label: 'This Week' },
              { key: 'month', label: 'This Month' },
              { key: 'year', label: 'This Year' },
            ].map((period) => (
              <TouchableOpacity
                key={period.key}
                onPress={() => setTimePeriod(period.key as TimePeriod)}
                className={`px-4 py-2 rounded-full mr-3 mb-3 ${
                  timePeriod === period.key ? 'bg-emerald-500' : 'bg-slate-100'
                }`}
              >
                <Text className={`font-medium ${
                  timePeriod === period.key ? 'text-white' : 'text-slate-600'
                }`}>
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Sort By */}
          <Text className="text-slate-900 font-bold text-lg mb-4">Sort By</Text>
          <View className="space-y-3">
            {[
              { key: 'date', label: 'Date (Newest First)', icon: 'schedule' },
              { key: 'amount', label: 'Amount (Highest First)', icon: 'attach-money' },
              { key: 'category', label: 'Category (A-Z)', icon: 'category' },
            ].map((sort) => (
              <TouchableOpacity
                key={sort.key}
                onPress={() => setSortType(sort.key as SortType)}
                className={`flex-row items-center p-4 rounded-2xl ${
                  sortType === sort.key ? 'bg-emerald-100 border-2 border-emerald-500' : 'bg-white border border-slate-200'
                }`}
              >
                <MaterialIcons
                  name={sort.icon as any}
                  size={24}
                  color={sortType === sort.key ? '#10B981' : '#64748B'}
                />
                <Text className={`ml-3 font-medium ${
                  sortType === sort.key ? 'text-emerald-700' : 'text-slate-700'
                }`}>
                  {sort.label}
                </Text>
                {sortType === sort.key && (
                  <View className="ml-auto">
                    <MaterialIcons name="check-circle" size={20} color="#10B981" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );

  const TransactionDetailModal = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<Transaction | null>(null);

    const handleSave = async () => {
      if (!editForm) return;
      // Update Firestore document:
      
      setIsEditing(false);
      setShowTransactionModal(false);
    };

     if (!selectedTransaction) return null; // ✅ avoid undefined crash

  return (
    <Modal
      visible={showTransactionModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowTransactionModal(false)}
    >
      <SafeAreaView className="flex-1 bg-slate-50">
        {/* Header */}
        <View className="bg-white px-6 py-4 border-b border-slate-200">
          <View className="flex-row justify-between items-center">
            <TouchableOpacity
              onPress={() => setShowTransactionModal(false)}
              className="w-8 h-8 bg-slate-100 rounded-full items-center justify-center"
            >
              <MaterialIcons name="close" size={20} color="#64748B" />
            </TouchableOpacity>

            <Text className="text-xl font-bold text-slate-900">
              {isEditing ? 'Edit Transaction' : 'Transaction Details'}
            </Text>

            {isEditing ? (
              <TouchableOpacity
                onPress={handleSave}
                className="px-4 py-2 bg-emerald-500 rounded-xl"
              >
                <Text className="text-white font-semibold">Save</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => handleDeleteTransaction(selectedTransaction.id)}
                className="w-8 h-8 bg-red-100 rounded-full items-center justify-center"
              >
                <MaterialIcons name="delete" size={20} color="#EF4444" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Body */}
        <View className="flex-1 px-6 py-6">
          {!isEditing ? (
            <>
              {/* Transaction display */}
              <View className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-6 items-center">
                <View
                  className="w-16 h-16 rounded-3xl items-center justify-center mb-4"
                  style={{
                    backgroundColor:
                      selectedTransaction.category?.color + '20' || '#00000020',
                  }}
                >
                  <MaterialIcons
                    name={
                      (selectedTransaction.category?.icon as keyof typeof MaterialIcons.glyphMap) ||
                      'help-outline'
                    }
                    size={32}
                    color={selectedTransaction.category?.color || '#000000'}
                  />
                </View>
                <Text className="text-slate-600 text-base mb-2">
                  {selectedTransaction.type === 'income' ? 'Income' : 'Expense'}
                </Text>
                <Text
                  className={`text-4xl font-bold mb-2 ${
                    selectedTransaction.type === 'income'
                      ? 'text-emerald-600'
                      : 'text-red-600'
                  }`}
                >
                  {selectedTransaction.type === 'income' ? '+' : '-'}LKR{' '}
                  {selectedTransaction.amount.toFixed(2)}
                </Text>
                <Text className="text-slate-500 text-base">
                  {selectedTransaction.category?.name ?? 'No category'}
                </Text>
              </View>

              {/* Description */}
              <View className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <Text className="text-slate-500 text-sm mb-1">Description</Text>
                <Text className="text-slate-900 font-medium text-base">
                  {selectedTransaction.description || 'No description'}
                </Text>
              </View>

              {/* Date */}
              <View className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mt-4">
                <Text className="text-slate-500 text-sm mb-1">Date & Time</Text>
                <Text className="text-slate-900 font-medium text-base">
                  {selectedTransaction.date instanceof Date
                    ? selectedTransaction.date.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : ''}
                </Text>
                <Text className="text-slate-600 text-sm">
                  {selectedTransaction.date instanceof Date
                    ? selectedTransaction.date.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : ''}
                </Text>
              </View>

              {/* Action button */}
              <View className="flex-row space-x-4 mt-8">
                <TouchableOpacity
                  onPress={() => setIsEditing(true)}
                  className="flex-1 bg-emerald-500 py-4 rounded-2xl"
                >
                  <Text className="text-white font-bold text-center">
                    Edit Transaction
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              {/* Editable form */}
              <TextInput
                value={editForm?.description}
                onChangeText={(text) =>
                  setEditForm((prev) => prev && { ...prev, description: text })
                }
                className="bg-white p-4 rounded-2xl mb-4"
                placeholder="Description"
              />
              <TextInput
                value={String(editForm?.amount)}
                onChangeText={(text) =>
                  setEditForm((prev) =>
                    prev && { ...prev, amount: parseFloat(text) || 0 },
                  )
                }
                keyboardType="numeric"
                className="bg-white p-4 rounded-2xl mb-4"
                placeholder="Amount"
              />
            </>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

  const renderItem = ({ item }: { item: { date: string; transactions: Transaction[]; totalIncome: number; totalExpense: number } }) => (
    <View>
      <DateGroupHeader 
        date={item.date} 
        totalIncome={item.totalIncome} 
        totalExpense={item.totalExpense} 
      />
      {item.transactions.map((transaction) => (
        <TransactionItem key={transaction.id} item={transaction} />
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

      <FilterModal />
      <TransactionDetailModal />
    </SafeAreaView>
  );
};

export default TransactionsScreen;