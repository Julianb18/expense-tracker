import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/router";

import { MonthBudgetDisplay } from "../../components/MonthBudgetDisplay";
import { MonthCategoryList } from "../../components/MonthCategoryList";
import { MonthPageHeader } from "../../components/MonthPageHeader";
import { MonthPageModals } from "../../components/MonthPageModals";
import { LoadingSpinner } from "../../components/LoadingSpinner";

import { UserDataContext } from "../../context/UserDataContext";
import { useAuth } from "../../context/AuthContext";
import { useCategoryReorder } from "../../hooks/useCategoryReorder";

import {
  addMonthBalanceAndExpense,
  ensureMonthHasCurrentDefaults,
  updateCategoryOrder,
} from "../../firebase/firestore";

const Month = () => {
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

  const {
    draggedIndex,
    dropTargetIndex,
    isDragging,
    touchCurrentY,
    touchStartY,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = useCategoryReorder({
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

  if (!selectedMonth) {
    return (
      <div className="h-[40vh] flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="relative max-w-[900px] mx-auto h-full">
      <MonthPageModals
        incomeModalIsOpen={incomeModalIsOpen}
        setIncomeModalIsOpen={setIncomeModalIsOpen}
        isCategoryModalOpen={isCategoryModalOpen}
        setIsCategoryModalOpen={setIsCategoryModalOpen}
        isExpenseModalOpen={isExpenseModalOpen}
        setIsExpenseModalOpen={setIsExpenseModalOpen}
        isViewExpensesModalOpen={isViewExpensesModalOpen}
        setIsViewExpensesModalOpen={setIsViewExpensesModalOpen}
        isConfirmDeleteModalOpen={isConfirmDeleteModalOpen}
        setIsConfirmDeleteModalOpen={setIsConfirmDeleteModalOpen}
        anyModalOpen={anyModalOpen}
        uid={userData?.uid}
        year={selectedYear?.year}
        month={month}
        currentIncome={selectedMonth.income || 0}
        selectedCategory={selectedCategory}
        selectedExpenses={selectedExpenses}
        setSelectedExpenses={setSelectedExpenses}
        selectedCategoryData={selectedCategoryData}
      />

      <MonthPageHeader
        monthLabel={selectedMonth.month}
        monthBalance={selectedMonth.monthBalance}
        income={selectedMonth.income}
        isEditMode={isEditMode}
        onToggleEditMode={() => setIsEditMode((v) => !v)}
        onOpenIncomeModal={() => setIncomeModalIsOpen(true)}
        onOpenCategoryModal={() => setIsCategoryModalOpen(true)}
      />

      <div className="fixed bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-primaryDark to-transparent pt-4 pb-4">
        <div className="max-w-[900px] mx-auto px-4">
          <MonthBudgetDisplay
            monthIncome={selectedMonth.income}
            totalMonthlyExpenses={totalMonthlyExpenses}
            monthlyExpectation={monthlyExpectation}
          />
        </div>
      </div>

      <div
        className={`pt-64 pb-20 md:pt-80 md:pb-36 ${
          isEditMode ? "pr-16 pl-4" : "px-4"
        } md:px-0`}
      >
        <MonthCategoryList
          categories={categories}
          isEditMode={isEditMode}
          draggedIndex={draggedIndex}
          dropTargetIndex={dropTargetIndex}
          isDragging={isDragging}
          touchCurrentY={touchCurrentY}
          touchStartY={touchStartY}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragEnd={handleDragEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onAddExpense={handleAddExpense}
          onViewExpense={handleViewExpense}
          onCategoryDelete={handleCategoryDelete}
          uid={userData?.uid}
          year={selectedYear?.year}
          month={month}
        />
      </div>
    </div>
  );
};

export default Month;
