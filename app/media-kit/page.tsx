'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Check, X, Wallet } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAccount, useDisconnect } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useOrb } from '@orb-money/wallet-sdk-react';

interface WalletConnection {
  _id: string;
  userId: string;
  walletAddress: string;
  walletType: 'metamask' | 'orb';
  connectedAt: string;
  lastUsed: string;
  isActive: boolean;
}

export default function WalletManagementPage() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect: connectOrb } = useOrb();
  const [connections, setConnections] = useState<WalletConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch wallet connections
  const fetchConnections = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/wallet/connections');
      const data = await response.json();
      
      if (data.success) {
        setConnections(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch connections');
      }
    } catch (err: any) {
      console.error('Error fetching wallet connections:', err);
      setError(err.message || 'An error occurred while fetching connections');
    } finally {
      setLoading(false);
    }
  };

  // Remove a wallet connection
  const removeConnection = async (connectionId: string) => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/wallet/connections', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ connectionId }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update the local state
        setConnections(prev => prev.filter(conn => conn._id !== connectionId));
        
        // If disconnecting current wallet, trigger disconnect
        const connection = connections.find(c => c._id === connectionId);
        if (connection?.walletAddress === address) {
          disconnect();
        }
      } else {
        throw new Error(data.error || 'Failed to remove connection');
      }
    } catch (err: any) {
      console.error('Error removing connection:', err);
      setError(err.message || 'An error occurred while removing the connection');
    } finally {
      setLoading(false);
    }
  };

  // Connect Orb wallet
  const handleConnectOrb = async () => {
    try {
      await connectOrb();
      // After connecting, refresh the connections list
      setTimeout(fetchConnections, 2000);
    } catch (err) {
      console.error('Error connecting Orb wallet:', err);
      setError('Failed to connect Orb wallet');
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (isConnected) {
      fetchConnections();
    }
  }, [isConnected]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Wallet Management</h1>
          <p className="text-muted-foreground">
            Manage your connected wallets
          </p>
        </div>
        
        <div className="flex gap-2">
          <ConnectButton 
            showBalance={false}
            accountStatus="address"
            chainStatus="none"
          />
          <Button 
            variant="outline" 
            onClick={handleConnectOrb}
            disabled={!isConnected}
          >
            <Wallet className="mr-2 h-4 w-4" />
            Connect Orb
          </Button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Connected Wallets</CardTitle>
          <CardDescription>
            Wallets currently connected to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading wallet connections...</div>
          ) : connections.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No wallet connections found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Wallet Type</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Connected</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {connections.map((connection) => (
                  <TableRow key={connection._id}>
                    <TableCell>
                      <Badge variant="outline">
                        {connection.walletType === 'orb' ? 'Orb' : 'MetaMask'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono">
                      {connection.walletAddress.substring(0, 10)}...
                    </TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(connection.connectedAt), { addSuffix: true })}
                    </TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(connection.lastUsed), { addSuffix: true })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={connection.isActive ? 'success' : 'destructive'}>
                        {connection.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => removeConnection(connection._id)}
                        disabled={loading}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}