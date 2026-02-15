import { LandingPage } from "@/components/landing-page";
import { RouteContent } from "@/components/route-content";
import { getLatestVersionInfo } from "@/lib/version";

export default function HomePage() {
  const latest = getLatestVersionInfo();
  return (
    <RouteContent>
      <LandingPage latest={latest} />
    </RouteContent>
  );
}
