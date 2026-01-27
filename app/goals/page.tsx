import GoalsForm from "@/components/goals-form";

export default function GoalsPage() {
  return (
    <main className="flex flex-col items-center gap-y-6 mt-10">
      <h1 className="text-2xl font-bold">Set your Daily Goals</h1>
      <GoalsForm />
    </main>
  );
}