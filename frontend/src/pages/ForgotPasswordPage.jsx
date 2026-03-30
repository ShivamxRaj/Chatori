import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import { ZapIcon, MailIcon, LoaderIcon, ArrowLeftIcon, MailOpenIcon } from "lucide-react";
import { Link } from "react-router";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { forgotPassword } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const result = await forgotPassword(email);
    setLoading(false);
    if (result.success) setSent(true);
  };

  return (
    <div className="w-full flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <BorderAnimatedContainer>
          <div className="w-full p-8">
            {/* Back link */}
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-violet-400 text-sm mb-6 transition-colors"
            >
              <ArrowLeftIcon className="size-4" />
              Back to Login
            </Link>

            {/* Icon */}
            <div className="text-center mb-7">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center glow-violet">
                <ZapIcon className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">Forgot Password?</h2>
              <p className="text-slate-400 text-sm">Enter your email and we'll send you a reset link</p>
            </div>

            {!sent ? (
              /* EMAIL FORM */
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="auth-input-label">Email Address</label>
                  <div className="relative">
                    <MailIcon className="auth-input-icon" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input"
                      placeholder="johndoe@gmail.com"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <button className="auth-btn" type="submit" disabled={loading || !email}>
                  {loading ? (
                    <LoaderIcon className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>
            ) : (
              /* SUCCESS STATE — with mailto button to open email client */
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-violet-600/20 border border-emerald-500/30 flex items-center justify-center">
                  <MailOpenIcon className="size-8 text-emerald-400" />
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">Check Your Inbox!</h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  We sent a password reset link to{" "}
                  <span className="text-violet-400 font-medium">{email}</span>.
                  <br />
                  The link expires in <span className="text-white font-medium">1 hour</span>.
                </p>
              </div>
            )}

            <div className="mt-5 text-center">
              <Link to="/login" className="text-slate-500 hover:text-violet-400 text-xs transition-colors">
                Remember your password? <span className="text-violet-400">Login</span>
              </Link>
            </div>
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
}
export default ForgotPasswordPage;
