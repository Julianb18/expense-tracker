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
      className="fixed inset-0 z-30 flex items-center justify-center p-4"
      open={isConfirmDeleteModalOpen}
      onClose={() => setIsConfirmDeleteModalOpen(false)}
    >
      <div className="fixed inset-0 bg-black bg-opacity-50" />
      <Dialog.Panel className="relative bg-white rounded-2xl shadow-2xl shadow-gray-900/20 border border-gray-100 w-full max-w-[300px] p-3">
        <div className="flex flex-col space-y-4">
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
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};
