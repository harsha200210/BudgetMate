import React from 'react';
import {
  Modal,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SortType, TimePeriod } from '@/app/(dashboard)/transactions';


type FilterModalProps = {
  showFilterModal: boolean;
  setShowFilterModal: React.Dispatch<React.SetStateAction<boolean>>;
  timePeriod: TimePeriod;
  setTimePeriod: React.Dispatch<React.SetStateAction<TimePeriod>>;
  sortType: SortType;
  setSortType: React.Dispatch<React.SetStateAction<SortType>>;
};

const FilterModal: React.FC<FilterModalProps> = ({
  showFilterModal,
  setShowFilterModal,
  timePeriod,
  setTimePeriod,
  sortType,
  setSortType,
}) => (
  <Modal
    visible={showFilterModal}
    animationType="slide"
    presentationStyle="pageSheet"
    onRequestClose={() => setShowFilterModal(false)}
  >
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Header */}
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
              <Text
                className={`font-medium ${
                  timePeriod === period.key ? 'text-white' : 'text-slate-600'
                }`}
              >
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
                sortType === sort.key
                  ? 'bg-emerald-100 border-2 border-emerald-500'
                  : 'bg-white border border-slate-200'
              }`}
            >
              <MaterialIcons
                name={sort.icon as any}
                size={24}
                color={sortType === sort.key ? '#10B981' : '#64748B'}
              />
              <Text
                className={`ml-3 font-medium ${
                  sortType === sort.key ? 'text-emerald-700' : 'text-slate-700'
                }`}
              >
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

export default FilterModal;
