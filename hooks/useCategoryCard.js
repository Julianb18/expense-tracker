import { useCallback, useEffect, useMemo, useState } from "react";
import {
  updateCategoryTitle,
  updateCategoryMaxSpending,
} from "../firebase/firestore";
import { getBudgetProgressData } from "../helperFunctions/getBudgetProgressData";

export function useCategoryCard({ category, uid, year, month }) {
  const { title, maxSpending, expenses } = category;

  const totalExpenses = useMemo(
    () => expenses.reduce((acc, curr) => acc + curr.amount, 0),
    [expenses],
  );

  const { percentage: spentPercentage, progressStyles } = useMemo(
    () => getBudgetProgressData(totalExpenses, maxSpending),
    [totalExpenses, maxSpending],
  );

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingMaxSpending, setIsEditingMaxSpending] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editMaxSpending, setEditMaxSpending] = useState(maxSpending);

  useEffect(() => {
    setEditTitle(title);
    setEditMaxSpending(maxSpending);
  }, [title, maxSpending]);

  const handleTitleSave = useCallback(async () => {
    if (editTitle.trim() && editTitle !== title) {
      await updateCategoryTitle(uid, year, month, title, editTitle.trim());
    }
    setIsEditingTitle(false);
  }, [editTitle, title, uid, year, month]);

  const handleMaxSpendingSave = useCallback(async () => {
    const newAmount = Number(editMaxSpending);
    if (newAmount > 0 && newAmount !== maxSpending) {
      await updateCategoryMaxSpending(uid, year, month, title, newAmount);
    }
    setIsEditingMaxSpending(false);
  }, [editMaxSpending, maxSpending, uid, year, month, title]);

  const handleTitleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter") handleTitleSave();
      if (e.key === "Escape") {
        setEditTitle(title);
        setIsEditingTitle(false);
      }
    },
    [handleTitleSave, title],
  );

  const handleMaxSpendingKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter") handleMaxSpendingSave();
      if (e.key === "Escape") {
        setEditMaxSpending(maxSpending);
        setIsEditingMaxSpending(false);
      }
    },
    [handleMaxSpendingSave, maxSpending],
  );

  return {
    title,
    maxSpending,
    expenses,
    totalExpenses,
    isEditingTitle,
    setIsEditingTitle,
    isEditingMaxSpending,
    setIsEditingMaxSpending,
    editTitle,
    setEditTitle,
    editMaxSpending,
    setEditMaxSpending,
    handleTitleSave,
    handleMaxSpendingSave,
    handleTitleKeyPress,
    handleMaxSpendingKeyPress,
    progressStyles,
    spentPercentage,
  };
}
