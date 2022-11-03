import React, { useState, Fragment } from "react";
import { Transition, Dialog, Menu } from "@headlessui/react";

import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
  const { authUser, signOut } = useAuth();

  return (
    <div className="flex justify-between px-4 py-2 bg-neutral-600 text-white">
      <span className="border border-black">image</span>
      <h2 className="border border-green-500">
        Budget App / {authUser?.email}
      </h2>
      <Menu
        as="div"
        className=" border border-red-400 bg-red-400 w-8 h-8 rounded-full text-black relative inline-block text-left"
      >
        <Menu.Button className="w-full h-full rounded-full">JB</Menu.Button>
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg">
          <Menu.Item as="div" onClick={signOut} className="px-2 py-1">
            {({ active }) => (
              <a
                className={`${
                  active
                    ? " text-orange-400 underline w-full"
                    : " text-black w-full"
                }`}
              >
                Sign Out
              </a>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>
    </div>
  );
};
