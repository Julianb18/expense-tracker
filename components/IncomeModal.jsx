import React from "react";
import { AppDialog } from "./AppDialog";
import { Button } from "./Button";
import { formatCurrency } from "../helperFunctions/currencyFormatter";
import { useIncomeModal } from "../hooks/useIncomeModal";

export const IncomeModal = ({
  incomeModalIsOpen,
  setIncomeModalIsOpen,
  uid,
  year,
  month,
  currentIncome = 0,
}) => {
  const {
    inputVal,
    setInputVal,
    isAddMode,
    setIsAddMode,
    handleClose,
    handleSubmit,
    previewTotal,
  } = useIncomeModal({
    setIncomeModalIsOpen,
    uid,
    year,
    month,
    currentIncome,
  });

  return (
    <AppDialog
      open={incomeModalIsOpen}
      onClose={handleClose}
      title="Manage Income"
      maxWidthClassName="max-w-[500px]"
      footer={
        <>
          <Button onClick={handleClose}>Cancel</Button>
          <Button filled onClick={handleSubmit}>
            {isAddMode ? "Add Income" : "Update Income"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-2xl border border-slate-700 bg-slate-900/40 p-4 text-center">
          <div className="mb-2 text-sm font-medium text-slate-300">
            Current Income
          </div>
          <div className="text-xl font-bold text-buttonSecondary">
            {formatCurrency(currentIncome)}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-700 bg-slate-900/40 p-1">
          <div className="flex">
            <button
              type="button"
              onClick={() => setIsAddMode(true)}
              className={`flex-1 rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                isAddMode
                  ? "bg-slate-700 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Add Amount
            </button>

            <button
              type="button"
              onClick={() => setIsAddMode(false)}
              className={`flex-1 rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                !isAddMode
                  ? "bg-slate-700 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Set Total
            </button>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            {isAddMode ? "Amount to Add" : "Total Income Amount"}
          </label>

          <input
            type="number"
            step="0.01"
            onChange={(e) => setInputVal(e.target.value)}
            value={inputVal}
            className="w-full rounded-xl border border-slate-600 bg-slate-900/70 px-4 py-3 text-base text-white placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            style={{ fontSize: "16px" }}
            placeholder={
              isAddMode
                ? "Enter amount to add (e.g. 500.00)"
                : "Enter total income (e.g. 3000.00)"
            }
          />
        </div>

        {previewTotal != null && (
          <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-3 text-center">
            <div className="mb-1 text-sm text-slate-300">
              {isAddMode ? "New Total Income" : "New Income Amount"}
            </div>
            <div className="text-lg font-semibold text-indigo-300">
              {formatCurrency(previewTotal)}
            </div>
          </div>
        )}
      </form>
    </AppDialog>
  );
};
