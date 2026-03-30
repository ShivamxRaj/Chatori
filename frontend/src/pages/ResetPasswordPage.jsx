import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import { ZapIcon, LockIcon, LoaderIcon, EyeIcon, EyeOffIcon, CheckCircleIcon } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router";

function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { resetPassword } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      import("react-hot-toast").then(({ default: toast }) =>
        toast.error("Passwords do not match")
      );
      return;
    }
    setLoading(true);
    const result = await resetPassword(token, password);
    setLoading(false);
    if (result.success) {
      setDone(true);
      setTimeout(() => navigate("/login"), 3000);
    }
  };

  return (
    <div className="w-full flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <BorderAnimatedContainer>
          <div className="w-full p-8">
            {/* Icon */}
            <div className="text-center mb-7">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center glow-violet">
                <ZapIcon className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">Set New Password</h2>
              <p className="text-slate-400 text-sm">Choose a strong new password for your account</p>
            </div>

            {!done ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* New password */}
                <div>
                  <label className="auth-input-label">New Password</label>
                  <div className="relative">
                    <LockIcon className="auth-input-icon" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input pr-11"
                      placeholder="Min 6 characters"
                      autoComplete="new-password"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-400 transition-colors"
                    >
                      {showPassword ? <EyeOffIcon className="size-5" /> : <EyeIcon className="size-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm password */}
                <div>
                  <label className="auth-input-label">Confirm Password</label>
                  <div className="relative">
                    <LockIcon className="auth-input-icon" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`input ${confirmPassword && password !== confirmPassword ? "ring-2 ring-red-500/50 border-red-500/30" : ""}`}
                      placeholder="Repeat your password"
                      autoComplete="new-password"
                      required
                    />
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="mt-1 text-xs text-red-400">Passwords do not match</p>
                  )}
                </div>

                <button
                  className="auth-btn"
                  type="submit"
                  disabled={loading || !password || !confirmPassword || password !== confirmPassword}
                >
                  {loading ? (
                    <LoaderIcon className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>
            ) : (
              /* SUCCESS */
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <CheckCircleIcon className="size-9 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Password Reset!</h3>
                <p className="text-slate-400 text-sm mb-4">
                  Your password has been successfully updated. Redirecting to login…
                </p>
                <Link to="/login" className="auth-link inline-block">
                  Go to Login
                </Link>
              </div>
            )}
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
}
export default ResetPasswordPage;
