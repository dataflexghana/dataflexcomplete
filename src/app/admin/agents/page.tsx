"use client"

import { useState, useMemo } from "react"
import { AgentTable } from "@/components/agent-table"
import { mockUsers } from "@/lib/mock-data"
import type { User, AgentStatus, SubscriptionStatus } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Users, KeyRound } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"

export default function ManageAgentsPage() {
  const [agents, setAgents] = useState<User[]>(mockUsers.filter((u) => u.role === "agent"))
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<AgentStatus | "all">("all")
  const [subscriptionFilter, setSubscriptionFilter] = useState<SubscriptionStatus | "all">("all")
  const [agentToModify, setAgentToModify] = useState<User | null>(null)
  const [modificationType, setModificationType] = useState<"delete" | "resetPassword" | null>(null)
  const [newPassword, setNewPassword] = useState("")
  const [showAddAgentDialog, setShowAddAgentDialog] = useState(false)
  const [newAgentData, setNewAgentData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
  })

  const handleApproveAgent = (agentId: string) => {
    setAgents((prev) =>
      prev.map((agent) => (agent.id === agentId ? { ...agent, status: "active", isApproved: true } : agent)),
    )
    const agentIndex = mockUsers.findIndex((u) => u.id === agentId)
    if (agentIndex !== -1) {
      mockUsers[agentIndex].status = "active"
      mockUsers[agentIndex].isApproved = true
    }
    toast({ title: "Agent Approved", description: `Agent ID ${agentId} has been approved.` })
  }

  const handleRejectAgent = (agentId: string) => {
    setAgents((prev) =>
      prev.map((agent) => (agent.id === agentId ? { ...agent, status: "banned", isApproved: false } : agent)),
    )
    const agentIndex = mockUsers.findIndex((u) => u.id === agentId)
    if (agentIndex !== -1) {
      mockUsers[agentIndex].status = "banned"
      mockUsers[agentIndex].isApproved = false
    }
    toast({ title: "Agent Banned", description: `Agent ID ${agentId} has been banned.`, variant: "destructive" })
  }

  const handleUpdateSubscription = (agentId: string, subStatus: SubscriptionStatus) => {
    setAgents((prev) =>
      prev.map((agent) => {
        if (agent.id === agentId) {
          let expiryDate = agent.subscriptionExpiryDate
          if (subStatus === "active") {
            const newExpiry = new Date()
            newExpiry.setDate(newExpiry.getDate() + 30)
            expiryDate = newExpiry.toISOString()
          } else if (subStatus === "expired") {
            expiryDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // yesterday
          }
          const updatedAgent = { ...agent, subscriptionStatus: subStatus, subscriptionExpiryDate: expiryDate }
          const agentIndex = mockUsers.findIndex((u) => u.id === agentId)
          if (agentIndex !== -1) mockUsers[agentIndex] = updatedAgent
          return updatedAgent
        }
        return agent
      }),
    )
    toast({
      title: "Subscription Updated",
      description: `Agent ID ${agentId} subscription status set to ${subStatus}.`,
    })
  }

  const handleDeleteAgent = (agentId: string) => {
    setAgents((prev) => prev.filter((agent) => agent.id !== agentId))
    const agentIndex = mockUsers.findIndex((u) => u.id === agentId)
    if (agentIndex !== -1) mockUsers.splice(agentIndex, 1)
    toast({ title: "Agent Deleted", description: `Agent ID ${agentId} has been deleted.`, variant: "destructive" })
    setAgentToModify(null)
    setModificationType(null)
  }

  const handleResetPassword = (agentId: string) => {
    if (!newPassword) {
      toast({ title: "Password Required", description: "New password cannot be empty.", variant: "destructive" })
      return
    }
    setAgents((prev) => prev.map((agent) => (agent.id === agentId ? { ...agent, password: newPassword } : agent)))
    const agentIndex = mockUsers.findIndex((u) => u.id === agentId)
    if (agentIndex !== -1) mockUsers[agentIndex].password = newPassword

    toast({ title: "Password Reset", description: `Password for agent ${agentToModify?.name} has been reset.` })
    setAgentToModify(null)
    setModificationType(null)
    setNewPassword("")
  }

  const openModal = (agent: User, type: "delete" | "resetPassword") => {
    setAgentToModify(agent)
    setModificationType(type)
  }

  const closeModal = () => {
    setAgentToModify(null)
    setModificationType(null)
    setNewPassword("")
  }

  const handleAddAgent = () => {
    if (!newAgentData.name || !newAgentData.email || !newAgentData.phoneNumber || !newAgentData.password) {
      toast({ title: "Validation Error", description: "All fields are required.", variant: "destructive" })
      return
    }

    if (newAgentData.password.length < 6) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      })
      return
    }

    const newAgent: User = {
      id: `agent_${Date.now()}`,
      name: newAgentData.name,
      email: newAgentData.email,
      phoneNumber: newAgentData.phoneNumber,
      password: newAgentData.password,
      role: "agent",
      status: "pending",
      subscriptionStatus: "none",
      isApproved: false,
      commissionBalance: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setAgents((prev) => [...prev, newAgent])
    mockUsers.push(newAgent)

    toast({ title: "Agent Added", description: `Agent ${newAgentData.name} has been added successfully.` })

    setShowAddAgentDialog(false)
    setNewAgentData({ name: "", email: "", phoneNumber: "", password: "" })
  }

  const filteredAgents = useMemo(() => {
    return agents
      .filter(
        (agent) =>
          agent.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          agent.email?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .filter((agent) => statusFilter === "all" || agent.status === statusFilter)
      .filter((agent) => subscriptionFilter === "all" || agent.subscriptionStatus === subscriptionFilter)
  }, [agents, searchTerm, statusFilter, subscriptionFilter])

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center">
          <Users className="h-8 w-8 mr-3 text-primary" />
          <h1 className="text-3xl font-bold font-headline">Manage Agents</h1>
        </div>
        <Button onClick={() => setShowAddAgentDialog(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Agent
        </Button>
      </div>

      <Card className="shadow-xl mb-8">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Refine the list of agents.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as AgentStatus | "all")}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="banned">Banned</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={subscriptionFilter}
            onValueChange={(value) => setSubscriptionFilter(value as SubscriptionStatus | "all")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by Subscription" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subscriptions</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="pending_payment">Pending Payment</SelectItem>
              <SelectItem value="none">None</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {filteredAgents.length > 0 ? (
        <AgentTable
          agents={filteredAgents}
          onApprove={handleApproveAgent}
          onReject={handleRejectAgent}
          onUpdateSubscription={handleUpdateSubscription}
          onDelete={(agent) => openModal(agent, "delete")}
          onResetPassword={(agent) => openModal(agent, "resetPassword")}
        />
      ) : (
        <Card className="shadow-lg text-center py-12">
          <CardHeader>
            <Users className="mx-auto h-16 w-16 text-muted-foreground" />
            <CardTitle className="mt-4">No Agents Found</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              There are no agents matching your current filter criteria. Try adjusting your search or filters.
            </CardDescription>
          </CardContent>
        </Card>
      )}

      <Dialog open={!!agentToModify && !!modificationType} onOpenChange={(isOpen) => !isOpen && closeModal()}>
        <DialogContent>
          {modificationType === "delete" && agentToModify && (
            <>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete the agent account for{" "}
                  <strong>
                    {agentToModify.name} ({agentToModify.email})
                  </strong>
                  ? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" onClick={closeModal}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button variant="destructive" onClick={() => handleDeleteAgent(agentToModify.id)}>
                  Delete Agent
                </Button>
              </DialogFooter>
            </>
          )}
          {modificationType === "resetPassword" && agentToModify && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <KeyRound className="mr-2 h-5 w-5" />
                  Reset Password for {agentToModify.name}
                </DialogTitle>
                <DialogDescription>
                  Enter a new temporary password for <strong>{agentToModify.email}</strong>. The agent should change
                  this password upon their next login.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-2">
                <Label htmlFor="newPassword">New Temporary Password</Label>
                <Input
                  id="newPassword"
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" onClick={closeModal}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button onClick={() => handleResetPassword(agentToModify.id)}>Set New Password</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={showAddAgentDialog} onOpenChange={setShowAddAgentDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Agent</DialogTitle>
            <DialogDescription>
              Create a new agent account. The agent will need approval before they can access the system.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newAgentData.name}
                onChange={(e) => setNewAgentData((prev) => ({ ...prev, name: e.target.value }))}
                className="col-span-3"
                placeholder="Enter full name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={newAgentData.email}
                onChange={(e) => setNewAgentData((prev) => ({ ...prev, email: e.target.value }))}
                className="col-span-3"
                placeholder="Enter email address"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                value={newAgentData.phoneNumber}
                onChange={(e) => setNewAgentData((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                className="col-span-3"
                placeholder="Enter phone number"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={newAgentData.password}
                onChange={(e) => setNewAgentData((prev) => ({ ...prev, password: e.target.value }))}
                className="col-span-3"
                placeholder="Enter temporary password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddAgentDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAgent}>Add Agent</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
