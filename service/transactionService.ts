// services/financeService.ts
import { Category, Transaction } from "@/app/(dashboard)/add";
import { db, auth } from "@/firebase";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, orderBy, query, serverTimestamp, Timestamp, updateDoc, where } from "firebase/firestore";

export const addTransaction = async (type: "expense" | "income", amount: number, category: Category, note?: string) => {
  if (!auth.currentUser) throw new Error("User not logged in");

  return await addDoc(collection(db, "transactions"), {
    userId: auth.currentUser.uid,
    type,            // "expense" or "income"
    amount,
    category,
    note: note || "",
    date: new Date(),
    createdAt: serverTimestamp(),
  });
};

export const getAllTransactions = async (): Promise<Transaction[]> => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");

  const q = query(
    collection(db, "users", user.uid, "transactions"),
    orderBy("createdAt", "desc") // latest first
  );

  const querySnapshot = await getDocs(collection(db, "transactions"));

  return querySnapshot.docs.map(doc => {
    const data = doc.data();

    return {
      id: doc.id,
      type: data.type as 'income' | 'expense',
      amount: data.amount as string,
      category: {
        id: data.category?.id || "",
        name: data.category?.name || "",
        icon: data.category?.icon || "help",
        color: data.category?.color || "#000000",
        type: data.category?.type || "expense",
      },
      description: data.note || "",
      date: (data.date as Timestamp).toDate(),
    };
  });
};

export const listenToTransactions = (callback: (transactions: any[]) => void) => {
  const user = auth.currentUser;
  if (!user) return;

  // const q = collection(db, "transactions");
  const q = query(
    collection(db, "transactions"),
    where("userId", "==", user.uid) // ✅ filter by logged-in user
  );

  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => {
      const data = doc.data();

      return {
        id: doc.id,
        type: data.type as 'income' | 'expense',
        amount: data.amount as string,
        category: {
          name: data.category?.name || "",
          icon: data.category?.icon || "help",
          color: data.category?.color || "#000000",
        },
        description: data.note || "",
        date: (data.date as Timestamp).toDate(),
      };
    });
    callback(data);
  });
};

export const deleteTransaction = async (transactionId: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");

  const transactionRef = doc(db, "transactions", transactionId);
  const snapshot = await getDoc(transactionRef);

  if (!snapshot.exists()) {
    throw new Error("Transaction not found");
  }

  const data = snapshot.data();
  if (data.userId !== user.uid) {
    throw new Error("Unauthorized to delete this transaction");
  }

  await deleteDoc(transactionRef);
  return true;
};

export const updateTransaction = async (
  transactionId: string,
  updatedData: {
    amount?: number;
    description?: string;
  }
) => {
  try {
    const transactionRef = doc(db, 'transactions', transactionId);
    await updateDoc(transactionRef, updatedData);
    console.log('Transaction updated successfully');
  } catch (error) {
    console.error('Error updating transaction: ', error);
  }
};