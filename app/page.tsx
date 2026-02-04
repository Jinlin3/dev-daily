import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center gap-y-5 pt-10 text-center">
      <h1 className="text-3xl font-bold">Welcome to Daily Commit!</h1>
      <p className="text-lg italic max-w-150">Struggling to find a SWE job? Having trouble sticking to the grind? Well this app is for you! This will help you set and track daily goals to improve your productivity and job search efforts.</p>
      <ol className="list-decimal list-inside max-w-150 space-y-3">
        <li className="text-md">Sign in with Google to get started!</li>
        <li className="text-md">Set your daily goals in the <Link className="italic font-semibold" href="/goals">Edit Goals</Link> section!</li>
        <li className="text-md">Track your progress each day on your <span className="italic font-semibold">User Page</span>!</li>
        <li className="text-md">Check your history to see your progress over time!</li>
        <li className="text-md">Look up other users' progress in the <Link className="italic font-semibold" href="/users">Users</Link> section!</li>
      </ol>
    </main>
  );
}