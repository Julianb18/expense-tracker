import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/router";

import { UserDataContext } from "../context/UserDataContext";
import { useAuth } from "../context/AuthContext";
import { useCategoryReorder } from "./useCategoryReorder";
import {
  addMonthBalanceAndExpense,
  ensureMonthHasCurrentDefaults,
  updateCategoryOrder,
} from "../firebase/firestore";

export function useMonth() {
  const { query } = useRouter();
  const month = query.month;
  const { selectedYear, userData } = useContext(UserDataContext);
  const { authUser } = useAuth();

  const [incomeModalIsOpen, setIncomeModalIsOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isViewExpensesModalOpen, setIsViewExpensesModalOpen] = useState(false);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedExpenses, setSelectedExpenses] = useState([]);
  const [selectedCategoryData, setSelectedCategoryData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const selectedMonth = selectedYear?.months.find((m) => m.month === month);
  const categories = selectedMonth?.categories ?? [];

  const { totalMonthlyExpenses, monthlyExpectation } = useMemo(() => {
    if (!selectedMonth?.categories?.length) {
      return { totalMonthlyExpenses: 0, monthlyExpectation: 0 };
    }
    return selectedMonth.categories.reduce(
      (acc, curr) => ({
        totalMonthlyExpenses:
          acc.totalMonthlyExpenses + curr.totalCategoryExpenses,
        monthlyExpectation: acc.monthlyExpectation + curr.maxSpending,
      }),
      { totalMonthlyExpenses: 0, monthlyExpectation: 0 },
    );
  }, [selectedMonth]);

  const persistCategoryOrder = useCallback(
    (nextCategories) => {
      if (userData?.uid && selectedYear?.year && month) {
        updateCategoryOrder(
          userData.uid,
          selectedYear.year,
          month,
          nextCategories,
        );
      }
    },
    [userData?.uid, selectedYear?.year, month],
  );

  const reorder = useCategoryReorder({
    categories,
    isEditMode,
    onPersistOrder: persistCategoryOrder,
  });

  useEffect(() => {
    const ensureDefaults = async () => {
      if (authUser?.uid && selectedYear?.year && month) {
        await ensureMonthHasCurrentDefaults(
          authUser.uid,
          selectedYear.year,
          month,
        );
      }
    };
    ensureDefaults();
  }, [authUser?.uid, selectedYear?.year, month]);

  useEffect(() => {
    const mBalance = selectedMonth?.income - totalMonthlyExpenses;
    if (userData && userData.uid && selectedYear && month) {
      addMonthBalanceAndExpense(
        userData.uid,
        selectedYear.year,
        month,
        mBalance,
        totalMonthlyExpenses,
      );
    }
  }, [totalMonthlyExpenses, selectedMonth, userData, selectedYear, month]);

  const handleAddExpense = useCallback(
    (currentCategory, expenses) => {
      setSelectedCategory(currentCategory);
      setIsExpenseModalOpen(true);
      setSelectedExpenses(expenses);
      const categoryData = selectedMonth?.categories.find(
        (cat) => cat.title === currentCategory,
      );
      setSelectedCategoryData(categoryData);
    },
    [selectedMonth?.categories],
  );

  const handleViewExpense = useCallback((currentCategory, expenses) => {
    setSelectedCategory(currentCategory);
    setIsViewExpensesModalOpen(true);
    setSelectedExpenses(expenses);
  }, []);

  const handleCategoryDelete = useCallback((currentCategory) => {
    setSelectedCategory(currentCategory);
    setIsConfirmDeleteModalOpen(true);
  }, []);

  const anyModalOpen =
    incomeModalIsOpen ||
    isCategoryModalOpen ||
    isExpenseModalOpen ||
    isViewExpensesModalOpen ||
    isConfirmDeleteModalOpen;

  return {
    month,
    userData,
    selectedYear,
    selectedMonth,
    categories,
    totalMonthlyExpenses,
    monthlyExpectation,
    isEditMode,
    setIsEditMode,
    incomeModalIsOpen,
    setIncomeModalIsOpen,
    isCategoryModalOpen,
    setIsCategoryModalOpen,
    isExpenseModalOpen,
    setIsExpenseModalOpen,
    isViewExpensesModalOpen,
    setIsViewExpensesModalOpen,
    isConfirmDeleteModalOpen,
    setIsConfirmDeleteModalOpen,
    selectedCategory,
    selectedExpenses,
    setSelectedExpenses,
    selectedCategoryData,
    anyModalOpen,
    handleAddExpense,
    handleViewExpense,
    handleCategoryDelete,
    ...reorder,
  };
}
