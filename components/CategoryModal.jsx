import React, { useState } from "react";
import { AppDialog } from "./AppDialog";
import { Button } from "./Button";
import { ChevronDown } from "./svg/ChevronDown";
import { addCategory } from "../firebase/firestore";

const PREDEFINED_CATEGORIES = [
  "Rent",
  "Groceries",
  "Car",
  "Utilities",
  "Loans",
  "Insurance",
  "Kita",
  "Miscellaneous",
];

export const CategoryModal = ({
  isCategoryModalOpen,
  setIsCategoryModalOpen,
  uid,
  year,
  month,
}) => {
  const [category, setCategory] = useState({
    title: "",
    maxSpending: "",
    expenses: [],
    categoryExpense: 0,
    totalCategoryExpenses: 0,
  });

  const [showDropdown, setShowDropdown] = useState(false);

  const resetForm = () => {
    setCategory({
      title: "",
      maxSpending: "",
      expenses: [],
      categoryExpense: 0,
      totalCategoryExpenses: 0,
    });
    setShowDropdown(false);
  };

  const handleSubmit = (e) => {
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
  };

  const handleCancel = () => {
    setIsCategoryModalOpen(false);
    resetForm();
  };

  return (
    <AppDialog
      open={isCategoryModalOpen}
      onClose={handleCancel}
      title="Add Category"
      footer={
        <>
          <Button
            buttonType="outlined"
            onClick={handleCancel}
            customClassName="px-3 py-1"
          >
            Cancel
          </Button>
          <Button filled onClick={handleSubmit} customClassName="px-3 py-1">
            Submit
          </Button>
        </>
      }
    >
      <div className="space-y-4 overflow-visible">
        <div className="overflow-visible">
          <label className="mb-2 block text-sm font-medium">
            Category Name
          </label>

          <div className="relative overflow-visible">
            <input
              type="text"
              className="w-full rounded-xl border border-slate-600 bg-slate-900/70 px-4 py-3 text-base text-white placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              style={{ fontSize: "16px" }}
              placeholder="Type category name"
              value={category.title}
              onChange={(e) => {
                const inputValue = e.target.value;
                setCategory({ ...category, title: inputValue });

                const hasMatches = PREDEFINED_CATEGORIES.some((cat) =>
                  cat.toLowerCase().includes(inputValue.toLowerCase()),
                );
                setShowDropdown(inputValue.length > 0 && hasMatches);
              }}
            />

            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <ChevronDown className="h-5 w-5" aria-hidden="true" />
            </button>

            {showDropdown && (
              <div className="absolute z-50 mt-1 max-h-44 w-full overflow-auto rounded-2xl border border-slate-700 bg-slate-900 py-1 shadow-xl">
                {PREDEFINED_CATEGORIES.filter((cat) =>
                  cat.toLowerCase().includes(category.title.toLowerCase()),
                ).map((categoryName) => (
                  <div
                    key={categoryName}
                    className="cursor-pointer px-3 py-2 text-sm text-slate-200 transition hover:bg-buttonSecondary hover:text-white"
                    onClick={() => {
                      setCategory({ ...category, title: categoryName });
                      setShowDropdown(false);
                    }}
                  >
                    {categoryName}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Max Spending Amount
          </label>
          <input
            className="w-full rounded-xl border border-slate-600 bg-slate-900/70 px-4 py-3 text-base text-white placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            style={{ fontSize: "16px" }}
            type="number"
            step="0.01"
            placeholder="Enter amount (e.g. 500.00)"
            value={category.maxSpending}
            onChange={(e) =>
              setCategory({
                ...category,
                maxSpending: e.target.value,
              })
            }
          />
        </div>
      </div>
    </AppDialog>
  );
};
