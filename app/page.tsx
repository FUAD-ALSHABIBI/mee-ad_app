import HomePage from "@/components/HomePage";
import { createClient } from "@/utils/supabase/server";

export default async function Page() {
  const supabase = await createClient();
  await supabase.auth.getUser();

  return <HomePage />;
}
