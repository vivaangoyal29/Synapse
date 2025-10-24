import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";
import axios from "axios";

// ✅ Virtual Gemini User
const GEMINI_USER = {
  _id: "gemini-ai",
  fullName: "Gemini AI",
  email: "gemini@ai.com",
  profilePic: "https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg",
  createdAt: new Date().toISOString(),
};

// ✅ Load Gemini messages from localStorage
const loadGeminiMessages = () => {
  try {
    const saved = localStorage.getItem("gemini-messages");
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Failed to load Gemini messages:", error);
    return [];
  }
};

// ✅ Save Gemini messages to localStorage
const saveGeminiMessages = (messages) => {
  try {
    localStorage.setItem("gemini-messages", JSON.stringify(messages));
  } catch (error) {
    console.error("Failed to save Gemini messages:", error);
  }
};

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
    set({ isSoundEnabled: !get().isSoundEnabled });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  
  setSelectedUser: (selectedUser) => set({ selectedUser }),

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      // ✅ Add Gemini at the top of contacts
      set({ allContacts: [GEMINI_USER, ...res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      // ✅ Add Gemini at the top if there are messages
      const geminiMessages = loadGeminiMessages();
      const chatsWithGemini = geminiMessages.length > 0 
        ? [GEMINI_USER, ...res.data] 
        : res.data;
      set({ chats: chatsWithGemini });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      // ✅ If Gemini is selected, load from localStorage
      if (userId === "gemini-ai") {
        const geminiMessages = loadGeminiMessages();
        set({ messages: geminiMessages, isMessagesLoading: false });
        return;
      }

      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    const { authUser } = useAuthStore.getState();
    const tempId = `temp-${Date.now()}`;

    // ✅ Handle Gemini messages
    if (selectedUser._id === "gemini-ai") {
      const userMessage = {
        _id: tempId,
        senderId: authUser._id,
        receiverId: "gemini-ai",
        text: messageData.text,
        image: messageData.image,
        createdAt: new Date().toISOString(),
      };

      const updatedMessages = [...messages, userMessage];
      set({ messages: updatedMessages });
      saveGeminiMessages(updatedMessages);

      // Call Gemini API
      try {
        const res = await axios.post("http://localhost:3000/api/gemini/chat", {
          message: messageData.text,
          chatId: selectedUser._id,
        });

        const geminiMessage = {
          _id: `gemini-${Date.now()}`,
          senderId: "gemini-ai",
          receiverId: authUser._id,
          text: res.data.text,
          createdAt: new Date().toISOString(),
        };

        const finalMessages = [...get().messages, geminiMessage];
        set({ messages: finalMessages });
        saveGeminiMessages(finalMessages);
      } catch (error) {
        toast.error("Failed to get Gemini response");
        const errorMessage = {
          _id:`error-${Date.now()}`,
          senderId: "gemini-ai",
          receiverId: authUser._id,
          text: "Sorry, I couldn't process that request.",
          createdAt: new Date().toISOString(),
        };
        const errorMessages = [...get().messages, errorMessage];
        set({ messages: errorMessages });
        saveGeminiMessages(errorMessages);
      }
      return;
    }

    // ✅ Regular user messages (original logic)
    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    set({ messages: [...messages, optimisticMessage] });

    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: messages.concat(res.data) });
    } catch (error) {
      set({ messages: messages });
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },

  // ✅ Clear Gemini chat
  clearGeminiMessages: () => {
    const { selectedUser } = get();
    if (selectedUser?._id === "gemini-ai") {
      set({ messages: [] });
      localStorage.removeItem("gemini-messages");
      toast.success("Gemini chat history cleared");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser, isSoundEnabled } = get();
    if (!selectedUser || selectedUser._id === "gemini-ai") return; // ✅ Don't subscribe for Gemini

    const socket = useAuthStore.getState().socket;
    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      const currentMessages = get().messages;
      set({ messages: [...currentMessages, newMessage] });

      if (isSoundEnabled) {
        const notificationSound = new Audio("/sounds/notification.mp3");
        notificationSound.currentTime = 0;
        notificationSound.play().catch((e) => console.log("Audio play failed:", e));
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
}));