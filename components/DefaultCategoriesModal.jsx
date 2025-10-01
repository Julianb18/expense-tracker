import { Dialog } from "@headlessui/react";
import React, { useState, useEffect } from "react";

import { Button } from "./Button";
import { XMarkSvg } from "./svg/XMarkSvg";
import { ChevronDown } from "./svg/ChevronDown";

const PREDEFINED_CATEGORIES = [
  "Rent",
  "Groceries",
  "Car",
  "Car Loan",
  "Bills",
  "Utilities",
  "Loans",
  "Insurance",
  "Kita",
  "Miscellaneous",
];

export const DefaultCategoriesModal = ({
  isOpen,
  setIsOpen,
  existingDefaults = [],
  onSave,
}) => {
  const [defaultCategories, setDefaultCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    title: "",
    maxSpending: "",
  });
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (existingDefaults.length > 0) {
      setDefaultCategories(existingDefaults);
    }
  }, [existingDefaults, isOpen]);

  const handleAddCategory = () => {
    if (newCategory.title.trim() && newCategory.maxSpending !== "" && Number(newCategory.maxSpending) > 0) {
      const category = {
        title: newCategory.title.trim(),
        maxSpending: Number(newCategory.maxSpending),
        expenses: [],
        categoryExpense: 0,
        totalCategoryExpenses: 0,
      };

      const exists = defaultCategories.some(
        (cat) => cat.title.toLowerCase() === category.title.toLowerCase()
      );
      if (!exists) {
        setDefaultCategories([...defaultCategories, category]);
        setNewCategory({ title: "", maxSpending: "" });
      }
    }
  };

  const handleRemoveCategory = (titleToRemove) => {
    setDefaultCategories(
      defaultCategories.filter((cat) => cat.title !== titleToRemove)
    );
  };

  const handleSave = () => {
    onSave(defaultCategories);
    setIsOpen(false);
  };

  const handleClose = () => {
    setDefaultCategories(existingDefaults);
    setNewCategory({ title: "", maxSpending: "" });
    setIsOpen(false);
  };

  return (
    <Dialog
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      open={isOpen}
      onClose={handleClose}
    >
      <div className="fixed inset-0 bg-black bg-opacity-50" />

      <Dialog.Panel className="relative bg-white rounded-2xl shadow-2xl shadow-gray-900/20 border border-gray-100 w-full max-w-md max-h-[80vh] overflow-hidden">
        <div className="relative flex items-center justify-between px-3 pt-3 pb-2 mb-2">
          <Dialog.Title className="text-xl font-semibold">
            Default Categories
          </Dialog.Title>
          <button className="cursor-pointer p-1" onClick={handleClose}>
            <XMarkSvg />
          </button>
          <span className="absolute left-0 bottom-0 w-full h-[1px] bg-gray-400"></span>
        </div>

        <div className="px-3 space-y-4 overflow-y-auto max-h-96">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Add Category</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-xl pl-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{ fontSize: "16px" }}
                    placeholder="Type category name"
                    value={newCategory.title}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      setNewCategory({ ...newCategory, title: inputValue });

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
                    <div className="absolute mt-1 max-h-44 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                      {PREDEFINED_CATEGORIES.filter((cat) =>
                        cat
                          .toLowerCase()
                          .includes(newCategory.title.toLowerCase())
                      ).map((categoryName) => (
                        <div
                          key={categoryName}
                          className="relative cursor-pointer select-none py-2 pl-3 pr-4 hover:bg-blue-600 hover:text-white text-gray-900"
                          onClick={() => {
                            setNewCategory({
                              ...newCategory,
                              title: categoryName,
                            });
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
                  Maximum Spending
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newCategory.maxSpending}
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      maxSpending: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-xl pl-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ fontSize: "16px" }}
                  placeholder="Enter amount (e.g., 500.00)"
                />
              </div>

              <Button
                onClick={handleAddCategory}
                filled
                customClassName="w-full"
              >
                Add Category
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">
              Current Default Categories
            </h3>

            {defaultCategories.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No default categories set
              </p>
            ) : (
              <div className="space-y-3">
                {defaultCategories.map((category) => (
                  <div
                    key={category.title}
                    className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-3 border border-gray-200"
                  >
                    <div>
                      <span className="font-medium">{category.title}</span>
                      <span className="text-gray-500 ml-2">
                        - {category.maxSpending}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveCategory(category.title)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <XMarkSvg />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 px-3 py-3">
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} filled>
            Save Template
          </Button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};
