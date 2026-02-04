import { signOut } from "@/auth";

export default function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button className="cursor-pointer">
        Sign Out
      </button>
    </form>
  );
}