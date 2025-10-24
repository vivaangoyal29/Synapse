import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/useAuthStore";

function ChatsList() {
  const { getMyChatPartners, chats, isUsersLoading, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (chats.length === 0) return <NoChatsFound />;

  return (
    <>
      {chats.map((chat) => {
        const isGemini = chat._id === "gemini-ai";
        const isOnline = isGemini || onlineUsers.includes(chat._id);

        return (
          <div
            key={chat._id}
            className={`p-4 rounded-lg cursor-pointer transition-colors ${
              isGemini
                ? "bg-blue-500/20 hover:bg-blue-500/30 border-l-2 border-l-blue-500"
                : "bg-cyan-500/10 hover:bg-cyan-500/20"
            }`}
            onClick={() => setSelectedUser(chat)}
          >
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className={`avatar ${isOnline ? "online" : "offline"}`}>
                <div
                  className={`size-12 rounded-full overflow-hidden ${
                    isGemini ? "ring-2 ring-blue-500" : ""
                  }`}
                >
                  <img
                    src={chat.profilePic || "/avatar.png"}
                    alt={chat.fullName}
                  />
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-slate-200 font-medium truncate">
                    {chat.fullName}
                  </h4>
                  {isGemini && (
                    <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded">
                      AI
                    </span>
                  )}
                </div>
                {isGemini && (
                  <p className="text-blue-400 text-xs">AI Assistant</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default ChatsList;
