import React from "react";
import HeaderBox from "@/components/HeaderBox";
import TotalBalanceBox from "@/components/TotalBalanceBox";

const Home = () => {
  //we will create a loggedIn param to hold the users name
  const loggedIn = { firstName: "Denis" };

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
                accounts={[]}
                totalBanks={1}
                totalCurrentBalance={123.55}
            />
        </header>
      </div>
    </section>
  );
};

export default Home;
