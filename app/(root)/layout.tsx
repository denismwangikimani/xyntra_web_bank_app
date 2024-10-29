import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import { getLoggedInUser } from "@/lib/actions/user.actions";
//import Image from "next/image";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //we will create a loggedIn state that will take in the users first and last name
  const loggedIn = await getLoggedInUser();

  //if the user is not logged in, we will redirect to the sign-in page
  if (!loggedIn) redirect("/sign-in");

  return (
    <main className="flex h-screen w-full font-inter">
      {/* We will pass the loggedIn state to the Sidebar component */}
      <Sidebar user={loggedIn} />

      {/* We will render the mobile nav(sidebar) */}
      <div className="flex size-full flex-col">
        <div className="root-layout">
          {/*<Image src="/icons/logo.svg" width={30} height={30} alt="logo" />*/}
          <div>
            <MobileNav user={loggedIn} />
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}
