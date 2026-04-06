import React, { useState, useEffect } from "react";

import { AppDialog } from "./AppDialog";
import { Button } from "./Button";
import { XMarkSvg } from "./svg/XMarkSvg";
import { ChevronDown } from "./svg/ChevronDown";
import { PREDEFINED_CATEGORIES } from "../utils/constants";

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
    if (isOpen) {
      setDefaultCategories(existingDefaults);
    }
  }, [existingDefaults, isOpen]);

  const handleAddCategory = () => {
    if (
      newCategory.title.trim() &&
      newCategory.maxSpending !== "" &&
      Number(newCategory.maxSpending) > 0
    ) {
      const category = {
        title: newCategory.title.trim(),
        maxSpending: Number(newCategory.maxSpending),
        expenses: [],
        categoryExpense: 0,
        totalCategoryExpenses: 0,
      };

      const exists = defaultCategories.some(
        (cat) => cat.title.toLowerCase() === category.title.toLowerCase(),
      );

      if (!exists) {
        setDefaultCategories([...defaultCategories, category]);
        setNewCategory({ title: "", maxSpending: "" });
        setShowDropdown(false);
      }
    }
  };

  const handleRemoveCategory = (titleToRemove) => {
    setDefaultCategories(
      defaultCategories.filter((cat) => cat.title !== titleToRemove),
    );
  };

  const handleSave = () => {
    onSave(defaultCategories);
    setIsOpen(false);
  };

  const handleClose = () => {
    setDefaultCategories(existingDefaults);
    setNewCategory({ title: "", maxSpending: "" });
    setShowDropdown(false);
    setIsOpen(false);
  };

  return (
    <AppDialog
      open={isOpen}
      onClose={handleClose}
      title="Default Categories"
      maxWidthClassName="max-w-[560px]"
      footer={
        <>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} filled>
            Save Template
          </Button>
        </>
      }
    >
      <div className="space-y-6 overflow-visible">
        <div className="rounded-2xl border border-slate-700 bg-slate-900/40 p-4">
          <h3 className="mb-4 text-lg font-medium text-white">Add Category</h3>

          <div className="space-y-4 overflow-visible">
            <div className="overflow-visible">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Category Name
              </label>

              <div className="relative overflow-visible">
                <input
                  type="text"
                  className="w-full rounded-xl border border-slate-600 bg-slate-900/70 px-4 py-3 text-base text-white placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  style={{ fontSize: "16px" }}
                  placeholder="Type category name"
                  value={newCategory.title}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    setNewCategory({ ...newCategory, title: inputValue });

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
                      cat
                        .toLowerCase()
                        .includes(newCategory.title.toLowerCase()),
                    ).map((categoryName) => (
                      <div
                        key={categoryName}
                        className="cursor-pointer px-3 py-2 text-sm text-slate-200 transition hover:bg-buttonSecondary hover:text-white"
                        onClick={() => {
                          setNewCategory({
                            ...newCategory,
                            title: categoryName,
                          });
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
              <label className="mb-2 block text-sm font-medium text-slate-300">
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
                className="w-full rounded-xl border border-slate-600 bg-slate-900/70 px-4 py-3 text-base text-white placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                style={{ fontSize: "16px" }}
                placeholder="Enter amount (e.g. 500.00)"
              />
            </div>

            <Button onClick={handleAddCategory} filled customClassName="w-full">
              Add Category
            </Button>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-medium text-white">
            Current Default Categories
          </h3>

          {defaultCategories.length === 0 ? (
            <p className="py-4 text-center text-slate-400">
              No default categories set
            </p>
          ) : (
            <div className="space-y-3">
              {defaultCategories.map((category) => (
                <div
                  key={category.title}
                  className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900/50 p-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">
                      {category.title}
                    </span>
                    <span className="text-slate-400">
                      - {category.maxSpending}
                    </span>
                  </div>

                  <button
                    onClick={() => handleRemoveCategory(category.title)}
                    className="rounded-lg p-1 text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                  >
                    <XMarkSvg />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppDialog>
  );
};
