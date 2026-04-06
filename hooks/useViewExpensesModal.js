import { useMemo, useCallback } from "react";
import { deleteExpense } from "../firebase/firestore";

export function useViewExpensesModal({
  uid,
  year,
  month,
  selectedCategory,
  setIsViewExpensesModalOpen,
  selectedExpenses,
  setSelectedExpenses,
}) {
  const handleClose = useCallback(() => {
    setIsViewExpensesModalOpen(false);
  }, [setIsViewExpensesModalOpen]);

  const handleDelete = useCallback(
    (e, expenseId) => {
      e.preventDefault();

      deleteExpense(uid, year, month, selectedCategory, expenseId);

      setSelectedExpenses((prev) => prev.filter((ex) => ex.id !== expenseId));
    },
    [uid, year, month, selectedCategory, setSelectedExpenses],
  );

  const sortedExpenses = useMemo(() => {
    return [...(selectedExpenses || [])].sort((a, b) => {
      const expenseDateA = new Date(a.date || 0).getTime();
      const expenseDateB = new Date(b.date || 0).getTime();

      if (expenseDateB !== expenseDateA) {
        return expenseDateB - expenseDateA;
      }

      return (b.createdAt || 0) - (a.createdAt || 0);
    });
  }, [selectedExpenses]);

  return {
    handleClose,
    handleDelete,
    sortedExpenses,
  };
}
