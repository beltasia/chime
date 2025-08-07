"use client";

export interface User {
  id: string;
  email: string;
  displayName: string;
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  chatId: string;
  readBy: string[];
  timestamp: Date;
}

export interface ChatUser {
  id: string;
  displayName: string;
  email: string;
  backgroundColor?: string;
}

// Mock data storage
let currentUser: User | null = null;
let users: ChatUser[] = [
  { id: '1', displayName: 'Alice Johnson', email: 'alice@example.com', backgroundColor: '#1a1a1a' },
  { id: '2', displayName: 'Bob Smith', email: 'bob@example.com', backgroundColor: '#2d1b69' },
  { id: '3', displayName: 'Carol Davis', email: 'carol@example.com', backgroundColor: '#1e3a8a' },
];
let messages: Message[] = [];
let messageListeners: ((messages: Message[]) => void)[] = [];

export const mockAuth = {
  signUp: async (email: string, password: string, displayName: string): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      email,
      displayName,
    };
    
    // Add to users list
    users.push({
      id: newUser.id,
      displayName,
      email,
      backgroundColor: '#1a1a1a'
    });
    
    currentUser = newUser;
  },

  signIn: async (email: string, password: string): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user by email
    const user = users.find(u => u.email === email);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    currentUser = {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
    };
  },

  signOut: async (): Promise<void> => {
    currentUser = null;
  },

  getCurrentUser: (): User | null => {
    return currentUser;
  },

  getUsers: (): ChatUser[] => {
    return users.filter(u => u.id !== currentUser?.id);
  },

  sendMessage: async (text: string, chatId: string, receiverId: string): Promise<void> => {
    if (!currentUser) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      senderId: currentUser.id,
      senderName: currentUser.displayName,
      chatId,
      readBy: [currentUser.id],
      timestamp: new Date(),
    };
    
    messages.push(newMessage);
    
    // Notify listeners
    messageListeners.forEach(listener => {
      listener(messages.filter(m => m.chatId === chatId));
    });
    
    // Simulate auto-read after 3 seconds
    setTimeout(() => {
      const messageIndex = messages.findIndex(m => m.id === newMessage.id);
      if (messageIndex !== -1) {
        messages[messageIndex].readBy.push(receiverId);
        messageListeners.forEach(listener => {
          listener(messages.filter(m => m.chatId === chatId));
        });
        
        // Delete message after both users have read it
        setTimeout(() => {
          messages = messages.filter(m => m.id !== newMessage.id);
          messageListeners.forEach(listener => {
            listener(messages.filter(m => m.chatId === chatId));
          });
        }, 2000);
      }
    }, 3000);
  },

  getMessages: (chatId: string): Message[] => {
    return messages.filter(m => m.chatId === chatId);
  },

  subscribeToMessages: (chatId: string, callback: (messages: Message[]) => void): (() => void) => {
    const listener = (allMessages: Message[]) => {
      callback(allMessages);
    };
    messageListeners.push(listener);
    
    // Send initial messages
    callback(messages.filter(m => m.chatId === chatId));
    
    return () => {
      messageListeners = messageListeners.filter(l => l !== listener);
    };
  },

  updateUserBackground: async (userId: string, backgroundColor: string): Promise<void> => {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex].backgroundColor = backgroundColor;
    }
  },

  getUserBackground: (userId: string): string => {
    const user = users.find(u => u.id === userId);
    return user?.backgroundColor || '#1a1a1a';
  }
};
