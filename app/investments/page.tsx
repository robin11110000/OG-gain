'use client';

import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  CircleDollarSign, 
  Wallet, 
  TrendingUp,
  ArrowUpRight,
  Clock,
  Filter,
  ChevronDown,
  Search,
  BarChart,
  ArrowLeft
} from 'lucide-react';
import MetaMaskConnector from '@/components/wallet/MetaMaskConnector';
import Link from 'next/link';
import { formatDistanceToNow, format } from 'date-fns';
import { ethers } from 'ethers';
import { claimRewards, withdrawFromInvestment } from '@/lib/blockchain/yield-farming';

const statusColorMap: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  active: 'bg-green-100 text-green-800',
  withdrawn: 'bg-gray-100 text-gray-800',
  completed: 'bg-blue-100 text-blue-800',
  failed: 'bg-red-100 text-red-800',
};

export default function InvestmentsPage() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [investments, setInvestments] = useState<any[]>([]);
  const [filteredInvestments, setFilteredInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeWithdrawalId, setActiveWithdrawalId] = useState<string | null>(null);
  const [activeClaimId, setActiveClaimId] = useState<string | null>(null);
  const [expandedInvestmentId, setExpandedInvestmentId] = useState<string | null>(null);
  
  const [stats, setStats] = useState({
    totalInvested: '0',
    activeInvestments: 0,
    totalEarned: '0',
    averageAPY: 0
  });

  useEffect(() => {
    if (walletAddress) {
      fetchInvestments();
    } else {
      setInvestments([]);
      setFilteredInvestments([]);
      setStats({
        totalInvested: '0',
        activeInvestments: 0,
        totalEarned: '0',
        averageAPY: 0
      });
      setLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    if (!loading) {
      applyFilters();
    }
  }, [activeTab, searchQuery, investments]);

  const fetchInvestments = async () => {
    if (!walletAddress) return;
    
    setLoading(true);
    
    try {
      const response = await fetch(`/api/investments?walletAddress=${walletAddress}`);
      const data = await response.json();
      
      if (data.success) {
        setInvestments(data.data);
        setFilteredInvestments(data.data);
        
        const activeInvs = data.data.filter((inv: any) => inv.status === 'active');
        const totalInvested = activeInvs.reduce((sum: number, inv: any) => sum + parseFloat(inv.amount), 0);
        const totalEarned = data.data.reduce((sum: number, inv: any) => {
          return sum + (parseFloat(inv.totalRewardsClaimed || '0'));
        }, 0);
        const totalAPY = activeInvs.reduce((sum: number, inv: any) => sum + (inv.currentAPY || inv.entryAPY), 0);
        const averageAPY = activeInvs.length > 0 ? totalAPY / activeInvs.length : 0;
        
        setStats({
          totalInvested: totalInvested.toFixed(4),
          activeInvestments: activeInvs.length,
          totalEarned: totalEarned.toFixed(4),
          averageAPY
        });
      }
    } catch (error) {
      console.error('Error fetching investments:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...investments];
    
    if (activeTab === 'active') {
      filtered = filtered.filter(inv => inv.status === 'active');
    } else if (activeTab === 'pending') {
      filtered = filtered.filter(inv => inv.status === 'pending');
    } else if (activeTab === 'withdrawn') {
      filtered = filtered.filter(inv => inv.status === 'withdrawn' || inv.status === 'completed');
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(inv => 
        (inv.opportunityName && inv.opportunityName.toLowerCase().includes(query)) ||
        (inv.protocol && inv.protocol.toLowerCase().includes(query)) ||
        (inv.asset && inv.asset.toLowerCase().includes(query)) ||
        (inv.chain && inv.chain.toLowerCase().includes(query))
      );
    }
    
    setFilteredInvestments(filtered);
  };

  const handleConnect = (account: string) => {
    setWalletAddress(account);
  };

  const handleDisconnect = () => {
    setWalletAddress(null);
  };

  const handleWithdraw = async (investmentId: string) => {
    if (!walletAddress || !window.ethereum) return;
    
    try {
      setWithdrawLoading(true);
      setActiveWithdrawalId(investmentId);
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      
      const result = await withdrawFromInvestment(
        investmentId,
        'all',
        walletAddress,
        signer
      );
      
      if (result.success) {
        setTimeout(fetchInvestments, 2000);
      }
    } catch (err) {
      console.error('Withdrawal error:', err);
    } finally {
      setWithdrawLoading(false);
      setActiveWithdrawalId(null);
    }
  };

  const handleClaimRewards = async (investmentId: string) => {
    if (!walletAddress || !window.ethereum) return;
    
    try {
      setClaimLoading(true);
      setActiveClaimId(investmentId);
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      
      const result = await claimRewards(
        investmentId,
        walletAddress,
        signer
      );
      
      if (result.success) {
        setTimeout(fetchInvestments, 2000);
      }
    } catch (err) {
      console.error('Claim rewards error:', err);
    } finally {
      setClaimLoading(false);
      setActiveClaimId(null);
    }
  };

  const toggleExpandedInvestment = (id: string) => {
    if (expandedInvestmentId === id) {
      setExpandedInvestmentId(null);
    } else {
      setExpandedInvestmentId(id);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    return statusColorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild className="mr-2">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">My Investments</h1>
          </div>
          <p className="text-muted-foreground mt-2">
            Track and manage your yield farming investments
          </p>
        </div>
        
        <MetaMaskConnector
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
          buttonSize="default"
          buttonText="Connect Wallet"
        />
      </div>
      
      {!walletAddress ? (
        <Card className="mb-8">
          <CardContent className="flex flex-col items-center py-12">
            <Wallet className="h-16 w-16 text-muted-foreground opacity-60 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
            <p className="text-center text-muted-foreground max-w-md mb-6">
              Connect your wallet to view your investments, track your earnings, and manage your yield farming positions.
            </p>
            <MetaMaskConnector
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
              buttonSize="lg"
              buttonText="Connect with MetaMask"
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <CircleDollarSign className="mr-2 h-4 w-4" />
                  Total Invested
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? <Skeleton className="h-8 w-24" /> : stats.totalInvested}
                </div>
                <p className="text-sm text-muted-foreground">
                  Across {loading ? '...' : stats.activeInvestments} active investments
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Average APY
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? <Skeleton className="h-8 w-24" /> : `${stats.averageAPY.toFixed(2)}%`}
                </div>
                <p className="text-sm text-muted-foreground">
                  Weighted average yield
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <BarChart className="mr-2 h-4 w-4" />
                  Total Earned
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {loading ? <Skeleton className="h-8 w-24" /> : stats.totalEarned}
                </div>
                <p className="text-sm text-muted-foreground">
                  Total rewards claimed
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Rest of the component remains the same */}
          <Card>
            {/* ... existing table and investment list code ... */}
          </Card>
        </>
      )}
    </div>
  );
}