import React from 'react'
import AnimatedCounter from './AnimatedCounter'
import DoughnutChart from './DoughnutChart'

//we will pass in the accounts, totalBanks and totalCurrentBalance props
const TotalBalanceBox = ({ accounts = [], totalBanks, totalCurrentBalance }: TotalBalanceBoxProps) => {
  return (
    <section className="total-balance">
        <div className="total-balance-chart">
            {/* We will pass the accounts prop to the DoughnutChart component */}
            <DoughnutChart accounts={accounts} />
        </div>

        <div className="flex flex-col gap-6">
            <h1 className="header-2">
                Bank Accounts: {totalBanks}
            </h1>

            <div className="flex flex-col gap-2">
                <p className="total-balance-label">
                    Total Currency Balance
                </p>
                <div className="total-balance-amount flex-center gap-2">
                    <AnimatedCounter amount={totalCurrentBalance} />
                </div>
            </div>
        </div>
    </section>
  )
}

export default TotalBalanceBox