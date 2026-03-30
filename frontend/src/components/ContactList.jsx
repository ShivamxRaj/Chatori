import { useState, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { SearchIcon } from "lucide-react";

function ContactList() {
  const { getAllContacts, allContacts, setSelectedUser, selectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [query, setQuery] = useState("");

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;

  const filtered = allContacts.filter((c) =>
    c.fullName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-2">
      {/* Search bar */}
      <div className="relative mb-1">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search contacts..."
          className="w-full bg-white/5 border border-violet-500/10 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
        />
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-slate-500 text-sm py-4">No contacts found</p>
      )}

      {filtered.map((contact) => {
        const isOnline = onlineUsers.includes(contact._id);
        const isSelected = selectedUser?._id === contact._id;
        return (
          <div
            key={contact._id}
            onClick={() => setSelectedUser(contact)}
            className={`p-3 rounded-xl cursor-pointer transition-all duration-200 border ${
              isSelected
                ? "bg-violet-600/20 border-violet-500/40"
                : "border-transparent hover:bg-white/5 hover:border-violet-500/10"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`avatar ${isOnline ? "online" : "offline"}`}>
                <div className={`size-11 rounded-full ring-2 transition-all ${isSelected ? "ring-violet-500/60" : "ring-violet-500/10"}`}>
                  <img src={contact.profilePic || "/avatar.png"} alt={contact.fullName} className="rounded-full object-cover" />
                </div>
              </div>
              <div className="min-w-0">
                <h4 className="text-slate-200 font-medium text-sm truncate">{contact.fullName}</h4>
                <p className={`text-xs ${isOnline ? "text-emerald-400" : "text-slate-500"}`}>
                  {isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
export default ContactList;
