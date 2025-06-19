
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { mockGlobalMessages } from '@/lib/mock-data';
import type { GlobalMessage } from '@/lib/types';
import { MessageSquare, Send, History } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function PlatformMessagesPage() {
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageHistory, setMessageHistory] = useState<GlobalMessage[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load current active message and history
    const activeMessage = mockGlobalMessages.find(m => m.isActive);
    if (activeMessage) {
      // setCurrentMessage(activeMessage.message); // Don't prefill, let admin type new
    }
    setMessageHistory([...mockGlobalMessages].sort((a, b) => parseISO(b.createdAt).getTime() - parseISO(a.createdAt).getTime()));
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim()) {
      toast({
        title: 'Empty Message',
        description: 'Cannot send an empty message.',
        variant: 'destructive',
      });
      return;
    }

    // Deactivate previous active messages
    mockGlobalMessages.forEach(m => m.isActive = false);

    const newMessage: GlobalMessage = {
      id: `globalMsg${mockGlobalMessages.length + 1}`,
      message: currentMessage,
      createdAt: new Date().toISOString(),
      isActive: true,
    };
    mockGlobalMessages.push(newMessage);
    
    // Update local state for history
    setMessageHistory(prev => [newMessage, ...prev].sort((a, b) => parseISO(b.createdAt).getTime() - parseISO(a.createdAt).getTime()));
    
    toast({
      title: 'Message Sent',
      description: 'The global message has been updated and will be shown to agents.',
    });
    setCurrentMessage(''); // Clear the input field
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-8">
        <MessageSquare className="h-8 w-8 mr-3 text-primary" />
        <h1 className="text-3xl font-bold font-headline">Platform Messages</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Send New Global Message</CardTitle>
            <CardDescription>This message will be shown as a pop-up to all active agents in their dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendMessage} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="globalMessage">Message Content</Label>
                <Textarea
                  id="globalMessage"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder="Enter the message you want to send to all agents..."
                  rows={5}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                <Send className="mr-2 h-4 w-4" /> Send Message
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center"><History className="mr-2 h-5 w-5"/>Message History</CardTitle>
            <CardDescription>Previously sent global messages.</CardDescription>
          </CardHeader>
          <CardContent>
            {messageHistory.length > 0 ? (
              <ul className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {messageHistory.map(msg => (
                  <li key={msg.id} className={`p-3 rounded-md border ${msg.isActive ? 'border-primary bg-primary/10' : 'bg-muted/50'}`}>
                    <p className="text-sm">{msg.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Sent: {format(parseISO(msg.createdAt), 'MMM d, yyyy p')}
                      {msg.isActive && <span className="ml-2 font-semibold text-primary">(Currently Active)</span>}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No messages sent yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
