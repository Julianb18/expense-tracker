import React from "react";
import { AppDialog } from "./AppDialog";
import { Button } from "./Button";

import { deleteCategory } from "../firebase/firestore";

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

  const handleClose = () => {
    setIsConfirmDeleteModalOpen(false);
  };

  return (
    <AppDialog
      open={isConfirmDeleteModalOpen}
      onClose={handleClose}
      title="Confirm Delete"
      maxWidthClassName="max-w-[360px]"
      footer={
        <>
          <Button onClick={handleClose}>Cancel</Button>

          <Button filled customColor="red-500" onClick={handleDelete}>
            Delete
          </Button>
        </>
      }
    >
      <p className="text-sm text-slate-300">
        Are you sure you want to delete{" "}
        <span className="font-semibold text-white">{selectedCategory}</span>{" "}
        category?
      </p>
    </AppDialog>
  );
};
