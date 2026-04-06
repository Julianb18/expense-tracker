import React from "react";
import { IncomeModal } from "./IncomeModal";
import { CategoryModal } from "./CategoryModal";
import { ExpenseModal } from "./ExpenseModal";
import { ViewExpensesModal } from "./ViewExpensesModal";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";

export const MonthPageModals = ({
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
  anyModalOpen,
  uid,
  year,
  month,
  currentIncome,
  selectedCategory,
  selectedExpenses,
  setSelectedExpenses,
  selectedCategoryData,
}) => (
  <>
    <IncomeModal
      incomeModalIsOpen={incomeModalIsOpen}
      setIncomeModalIsOpen={setIncomeModalIsOpen}
      uid={uid}
      year={year}
      month={month}
      currentIncome={currentIncome}
    />
    <CategoryModal
      isCategoryModalOpen={isCategoryModalOpen}
      setIsCategoryModalOpen={setIsCategoryModalOpen}
      uid={uid}
      year={year}
      month={month}
    />
    <ExpenseModal
      uid={uid}
      year={year}
      month={month}
      selectedCategory={selectedCategory}
      isExpenseModalOpen={isExpenseModalOpen}
      setIsExpenseModalOpen={setIsExpenseModalOpen}
      selectedExpenses={selectedExpenses}
      selectedCategoryData={selectedCategoryData}
    />
    <ViewExpensesModal
      uid={uid}
      year={year}
      month={month}
      selectedCategory={selectedCategory}
      isViewExpensesModalOpen={isViewExpensesModalOpen}
      setIsViewExpensesModalOpen={setIsViewExpensesModalOpen}
      selectedExpenses={selectedExpenses}
      setSelectedExpenses={setSelectedExpenses}
    />
    <ConfirmDeleteModal
      isConfirmDeleteModalOpen={isConfirmDeleteModalOpen}
      setIsConfirmDeleteModalOpen={setIsConfirmDeleteModalOpen}
      selectedCategory={selectedCategory}
      uid={uid}
      year={year}
      month={month}
    />
    {anyModalOpen ? (
      <div className="absolute z-20 top-0 left-0 bg-black opacity-60 h-screen w-full" />
    ) : null}
  </>
);
