import React from "react";
import Link from "next/link";
import { BackSvg } from "./svg/BackSvg";
import { ArrowUpSvg } from "./svg/ArrowUpSvg";
import { ArrowDownSvg } from "./svg/ArrowDownSvg";
import { Button } from "./Button";
import { formatCurrency } from "../helperFunctions/currencyFormatter";

export const MonthPageHeader = ({
  monthLabel,
  monthBalance,
  income,
  isEditMode,
  onToggleEditMode,
  onOpenIncomeModal,
  onOpenCategoryModal,
}) => (
  <div className="fixed top-[56px] left-0 right-0 z-10 bg-primaryDark py-3 shadow-lg shadow-primaryDark">
    <div className="max-w-[900px] mx-auto">
      <div className="flex justify-between items-center mb-3 px-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-white py-1 px-2">
            <BackSvg />
          </Link>
          <h2 className="text-white text-xl md:hidden">{monthLabel}</h2>
        </div>
        <div className="hidden md:flex items-center justify-center flex-1">
          <h2 className="text-white text-xl">{monthLabel}</h2>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2">
            <span className="text-white text-lg font-semibold">
              {formatCurrency(monthBalance)}
            </span>
            {monthBalance > 0 ? (
              <div className="text-green-400">
                <ArrowUpSvg />
              </div>
            ) : monthBalance < 0 ? (
              <div className="text-red-400">
                <ArrowDownSvg />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div
        className="mx-4 mb-4 px-3 py-2 bg-white/10 rounded-lg border border-white/20 cursor-pointer hover:bg-white/15 transition-all flex items-center justify-between"
        onClick={onOpenIncomeModal}
      >
        <div className="flex items-center gap-2">
          <span className="text-white/70 text-xs">Income:</span>
          <span className="text-white text-sm font-semibold">
            {formatCurrency(income)}
          </span>
        </div>
        <svg
          className="w-4 h-4 text-white/50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
      </div>

      <div className="flex justify-between mb-1 md:mb-10 px-4">
        <Button onClick={onToggleEditMode}>
          {isEditMode ? "Done" : "Edit Layout"}
        </Button>
        <Button filled onClick={onOpenCategoryModal}>
          Add Category
        </Button>
      </div>
    </div>
  </div>
);
