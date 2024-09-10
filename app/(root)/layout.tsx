import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //we will create a loggedIn state that will take in the users first and last name
  const loggedIn = { firstName: "Denis", lastName: "Mwangi" };

  return (
    <main className="flex h-screen w-full font-inter">
      {/* We will pass the loggedIn state to the Sidebar component */}
      <Sidebar user={loggedIn} />
      
      {/* We will render the mobile nav(sidebar) */}
      <div className="flex size-full flex-col">
        <div className="root-layout">
          <Image src="/icons/logo.svg" width={30} height={30} alt="logo" />
          <div>
            <MobileNav user={loggedIn} />
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}
