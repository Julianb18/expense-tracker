import { useState, useEffect, useCallback } from "react";
import { PREDEFINED_CATEGORIES } from "../utils/constants";

export function useDefaultCategoriesModal({
  isOpen,
  setIsOpen,
  existingDefaults = [],
  onSave,
}) {
  const [defaultCategories, setDefaultCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    title: "",
    maxSpending: "",
  });
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDefaultCategories(existingDefaults);
    }
  }, [existingDefaults, isOpen]);

  const handleAddCategory = useCallback(() => {
    if (
      newCategory.title.trim() &&
      newCategory.maxSpending !== "" &&
      Number(newCategory.maxSpending) > 0
    ) {
      const category = {
        title: newCategory.title.trim(),
        maxSpending: Number(newCategory.maxSpending),
        expenses: [],
        categoryExpense: 0,
        totalCategoryExpenses: 0,
      };

      const exists = defaultCategories.some(
        (cat) => cat.title.toLowerCase() === category.title.toLowerCase(),
      );

      if (!exists) {
        setDefaultCategories([...defaultCategories, category]);
        setNewCategory({ title: "", maxSpending: "" });
        setShowDropdown(false);
      }
    }
  }, [newCategory, defaultCategories]);

  const handleRemoveCategory = useCallback((titleToRemove) => {
    setDefaultCategories((prev) =>
      prev.filter((cat) => cat.title !== titleToRemove),
    );
  }, []);

  const handleSave = useCallback(() => {
    onSave(defaultCategories);
    setIsOpen(false);
  }, [defaultCategories, onSave, setIsOpen]);

  const handleClose = useCallback(() => {
    setDefaultCategories(existingDefaults);
    setNewCategory({ title: "", maxSpending: "" });
    setShowDropdown(false);
    setIsOpen(false);
  }, [existingDefaults, setIsOpen]);

  const onNewTitleChange = useCallback((inputValue) => {
    setNewCategory((prev) => ({ ...prev, title: inputValue }));

    const hasMatches = PREDEFINED_CATEGORIES.some((cat) =>
      cat.toLowerCase().includes(inputValue.toLowerCase()),
    );

    setShowDropdown(inputValue.length > 0 && hasMatches);
  }, []);

  const selectNewTitle = useCallback((categoryName) => {
    setNewCategory((prev) => ({ ...prev, title: categoryName }));
    setShowDropdown(false);
  }, []);

  const setMaxSpending = useCallback((value) => {
    setNewCategory((prev) => ({ ...prev, maxSpending: value }));
  }, []);

  const filteredPredefined = PREDEFINED_CATEGORIES.filter((cat) =>
    cat.toLowerCase().includes(newCategory.title.toLowerCase()),
  );

  return {
    defaultCategories,
    newCategory,
    showDropdown,
    setShowDropdown,
    filteredPredefined,
    handleAddCategory,
    handleRemoveCategory,
    handleSave,
    handleClose,
    onNewTitleChange,
    selectNewTitle,
    setMaxSpending,
  };
}
