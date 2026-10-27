import Home from "@/components/Home";
import { pageMetadata } from "@/i18n/dictionary";

export const metadata = pageMetadata("en");

export default function Page() {
  return <Home lang="en" />;
}
