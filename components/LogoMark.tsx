export default function LogoMark({
  size = 32,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <img
      src="/logo.png"
      alt="Vidibro Logo"
      width={size}
      height={size}
      className={`rounded-xl object-cover ${className}`}
    />
  );
}
