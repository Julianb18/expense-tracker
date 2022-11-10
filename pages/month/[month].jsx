import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { UserDataContext } from "../../context/UserDataContext";
import { BackSvg } from "../../components/svg/BackSvg";
import { ArrowUpSvg } from "../../components/svg/ArrowUpSvg";
import { ArrowDownSvg } from "../../components/svg/ArrowDownSvg";
import { MinusSvg } from "../../components/svg/MinusSvg";
import { CategoryCard } from "../../components/CategoryCard";
import { Button } from "../../components/Button";
import { MonthBudgetDisplay } from "../../components/MonthBudgetDisplay";
import { IncomeModal } from "../../components/IncomeModal";
import { CategoryModal } from "../../components/CategoryModal";
import { ExpenseModal } from "../../components/ExpenseModal";
import { ViewExpensesModal } from "../../components/ViewExpensesModal";
import { addMonthBalanceAndExpense } from "../../firebase/firestore";
// import { getUserExpenses } from "../firebase/firestore";

const Month = () => {
  const router = useRouter();
  const { month } = router.query;
  const { selectedYear, userData } = useContext(UserDataContext);

  const [incomeModalIsOpen, setIncomeModalIsOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isViewExpensesModalOpen, setIsViewExpensesModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedExpenses, setSelectedExpenses] = useState([]);

  const [totalMonthlyExpenses, setTotalMonthlyExpenses] = useState(0);
  const [monthlyExpectation, setMonthlyExpectation] = useState(0);

  const selectedMonth = selectedYear?.months.find((m) => m.month === month);

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
      console.log("TEMP", tempMonthlyExpense);
      setTotalMonthlyExpenses(tempMonthlyExpense);
      setMonthlyExpectation(tempMonthlyExpectation);
    }
  }, [selectedMonth]);

  useEffect(() => {
    const mBalance = selectedMonth?.income - totalMonthlyExpenses;
    if (userData && userData.uid && selectedYear && month) {
      // addTotalMonthlyExpenses(
      //   userData.uid,
      //   selectedYear.year,
      //   month,
      //   totalMonthlyExpenses
      // );
      addMonthBalanceAndExpense(
        userData.uid,
        selectedYear.year,
        month,
        mBalance,
        totalMonthlyExpenses
      );
    }
  }, [totalMonthlyExpenses, selectedMonth, userData, selectedYear, month]);

  // useEffect(() => {
  //   const mBalance = selectedMonth?.income - totalMonthlyExpenses;
  //   if (userData && userData.uid && selectedYear && month) {
  //     addMonthBalance(userData.uid, selectedYear.year, month, mBalance);
  //   }
  // }, [
  //   totalMonthlyExpenses,
  //   selectedMonth?.income,
  //   userData,
  //   selectedYear,
  //   month,
  // ]);
  // console.log("EXPENSES", selectedExpenses);
  // console.log("CAT", selectedCategory);
  // console.log("CURR MONTH", month);
  console.log("TOTAL MONTHLY====>", totalMonthlyExpenses);
  // min-h-[calc(100vh-58px)]
  // () =>
  //           addMonthIncome(userData?.uid, selectedYear?.year, month, 100)
  return selectedMonth ? (
    <div className="relative min-h-[calc(100vh-58px)] sm:max-w-[780px] mx-auto bg-stone-200 p-3">
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
      {incomeModalIsOpen || isCategoryModalOpen || isExpenseModalOpen ? (
        <div className="absolute z-20 top-0 left-0 bg-black opacity-60 h-screen w-full"></div>
      ) : null}
      <div className="flex justify-between mb-8">
        <Link href="/dashboard" className="">
          <BackSvg />
        </Link>
        <h1>{selectedMonth.month}</h1>
        <div className="flex">
          <span>{selectedMonth.monthBalance}</span>
          {selectedMonth.monthBalance > 0 ? (
            <ArrowUpSvg />
          ) : selectedMonth.monthBalance < 0 ? (
            <ArrowDownSvg />
          ) : selectedMonth.monthBalance === 0 ? (
            <MinusSvg />
          ) : null}
        </div>
      </div>
      <div className="flex justify-between mb-10">
        <Button filled onClick={() => setIncomeModalIsOpen(true)}>
          Add Income
        </Button>
        <Button onClick={() => setIsCategoryModalOpen(true)}>
          Add Category
        </Button>
      </div>
      <div className="flex flex-col gap-4 items-center sm:flex-wrap sm:flex-row sm:justify-center">
        {selectedMonth.categories.map((category) => (
          <CategoryCard
            key={category.title}
            category={category}
            handleAddExpense={handleAddExpense}
            handleViewExpense={handleViewExpense}
            uid={userData?.uid}
            year={selectedYear?.year}
            month={month}
            setIsViewExpensesModalOpen={setIsViewExpensesModalOpen}
          />
        ))}
        {/* uid={userData?.uid}
            year={selectedYear?.year}
            month={month}
            isExpenseModalOpen={isExpenseModalOpen}
            setIsExpenseModalOpen={setIsExpenseModalOpen} */}
        {/* <CategoryCard />
        <CategoryCard />
        <CategoryCard />
        <CategoryCard /> */}
      </div>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-[374px] sm:max-w-[550px] px-3 rounded-3xl">
        <MonthBudgetDisplay
          monthIncome={selectedMonth.income}
          totalMonthlyExpenses={totalMonthlyExpenses}
          monthlyExpectation={monthlyExpectation}
        />
      </div>
    </div>
  ) : (
    <div>There is a problem with the selected Month</div>
  );
};

export default Month;
