import { redirect } from "next/navigation";
import { DemoScreen } from "../../screens";
export const dynamic = "force-dynamic";
export default async function Page({ params }: { params: Promise<{ path?: string[] }> }) {
  const { path = [] } = await params;
  if (path.length === 0 || path.join("/") === "app" || path[0] === "login") redirect("/app/kanban");
  return <DemoScreen path={`/${path.join("/")}`} />;
}
