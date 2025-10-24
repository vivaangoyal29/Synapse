import { XIcon, Trash2 } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

function ChatHeader() {
  const { selectedUser, setSelectedUser, clearGeminiMessages } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const isGemini = selectedUser._id === "gemini-ai";
  const isOnline = isGemini || onlineUsers.includes(selectedUser._id);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") setSelectedUser(null);
    };
    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser]);

  return (
    <div
      className="flex justify-between items-center bg-slate-800/50 border-b
      border-slate-700/50 max-h-[84px] px-6 flex-1"
    >
      <div className="flex items-center space-x-3">
        {/* Avatar */}
        <div className={`avatar ${isOnline ? "online" : "offline"}`}>
          <div
            className={`w-12 rounded-full overflow-hidden ${
              isGemini ? "ring-2 ring-blue-500" : ""
            }`}
          >
            <img
              src={selectedUser.profilePic || "/avatar.png"}
              alt={selectedUser.fullName}
            />
          </div>
        </div>

        {/* User Info */}
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-slate-200 font-medium">
              {selectedUser.fullName}
            </h3>
            {isGemini && (
              <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded">
                AI
              </span>
            )}
          </div>
          <p
            className={`text-sm ${
              isGemini ? "text-blue-400" : "text-slate-400"
            }`}
          >
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {isGemini && (
          <button
            onClick={clearGeminiMessages}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            title="Clear chat history"
          >
            <Trash2 className="w-5 h-5 text-slate-400 hover:text-red-400" />
          </button>
        )}
        <button onClick={() => setSelectedUser(null)}>
          <XIcon className="w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer" />
        </button>
      </div>
    </div>
  );
}

export default ChatHeader;
