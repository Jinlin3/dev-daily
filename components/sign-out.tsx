import { signOut } from "@/auth";

type SignOutProps = {
  display?: string | null;
};

export default function SignOut({ display }: SignOutProps) {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button className="cursor-pointer">
        {display}
      </button>
    </form>
  );
}