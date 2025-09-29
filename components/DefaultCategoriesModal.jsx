import { Dialog, Combobox, Transition } from "@headlessui/react";
import React, { useState, Fragment, useEffect } from "react";

import { Button } from "./Button";
import { XMarkSvg } from "./svg/XMarkSvg";
import { ChevronDown } from "./svg/ChevronDown";
import { Check } from "./svg/Check";

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
  "Miscellaneous"
];

export const DefaultCategoriesModal = ({
  isOpen,
  setIsOpen,
  existingDefaults = [],
  onSave,
}) => {
  const [defaultCategories, setDefaultCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ title: "", maxSpending: "" });
  const [query, setQuery] = useState("");

  const filteredCategories = query === ""
    ? PREDEFINED_CATEGORIES
    : PREDEFINED_CATEGORIES.filter((cat) =>
        cat.toLowerCase().includes(query.toLowerCase())
      );

  // Load existing defaults when modal opens
  useEffect(() => {
    if (existingDefaults.length > 0) {
      setDefaultCategories(existingDefaults);
    }
  }, [existingDefaults, isOpen]);

  const handleAddCategory = () => {
    if (newCategory.title.trim() && Number(newCategory.maxSpending) > 0) {
      const category = {
        title: newCategory.title.trim(),
        maxSpending: Number(newCategory.maxSpending),
        expenses: [],
        categoryExpense: 0,
        totalCategoryExpenses: 0,
      };
      
      // Check if category already exists
      const exists = defaultCategories.some(cat => cat.title.toLowerCase() === category.title.toLowerCase());
      if (!exists) {
        setDefaultCategories([...defaultCategories, category]);
        setNewCategory({ title: "", maxSpending: "" });
        setQuery("");
      }
    }
  };

  const handleRemoveCategory = (titleToRemove) => {
    setDefaultCategories(defaultCategories.filter(cat => cat.title !== titleToRemove));
  };

  const handleSave = () => {
    onSave(defaultCategories);
    setIsOpen(false);
  };

  const handleClose = () => {
    setDefaultCategories(existingDefaults); // Reset to original state
    setNewCategory({ title: "", maxSpending: "" });
    setQuery("");
    setIsOpen(false);
  };

  return (
    <Dialog
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      open={isOpen}
      onClose={handleClose}
    >
      <div className="fixed inset-0 bg-black bg-opacity-50" />
      
      <Dialog.Panel className="relative bg-white rounded-3xl w-full max-w-md max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <Dialog.Title className="text-xl font-semibold">
            Default Categories
          </Dialog.Title>
          <button
            className="cursor-pointer p-1"
            onClick={handleClose}
          >
            <XMarkSvg />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-96">
          {/* Add New Category Section */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Add Category</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category Name</label>
                <Combobox
                  value={newCategory.title}
                  onChange={(value) => setNewCategory({ ...newCategory, title: value })}
                >
                  <div className="relative">
                    <div className="relative w-full cursor-default overflow-hidden rounded-3xl bg-white text-left border border-gray-300">
                      <Combobox.Input
                        className="w-full border-none py-2 pl-3 pr-10 text-base leading-5 text-gray-900 focus:ring-0 focus:outline-none rounded-3xl"
                        displayValue={(category) => category}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Select or type a category"
                        style={{ fontSize: '16px' }}
                      />
                      <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      </Combobox.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                      afterLeave={() => setQuery("")}
                    >
                      <Combobox.Options className="absolute mt-1 max-h-44 w-full overflow-auto rounded-3xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                        {filteredCategories.length === 0 && query !== "" ? (
                          <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                            Nothing found.
                          </div>
                        ) : (
                          filteredCategories.map((categoryName) => (
                            <Combobox.Option
                              key={categoryName}
                              className={({ active }) =>
                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                  active ? "bg-blue-600 text-white" : "text-gray-900"
                                }`
                              }
                              value={categoryName}
                            >
                              {({ selected, active }) => (
                                <>
                                  <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                                    {categoryName}
                                  </span>
                                  {selected ? (
                                    <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? "text-white" : "text-blue-600"}`}>
                                      <Check className="h-5 w-5" />
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Combobox.Option>
                          ))
                        )}
                      </Combobox.Options>
                    </Transition>
                  </div>
                </Combobox>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Maximum Spending</label>
                <input
                  type="number"
                  value={newCategory.maxSpending}
                  onChange={(e) => setNewCategory({ ...newCategory, maxSpending: e.target.value })}
                  className="w-full border border-gray-300 rounded-3xl px-3 py-2 text-base"
                  style={{ fontSize: '16px' }}
                  placeholder="Enter amount"
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

          {/* Current Default Categories */}
          <div>
            <h3 className="text-lg font-medium mb-4">Current Default Categories</h3>
            
            {defaultCategories.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No default categories set</p>
            ) : (
              <div className="space-y-3">
                {defaultCategories.map((category) => (
                  <div
                    key={category.title}
                    className="flex items-center justify-between bg-gray-50 rounded-xl p-3"
                  >
                    <div>
                      <span className="font-medium">{category.title}</span>
                      <span className="text-gray-500 ml-2">- {category.maxSpending}</span>
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

        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <Button onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} filled>
            Save Template
          </Button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};
