import { useState, useCallback, useMemo } from "react";
import { addMonthIncome } from "../firebase/firestore";

export function useIncomeModal({
  setIncomeModalIsOpen,
  uid,
  year,
  month,
  currentIncome = 0,
}) {
  const [inputVal, setInputVal] = useState("");
  const [isAddMode, setIsAddMode] = useState(true);

  const resetState = useCallback(() => {
    setInputVal("");
    setIsAddMode(true);
  }, []);

  const handleClose = useCallback(() => {
    setIncomeModalIsOpen(false);
    resetState();
  }, [setIncomeModalIsOpen, resetState]);

  const handleSubmit = useCallback(
    (e) => {
      if (e) e.preventDefault();

      if (inputVal !== "" && Number(inputVal) > 0) {
        const amount = Number(inputVal);
        const newIncome = isAddMode ? currentIncome + amount : amount;

        addMonthIncome(uid, year, month, newIncome);
        setIncomeModalIsOpen(false);
        resetState();
      }
    },
    [
      inputVal,
      isAddMode,
      currentIncome,
      uid,
      year,
      month,
      setIncomeModalIsOpen,
      resetState,
    ],
  );

  const previewTotal = useMemo(() => {
    if (inputVal === "" || Number(inputVal) <= 0) return null;
    return isAddMode ? currentIncome + Number(inputVal) : Number(inputVal);
  }, [inputVal, isAddMode, currentIncome]);

  return {
    inputVal,
    setInputVal,
    isAddMode,
    setIsAddMode,
    handleClose,
    handleSubmit,
    previewTotal,
  };
}
