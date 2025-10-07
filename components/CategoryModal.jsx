import { Dialog } from "@headlessui/react";
import React, { useState } from "react";

import { Button } from "./Button";
import { XMarkSvg } from "./svg/XMarkSvg";
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
      setCategory({
        title: "",
        maxSpending: "",
        expenses: [],
        categoryExpense: 0,
        totalCategoryExpenses: 0,
      });
    }
  };

  const handleCancel = () => {
    setIsCategoryModalOpen(false);
    setCategory({
      title: "",
      maxSpending: "",
      expenses: [],
      categoryExpense: 0,
      totalCategoryExpenses: 0,
    });
  };

  return (
    <Dialog
      open={isCategoryModalOpen}
      onClose={handleCancel}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="fixed inset-0 bg-black bg-opacity-50" />
      <Dialog.Panel className="relative bg-white rounded-2xl shadow-2xl shadow-gray-900/20 border border-gray-100 w-full max-w-[500px] max-h-[90vh] overflow-visible">
            <Dialog.Title
              as="div"
              className="flex justify-between items-center text-lg font-medium leading-6 text-gray-900 p-3 relative"
            >
              <h3>Add Category</h3>
              <button onClick={handleCancel}>
                <XMarkSvg />
              </button>
              <span className="absolute left-0 bottom-0 w-full h-[1px] bg-gray-400"></span>
            </Dialog.Title>
            <div className="space-y-4 px-3 overflow-visible">
              <div className="overflow-visible">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name
                </label>
                <div className="relative overflow-visible">
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-xl pl-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{ fontSize: "16px" }}
                    placeholder="Type category name"
                    value={category.title}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      setCategory({ ...category, title: inputValue });

                      const hasMatches = PREDEFINED_CATEGORIES.some((cat) =>
                        cat.toLowerCase().includes(inputValue.toLowerCase())
                      );
                      setShowDropdown(inputValue.length > 0 && hasMatches);
                    }}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-2"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <ChevronDown
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </button>

                  {showDropdown && (
                    <div className="absolute mt-1 max-h-44 w-full overflow-auto rounded-3xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50">
                      {PREDEFINED_CATEGORIES.filter((cat) =>
                        cat.toLowerCase().includes(category.title.toLowerCase())
                      ).map((categoryName) => (
                        <div
                          key={categoryName}
                          className="relative cursor-pointer select-none py-2 pl-3 pr-4 hover:bg-buttonSecondary hover:text-white text-gray-900"
                          onClick={() => {
                            setCategory({ ...category, title: categoryName });
                            setShowDropdown(false);
                          }}
                        >
                          <span className="block truncate">{categoryName}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Spending Amount
                </label>
                <input
                  className="w-full border border-gray-300 rounded-xl pl-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ fontSize: "16px" }}
                  type="number"
                  step="0.01"
                  placeholder="Enter amount (e.g., 500.00)"
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

            <div className="flex justify-end gap-4 m-3">
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
            </div>
      </Dialog.Panel>
    </Dialog>
  );
};
