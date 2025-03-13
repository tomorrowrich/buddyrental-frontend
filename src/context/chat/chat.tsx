import React, { createContext, useContext, useEffect, useReducer } from "react";
import { Socket } from "socket.io-client";
import { useSocket } from "@/hooks/useSocket";
import { useAuth } from "../auth/auth";
import { baseURL } from "@/api";
import axios from "axios";

interface MetaProps {
  id: string;
  time: string;
  type: string;
  content: string;
}

interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  receiverId: string;
  content: string;
  status: "SENDING" | "SENT" | "DELIVERED" | "READ" | "FAILED";
  createdAt: string;
  meta?: MetaProps;
}

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage?: ChatMessage;
  unreadCount: number;
  buddyId: string;
  customerId: string;
  isFocused: boolean;
  isTyping: boolean;
}

interface ChatState {
  chats: Record<string, Chat>;
  messages: Record<string, ChatMessage[]>;
  activeChatId: string | null;
  isLoading: boolean;
  error: string | null;
}

type ChatAction =
  | { type: "SET_CHATS"; payload: Chat[] }
  | { type: "SET_ACTIVE_CHAT"; payload: string }
  | { type: "ADD_MESSAGE"; payload: ChatMessage }
  | {
      type: "SET_MESSAGES";
      payload: { chatId: string; messages: ChatMessage[] };
    }
  | {
      type: "UPDATE_MESSAGE_STATUS";
      payload: { messageId: string; status: ChatMessage["status"] };
    }
  | { type: "SET_CHAT_FOCUS"; payload: { chatId: string; isFocused: boolean } }
  | { type: "SET_CHAT_TYPING"; payload: { chatId: string; isTyping: boolean } }
  | { type: "SET_MESSAGES_READ"; payload: { chatId: string } }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case "SET_CHATS":
      const chatsMap = action.payload.reduce(
        (acc, chat) => {
          acc[chat.id] = chat;
          return acc;
        },
        {} as Record<string, Chat>,
      );
      return { ...state, chats: chatsMap };

    case "SET_ACTIVE_CHAT":
      return { ...state, activeChatId: action.payload };

    case "ADD_MESSAGE": {
      const { chatId } = action.payload;
      const chatMessages = [...(state.messages[chatId] || []), action.payload];
      const chat = state.chats[chatId];

      if (chat) {
        // Update last message in chat
        const updatedChat = {
          ...chat,
          lastMessage: action.payload,
          unreadCount: chat.isFocused ? 0 : chat.unreadCount + 1,
        };

        return {
          ...state,
          messages: { ...state.messages, [chatId]: chatMessages },
          chats: { ...state.chats, [chatId]: updatedChat },
        };
      }

      return {
        ...state,
        messages: { ...state.messages, [chatId]: chatMessages },
      };
    }

    case "SET_MESSAGES":
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.chatId]: action.payload.messages,
        },
      };

    case "UPDATE_MESSAGE_STATUS": {
      const { messageId, status } = action.payload;
      const updatedMessages = { ...state.messages };

      // Find the message in all chats
      Object.keys(updatedMessages).forEach((chatId) => {
        updatedMessages[chatId] = updatedMessages[chatId].map((msg) =>
          msg.id === messageId ? { ...msg, status } : msg,
        );
      });

      return { ...state, messages: updatedMessages };
    }

    case "SET_CHAT_FOCUS": {
      const { chatId, isFocused } = action.payload;
      const chat = state.chats[chatId];

      if (chat) {
        return {
          ...state,
          chats: {
            ...state.chats,
            [chatId]: {
              ...chat,
              isFocused,
              unreadCount: isFocused ? 0 : chat.unreadCount,
            },
          },
        };
      }

      return state;
    }

    case "SET_CHAT_TYPING": {
      const { chatId, isTyping } = action.payload;
      const chat = state.chats[chatId];

      if (chat) {
        return {
          ...state,
          chats: { ...state.chats, [chatId]: { ...chat, isTyping } },
        };
      }

      return state;
    }

    case "SET_MESSAGES_READ": {
      const { chatId } = action.payload;
      const chat = state.chats[chatId];

      if (chat) {
        // Mark all messages as read
        const updatedMessages =
          state.messages[chatId]?.map((msg) =>
            msg.status !== "READ" ? { ...msg, status: "READ" as const } : msg,
          ) || [];

        return {
          ...state,
          messages: { ...state.messages, [chatId]: updatedMessages },
          chats: { ...state.chats, [chatId]: { ...chat, unreadCount: 0 } },
        };
      }

      return state;
    }

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    default:
      return state;
  }
};

interface ChatContextValue extends ChatState {
  sendMessage: (
    chatId: string,
    content: string,
    meta?: MetaProps,
  ) => Promise<string>;
  setActiveChat: (chatId: string) => void;
  socket: Socket | null;
  socketConnected: boolean;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

interface ChatProviderProps {
  children: React.ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const { socket, connected: socketConnected } = useSocket();
  const { user } = useAuth();
  const [state, dispatch] = useReducer(chatReducer, {
    chats: {},
    messages: {},
    activeChatId: null,
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    if (!socket) return;

    // Listen for incoming messages
    socket.on("message", (message: ChatMessage) => {
      dispatch({ type: "ADD_MESSAGE", payload: message });

      // If this chat is active and focused, mark message as read
      if (
        state.activeChatId === message.chatId &&
        state.chats[message.chatId]?.isFocused
      ) {
        socket.emit("operation", `read ${message.chatId}`);
      }
    });

    // Listen for operations
    socket.on("operation", (operation: string) => {
      const [command, chatId, ...args] = operation.split(" ");

      switch (command) {
        case "focus":
          dispatch({
            type: "SET_CHAT_FOCUS",
            payload: { chatId, isFocused: true },
          });
          break;
        case "unfocus":
          dispatch({
            type: "SET_CHAT_FOCUS",
            payload: { chatId, isFocused: false },
          });
          break;
        case "typing":
          dispatch({
            type: "SET_CHAT_TYPING",
            payload: { chatId, isTyping: args[0] === "true" },
          });
          break;
        case "read":
          dispatch({ type: "SET_MESSAGES_READ", payload: { chatId } });
          break;
        default:
          console.warn("Unknown operation:", operation);
      }
    });

    return () => {
      socket.off("message");
      socket.off("operation");
    };
  }, [socket, state.activeChatId, state.chats]);

  // Fetch chats from API when socket is connected
  useEffect(() => {
    if (socketConnected) {
      fetchChats();
    }
  }, [socketConnected]);

  const fetchChats = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      console.log(baseURL);
      const response = await axios.get(`${baseURL}/chat`);
      console.log(response);

      if (!response) throw new Error("Failed to fetch chats");

      const chats = await response.data;
      dispatch({ type: "SET_CHATS", payload: chats });
      dispatch({ type: "SET_ERROR", payload: null });
    } catch (error) {
      console.error("Error fetching chats:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to load chats" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const fetchMessages = async (chatId: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await fetch(`${baseURL}/chats/${chatId}/messages`);

      if (!response.ok) throw new Error("Failed to fetch messages");

      const messages = await response.json();
      dispatch({ type: "SET_MESSAGES", payload: { chatId, messages } });
      dispatch({ type: "SET_ERROR", payload: null });
    } catch (error) {
      console.error("Error fetching messages:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to load messages" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const sendMessage = async (
    chatId: string,
    content: string,
    meta?: MetaProps,
  ): Promise<string> => {
    if (!socket || !socketConnected || !user) {
      return "FAILED";
    }

    // Create a temporary message ID
    const tempId = `temp-${Date.now()}`;

    // Create a temporary message
    const tempMessage: ChatMessage = {
      id: tempId,
      chatId,
      senderId: user.userId,
      receiverId:
        state.chats[chatId]?.buddyId === user.userId
          ? state.chats[chatId]?.customerId
          : state.chats[chatId]?.buddyId,
      content,
      status: "SENDING",
      createdAt: new Date().toISOString(),
      meta,
    };

    // Add to local state immediately
    dispatch({ type: "ADD_MESSAGE", payload: tempMessage });

    // Send via socket
    return new Promise((resolve) => {
      socket.emit(
        "message",
        {
          chatId,
          senderId: user.userId,
          content,
          meta,
        },
        (status: string) => {
          dispatch({
            type: "UPDATE_MESSAGE_STATUS",
            payload: {
              messageId: tempId,
              status: status as ChatMessage["status"],
            },
          });
          resolve(status);
        },
      );
    });
  };

  const setActiveChat = (chatId: string) => {
    dispatch({ type: "SET_ACTIVE_CHAT", payload: chatId });

    // Mark chat as focused
    if (socket && socketConnected) {
      socket.emit("operation", `focus ${chatId}`);
    }

    // Fetch messages if not already loaded
    if (!state.messages[chatId] || state.messages[chatId].length === 0) {
      fetchMessages(chatId);
    }

    // Mark messages as read
    if (socket && socketConnected) {
      socket.emit("operation", `read ${chatId}`);
    }
  };

  const value: ChatContextValue = {
    ...state,
    sendMessage,
    setActiveChat,
    socket,
    socketConnected,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
