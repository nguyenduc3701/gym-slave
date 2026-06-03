// Dashboard uses its own full-page layout (matching IRON_PULSE Stitch design)
// No wrapping DashboardLayout needed
export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
