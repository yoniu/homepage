import SubpageLayout from '@/src/shared/ui/SubpageLayout';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <SubpageLayout>{children}</SubpageLayout>
}
