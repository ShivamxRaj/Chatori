function BorderAnimatedContainer({ children }) {
  return (
    <div className="w-full h-full [background:linear-gradient(45deg,#0d0d1a,#12102a_50%,#0d0d1a)_padding-box,conic-gradient(from_var(--border-angle),rgba(139,92,246,0.25)_80%,_theme(colors.violet.500)_86%,_theme(colors.fuchsia.400)_90%,_theme(colors.violet.500)_94%,_rgba(139,92,246,0.25))_border-box] rounded-2xl border border-transparent animate-border flex overflow-hidden shadow-2xl shadow-violet-900/40">
      {children}
    </div>
  );
}
export default BorderAnimatedContainer;
