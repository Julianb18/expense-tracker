import React, { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";

import { ChevronDown } from "./svg/ChevronDown";
import { Check } from "./svg/Check";

const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const MonthDropdown = ({ selectedMonth, onMonthChange }) => {
  return (
    <Listbox
      value={selectedMonth}
      onChange={onMonthChange}
      className="outline-none border-none z-10"
    >
      {({ open }) => (
        <div className="flex flex-col">
          <Listbox.Label className="block text-white ml-3 font-medium">
            Month
          </Listbox.Label>
          <div className="relative mt-1">
            <Listbox.Button className="relative w-full cursor-default rounded-3xl border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-gray-800 shadow-lg">
              <span className="flex items-center">
                <span className="ml-3 block truncate">{selectedMonth}</span>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                <ChevronDown
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-3xl bg-white py-1 text-base focus:outline-none shadow-gray-800 shadow-lg">
                {MONTHS.map((month) => (
                  <Listbox.Option
                    key={month}
                    className={({ active }) =>
                      classNames(
                        active
                          ? "text-white bg-buttonSecondary"
                          : "text-gray-900",
                        "relative cursor-default select-none py-2 pl-3 pr-9"
                      )
                    }
                    value={month}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center">
                          <span
                            className={classNames(
                              selected ? "font-semibold" : "font-normal",
                              "ml-3 block truncate"
                            )}
                          >
                            {month}
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? "text-white" : "text-buttonSecondary",
                              "absolute inset-y-0 right-0 flex items-center pr-4"
                            )}
                          >
                            <Check className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </div>
      )}
    </Listbox>
  );
};
