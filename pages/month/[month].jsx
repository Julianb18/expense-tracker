import React, { useContext, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { UserDataContext } from "../../context/UserDataContext";
import { BackSvg } from "../../components/svg/BackSvg";
import { ArrowUpSvg } from "../../components/svg/ArrowUpSvg";
import { CategoryCard } from "../../components/CategoryCard";
import { Button } from "../../components/Button";
import { MonthBudgetDisplay } from "../../components/MonthBudgetDisplay";
import { IncomeModal } from "../../components/IncomeModal";
import { CategoryModal } from "../../components/CategoryModal";
import { ExpenseModal } from "../../components/ExpenseModal";
import { ViewExpensesModal } from "../../components/ViewExpensesModal";
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

  const selectedMonth = selectedYear?.months.find((m) => m.month === month);

  const handleAddExpense = (currentCategory) => {
    setSelectedCategory(currentCategory);
    setIsExpenseModalOpen(true);
  };
  const handleViewExpense = (currentCategory, expenses) => {
    setSelectedCategory(currentCategory);
    setIsViewExpensesModalOpen(true);
    setSelectedExpenses(expenses);
  };
  console.log("EXPENSES", selectedExpenses);
  console.log("CAT", selectedCategory);
  // console.log("CURR MONTH", month);
  console.log("SELECTED MONTH", selectedMonth);
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
      />
      <ViewExpensesModal
        uid={userData?.uid}
        year={selectedYear?.year}
        month={month}
        selectedCategory={selectedCategory}
        isViewExpensesModalOpen={isViewExpensesModalOpen}
        setIsViewExpensesModalOpen={setIsViewExpensesModalOpen}
        selectedExpenses={selectedExpenses}
      />
      {incomeModalIsOpen || isCategoryModalOpen || isExpenseModalOpen ? (
        <div className="absolute top-0 left-0 bg-black opacity-60 h-screen w-full"></div>
      ) : null}
      <div className="flex justify-between mb-8">
        <Link href="/dashboard" className="">
          <BackSvg />
        </Link>
        <h1>{selectedMonth.month}</h1>
        <div className="flex">
          <span>{selectedMonth.monthBalance}</span>
          <ArrowUpSvg />
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
        <MonthBudgetDisplay monthIncome={selectedMonth.income} />
      </div>
    </div>
  ) : (
    <div>There is a problem with the selected Month</div>
  );
};

export default Month;
