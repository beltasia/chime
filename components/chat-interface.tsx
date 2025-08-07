"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/auth-context";
import { mockAuth, User, Message, ChatUser } from "@/lib/mock-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { MessageCircle, Send, Settings, LogOut, Users } from 'lucide-react';

export default function ChatInterface({ user }: { user: User }) {
  const { signOut } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState("#1a1a1a");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load user's background color preference
  useEffect(() => {
    const bgColor = mockAuth.getUserBackground(user.id);
    setBackgroundColor(bgColor);
  }, [user.id]);

  // Load all users except current user
  useEffect(() => {
    const availableUsers = mockAuth.getUsers();
    setUsers(availableUsers);
  }, [user.id]);

  // Generate chat ID for two users
  const generateChatId = (userId1: string, userId2: string) => {
    return [userId1, userId2].sort().join("_");
  };

  // Start chat with selected user
  const startChat = (selectedUser: ChatUser) => {
    setSelectedUser(selectedUser);
    const chatId = generateChatId(user.id, selectedUser.id);
    setCurrentChatId(chatId);
  };

  // Listen to messages for current chat
  useEffect(() => {
    if (!currentChatId || !selectedUser) return;

    const unsubscribe = mockAuth.subscribeToMessages(currentChatId, (chatMessages) => {
      setMessages(chatMessages);
    });

    return unsubscribe;
  }, [currentChatId, selectedUser]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentChatId || !selectedUser) return;

    await mockAuth.sendMessage(newMessage, currentChatId, selectedUser.id);
    setNewMessage("");
  };

  const updateBackgroundColor = async (color: string) => {
    setBackgroundColor(color);
    await mockAuth.updateUserBackground(user.id, color);
  };

  const backgroundColors = [
    "#1a1a1a", "#2d1b69", "#1e3a8a", "#166534", "#7c2d12", 
    "#991b1b", "#7c1d6f", "#0f766e", "#365314", "#92400e"
  ];

  return (
    <div 
      className="min-h-screen flex"
      style={{ backgroundColor }}
    >
      {/* Sidebar */}
      <div className="w-80 bg-white/10 backdrop-blur-sm border-r border-white/20">
        <div className="p-4 border-b border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MessageCircle className="h-6 w-6 text-white mr-2" />
              <h1 className="text-xl font-bold text-white">Chime</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Background Color</Label>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {backgroundColors.map((color) => (
                          <button
                            key={color}
                            className="w-8 h-8 rounded border-2 border-white/20 hover:border-white/40"
                            style={{ backgroundColor: color }}
                            onClick={() => updateBackgroundColor(color)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={signOut}
                className="text-white hover:bg-white/20"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-white/70 text-sm mt-1">
            Welcome, {user.displayName}
          </p>
        </div>

        <div className="p-4">
          <h2 className="text-white font-semibold mb-3 flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Users
          </h2>
          <div className="space-y-2">
            {users.map((chatUser) => (
              <button
                key={chatUser.id}
                onClick={() => startChat(chatUser)}
                className={`w-full p-3 rounded-lg text-left transition-colors ${
                  selectedUser?.id === chatUser.id
                    ? "bg-white/20 text-white"
                    : "bg-white/5 text-white/80 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarFallback>
                      {chatUser.displayName?.charAt(0) || chatUser.email.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{chatUser.displayName}</p>
                    <p className="text-xs opacity-70">{chatUser.email}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white/10 backdrop-blur-sm border-b border-white/20">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-3">
                  <AvatarFallback>
                    {selectedUser.displayName?.charAt(0) || selectedUser.email.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold text-white">{selectedUser.displayName}</h2>
                  <p className="text-sm text-white/70">Messages disappear when read</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.senderId === user.id ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderId === user.id
                          ? "bg-blue-500 text-white"
                          : "bg-white/20 text-white backdrop-blur-sm"
                      }`}
                    >
                      <p>{message.text}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                        {message.senderId === user.id && (
                          <Badge 
                            variant="secondary" 
                            className="text-xs ml-2"
                          >
                            {message.readBy && message.readBy.length > 1 ? "Read" : "Sent"}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 bg-white/10 backdrop-blur-sm border-t border-white/20">
              <form onSubmit={sendMessage} className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/50"
                />
                <Button type="submit" size="icon" className="bg-blue-500 hover:bg-blue-600">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-white/70">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h2 className="text-xl font-semibold mb-2">Welcome to Chime</h2>
              <p>Select a user from the sidebar to start chatting</p>
              <p className="text-sm mt-2">Messages disappear after being read by both users</p>
              <div className="mt-4 p-4 bg-white/10 rounded-lg">
                <p className="text-sm text-white/60">
                  💡 <strong>Demo Mode:</strong> Try signing in with any email (e.g., alice@example.com) 
                  and any password to test the chat functionality!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
