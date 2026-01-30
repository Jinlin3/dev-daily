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
    <main className="flex flex-col items-center gap-y-10 pt-10 text-center">
      
      {goals ? (
        <EntryForm goals={goals} />
      ) : (
        <div className="text-lg italic">Please set your goals to log your progress.</div>
      )}

      {entryCount > 0 && (
        <div className="mb-10 w-full max-w-2xl">
          <h1 className="text-3xl font-semibold mb-5">Submission History</h1>
          <div className="flex flex-col divide-y divide-black/10">
            {entries.map((entry) => {
              const hits = [
                entry.applications >= goals!.applications,
                entry.leetcode >= goals!.leetcode,
                entry.projectHours >= goals!.projectHours,
              ];
              const hitCount = hits.filter(Boolean).length;
              let bgClass = "bg-red-300";
              if (hitCount === hits.length) {
                bgClass = "bg-green-300";
              } else if (hitCount > 0) {
                bgClass = "bg-yellow-200";
              }
            
              return (
                <div key={entry.id} className={`flex flex-col py-2 gap-y-1 px-4 rounded-sm ${bgClass}`}>
                  <span className="italic">Date: {new Date(entry.date).toLocaleDateString()}</span>
                  <span>Job Applications: {entry.applications}</span>
                  <span>Leetcode Problems: {entry.leetcode}</span>
                  <span>Project Hours: {entry.projectHours}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </main>
  );
}