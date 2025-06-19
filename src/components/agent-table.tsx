
"use client";

import type { User, AgentStatus, SubscriptionStatus } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, CheckCircle, XCircle, UserX, UserCheck, MailWarning, KeyRound, Trash2 } from 'lucide-react'; // Added KeyRound and Trash2
import { format, parseISO } from 'date-fns';
import { ScrollArea } from './ui/scroll-area';

interface AgentTableProps {
  agents: User[];
  onApprove: (agentId: string) => void;
  onReject: (agentId: string) => void; // Or Ban
  onUpdateSubscription: (agentId: string, status: SubscriptionStatus) => void;
  onDelete: (agent: User) => void; // Pass full agent for modal info
  onResetPassword: (agent: User) => void; // Pass full agent for modal info
}

export function AgentTable({ agents, onApprove, onReject, onUpdateSubscription, onDelete, onResetPassword }: AgentTableProps) {

  const getStatusBadgeVariant = (status?: AgentStatus) => {
    switch (status) {
      case 'active': return 'default';
      case 'pending': return 'secondary';
      case 'banned': return 'destructive';
      default: return 'outline';
    }
  };

  const getSubscriptionBadgeVariant = (status?: SubscriptionStatus) => {
     switch (status) {
      case 'active': return 'default';
      case 'expired': return 'destructive';
      case 'pending_payment': return 'secondary';
      case 'none': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <ScrollArea className="h-[600px] w-full rounded-md border shadow-md">
      <Table>
        <TableHeader className="sticky top-0 bg-background z-10">
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Subscription</TableHead>
            <TableHead>Expiry Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agents.map((agent) => (
            <TableRow key={agent.id}>
              <TableCell className="font-medium">{agent.name}</TableCell>
              <TableCell>{agent.email}</TableCell>
              <TableCell>{agent.phoneNumber || 'N/A'}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(agent.status)} className="capitalize">
                  {agent.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getSubscriptionBadgeVariant(agent.subscriptionStatus)} className="capitalize">
                  {agent.subscriptionStatus?.replace('_',' ') || 'N/A'}
                </Badge>
              </TableCell>
              <TableCell>
                {agent.subscriptionExpiryDate ? format(parseISO(agent.subscriptionExpiryDate), 'MMM d, yyyy') : 'N/A'}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Account Actions</DropdownMenuLabel>
                    {agent.status === 'pending' && (
                      <DropdownMenuItem onClick={() => onApprove(agent.id)}>
                        <UserCheck className="mr-2 h-4 w-4" /> Approve Agent
                      </DropdownMenuItem>
                    )}
                     {agent.status !== 'banned' && agent.status !== 'pending' &&(
                      <DropdownMenuItem onClick={() => onReject(agent.id)} className="text-orange-600 focus:text-orange-700 focus:bg-orange-100">
                        <UserX className="mr-2 h-4 w-4" /> Ban Agent
                      </DropdownMenuItem>
                    )}
                     {agent.status === 'banned' && (
                      <DropdownMenuItem onClick={() => onApprove(agent.id)} > 
                        <UserCheck className="mr-2 h-4 w-4" /> Unban Agent
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => onResetPassword(agent)}>
                        <KeyRound className="mr-2 h-4 w-4" /> Reset Password
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Subscription</DropdownMenuLabel>
                    {agent.subscriptionStatus === 'pending_payment' && (
                        <DropdownMenuItem onClick={() => onUpdateSubscription(agent.id, 'active')}>
                            <CheckCircle className="mr-2 h-4 w-4" /> Mark Subscription Paid
                        </DropdownMenuItem>
                    )}
                     {(agent.subscriptionStatus === 'active' || agent.subscriptionStatus === 'expired') && (
                        <DropdownMenuItem onClick={() => onUpdateSubscription(agent.id, 'expired')}>
                            <XCircle className="mr-2 h-4 w-4" /> Mark Subscription Expired
                        </DropdownMenuItem>
                    )}
                     {agent.subscriptionStatus === 'none' && (
                        <DropdownMenuItem onClick={() => onUpdateSubscription(agent.id, 'pending_payment')}>
                            <MailWarning className="mr-2 h-4 w-4" /> Set Pending Payment
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onDelete(agent)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete Account
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
