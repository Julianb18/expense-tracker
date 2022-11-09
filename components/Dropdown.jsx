import React, { useState, Fragment, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDown } from "./svg/ChevronDown";
import { Check } from "./svg/Check";

const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

export const Dropdown = ({ years, changeEvent, selectedYear }) => {
  //   console.log("HERE ======>", selectedYear);
  return (
    <Listbox
      value={selectedYear}
      onChange={changeEvent}
      className="outline-none border-none"
    >
      {({ open }) => (
        <div className="flex flex-col">
          <Listbox.Label className="block text-sm font-medium text-gray-700">
            Year
          </Listbox.Label>
          <div className="relative mt-1">
            <Listbox.Button className="relative w-full cursor-default rounded-3xl border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm sm:text-sm">
              <span className="flex items-center">
                <span className="ml-3 block truncate">
                  {/* not working because we have to store the whole object in selected not just the year*/}
                  {selectedYear.year}
                </span>
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
              <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-3xl bg-white py-1 text-base shadow-lg focus:outline-none sm:text-sm">
                {years &&
                  years.map((year) => (
                    <Listbox.Option
                      key={year.year}
                      className={({ active }) =>
                        classNames(
                          active ? "text-white bg-indigo-600" : "text-gray-900",
                          "relative cursor-default select-none py-2 pl-3 pr-9"
                        )
                      }
                      value={year}
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
                              {year.year}
                            </span>
                          </div>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? "text-white" : "text-indigo-600",
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
