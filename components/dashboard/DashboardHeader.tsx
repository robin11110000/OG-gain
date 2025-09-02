// components/dashboard/DashboardHeader.tsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Home, Wallet, Code, Settings } from 'lucide-react';

const DashboardHeader = ({ walletAddress }: { walletAddress: string | null }) => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-lg font-bold">Mantle-Gain</span>
          </Link>

          <nav className="flex items-center space-x-6">
            <Button
              variant={pathname === '/dashboard' ? 'secondary' : 'ghost'}
              asChild
            >
              <Link href="/dashboard" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </Button>

            <Button
              variant={pathname === '/portfolio' ? 'secondary' : 'ghost'}
              asChild
            >
              <Link href="/portfolio" className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                <span>Portfolio</span>
              </Link>
            </Button>

            <Button
              variant={pathname === '/developers' ? 'secondary' : 'ghost'}
              asChild
            >
              <Link href="/developers" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                <span>Developers</span>
              </Link>
            </Button>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {walletAddress && (
            <div className="text-sm text-muted-foreground">
              Connected: {walletAddress.substring(0, 6)}...{walletAddress.slice(-4)}
            </div>
          )}
          <Button
            variant={pathname === '/settings' ? 'secondary' : 'ghost'}
            asChild
          >
            <Link href="/settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader; // Add this default export