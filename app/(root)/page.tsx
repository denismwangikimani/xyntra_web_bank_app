import React from "react";
import HeaderBox from "@/components/HeaderBox";
import TotalBalanceBox from "@/components/TotalBalanceBox";
import RightSidebar from "@/components/RightSidebar";
import { getLoggedInUser } from "@/lib/actions/user.action";

const Home = async () => {
  //we will create a loggedIn param to hold the users name
  const loggedIn = await getLoggedInUser();

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          {/* We will pass the loggedIn, type, title, user and subtext props to the HeaderBox component */}
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={loggedIn?.name || "Guest"}
            subtext="Access and manage your account and transactions efficiently"
          />
          {/* We will pass the accounts, totalBanks and totalCurrentBalance props to the TotalBalanceBox component */}
          <TotalBalanceBox
            accounts={[]}
            totalBanks={1}
            totalCurrentBalance={1523.55}
          />
        </header>
        RECENT TRANSACTIONS
      </div>

      {/* We will render the RightSidebar component where we will pass in user, transactions and banks as an array */}
      <RightSidebar
        user={loggedIn}
        transactions={[]}
        banks={[{ currentBalance: 123.55 }, { currentBalance: 3600.98 }]}
      />
    </section>
  );
};

export default Home;
