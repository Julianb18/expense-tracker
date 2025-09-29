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
    maxSpending: 0,
    expenses: [],
    categoryExpense: 0,
    totalCategoryExpenses: 0,
  });

  const [showDropdown, setShowDropdown] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (category.title !== "" && category.maxSpending !== 0) {
      console.log("submitted");
      addCategory(uid, year, month, category);
      setIsCategoryModalOpen(false);
      setCategory({
        title: "",
        maxSpending: 0,
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
      maxSpending: 0,
      expenses: [],
      categoryExpense: 0,
      totalCategoryExpenses: 0,
    });
  };

  return (
    <Dialog
      open={isCategoryModalOpen}
      onClose={handleCancel}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-transparent" />

      <div className="fixed inset-0 overflow-y-auto z-50">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl">
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
            <div className="space-y-4 px-3">
              <div className="">
                <label htmlFor="categoryName">Category Name</label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full px-3 py-1 text-base border border-black rounded-3xl focus:outline-none focus:ring-2 focus:ring-buttonSecondary"
                    style={{ fontSize: "16px" }}
                    placeholder="Type category name"
                    value={category.title}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      setCategory({ ...category, title: inputValue });

                      // Show dropdown if there are matching categories
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
                    <div className="absolute mt-1 max-h-44 w-full overflow-auto rounded-3xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
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
                <label htmlFor="maxSpending">Max Spending Amount</label>
                <input
                  className="w-full px-3 py-1 text-base border border-black rounded-3xl focus:outline-none focus:ring-2 focus:ring-buttonSecondary"
                  style={{ fontSize: "16px" }}
                  type="number"
                  placeholder="0"
                  value={category.maxSpending}
                  onChange={(e) =>
                    setCategory({
                      ...category,
                      maxSpending: parseFloat(e.target.value),
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
              <Button onClick={handleSubmit} customClassName="px-3 py-1">
                Submit
              </Button>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};
