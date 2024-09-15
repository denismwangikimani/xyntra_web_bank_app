import React from "react";
import Image from "next/image";
import Link from "next/link";
import BankCard from "./BankCard";

// We will create a functional component called RightSidebar and pass in the user, transactions and banks as props
const RightSidebar = ({ user, transactions, banks }: RightSidebarProps) => {
  return (
    // We will create a right-sidebar section
    <aside className="right-sidebar">
      <section className="flex flex-col pb-8">
        {/* We will create a profile banner */}
        <div className="profile-banner" />
        {/* We will create a profile image section */}
        <div className="profile">
          <div className="profile-img">
            <span className="text-5xl font-bold text-blue-500">
              {user?.firstName[0]}
            </span>
          </div>

          {/* We will create a profile-details section */}
          <div className="profile-details">
            <h1 className="profile-name">
              {user?.firstName} {user?.lastName}
            </h1>
            <p className="profile-email">{user?.email}</p>
          </div>
        </div>
      </section>

      {/* We will create a banks section */}
      <section className="banks">
        <div className="flex w-full justify-between">
          <h2 className="header-2">My Banks</h2>
          {/* We will create a link to add a bank */}
          <Link href="/" className="flex gap-2">
            <Image src="/icons/plus.svg" width={20} height={20} alt="plus" />
            <h2 className="text-14 font-semibold text-gray-600">Add Bank</h2>
          </Link>
        </div>

        {/* We will map over the banks if they are more than 0*/}
        {banks?.length > 0 && (
          <div className="relative flex flex-1 flex-col items-center justify-center gap-5">
            <div className="relative z-10">
              {/* We will render the BankCard component, where we will pass in the key, account, username and set show balance to false */}
              <BankCard
                key={banks[0].$id}
                account={banks[0]}
                userName={`${user?.firstName} ${user?.lastName}`}
                showBalance={false}
              />
            </div>
            {banks[1] && (
              <div className="absolute right-0 top-8 z-0 w-[90%]">
                {/* We will render the BankCard component, where we will pass in the key, account, username and set show balance to false */}
                <BankCard
                  key={banks[1].$id}
                  account={banks[1]}
                  userName={`${user?.firstName} ${user?.lastName}`}
                  showBalance={false}
                />
              </div>
            )}
          </div>
        )}
      </section>
    </aside>
  );
};

export default RightSidebar;
