import Image from "next/image";

/** Official SHIFT horizontal lockup, gradient on light type — scales down to 32px vertical min per brand guide. */
export function ShiftLogo({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/brand/shift-lockup-gradient-light.png"
      alt="SHIFT Finance"
      width={125}
      height={28}
      priority
      className={`h-7 w-auto ${className}`}
    />
  );
}
