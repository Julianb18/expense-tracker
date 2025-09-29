import React, { useRef } from "react";
import { Menu } from "@headlessui/react";

import { useAuth } from "../context/AuthContext";
import { MoneySvg } from "./svg/MoneySvg";
import { Button } from "./Button";
import { LoginModal } from "./LoginModal";
import Link from "next/link";

export const Navbar = () => {
  const { authUser, signOut } = useAuth();
  const loginModalRef = useRef();

  const handleLoginClick = () => {
    loginModalRef.current?.open();
  };

  return (
    <div className="sticky shadow-lg shadow-primaryDark z-50 top-0 flex justify-between items-center px-3 py-3 bg-primaryDark text-white">
      <Link href="/dashboard" className="text-buttonSecondary flex gap-4">
        <MoneySvg /> ExpenseTracker
      </Link>
      
      {authUser ? (
        <Menu
          as="div"
          className=" border border-secondaryDark bg-buttonSecondary w-8 h-8 rounded-full text-white relative inline-block text-left"
        >
          <Menu.Button className="w-full h-full rounded-full">
            {authUser?.displayName.charAt(0)}
          </Menu.Button>
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg">
            <Menu.Item as="div" onClick={signOut} className="px-2 py-1">
              {({ active }) => (
                <a
                  className={`${
                    active
                      ? " text-buttonPrimary underline w-full"
                      : " text-black w-full"
                  }`}
                >
                  Sign Out
                </a>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>
      ) : (
        <Button
          onClick={handleLoginClick}
          customClassName="bg-buttonSecondary hover:bg-buttonPrimary text-white px-4 py-2 text-sm font-medium"
        >
          Login / Register
        </Button>
      )}
      
      <LoginModal ref={loginModalRef} />
    </div>
  );
};
