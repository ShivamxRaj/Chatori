import { useRef, useState } from "react";
import useKeyboardSound from "../hooks/useKeyboardSound";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";
import { ImageIcon, SendIcon, XIcon, SmileIcon } from "lucide-react";

const EMOJIS = [
  "😀","😂","😍","🥰","😎","🤔","😅","🙏","👍","❤️",
  "🔥","✨","🎉","😭","🤣","💀","👀","🫡","💯","🥹",
  "😊","🤯","😤","🥳","😴","🫠","🤗","😏","😬","🙈",
  "💪","🫶","✌️","👋","🤙","💬","🎯","🚀","💡","🌟",
];

function MessageInput() {
  const { playRandomKeyStrokeSound } = useKeyboardSound();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const fileInputRef = useRef(null);
  const { sendMessage, isSoundEnabled } = useChatStore();

  const MAX_CHARS = 2000;

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    if (text.length > MAX_CHARS) return;
    if (isSoundEnabled) playRandomKeyStrokeSound();
    sendMessage({ text: text.trim(), image: imagePreview });
    setText("");
    setImagePreview(null);
    setShowEmoji(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const insertEmoji = (emoji) => {
    if (text.length < MAX_CHARS) setText((t) => t + emoji);
  };

  const charsLeft = MAX_CHARS - text.length;
  const showCounter = text.length > 50;

  return (
    <div className="border-t border-violet-500/10 p-4">
      {/* Image preview */}
      {imagePreview && (
        <div className="max-w-3xl mx-auto mb-3">
          <div className="relative inline-block">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-xl border border-violet-500/30 shadow-lg"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 size-6 rounded-full bg-slate-800 border border-violet-500/30 flex items-center justify-center text-slate-300 hover:bg-red-500/80 hover:text-white transition-all"
              type="button"
            >
              <XIcon className="size-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Emoji picker */}
      {showEmoji && (
        <div className="max-w-3xl mx-auto mb-3 p-3 bg-[#12102a] border border-violet-500/20 rounded-2xl shadow-xl grid grid-cols-10 gap-1.5">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => insertEmoji(emoji)}
              className="text-xl hover:scale-125 transition-transform leading-none p-0.5"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto flex items-center gap-2">
        {/* Emoji toggle */}
        <button
          type="button"
          onClick={() => setShowEmoji(!showEmoji)}
          className={`p-2.5 rounded-xl transition-all ${
            showEmoji
              ? "bg-violet-600/30 text-violet-300"
              : "bg-white/5 text-slate-400 hover:text-violet-300 hover:bg-violet-600/20"
          }`}
        >
          <SmileIcon className="size-5" />
        </button>

        {/* Text input */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              isSoundEnabled && playRandomKeyStrokeSound();
            }}
            className="w-full bg-white/5 border border-violet-500/15 rounded-xl py-2.5 px-4 text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all pr-16"
            placeholder="Type a message..."
            maxLength={MAX_CHARS + 10}
          />
          {showCounter && (
            <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono ${charsLeft < 100 ? "text-red-400" : "text-slate-500"}`}>
              {charsLeft}
            </span>
          )}
        </div>

        {/* Image upload */}
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`p-2.5 rounded-xl transition-all ${
            imagePreview
              ? "bg-violet-600/30 text-violet-300"
              : "bg-white/5 text-slate-400 hover:text-violet-300 hover:bg-violet-600/20"
          }`}
        >
          <ImageIcon className="size-5" />
        </button>

        {/* Send */}
        <button
          type="submit"
          disabled={(!text.trim() && !imagePreview) || text.length > MAX_CHARS}
          className="p-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-violet-500/30 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
        >
          <SendIcon className="size-5" />
        </button>
      </form>
    </div>
  );
}
export default MessageInput;
