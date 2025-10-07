import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { BackSvg } from "../../components/svg/BackSvg";
import { ArrowUpSvg } from "../../components/svg/ArrowUpSvg";
import { ArrowDownSvg } from "../../components/svg/ArrowDownSvg";
import { CategoryCard } from "../../components/CategoryCard";
import { Button } from "../../components/Button";
import { MonthBudgetDisplay } from "../../components/MonthBudgetDisplay";
import { IncomeModal } from "../../components/IncomeModal";
import { CategoryModal } from "../../components/CategoryModal";
import { ExpenseModal } from "../../components/ExpenseModal";
import { ViewExpensesModal } from "../../components/ViewExpensesModal";

import { UserDataContext } from "../../context/UserDataContext";
import { useAuth } from "../../context/AuthContext";

import {
  addMonthBalanceAndExpense,
  ensureMonthHasCurrentDefaults,
  updateCategoryOrder,
} from "../../firebase/firestore";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { ConfirmDeleteModal } from "../../components/ConfirmDeleteModal";
import { formatCurrency } from "../../helperFunctions/currencyFormatter";

const Month = () => {
  const router = useRouter();
  const { month } = router.query;
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

  const [totalMonthlyExpenses, setTotalMonthlyExpenses] = useState(0);
  const [monthlyExpectation, setMonthlyExpectation] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);
  const [touchStartIndex, setTouchStartIndex] = useState(null);

  const selectedMonth = selectedYear?.months.find((m) => m.month === month);

  useEffect(() => {
    const ensureDefaults = async () => {
      if (authUser?.uid && selectedYear?.year && month) {
        await ensureMonthHasCurrentDefaults(
          authUser.uid,
          selectedYear.year,
          month
        );
      }
    };

    ensureDefaults();
  }, [authUser?.uid, selectedYear?.year, month]);

  const handleAddExpense = (currentCategory, expenses) => {
    setSelectedCategory(currentCategory);
    setIsExpenseModalOpen(true);
    setSelectedExpenses(expenses);
    const categoryData = selectedMonth?.categories.find(
      (cat) => cat.title === currentCategory
    );
    setSelectedCategoryData(categoryData);
  };

  const handleViewExpense = (currentCategory, expenses) => {
    setSelectedCategory(currentCategory);
    setIsViewExpensesModalOpen(true);
    setSelectedExpenses(expenses);
  };

  const handleCategoryDelete = (currentCategory) => {
    setSelectedCategory(currentCategory);
    setIsConfirmDeleteModalOpen(true);
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newCategories = [...selectedMonth.categories];
    const draggedCategory = newCategories[draggedIndex];
    newCategories.splice(draggedIndex, 1);
    newCategories.splice(dropIndex, 0, draggedCategory);

    // Update the order in Firestore
    updateCategoryOrder(userData.uid, selectedYear.year, month, newCategories);
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleTouchStart = (e, index) => {
    if (!isEditMode) return;
    setTouchStartY(e.touches[0].clientY);
    setTouchStartIndex(index);
    setDraggedIndex(index);
  };

  const handleTouchMove = (e) => {
    if (!isEditMode || touchStartIndex === null) return;
    e.preventDefault();
  };

  const handleTouchEnd = (e) => {
    if (!isEditMode || touchStartIndex === null) return;

    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchEndY - touchStartY;

    // Only trigger reorder if there's significant vertical movement
    if (Math.abs(deltaY) > 50) {
      const direction = deltaY > 0 ? 1 : -1;
      const newIndex = touchStartIndex + direction;

      if (newIndex >= 0 && newIndex < selectedMonth.categories.length) {
        const newCategories = [...selectedMonth.categories];
        const draggedCategory = newCategories[touchStartIndex];
        newCategories.splice(touchStartIndex, 1);
        newCategories.splice(newIndex, 0, draggedCategory);

        updateCategoryOrder(
          userData.uid,
          selectedYear.year,
          month,
          newCategories
        );
      }
    }

    setTouchStartY(null);
    setTouchStartIndex(null);
    setDraggedIndex(null);
  };

  useEffect(() => {
    if (selectedMonth) {
      const tempMonthlyExpense = selectedMonth.categories.reduce(
        (acc, curr) => {
          return acc + curr.totalCategoryExpenses;
        },
        0
      );
      const tempMonthlyExpectation = selectedMonth.categories.reduce(
        (acc, curr) => {
          return acc + curr.maxSpending;
        },
        0
      );
      setTotalMonthlyExpenses(tempMonthlyExpense);
      setMonthlyExpectation(tempMonthlyExpectation);
    }
  }, [selectedMonth]);

  useEffect(() => {
    const mBalance = selectedMonth?.income - totalMonthlyExpenses;
    if (userData && userData.uid && selectedYear && month) {
      addMonthBalanceAndExpense(
        userData.uid,
        selectedYear.year,
        month,
        mBalance,
        totalMonthlyExpenses
      );
    }
  }, [totalMonthlyExpenses, selectedMonth, userData, selectedYear, month]);

  return selectedMonth ? (
    <div className="relative max-w-[900px] mx-auto h-full">
      <IncomeModal
        incomeModalIsOpen={incomeModalIsOpen}
        setIncomeModalIsOpen={setIncomeModalIsOpen}
        uid={userData?.uid}
        year={selectedYear?.year}
        month={month}
        currentIncome={selectedMonth?.income || 0}
      />
      <CategoryModal
        isCategoryModalOpen={isCategoryModalOpen}
        setIsCategoryModalOpen={setIsCategoryModalOpen}
        uid={userData?.uid}
        year={selectedYear?.year}
        month={month}
      />
      <ExpenseModal
        uid={userData?.uid}
        year={selectedYear?.year}
        month={month}
        selectedCategory={selectedCategory}
        isExpenseModalOpen={isExpenseModalOpen}
        setIsExpenseModalOpen={setIsExpenseModalOpen}
        selectedExpenses={selectedExpenses}
        selectedCategoryData={selectedCategoryData}
      />
      <ViewExpensesModal
        uid={userData?.uid}
        year={selectedYear?.year}
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
        uid={userData?.uid}
        year={selectedYear?.year}
        month={month}
      />

      {incomeModalIsOpen ||
      isCategoryModalOpen ||
      isExpenseModalOpen ||
      isViewExpensesModalOpen ||
      isConfirmDeleteModalOpen ? (
        <div className="absolute z-20 top-0 left-0 bg-black opacity-60 h-screen w-full"></div>
      ) : null}

      {/* Fixed Header - Always Visible */}
      <div className="fixed top-[56px] left-0 right-0 z-10 bg-primaryDark py-3 shadow-lg shadow-primaryDark">
        <div className="max-w-[900px] mx-auto">
          <div className="flex justify-between items-center mb-8 px-4">
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="text-white py-1 px-2">
                <BackSvg />
              </Link>
              <h2 className="text-white text-xl md:hidden">
                {selectedMonth.month}
              </h2>
            </div>
            <div className="hidden md:flex items-center justify-center flex-1">
              <h2 className="text-white text-xl">{selectedMonth.month}</h2>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="text-white cursor-pointer hover:text-gray-200 transition-colors"
                onClick={() => setIncomeModalIsOpen(true)}
              >
                {formatCurrency(selectedMonth.monthBalance)}
              </span>
              <button
                className="w-6 h-6 bg-white rounded-full flex justify-center hover:bg-gray-100 transition-colors"
                onClick={() => setIncomeModalIsOpen(true)}
              >
                <span className="text-primaryDark text-base font-bold">+</span>
              </button>
            </div>
          </div>
          <div className="flex justify-between mb-5 md:mb-10 px-4">
            <Button
              filled={isEditMode}
              onClick={() => setIsEditMode(!isEditMode)}
              customColor={isEditMode ? "blue-500" : "gray-500"}
            >
              {isEditMode ? "Done" : "Edit Layout"}
            </Button>
            <Button filled onClick={() => setIsCategoryModalOpen(true)}>
              Add Category
            </Button>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Budget Display - Always Visible */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-primaryDark to-transparent pt-4 pb-4">
        <div className="max-w-[900px] mx-auto px-4">
          <MonthBudgetDisplay
            monthIncome={selectedMonth.income}
            totalMonthlyExpenses={totalMonthlyExpenses}
            monthlyExpectation={monthlyExpectation}
          />
        </div>
      </div>

      {/* Scrollable Category Cards Area */}
      <div className="pt-36 pb-20 px-4 md:px-0 md:pt-48 md:pb-36">
        {isEditMode && (
          <div className="text-center mb-4 md:hidden">
            <p className="text-sm text-gray-600 bg-blue-50 px-4 py-2 rounded-lg mx-4">
              📱 Touch and drag categories up or down to reorder
            </p>
          </div>
        )}
        <div className="flex flex-col md:flex-row md:flex-wrap md:justify-center md:gap-6 items-center py-4 md:py-0">
          {selectedMonth.categories.map((category, index) => (
            <div
              key={category.title}
              draggable={isEditMode}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              onTouchStart={(e) => handleTouchStart(e, index)}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className={`w-full xs:max-w-[400px] ${
                isEditMode ? "cursor-move" : ""
              } ${draggedIndex === index ? "opacity-50" : ""}`}
            >
              <CategoryCard
                category={category}
                handleAddExpense={handleAddExpense}
                handleViewExpense={handleViewExpense}
                handleCategoryDelete={handleCategoryDelete}
                uid={userData?.uid}
                year={selectedYear?.year}
                month={month}
                isEditMode={isEditMode}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <div className="h-[40vh] flex justify-center items-center">
      <LoadingSpinner />
    </div>
  );
};

export default Month;
