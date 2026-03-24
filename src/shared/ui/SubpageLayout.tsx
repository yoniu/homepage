export default function SubpageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      id="root"
      className="space-x-0 justify-center px-4 py-4 md:space-x-8 md:justify-between md:px-8 md:py-12"
    >
      {children}
    </div>
  );
}
