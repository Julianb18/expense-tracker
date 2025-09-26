import { Dialog, Combobox, Transition } from "@headlessui/react";
import React, { useState, Fragment } from "react";

import { Button } from "./Button";
import { XMarkSvg } from "./svg/XMarkSvg";
import { ChevronDown } from "./svg/ChevronDown";
import { Check } from "./svg/Check";

import { addCategory } from "../firebase/firestore";

const PREDEFINED_CATEGORIES = [
  "Rent",
  "Groceries", 
  "Car",
  "Utilities",
  "Loans",
  "Insurance",
  "Kita",
  "Miscellaneous"
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
  
  const [query, setQuery] = useState("");
  
  const filteredCategories = query === ""
    ? PREDEFINED_CATEGORIES
    : PREDEFINED_CATEGORIES.filter((cat) =>
        cat.toLowerCase().includes(query.toLowerCase())
      );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (category.title !== "" && category.maxSpending !== 0) {
      console.log("submitted");
      addCategory(uid, year, month, category);
      setIsCategoryModalOpen(false);
    }
    console.log("not submitted");
  };
  return (
    <Dialog
      className="absolute shadow-xl shadow-primaryDark z-30 min-w-[300px] top-1/4 left-1/2 -translate-x-1/2 bg-white rounded-3xl"
      open={isCategoryModalOpen}
      onClose={() => setIsCategoryModalOpen(false)}
    >
      <form onSubmit={handleSubmit}>
        <Dialog.Panel className="flex flex-col space-y-4">
          <div className="relative flex items-center justify-between px-3 pt-3 pb-2 mb-2">
            <Dialog.Title>New Category</Dialog.Title>
            <button
              className="cursor-pointer p-1"
              onClick={() => setIsCategoryModalOpen(false)}
            >
              <XMarkSvg />
            </button>
            <span className="absolute left-0 bottom-0 w-full h-[1px] bg-gray-400"></span>
          </div>
          <div className="space-y-4 px-3">
            <div className="">
              <label htmlFor="categoryName">Category Name</label>
              <Combobox
                value={category.title}
                onChange={(value) => setCategory({ ...category, title: value })}
              >
                <div className="relative">
                  <div className="relative w-full cursor-default overflow-hidden rounded-3xl bg-white text-left border border-black">
                    <Combobox.Input
                      className="w-full border-none py-1 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 focus:outline-none rounded-3xl"
                      displayValue={(category) => category}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Select or type a category"
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronDown
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </Combobox.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    afterLeave={() => setQuery("")}
                  >
                    <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-3xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
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
                                active ? "bg-buttonSecondary text-white" : "text-gray-900"
                              }`
                            }
                            value={categoryName}
                          >
                            {({ selected, active }) => (
                              <>
                                <span
                                  className={`block truncate ${
                                    selected ? "font-medium" : "font-normal"
                                  }`}
                                >
                                  {categoryName}
                                </span>
                                {selected ? (
                                  <span
                                    className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                      active ? "text-white" : "text-buttonSecondary"
                                    }`}
                                  >
                                    <Check className="h-5 w-5" aria-hidden="true" />
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
              <label htmlFor="maxSpending">Maximum Spending</label>
              <input
                onChange={(e) =>
                  setCategory({
                    ...category,
                    maxSpending: Number(e.target.value) || "",
                  })
                }
                value={category.maxSpending}
                onFocus={(e) => (e.target.value = "")}
                className="w-full border border-black rounded-3xl pl-3 py-1"
                type="number"
                name="maxSpending"
              />
            </div>
          </div>
          <div className="flex justify-end px-3 pb-3">
            <Button filled customClassName="mr-1" onClick={handleSubmit}>
              Add
            </Button>
          </div>
        </Dialog.Panel>
      </form>
    </Dialog>
  );
};
