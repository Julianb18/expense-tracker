import React, { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";

import { ChevronDown } from "./svg/ChevronDown";
import { Check } from "./svg/Check";

import { MONTHS } from "../utils/constants";

const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

export const MonthDropdown = ({ selectedMonth, onMonthChange }) => {
  return (
    <Listbox value={selectedMonth} onChange={onMonthChange}>
      {({ open }) => (
        <div className="flex min-w-36 flex-col">
          <Listbox.Label className="ml-1 block text-sm font-medium text-slate-300">
            Month
          </Listbox.Label>

          <div className="relative mt-1">
            <Listbox.Button className="relative w-full rounded-xl border border-slate-600 bg-slate-900/80 py-3 pr-10 text-left text-white shadow-lg shadow-black/20 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <span className="flex items-center">
                <span className="ml-3 block truncate">{selectedMonth}</span>
              </span>

              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                <ChevronDown
                  className={`h-5 w-5 transition-transform duration-200 ${
                    open ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 -translate-y-1"
              enter="transition ease-out duration-150"
              enterFrom="opacity-0 -translate-y-1"
              enterTo="opacity-100 translate-y-0"
            >
              <Listbox.Options className="absolute z-20 mt-2 max-h-56 w-full overflow-auto rounded-2xl border border-slate-700 bg-slate-900/95 py-1 text-base shadow-2xl shadow-black/30 backdrop-blur-sm focus:outline-none">
                {MONTHS.map((month) => (
                  <Listbox.Option
                    key={month}
                    value={month}
                    className={({ active }) =>
                      classNames(
                        active
                          ? "bg-buttonPrimary text-white"
                          : "text-slate-200",
                        "relative cursor-default select-none py-2 pl-3 pr-9 transition",
                      )
                    }
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center">
                          <span
                            className={classNames(
                              selected ? "font-semibold" : "font-normal",
                              "ml-3 block truncate",
                            )}
                          >
                            {month}
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? "text-white" : "text-buttonPrimary",
                              "absolute inset-y-0 right-0 flex items-center pr-4",
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
