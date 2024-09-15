import React from "react";
import HeaderBox from "@/components/HeaderBox";
import TotalBalanceBox from "@/components/TotalBalanceBox";
import RightSidebar from "@/components/RightSidebar";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { getAccount, getAccounts } from "@/lib/actions/bank.actions";

const Home = async ({ searchParams: { id, page } }: SearchParamProps) => {
  //we will create a loggedIn param to hold the users name
  const loggedIn = await getLoggedInUser();
  //we will now get the accounts form the getAccounts function
  const accounts = await getAccounts({ userId: loggedIn.$id });

  //if we don't have any accounts we will return null
  if (!accounts) return;

  //we will get the id from the query params
  const accountsData = accounts?.data;
  //we will get the id from the query params
  const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId;

  //we will now get the account from the getAccount function
  const account = await getAccount({ appwriteItemId });

  console.log({
    accountsData,
    account,
  });

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          {/* We will pass the loggedIn, type, title, user and subtext props to the HeaderBox component */}
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={loggedIn?.firstName || "Guest"}
            subtext="Access and manage your account and transactions efficiently"
          />
          {/* We will pass the accounts, totalBanks and totalCurrentBalance props to the TotalBalanceBox component */}
          <TotalBalanceBox
            accounts={accountsData}
            totalBanks={accounts?.totalBanks}
            totalCurrentBalance={accounts?.totalCurrentBalance}
          />
        </header>
        RECENT TRANSACTIONS
      </div>

      {/* We will render the RightSidebar component where we will pass in user, transactions and banks as an array */}
      <RightSidebar
        user={loggedIn}
        transactions={accounts?.transactions}
        banks={accountsData?.slice(0, 2)} //we will slice the first two banks
      />
    </section>
  );
};

export default Home;
