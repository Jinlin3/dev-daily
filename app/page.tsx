import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import EntryForm from '@/components/entry-form';

export default async function Home() {

  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    return (
      <main className="flex flex-col items-center gap-y-5 pt-10 text-center">
        <h1 className="text-lg italic">Please sign in to log your progress.</h1>
      </main>
    );
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
    }
  });

  if (!user) {
    console.log(session);
    return (
      <main className="flex flex-col items-center gap-y-5 pt-10 text-center">
        <h1 className="text-lg italic">User not found.</h1>
      </main>
    );
  }
  const userId = user.id;

  // Find all of the posts of the user signed in
  const [entries, goals] = await Promise.all([
    prisma.entry.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    }),
    prisma.goals.findUnique({
      where: { userId },
    }),
  ]);

  const entryCount = entries.length;
  const display = user?.name ?? user?.email;

  return (
    <main className="flex flex-col items-center gap-y-5 pt-10 text-center">

      <div>
        <div className="font-bold">Current Goals for {user.email}:</div>
        <div>Job Applications: {goals?.applications ?? "—"}</div>
        <div>Leetcode Problems: {goals?.leetcode ?? "—"}</div>
        <div>Project Hours: {goals?.projectHours ?? "—"}</div>
      </div>
      
      {goals ? (
        <EntryForm />
      ) : (
        <div className="text-lg italic">Please set your goals to log your progress.</div>
      )}

      {entryCount > 0 && (
        <>
          <h1 className="text-3xl font-semibold">Submission History</h1>
          <div className="border-t border-b border-black/10 flex flex-col w-full max-w-3xl">
            {entries.map((entry) => (
              <div key={entry.id} className="flex flex-col">
                <span>Date: {new Date(entry.date).toDateString()}</span>
                <span>Job Applications: {entry.applications}</span>
                <span>Leetcode Problems: {entry.leetcode}</span>
                <span>Project Hours: {entry.projectHours}</span>
              </div>
            ))}
          </div>
        </>
      )}

    </main>
  );
}