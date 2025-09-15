import React, { useEffect, useState } from 'react';
import {
  Modal,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Transaction } from '@/app/(dashboard)/transactions';
import { updateTransaction } from '@/service/transactionService';

interface Props {
  selectedTransaction: Transaction | null;
  showTransactionModal: boolean;
  setShowTransactionModal: (v: boolean) => void;
  handleDeleteTransaction: (id: string) => void;
}

const TransactionDetailModal: React.FC<Props> = ({
  selectedTransaction,
  showTransactionModal,
  setShowTransactionModal,
  handleDeleteTransaction,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Transaction | null>(null);

  // When a new transaction comes in → reset form + editing state
  useEffect(() => {
    if (selectedTransaction) {
      setEditForm(selectedTransaction);
      setIsEditing(false);
    }
  }, [selectedTransaction]);

  const handleSave = async () => {
    if (!editForm) return;
    // Update Firestore (via your service)
    await updateTransaction(editForm.id, {
      amount: editForm.amount,
      description: editForm.description,
    });
    
    setIsEditing(false);
    setShowTransactionModal(false);
  };

  return (
    <Modal
      visible={showTransactionModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowTransactionModal(false)}
    >
      <SafeAreaView className="flex-1 bg-slate-50">
        {selectedTransaction ? (
          <>
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
                    onPress={() =>
                      handleDeleteTransaction(selectedTransaction.id)
                    }
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
                      {selectedTransaction.date.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Text>
                    <Text className="text-slate-600 text-sm">
                      {selectedTransaction.date.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>

                  {/* Edit button */}
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
                    value={editForm?.description ?? ''}
                    onChangeText={(text) =>
                      setEditForm((prev) => prev && { ...prev, description: text })
                    }
                    className="bg-white p-4 rounded-2xl mb-4"
                    placeholder="Description"
                  />
                  <TextInput
                    value={editForm?.amount ? String(editForm.amount) : ''}
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
          </>
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text>No transaction selected</Text>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

export default TransactionDetailModal;
