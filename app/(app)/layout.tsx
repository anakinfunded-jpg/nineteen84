import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { getUserPlan } from "@/lib/credits";
import { PLANS, syncStripeSubscription } from "@/lib/stripe";

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

  let planId = await getUserPlan(user.id);

  // Self-healing: if DB shows free, check Stripe directly
  if (planId === "free" && user.email) {
    const admin = createAdminClient();
    const synced = await syncStripeSubscription(user.id, user.email, admin);
    if (synced) planId = synced;
  }

  const planName = PLANS[planId].name;

  return (
    <div className="flex h-screen bg-[#171717]">
      <AppSidebar user={user} isAffiliate={isAffiliate} planName={planName} />
      <main className="flex-1 overflow-y-auto pt-14 lg:pt-0">{children}</main>
    </div>
  );
}
