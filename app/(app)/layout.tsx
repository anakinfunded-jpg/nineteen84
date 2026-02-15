import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/prijava");
  }

  // Check if user is an active affiliate (lightweight query)
  let isAffiliate = false;
  try {
    const admin = createAdminClient();
    const { data: affiliate } = await admin
      .from("affiliates")
      .select("status")
      .eq("user_id", user.id)
      .single();
    isAffiliate = affiliate?.status === "active";
  } catch {
    // Table may not exist yet or query failed — default to false
  }

  return (
    <div className="flex h-screen bg-[#171717]">
      <AppSidebar user={user} isAffiliate={isAffiliate} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
