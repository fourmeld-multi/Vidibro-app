import Image from "next/image";

export default function LogoMark({
  size = 32,
  className = "",
  priority = false,
}: {
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/logo.png"
      alt="Vidibro Logo"
      width={size}
      height={size}
      priority={priority}
      className={`rounded-xl object-cover ${className}`}
    />
  );
}
