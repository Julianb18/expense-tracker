import { useMemo, useState, useCallback } from "react";
import { v4 as uuid } from "uuid";
import { addExpense } from "../firebase/firestore";

export function useExpenseModal({
  uid,
  year,
  month,
  selectedCategory,
  setIsExpenseModalOpen,
  selectedCategoryData,
}) {
  const [expense, setExpense] = useState({
    title: "",
    amount: "",
    id: uuid(),
    date: new Date().toISOString().split("T")[0],
  });

  const resetExpense = useCallback(() => {
    setExpense({
      title: "",
      amount: "",
      id: uuid(),
      date: new Date().toISOString().split("T")[0],
      createdAt: Date.now(),
    });
  }, []);

  const handleClose = useCallback(() => {
    setIsExpenseModalOpen(false);
    resetExpense();
  }, [setIsExpenseModalOpen, resetExpense]);

  const handleSubmit = useCallback(
    (e) => {
      if (e) e.preventDefault();

      const tempExpense = {
        ...expense,
        id: uuid(),
        createdAt: Date.now(),
      };

      if (
        tempExpense.title !== "" &&
        tempExpense.amount !== "" &&
        Number(tempExpense.amount) > 0
      ) {
        addExpense(uid, year, month, selectedCategory, {
          ...tempExpense,
          amount: Number(tempExpense.amount),
        });

        setIsExpenseModalOpen(false);
        resetExpense();
      }
    },
    [
      expense,
      uid,
      year,
      month,
      selectedCategory,
      setIsExpenseModalOpen,
      resetExpense,
    ],
  );

  const totalSpent = useMemo(
    () =>
      selectedCategoryData?.expenses?.reduce(
        (acc, curr) => acc + curr.amount,
        0,
      ) || 0,
    [selectedCategoryData?.expenses],
  );

  const availableAmount = useMemo(() => {
    if (!selectedCategoryData) return 0;
    return selectedCategoryData.maxSpending - totalSpent;
  }, [selectedCategoryData, totalSpent]);

  const remainingAfterExpense = useMemo(() => {
    const currentExpenseAmount = parseFloat(expense.amount) || 0;
    return availableAmount - currentExpenseAmount;
  }, [availableAmount, expense.amount]);

  const setTitle = useCallback((title) => {
    setExpense((prev) => ({ ...prev, title }));
  }, []);

  const setAmount = useCallback((amount) => {
    setExpense((prev) => ({ ...prev, amount }));
  }, []);

  const setDate = useCallback((date) => {
    setExpense((prev) => ({ ...prev, date }));
  }, []);

  return {
    expense,
    handleClose,
    handleSubmit,
    totalSpent,
    availableAmount,
    remainingAfterExpense,
    setTitle,
    setAmount,
    setDate,
  };
}
