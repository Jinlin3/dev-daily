import Link from "next/link";
import SignIn from "./sign-in";
import { auth } from "@/auth";
import SignOut from "./sign-out";
import { requireUser } from "@/actions/actions";

export default async function Navbar() {
  const user = await requireUser();
  const display = user ? user.slug : null;

  return (
    <header className="bg-gray-800 p-4 text-white">
      <div className="flex items-center justify-between">
        { /* Left Side */ }
        <div className="w-1/2 flex items-center justify-start gap-x-10">
          <Link href="/" className="text-2xl font-semibold">
            Daily Commit
          </Link>
          {user && (
            <Link href={`/users/${user.slug}`}>
              {display}
            </Link>
          )}
          <Link href="/users">
            Search Users
          </Link>
          <Link href="/goals">
            Edit Goals
          </Link>
        </div>
        { /* Right Side */ }
        <div className="w-1/2 flex justify-end">
          {user ? (
            <SignOut />
          ) : (
            <SignIn />
          )}
        </div>
      </div>
    </header>
  );
}