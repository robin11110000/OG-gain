'use client';

import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { 
  Wallet, 
  History, 
  Shield, 
  ChevronRight,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import MetaMaskConnector from '@/components/wallet/MetaMaskConnector';
import MetaMaskActivities from '@/app/wallet-management/components/MetaMaskActivities';
import MetaMaskDetails from '@/app/wallet-management/components/MetaMaskDetails';

export default function WalletManagementPage() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletData, setWalletData] = useState<any>(null);
  const [connections, setConnections] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    const checkMetaMask = async () => {
      try {
        if (typeof window !== 'undefined' && window.ethereum) {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            setWalletAddress(accounts[0]);
            fetchWalletData(accounts[0]);
            fetchConnections(accounts[0]);
          } else {
            setIsLoading(false);
          }
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error checking MetaMask connection:', error);
        setIsLoading(false);
      }
    };
    
    checkMetaMask();
  }, []);
  
  const handleConnect = (address: string) => {
    setWalletAddress(address);
    fetchWalletData(address);
    fetchConnections(address);
  };

  const handleDisconnect = () => {
    setWalletAddress(null);
    setWalletData(null);
    setConnections([]);
    setActivities([]);
  };
  
  const fetchWalletData = async (address: string) => {
    setIsLoading(true);
    try {
      const investmentsResponse = await fetch(`/api/investments/count?walletAddress=${address}`);
      const transactionsResponse = await fetch(`/api/transactions/count?walletAddress=${address}`);
      
      if (investmentsResponse.ok && transactionsResponse.ok) {
        const investments = await investmentsResponse.json();
        const transactions = await transactionsResponse.json();
        
        setWalletData({
          investmentCount: investments.count,
          transactionCount: transactions.count,
          lastActive: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchConnections = async (address: string) => {
    try {
      const response = await fetch(`/api/wallet/connections?walletAddress=${address}`);
      
      if (response.ok) {
        const data = await response.json();
        setConnections(data.connections || []);
      }
    } catch (error) {
      console.error('Error fetching connections:', error);
    }
  };
  
  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="flex items-center mb-6">
        <Link href="/dashboard" className="mr-4">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Wallet Management</h1>
      </div>
      
      {!walletAddress && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>
              Connect your wallet to manage your investments and transactions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MetaMaskConnector onConnect={handleConnect} />
          </CardContent>
          <CardFooter className="flex flex-col items-start space-y-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Shield className="h-4 w-4 mr-2" />
              Your wallet information is securely stored and encrypted.
            </div>
          </CardFooter>
        </Card>
      )}
      
      {walletAddress && (
        <>
          <div className="flex justify-between items-center mb-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activities">Recent Activities</TabsTrigger>
                <TabsTrigger value="connections">Connections</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Button 
              variant="outline" 
              onClick={handleDisconnect}
              className="ml-4"
            >
              Disconnect Wallet
            </Button>
          </div>
            
          <TabsContent value="overview">
            <MetaMaskDetails 
              walletAddress={walletAddress}
              walletData={walletData}
              isLoading={isLoading}
            />
          </TabsContent>
          
          <TabsContent value="activities">
            <MetaMaskActivities walletAddress={walletAddress} />
          </TabsContent>
          
          <TabsContent value="connections">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" /> Wallet Connections
                </CardTitle>
                <CardDescription>
                  View your active wallet connections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Wallet Address</TableHead>
                      <TableHead>Connected Since</TableHead>
                      <TableHead>Last Activity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {connections.map((connection) => (
                      <TableRow key={connection._id}>
                        <TableCell className="font-mono">
                          {connection.walletAddress.substring(0, 10)}...
                        </TableCell>
                        <TableCell>
                          {new Date(connection.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {new Date(connection.updatedAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </>
      )}
    </div>
  );
}