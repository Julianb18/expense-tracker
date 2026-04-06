import { useState, useCallback } from "react";
import { addCategory } from "../firebase/firestore";
import { PREDEFINED_CATEGORIES } from "../utils/constants";

const initialCategory = {
  title: "",
  maxSpending: "",
  expenses: [],
  categoryExpense: 0,
  totalCategoryExpenses: 0,
};

export function useCategoryModal({ uid, year, month, setIsCategoryModalOpen }) {
  const [category, setCategory] = useState(initialCategory);
  const [showDropdown, setShowDropdown] = useState(false);

  const resetForm = useCallback(() => {
    setCategory(initialCategory);
    setShowDropdown(false);
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      if (
        category.title !== "" &&
        category.maxSpending !== "" &&
        Number(category.maxSpending) > 0
      ) {
        addCategory(uid, year, month, {
          ...category,
          maxSpending: Number(category.maxSpending),
        });

        setIsCategoryModalOpen(false);
        resetForm();
      }
    },
    [category, uid, year, month, setIsCategoryModalOpen, resetForm],
  );

  const handleCancel = useCallback(() => {
    setIsCategoryModalOpen(false);
    resetForm();
  }, [setIsCategoryModalOpen, resetForm]);

  const onTitleChange = useCallback((inputValue) => {
    setCategory((prev) => ({ ...prev, title: inputValue }));
    const hasMatches = PREDEFINED_CATEGORIES.some((cat) =>
      cat.toLowerCase().includes(inputValue.toLowerCase()),
    );
    setShowDropdown(inputValue.length > 0 && hasMatches);
  }, []);

  const selectPredefinedTitle = useCallback((categoryName) => {
    setCategory((prev) => ({ ...prev, title: categoryName }));
    setShowDropdown(false);
  }, []);

  const onMaxSpendingChange = useCallback((value) => {
    setCategory((prev) => ({ ...prev, maxSpending: value }));
  }, []);

  const filteredPredefined = PREDEFINED_CATEGORIES.filter((cat) =>
    cat.toLowerCase().includes(category.title.toLowerCase()),
  );

  return {
    category,
    showDropdown,
    setShowDropdown,
    filteredPredefined,
    handleSubmit,
    handleCancel,
    onTitleChange,
    selectPredefinedTitle,
    onMaxSpendingChange,
  };
}
