
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Send, X } from 'lucide-react'; // Using MessageCircle for WhatsApp icon

interface WhatsAppWidgetProps {
  phoneNumber: string; // E.g., "1234567890" (without + or country code for wa.me link construction if needed, or full for direct)
  defaultMessage?: string;
}

export function WhatsAppWidget({ phoneNumber, defaultMessage = "Hello! I have a question." }: WhatsAppWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const toggleOpen = () => setIsOpen(!isOpen);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let text = `Name: ${name || 'N/A'}\n\nMessage:\n${message || defaultMessage}`;
    text = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${text}`;
    window.open(whatsappUrl, '_blank');
    // Reset form after submission (optional)
    // setName('');
    // setMessage('');
    // setIsOpen(false);
  };

  return (
    <>
      {!isOpen && (
        <Button
          onClick={toggleOpen}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg z-50"
          aria-label="Open WhatsApp Chat"
          size="icon"
        >
          <MessageCircle className="h-7 w-7" />
        </Button>
      )}

      {isOpen && (
        <Card className="fixed bottom-20 right-6 w-[calc(100vw-3rem)] max-w-xs sm:w-96 shadow-xl z-50 rounded-lg border-t-4 border-green-500">
          <CardHeader className="flex flex-row items-center justify-between p-4 bg-green-500 text-white rounded-t-md">
            <CardTitle className="text-lg font-semibold">Chat with Us</CardTitle>
            <Button variant="ghost" size="icon" onClick={toggleOpen} className="h-8 w-8 text-white hover:bg-green-600">
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="wa-name" className="text-sm font-medium text-muted-foreground">Your Name (Optional)</label>
                <Input 
                  id="wa-name"
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Enter your name"
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="wa-message" className="text-sm font-medium text-muted-foreground">Message *</label>
                <Textarea 
                  id="wa-message"
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  placeholder="Type your message here..." 
                  required
                  rows={4}
                  className="mt-1"
                />
              </div>
              <Button type="submit" className="w-full mt-3 bg-green-500 hover:bg-green-600 text-white">
                <Send className="mr-2 h-4 w-4" /> Send via WhatsApp
              </Button>
            </form>
          </CardContent>
          <CardFooter className="p-2 text-xs text-muted-foreground text-center bg-slate-50 rounded-b-md">
            Powered by DataFlex Support
          </CardFooter>
        </Card>
      )}
    </>
  );
}

