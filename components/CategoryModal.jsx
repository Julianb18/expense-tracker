import React from "react";
import { AppDialog } from "./AppDialog";
import { Button } from "./Button";
import { ChevronDown } from "./svg/ChevronDown";
import { useCategoryModal } from "../hooks/useCategoryModal";

export const CategoryModal = ({
  isCategoryModalOpen,
  setIsCategoryModalOpen,
  uid,
  year,
  month,
}) => {
  const {
    category,
    showDropdown,
    setShowDropdown,
    filteredPredefined,
    handleSubmit,
    handleCancel,
    onTitleChange,
    selectPredefinedTitle,
    onMaxSpendingChange,
  } = useCategoryModal({
    uid,
    year,
    month,
    setIsCategoryModalOpen,
  });

  return (
    <AppDialog
      open={isCategoryModalOpen}
      onClose={handleCancel}
      title="Add Category"
      bodyClassName="shrink-0 overflow-visible px-4 py-4"
      footer={
        <>
          <Button
            buttonType="outlined"
            onClick={handleCancel}
            customClassName="px-3 py-1"
          >
            Cancel
          </Button>
          <Button filled onClick={handleSubmit} customClassName="px-3 py-1">
            Add Category
          </Button>
        </>
      }
    >
      <div className="space-y-4 overflow-visible">
        <div className="overflow-visible">
          <label className="mb-2 block text-sm font-medium">
            Category Name
          </label>

          <div className="overflow-visible">
            <div className="flex gap-0 rounded-xl border border-slate-600 bg-slate-900/70 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500">
              <input
                type="text"
                className="min-w-0 flex-1 rounded-l-xl border-0 bg-transparent px-4 py-3 text-base text-white placeholder:text-slate-400 focus:outline-none focus:ring-0"
                style={{ fontSize: "16px" }}
                placeholder="Type category name"
                value={category.title}
                onChange={(e) => onTitleChange(e.target.value)}
              />

              <button
                type="button"
                className="flex shrink-0 items-center px-3 text-slate-400 transition hover:text-white"
                onClick={() => setShowDropdown(!showDropdown)}
                aria-expanded={showDropdown}
              >
                <ChevronDown className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {showDropdown && filteredPredefined.length > 0 && (
              <div className="mt-2 w-full max-h-72 overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 shadow-xl">
                {filteredPredefined.map((categoryName, index) => (
                  <div
                    key={categoryName}
                    className={`cursor-pointer px-3 py-2 text-sm text-slate-200 transition hover:bg-buttonPrimary hover:text-white ${index === 0 ? "rounded-t-lg" : ""} ${index === filteredPredefined.length - 1 ? "rounded-b-2xl" : ""}`}
                    onClick={() => selectPredefinedTitle(categoryName)}
                  >
                    {categoryName}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Max Spending Amount
          </label>
          <input
            className="w-full rounded-xl border border-slate-600 bg-slate-900/70 px-4 py-3 text-base text-white placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            style={{ fontSize: "16px" }}
            type="number"
            step="0.01"
            placeholder="Enter amount (e.g. 500.00)"
            value={category.maxSpending}
            onChange={(e) => onMaxSpendingChange(e.target.value)}
          />
        </div>
      </div>
    </AppDialog>
  );
};
