
"use client";

import { StatCard } from '@/components/stat-card';
import { mockUsers, mockOrders, mockDataBundles } from '@/lib/mock-data';
import { Users, ShoppingCart, Package, DollarSign, AlertTriangle, CheckSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, parseISO } from 'date-fns';

export default function AdminDashboardPage() {
  const totalAgents = mockUsers.filter(u => u.role === 'agent').length;
  const pendingApprovals = mockUsers.filter(u => u.role === 'agent' && u.status === 'pending').length;
  const totalOrders = mockOrders.length;
  const pendingOrders = mockOrders.filter(o => o.status === 'pending_payment' || o.status === 'processing').length;
  const totalRevenue = mockOrders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + o.pricePaid, 0);
  const activeBundles = mockDataBundles.filter(b => b.isActive).length;

  const recentPendingAgents = mockUsers
    .filter(u => u.role === 'agent' && u.status === 'pending')
    .slice(0, 5);

  const recentPendingOrders = mockOrders
    .filter(o => o.status === 'pending_payment' || o.status === 'processing')
    .slice(0, 5);


  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 font-headline">Admin Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Total Agents"
          value={totalAgents}
          icon={Users}
          description={`${pendingApprovals} pending approval`}
          iconClassName="text-indigo-500"
        />
        <StatCard
          title="Total Orders"
          value={totalOrders}
          icon={ShoppingCart}
          description={`${pendingOrders} pending`}
          iconClassName="text-blue-500"
        />
        <StatCard
          title="Total Revenue"
          value={`₵${totalRevenue.toFixed(2)}`}
          icon={DollarSign}
          description="From completed orders"
          iconClassName="text-green-500"
        />
        <StatCard
          title="Active Bundles"
          value={activeBundles}
          icon={Package}
          description="Available for agents"
          iconClassName="text-purple-500"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 mb-8">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pending Agent Approvals</CardTitle>
              <CardDescription>Agents awaiting review.</CardDescription>
            </div>
            {pendingApprovals > 0 && <Badge variant="destructive">{pendingApprovals}</Badge>}
          </CardHeader>
          <CardContent>
            {recentPendingAgents.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentPendingAgents.map(agent => (
                    <TableRow key={agent.id}>
                      <TableCell>{agent.name}</TableCell>
                      <TableCell>{agent.email}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/agents?agentId=${agent.id}`}>Review</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground text-center py-4">No pending agent approvals.</p>
            )}
            {pendingApprovals > recentPendingAgents.length && (
              <Button variant="link" asChild className="mt-2">
                <Link href="/admin/agents">View All Pending Agents</Link>
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Pending Orders</CardTitle>
                <CardDescription>Orders needing processing or payment confirmation.</CardDescription>
            </div>
            {pendingOrders > 0 && <Badge variant="secondary">{pendingOrders}</Badge>}
          </CardHeader>
          <CardContent>
            {recentPendingOrders.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead>Bundle</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentPendingOrders.map(order => (
                    <TableRow key={order.id}>
                      <TableCell className="truncate max-w-[80px]" title={order.id}>{order.id}</TableCell>
                      <TableCell>{order.agentName}</TableCell>
                      <TableCell>{order.bundleName}</TableCell>
                      <TableCell><Badge variant={order.status === 'pending_payment' ? 'destructive': 'secondary'} className="capitalize">{order.status.replace('_', ' ')}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground text-center py-4">No pending orders.</p>
            )}
            {pendingOrders > recentPendingOrders.length && (
               <Button variant="link" asChild className="mt-2">
                <Link href="/admin/orders">View All Pending Orders</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

       <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Quick Management Links</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button asChild variant="outline" className="h-auto py-3 flex-col">
              <Link href="/admin/agents"><Users className="mb-1"/>Manage Agents</Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-3 flex-col">
              <Link href="/admin/data-bundles"><Package className="mb-1"/>Manage Bundles</Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-3 flex-col">
              <Link href="/admin/orders"><ShoppingCart className="mb-1"/>Manage Orders</Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-3 flex-col">
              <Link href="/admin/subscriptions"><CheckSquare className="mb-1"/>Manage Subscriptions</Link>
            </Button>
          </CardContent>
        </Card>

    </div>
  );
}
