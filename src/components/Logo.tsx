import Link from "next/link";
import { Hexagon } from "lucide-react";

// Geçici logo: altıgen içinde "U" + marka adı
export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
      <span className="relative grid place-items-center text-accent">
        <Hexagon className="size-8" strokeWidth={1.5} />
        <span className="absolute font-mono text-xs font-bold">U</span>
      </span>
      <span>
        Ugur<span className="text-accent">Labs</span>
      </span>
    </Link>
  );
}
