import { Dialog } from "@headlessui/react";
import React, { useState } from "react";
import { addCategory } from "../firebase/firestore";
import { Button } from "./Button";
import { XMarkSvg } from "./svg/XMarkSvg";

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
  });

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
      className="absolute min-w-[300px] top-1/4 left-1/2 -translate-x-1/2 bg-white rounded-3xl"
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
              <input
                onChange={(e) =>
                  setCategory({ ...category, title: e.target.value })
                }
                value={category.title}
                className="w-full border border-black rounded-3xl pl-3 py-1"
                type="text"
                name="categoryName"
              />
            </div>
            <div>
              <label htmlFor="maxSpending">Maximum Spending</label>
              <input
                onChange={(e) =>
                  setCategory({ ...category, maxSpending: e.target.value })
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
