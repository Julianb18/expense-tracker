import React, { useState } from "react";
import { Dialog } from "@headlessui/react";

import { addMonthIncome } from "../firebase/firestore";
import { Button } from "./Button";

// userData?.uid, selectedYear?.year, month

export const IncomeModal = ({
  incomeModalIsOpen,
  setIncomeModalIsOpen,
  uid,
  year,
  month,
}) => {
  const [inputVal, setInputVal] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    addMonthIncome(uid, year, month, inputVal);
    setIncomeModalIsOpen(false);
  };

  return (
    <Dialog
      className="absolute min-w-[300px] top-1/4 left-1/2 -translate-x-1/2 bg-white rounded-3xl p-3"
      open={incomeModalIsOpen}
      onClose={() => setIncomeModalIsOpen(false)}
    >
      <form onSubmit={handleSubmit}>
        <Dialog.Panel className="flex flex-col space-y-4">
          <Dialog.Title>Add Income</Dialog.Title>
          <input
            onChange={(e) => setInputVal(e.target.value)}
            value={inputVal}
            className="border border-black rounded-3xl pl-3 py-1"
            type="number"
          />
          <div className="flex justify-end">
            <Button filled customClassName="mr-1" onClick={handleSubmit}>
              Add
            </Button>
            <Button onClick={() => setIncomeModalIsOpen(false)}>Cancel</Button>
          </div>
        </Dialog.Panel>
      </form>
    </Dialog>
  );
};
