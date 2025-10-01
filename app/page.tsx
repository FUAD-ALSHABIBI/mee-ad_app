/*
Component Summary: Serves the root marketing route by priming Supabase auth and rendering the HomePage UI.
Steps:
1. Creates the Supabase server client helper for the current request context.
2. Invokes getUser to warm the session cache before rendering.
3. Returns the HomePage component to display the marketing experience.
Component Dependencies: components/HomePage.tsx
External Libs: @/utils/supabase/server
*/

import HomePage from "@/components/HomePage";
import { createClient } from "@/utils/supabase/server";

export default async function Page() {
  const supabase = await createClient();
  await supabase.auth.getUser();

  return <HomePage />;
}

