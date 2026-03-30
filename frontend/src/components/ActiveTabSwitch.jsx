import { useChatStore } from "../store/useChatStore";

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <div className="flex gap-1 p-2 mx-2 bg-white/5 rounded-xl border border-violet-500/10">
      {["chats", "contacts"].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`flex-1 py-1.5 text-sm font-medium rounded-lg capitalize transition-all duration-200 ${
            activeTab === tab
              ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25"
              : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
export default ActiveTabSwitch;
