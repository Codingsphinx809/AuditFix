import { redirect } from "next/navigation";

export default async function LoadingPage() {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  redirect("/report");
}