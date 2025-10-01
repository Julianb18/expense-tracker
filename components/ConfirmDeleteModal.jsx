import React, { useState } from "react";
import { Dialog } from "@headlessui/react";

import { Button } from "./Button";

import { addMonthIncome, deleteCategory } from "../firebase/firestore";

export const ConfirmDeleteModal = ({
  isConfirmDeleteModalOpen,
  setIsConfirmDeleteModalOpen,
  selectedCategory,
  uid,
  month,
  year,
}) => {
  const handleDelete = () => {
    deleteCategory(uid, year, month, selectedCategory);
    setIsConfirmDeleteModalOpen(false);
  };
  return (
    <Dialog
      className="absolute z-30 min-w-[300px] top-1/4 left-1/2 -translate-x-1/2 bg-white rounded-2xl p-3"
      open={isConfirmDeleteModalOpen}
      onClose={() => setIsConfirmDeleteModalOpen(false)}
    >
      <Dialog.Panel className="flex flex-col space-y-4">
        <Dialog.Title>
          Are you sure you want to delete - {selectedCategory}
        </Dialog.Title>

        <div className="flex justify-end gap-2">
          <Button filled customColor="red-400" onClick={handleDelete}>
            Delete
          </Button>
          <Button onClick={() => setIsConfirmDeleteModalOpen(false)}>
            Cancel
          </Button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};
