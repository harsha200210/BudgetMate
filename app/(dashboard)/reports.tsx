import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';

interface CategoryData {
  name: string;
  amount: number;
  percentage: number;
  color: string;
  icon: string;
}

interface MonthlyData {
  month: string;
  income: number;
  expense: number;
  savings: number;
}

type ReportPeriod = 'week' | 'month' | 'year';
type ReportType = 'overview' | 'income' | 'expense' | 'savings';

const ReportsScreen: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>('month');
  const [selectedType, setSelectedType] = useState<ReportType>('overview');
  
  const screenWidth = Dimensions.get('window').width;

  // Sample data
  const categoryData: CategoryData[] = [
    { name: 'Food & Dining', amount: 1200, percentage: 35, color: '#EF4444', icon: 'restaurant' },
    { name: 'Transportation', amount: 800, percentage: 23, color: '#F59E0B', icon: 'directions-car' },
    { name: 'Shopping', amount: 600, percentage: 18, color: '#8B5CF6', icon: 'shopping-bag' },
    { name: 'Entertainment', amount: 400, percentage: 12, color: '#06B6D4', icon: 'movie' },
    { name: 'Bills & Utilities', amount: 300, percentage: 9, color: '#10B981', icon: 'receipt' },
    { name: 'Others', amount: 100, percentage: 3, color: '#64748B', icon: 'more-horiz' },
  ];

  const monthlyData: MonthlyData[] = [
    { month: 'Jan', income: 5000, expense: 3500, savings: 1500 },
    { month: 'Feb', income: 5200, expense: 3800, savings: 1400 },
    { month: 'Mar', income: 4800, expense: 3200, savings: 1600 },
    { month: 'Apr', income: 5500, expense: 4000, savings: 1500 },
    { month: 'May', income: 5800, expense: 4200, savings: 1600 },
    { month: 'Jun', income: 6000, expense: 3900, savings: 2100 },
  ];

  const pieChartData = categoryData.map(item => ({
    name: item.name,
    population: item.amount,
    color: item.color,
    legendFontColor: '#64748B',
    legendFontSize: 12,
  }));

  const lineChartData = {
    labels: monthlyData.map(item => item.month),
    datasets: [
      {
        data: monthlyData.map(item => item.income),
        color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
        strokeWidth: 3,
      },
      {
        data: monthlyData.map(item => item.expense),
        color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
        strokeWidth: 3,
      },
      {
        data: monthlyData.map(item => item.savings),
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };

  const barChartData = {
    labels: monthlyData.slice(-6).map(item => item.month),
    datasets: [
      {
        data: monthlyData.slice(-6).map(item => item.savings),
        colors: monthlyData.slice(-6).map(() => (opacity = 1) => `rgba(16, 185, 129, ${opacity})`),
      },
    ],
  };

  const PeriodButton = ({ period, label, isActive }: { 
    period: ReportPeriod; 
    label: string; 
    isActive: boolean 
  }) => (
    <TouchableOpacity
      onPress={() => setSelectedPeriod(period)}
      className={`px-6 py-3 rounded-full ${
        isActive ? 'bg-emerald-500 shadow-lg' : 'bg-white border border-slate-200'
      }`}
    >
      <Text className={`font-semibold ${
        isActive ? 'text-white' : 'text-slate-600'
      }`}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const TypeButton = ({ type, label, isActive }: { 
    type: ReportType; 
    label: string; 
    isActive: boolean 
  }) => (
    <TouchableOpacity
      onPress={() => setSelectedType(type)}
      className={`px-4 py-2 rounded-xl ${
        isActive ? 'bg-emerald-100' : 'bg-slate-50'
      }`}
    >
      <Text className={`font-medium text-sm ${
        isActive ? 'text-emerald-700' : 'text-slate-600'
      }`}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const StatCard = ({ 
    title, 
    amount, 
    change, 
    changeType, 
    icon, 
    color 
  }: {
    title: string;
    amount: string;
    change: string;
    changeType: 'up' | 'down';
    icon: string;
    color: string;
  }) => (
    <View className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex-1">
      <View className="flex-row items-center justify-between mb-3">
        <View className={`w-12 h-12 rounded-2xl items-center justify-center`} style={{ backgroundColor: color + '20' }}>
          <MaterialIcons name={icon as any} size={24} color={color} />
        </View>
        <View className={`flex-row items-center px-2 py-1 rounded-full ${
          changeType === 'up' ? 'bg-emerald-100' : 'bg-red-100'
        }`}>
          <MaterialIcons 
            name={changeType === 'up' ? 'arrow-upward' : 'arrow-downward'} 
            size={14} 
            color={changeType === 'up' ? '#10B981' : '#EF4444'} 
          />
          <Text className={`text-xs font-semibold ml-1 ${
            changeType === 'up' ? 'text-emerald-600' : 'text-red-600'
          }`}>
            {change}
          </Text>
        </View>
      </View>
      <Text className="text-slate-600 text-sm mb-1">{title}</Text>
      <Text className="text-slate-900 text-2xl font-bold">{amount}</Text>
    </View>
  );

  const CategoryItem = ({ item }: { item: CategoryData }) => (
    <View className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-3">
      <View className="flex-row items-center">
        <View 
          className="w-12 h-12 rounded-2xl items-center justify-center"
          style={{ backgroundColor: item.color + '20' }}
        >
          <MaterialIcons name={item.icon as any} size={24} color={item.color} />
        </View>
        
        <View className="flex-1 ml-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-slate-900 font-semibold">{item.name}</Text>
            <Text className="text-slate-900 font-bold">${item.amount.toLocaleString()}</Text>
          </View>
          
          <View className="flex-row items-center">
            <View className="flex-1 bg-slate-200 h-2 rounded-full mr-3">
              <View 
                className="h-2 rounded-full" 
                style={{ 
                  width: `${item.percentage}%`, 
                  backgroundColor: item.color 
                }}
              />
            </View>
            <Text className="text-slate-500 text-sm font-medium">{item.percentage}%</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View className="bg-white px-6 py-6 border-b border-slate-100">
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-slate-900 text-2xl font-bold">Reports</Text>
              <Text className="text-slate-500 text-base">Financial insights and analytics</Text>
            </View>
            <TouchableOpacity className="w-10 h-10 bg-slate-100 rounded-full items-center justify-center">
              <MaterialIcons name="file-download" size={24} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Period Selection */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="flex-row space-x-3"
            contentContainerStyle={{ paddingRight: 20 }}
          >
            <PeriodButton period="week" label="This Week" isActive={selectedPeriod === 'week'} />
            <PeriodButton period="month" label="This Month" isActive={selectedPeriod === 'month'} />
            <PeriodButton period="year" label="This Year" isActive={selectedPeriod === 'year'} />
          </ScrollView>
        </View>

        {/* Summary Stats */}
        <View className="px-6 py-6">
          <Text className="text-slate-900 text-xl font-bold mb-4">Summary</Text>
          
          <View className="flex-row space-x-4 mb-4">
            <StatCard
              title="Total Income"
              amount="$12,500"
              change="12%"
              changeType="up"
              icon="trending-up"
              color="#10B981"
            />
            <StatCard
              title="Total Expense"
              amount="$8,750"
              change="5%"
              changeType="down"
              icon="trending-down"
              color="#EF4444"
            />
          </View>

          <View className="flex-row space-x-4">
            <StatCard
              title="Net Savings"
              amount="$3,750"
              change="18%"
              changeType="up"
              icon="savings"
              color="#3B82F6"
            />
            <StatCard
              title="Budget Left"
              amount="$1,250"
              change="8%"
              changeType="up"
              icon="account-balance-wallet"
              color="#8B5CF6"
            />
          </View>
        </View>

        {/* Report Type Tabs */}
        <View className="px-6 mb-6">
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="flex-row space-x-3"
            contentContainerStyle={{ paddingRight: 20 }}
          >
            <TypeButton type="overview" label="Overview" isActive={selectedType === 'overview'} />
            <TypeButton type="income" label="Income" isActive={selectedType === 'income'} />
            <TypeButton type="expense" label="Expense" isActive={selectedType === 'expense'} />
            <TypeButton type="savings" label="Savings" isActive={selectedType === 'savings'} />
          </ScrollView>
        </View>

        {/* Charts Section */}
        <View className="px-6 mb-6">
          
          {/* Line Chart - Trends */}
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-slate-900 text-lg font-bold">Income vs Expense Trend</Text>
              <TouchableOpacity>
                <MaterialIcons name="fullscreen" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>
            
            <View className="flex-row justify-center space-x-6 mb-4">
              <View className="flex-row items-center">
                <View className="w-3 h-3 bg-emerald-500 rounded-full mr-2" />
                <Text className="text-slate-600 text-sm">Income</Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-3 h-3 bg-red-500 rounded-full mr-2" />
                <Text className="text-slate-600 text-sm">Expense</Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
                <Text className="text-slate-600 text-sm">Savings</Text>
              </View>
            </View>

            <LineChart
              data={lineChartData}
              width={screenWidth - 80}
              height={220}
              chartConfig={{
                backgroundColor: 'transparent',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity * 0.1})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity * 0.7})`,
                style: { borderRadius: 16 },
                propsForDots: {
                  r: '4',
                  strokeWidth: '2',
                },
              }}
              bezier
              style={{ marginVertical: 8, borderRadius: 16 }}
            />
          </View>

          {/* Pie Chart - Categories */}
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-slate-900 text-lg font-bold">Expense by Category</Text>
              <TouchableOpacity>
                <MaterialIcons name="pie-chart" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <PieChart
              data={pieChartData}
              width={screenWidth - 80}
              height={220}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>

          {/* Bar Chart - Savings */}
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-slate-900 text-lg font-bold">Monthly Savings</Text>
              <TouchableOpacity>
                <MaterialIcons name="bar-chart" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <BarChart
              data={barChartData}
              width={screenWidth - 80}
              height={220}
              yAxisLabel="$"
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

        {/* Category Breakdown */}
        <View className="px-6 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-slate-900 text-xl font-bold">Category Breakdown</Text>
            <TouchableOpacity>
              <Text className="text-emerald-600 font-semibold">View All</Text>
            </TouchableOpacity>
          </View>

          {categoryData.map((item, index) => (
            <CategoryItem key={index} item={item} />
          ))}
        </View>

        {/* Insights Section */}
        <View className="px-6 mb-6">
          <Text className="text-slate-900 text-xl font-bold mb-4">Key Insights</Text>

          <LinearGradient
            colors={["#10B981", "#0D9488"]} // emerald-500 → teal-600
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ borderRadius: 16, padding: 10, marginBottom: 16 }}
          >
            <View className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 mb-4">
              <View className="flex-row items-center mb-3">
                <View className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-3">
                  <MaterialIcons name="trending-up" size={24} color="white" />
                </View>
                <Text className="text-white font-bold text-lg">Best Saving Month</Text>
              </View>
              <Text className="text-white/90 text-base mb-2">
                June was your best saving month with $2,100 saved
              </Text>
              <Text className="text-white/70 text-sm">
                That's 35% of your income! Keep it up! 🎉
              </Text>
            </View>
          </LinearGradient>

          <LinearGradient
            colors={["#f59e0b", "#ea580c"]} // amber-500 → orange-600
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ borderRadius: 16, padding: 24, marginBottom: 16 }}
          >
            <View className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-6 mb-4">
              <View className="flex-row items-center mb-3">
                <View className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-3">
                  <MaterialIcons name="restaurant" size={24} color="white" />
                </View>
                <Text className="text-white font-bold text-lg">Biggest Expense</Text>
              </View>
              <Text className="text-white/90 text-base mb-2">
                Food & Dining accounts for 35% of your spending
              </Text>
              <Text className="text-white/70 text-sm">
                Consider meal planning to reduce costs
              </Text>
          </View>
          </LinearGradient>

          <LinearGradient
            colors={["#9333EA", "#DB2777"]} // purple-500 → pink-600
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ borderRadius: 16, padding: 24, marginBottom: 16 }}
          >
            <View className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-6">
              <View className="flex-row items-center mb-3">
                <View className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-3">
                  <MaterialIcons name="lightbulb" size={24} color="white" />
                </View>
                <Text className="text-white font-bold text-lg">Smart Tip</Text>
              </View>
              <Text className="text-white/90 text-base mb-2">
                You could save $200/month by reducing entertainment expenses by 20%
              </Text>
              <Text className="text-white/70 text-sm">
                Small changes, big results! 💪
              </Text>
            </View>
          </LinearGradient>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default ReportsScreen;