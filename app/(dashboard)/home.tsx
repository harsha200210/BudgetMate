import { useAuth } from '@/hooks/useAuth';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from "expo-linear-gradient";
import { listenToTransactions } from '@/service/transactionService';
import { useRouter } from 'expo-router';

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

type FilterPeriod = 'today' | 'weekly' | 'monthly';

const HomeScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useRouter();
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('monthly');
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    const unsubscribe = listenToTransactions(setTransactions);
    return () => unsubscribe && unsubscribe();
  }, []);

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = totalIncome - totalExpense;

  const barData = {
    labels: ['Income', 'Expense'],
    datasets: [
      {
        data: [totalIncome, totalExpense],
        colors: [
          (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
          (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
        ],
      },
    ],
  };


  useEffect(() => {
    console.log('User data:', user);
  }, []);

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
          {/* Header */}
          <View className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 pt-6 pb-8">
            <View className="flex-row justify-between items-center mb-6">
              <View>
                <Text className="text-white/80 text-base">Welcome back,</Text>
                <Text className="text-white text-2xl font-bold">{user?.displayName}</Text>
              </View>
              <TouchableOpacity className="w-10 h-10 bg-white/20 rounded-full items-center justify-center">
                <MaterialIcons name="notifications" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Balance Card */}
            <View className="bg-white/10 rounded-3xl p-6 backdrop-blur-xl border border-white/20">
              <Text className="text-white/80 text-base mb-2">Total Balance</Text>
              <Text className="text-white text-3xl font-bold mb-4">
                LKR {balance.toLocaleString()}
              </Text>
              
              <View className="flex-row justify-between">
                <View className="flex-1">
                  <Text className="text-white/60 text-sm">Income</Text>
                  <Text className="text-white text-lg font-semibold">
                    LKR {totalIncome.toLocaleString()}
                  </Text>
                </View>
                <View className="flex-1 items-end">
                  <Text className="text-white/60 text-sm">Expense</Text>
                  <Text className="text-white text-lg font-semibold">
                    LKR {totalExpense.toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Charts Section */}
        <View className="px-6 mb-6">
          <View className="flex-row justify-between items-center mb-4 mt-3">
            <Text className="text-slate-900 text-xl font-bold">Analytics</Text>
          </View>

          {/* Bar Chart */}
          <View className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <Text className="text-slate-700 font-semibold mb-4">Current Month Overview</Text>
            <BarChart
              data={barData}
              width={screenWidth - 80}
              height={200}
              yAxisLabel="LKR "
              yAxisSuffix=""
              chartConfig={{
                backgroundColor: 'transparent',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity * 0.1})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity * 0.7})`,
                style: { borderRadius: 16 },
              }}
              style={{ marginVertical: 8, borderRadius: 16 }}
              showValuesOnTopOfBars
            />
          </View>
        </View>

        {/* Recent Transactions */}
        <View className="px-6 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-slate-900 text-xl font-bold">Recent Transactions</Text>
            <TouchableOpacity onPress={() => { navigation.push('/(dashboard)/transactions'); }}>
              <Text className="text-emerald-600 font-semibold">View All</Text>
            </TouchableOpacity>
          </View>

          <View className="bg-white rounded-2xl border border-slate-100 shadow-sm">
            {transactions.slice(0, 5).map((transaction, index) => (
              <View 
                key={transaction.id}
                className={`flex-row items-center p-4 ${
                  index !== transactions.slice(0, 5).length - 1 ? 'border-b border-slate-100' : ''
                }`}
              >
                <View className={`w-12 h-12 rounded-2xl items-center justify-center ${
                  transaction.type === 'income' ? 'bg-emerald-100' : 'bg-red-100'
                }`}>
                  <MaterialIcons
                    name={transaction.type === 'income' ? 'arrow-upward' : 'arrow-downward'}
                    size={20}
                    color={transaction.type === 'income' ? '#10B981' : '#EF4444'}
                  />
                </View>
                
                <View className="flex-1 ml-4">
                  <Text className="text-slate-900 font-semibold text-base">
                    {transaction.category?.name}
                  </Text>
                  <Text className="text-slate-500 text-sm">
                    {transaction.description}
                  </Text>
                </View>
                
                <Text className={`font-bold text-lg ${
                  transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}LKR {transaction.amount.toLocaleString()}
                </Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;