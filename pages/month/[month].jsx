import React from "react";

import { MonthBudgetDisplay } from "../../components/MonthBudgetDisplay";
import { MonthCategoryList } from "../../components/MonthCategoryList";
import { MonthPageHeader } from "../../components/MonthPageHeader";
import { MonthPageModals } from "../../components/MonthPageModals";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { useMonth } from "../../hooks/useMonth";

const Month = () => {
  const {
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
  } = useMonth();

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
