import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Menu } from "@headlessui/react";
// import { ChevronDownIcon } from "@heroicons/react/20/solid";

import { useAuth } from "../context/AuthContext";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { addANewUserExpenseDoc, getUserExpenses } from "../firebase/firestore";
import { Dropdown } from "../components/Dropdown";

const Dashboard = () => {
  const { authUser, isLoading } = useAuth();
  const router = useRouter();

  const [userData, setUserData] = useState({});

  const [selected, setSelected] = useState(
    userData && userData.years && userData.years[0]
  );

  const changeEvent = (e) => {
    setSelected(e);
    console.log("this is e", e);
  };

  useEffect(() => {
    if (!isLoading && !authUser) {
      router.push("/");
    }
    if (authUser && authUser.uid && authUser.displayName) {
      addANewUserExpenseDoc(authUser.uid, authUser.displayName);
    }
  }, [authUser, isLoading]);

  useEffect(() => {
    if (authUser) {
      const fetchData = async () => {
        // You can await here
        const data = await getUserExpenses(authUser.uid);
        return data;
        // ...
      };
      fetchData()
        .then((data) => {
          setUserData(data);
          setSelected(data.years[0]);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [authUser]);
  console.log("NEW SELECTED", selected);
  console.log("USERDATA", userData);

  return !authUser ? (
    <LoadingSpinner />
  ) : (
    <div className="min-h-screen bg-gray-200">
      <h2>DashBoard</h2>
      <div>
        {userData && userData.years && (
          <Dropdown
            years={userData.years}
            changeEvent={changeEvent}
            selected={selected}
          />
        )}

        {/* <h3>
          {userData &&
            userData.years &&
            userData.years.map((year) => year.year)}
        </h3> */}
      </div>
    </div>
  );
};

export default Dashboard;
