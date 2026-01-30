import Link from "next/link";
import SignIn from "./sign-in";
import { auth } from "@/auth";
import SignOut from "./sign-out";

export default async function Navbar() {
  const session = await auth();
  const email = session?.user?.email;
  const name = session?.user?.name;
  const display = name ? name : email;

  return (
    <header className="bg-gray-800 p-4 text-white">
      <div className="flex items-center justify-between">
        { /* Left Side */ }
        <div className="w-1/2 flex items-center justify-start gap-x-10">
          <Link href="/" className="text-2xl font-semibold">
            Daily Commit
          </Link>
          <Link href="/goals">
            Edit Goals
          </Link>
        </div>
        { /* Right Side */ }
        <div className="w-1/2 flex justify-end">
          {email ? (
            <SignOut display={display} />
          ) : (
            <SignIn />
          )}
        </div>
      </div>
    </header>
  );
}