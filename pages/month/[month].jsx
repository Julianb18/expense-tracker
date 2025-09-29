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

import { addMonthBalanceAndExpense, ensureMonthHasCurrentDefaults } from "../../firebase/firestore";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { ConfirmDeleteModal } from "../../components/ConfirmDeleteModal";

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

  const [totalMonthlyExpenses, setTotalMonthlyExpenses] = useState(0);
  const [monthlyExpectation, setMonthlyExpectation] = useState(0);

  const selectedMonth = selectedYear?.months.find((m) => m.month === month);

  useEffect(() => {
    const ensureDefaults = async () => {
      if (authUser?.uid && selectedYear?.year && month) {
        await ensureMonthHasCurrentDefaults(authUser.uid, selectedYear.year, month);
      }
    };
    
    ensureDefaults();
  }, [authUser?.uid, selectedYear?.year, month]);

  const handleAddExpense = (currentCategory, expenses) => {
    setSelectedCategory(currentCategory);
    setIsExpenseModalOpen(true);
    setSelectedExpenses(expenses);
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
    <div className="relative py-3">
      <IncomeModal
        incomeModalIsOpen={incomeModalIsOpen}
        setIncomeModalIsOpen={setIncomeModalIsOpen}
        uid={userData?.uid}
        year={selectedYear?.year}
        month={month}
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
      isConfirmDeleteModalOpen ? (
        <div className="absolute z-20 top-0 left-0 bg-black opacity-60 h-screen w-full"></div>
      ) : null}
      <div className="flex justify-between items-center mb-8 px-4">
        <Link href="/dashboard" className="text-white py-1 px-2">
          <BackSvg />
        </Link>
        <h2 className="text-white text-xl">{selectedMonth.month}</h2>
        <div className="flex">
          <span className="text-white">{selectedMonth.monthBalance}</span>
          {selectedMonth.monthBalance > 0 ? (
            <div className="text-green-400">
              <ArrowUpSvg />
            </div>
          ) : selectedMonth.monthBalance < 0 ? (
            <div className="text-red-400">
              <ArrowDownSvg />
            </div>
          ) : null}
        </div>
      </div>
      <div className="flex justify-between mb-5 md:mb-10 px-4">
        <Button filled onClick={() => setIncomeModalIsOpen(true)}>
          Add Income
        </Button>
        <Button filled onClick={() => setIsCategoryModalOpen(true)}>
          Add Category
        </Button>
      </div>

      <div
        className="relative flex px-4 md:px-0 pb-11 h-[calc(100vh-212px)] overflow-hidden 
            scroll-smooth overflow-y-scroll flex-col md:overflow-visible md:h-full 
            md:gap-6 md:space-y-0 items-center md:flex-wrap md:justify-center md:flex-row"
      >
        <div className="sticky md:hidden z-10 top-0 left-0 right-0 w-screen bg-gradient-to-b from-primaryDark to-transparent">
          <div className="h-[40px]"></div>
        </div>
        {selectedMonth.categories.map((category) => (
          <CategoryCard
            key={category.title}
            category={category}
            handleAddExpense={handleAddExpense}
            handleViewExpense={handleViewExpense}
            handleCategoryDelete={handleCategoryDelete}
            uid={userData?.uid}
            year={selectedYear?.year}
            month={month}
          />
        ))}
      </div>
      <div className="fixed z-10 bottom-4 left-1/2 -translate-x-1/2 w-full max-w-[374px] sm:max-w-[550px] px-4 rounded-3xl">
        <MonthBudgetDisplay
          monthIncome={selectedMonth.income}
          totalMonthlyExpenses={totalMonthlyExpenses}
          monthlyExpectation={monthlyExpectation}
        />
      </div>
    </div>
  ) : (
    <div className="h-[40vh] flex justify-center items-center">
      <LoadingSpinner />
    </div>
  );
};

export default Month;
