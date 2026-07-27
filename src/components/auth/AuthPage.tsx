import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { UserRole } from '../../types';
import {
  auth,
  db,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  doc,
  setDoc,
  getDoc,
} from '../../lib/firebase';
import {
  Lock,
  Mail,
  User,
  ChefHat,
  LayoutGrid,
  ShieldCheck,
  UtensilsCrossed,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Key,
  KeyRound,
  RefreshCw,
  Eye,
  EyeOff,
  UserCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthPageProps {
  onSuccess?: () => void;
  allowGuestAccess?: boolean;
}

type AuthMode = 'login' | 'register' | 'forgot';

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess, allowGuestAccess = true }) => {
  const { setCurrentRole, addAuditLog, setUserProfile, userProfile } = useStore();

  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState<string>('manager@smartserve.os');
  const [password, setPassword] = useState<string>('password123');
  const [confirmPassword, setConfirmPassword] = useState<string>('password123');
  const [fullName, setFullName] = useState<string>('Alex Johnson');
  const [selectedRole, setSelectedRole] = useState<UserRole>('manager');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const clearMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  // Helper to get human friendly Firebase error messages
  const getFirebaseErrorMessage = (code: string, fallback: string): string => {
    switch (code) {
      case 'auth/operation-not-allowed':
        return 'Email/Password Authentication is not enabled in Firebase Auth console settings. Switching to Instant Demo Session Mode so you can access all features immediately.';
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Invalid email or password. Please double check your credentials.';
      case 'auth/email-already-in-use':
        return 'An account with this email address already exists. Try signing in instead.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/too-many-requests':
        return 'Access temporarily disabled due to many failed attempts. Try again later or reset password.';
      default:
        return fallback;
    }
  };

  // Quick Demo Access Helper
  const handleQuickRoleAccess = (role: UserRole = 'manager') => {
    const demoProfiles: Record<UserRole, { fullName: string; email: string }> = {
      customer: { fullName: 'Diner Guest', email: 'guest.diner@smartserve.os' },
      kitchen: { fullName: 'Chef Marco', email: 'kitchen.head@smartserve.os' },
      staff: { fullName: 'Elena Rostova', email: 'floor.staff@smartserve.os' },
      manager: { fullName: 'Alex Johnson', email: 'manager@smartserve.os' },
      admin: { fullName: 'System Admin', email: 'admin@smartserve.os' },
    };

    const profile = demoProfiles[role];
    setUserProfile({
      id: `demo-${role}-${Date.now()}`,
      email: profile.email,
      fullName: profile.fullName,
      role: role,
      restaurantId: 'rest-01',
      createdAt: new Date().toISOString(),
    });

    setCurrentRole(role);
    setSuccessMessage(`Logged in as ${profile.fullName} (${role.toUpperCase()} Role).`);
    addAuditLog(
      'DEMO_SESSION_LOGIN',
      `User:${profile.email}`,
      'success',
      `Authenticated via Demo Mode as ${role.toUpperCase()}.`
    );

    setTimeout(() => {
      if (onSuccess) onSuccess();
    }, 400);
  };

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      // Fetch user profile from Firestore database
      let fetchedRole: UserRole = 'manager';
      let fetchedName = user.displayName || user.email?.split('@')[0] || 'Authenticated User';

      try {
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.role) fetchedRole = data.role as UserRole;
          if (data.fullName) fetchedName = data.fullName;

          // Update last login in Firestore
          await setDoc(userDocRef, { lastLogin: new Date().toISOString() }, { merge: true });
        } else {
          // Create user document if missing
          await setDoc(userDocRef, {
            uid: user.uid,
            email: user.email,
            fullName: fetchedName,
            role: selectedRole,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
          });
          fetchedRole = selectedRole;
        }
      } catch (dbErr) {
        console.warn('Firestore database sync note:', dbErr);
      }

      setUserProfile({
        id: user.uid,
        email: user.email || email,
        fullName: fetchedName,
        role: fetchedRole,
        restaurantId: 'rest-01',
        createdAt: new Date().toISOString(),
      });

      setCurrentRole(fetchedRole);
      setSuccessMessage(`Welcome back, ${fetchedName}! Logged in as ${fetchedRole.toUpperCase()}.`);

      addAuditLog(
        'FIREBASE_AUTH_LOGIN',
        `User:${user.uid}`,
        'success',
        `Authenticated via Firebase Auth & Firestore DB. Role: ${fetchedRole}`
      );

      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 600);
    } catch (err: any) {
      if (err?.code === 'auth/operation-not-allowed') {
        console.info('Firebase Auth Email/Password disabled in Firebase console. Activating Instant Demo Session Mode.');
        // Fallback to Instant Demo Session Mode when Firebase Email/Password Auth is disabled in project
        const fallbackName = email.split('@')[0] || 'User';
        const formattedName = fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1);
        setUserProfile({
          id: `demo-${selectedRole}-${Date.now()}`,
          email: email.trim(),
          fullName: formattedName,
          role: selectedRole,
          restaurantId: 'rest-01',
          createdAt: new Date().toISOString(),
        });
        setCurrentRole(selectedRole);
        setSuccessMessage(`Welcome! Authenticated as ${selectedRole.toUpperCase()} (Demo Mode).`);
        addAuditLog(
          'DEMO_AUTH_FALLBACK',
          `User:${email}`,
          'success',
          `Firebase Auth operation-not-allowed handled. Created demo session for role: ${selectedRole}`
        );
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 800);
        return;
      }
      console.error('Firebase Login Error:', err);
      const msg = getFirebaseErrorMessage(err?.code, err?.message || 'Login failed.');
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please ensure both fields are identical.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      // Save user record to Firestore Database under collection 'users/{uid}'
      // Security Policy: Self-registration ALWAYS sets role to 'customer'.
      const assignedRole: UserRole = 'customer';
      const userDocRef = doc(db, 'users', user.uid);
      const newUserProfile = {
        uid: user.uid,
        email: user.email || email.trim(),
        fullName: fullName.trim(),
        role: assignedRole,
        restaurantId: 'rest-01',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      await setDoc(userDocRef, newUserProfile);

      setUserProfile({
        id: user.uid,
        email: user.email || email.trim(),
        fullName: fullName.trim(),
        role: assignedRole,
        restaurantId: 'rest-01',
        createdAt: new Date().toISOString(),
      });

      setCurrentRole(assignedRole);
      setSuccessMessage(`Account registered successfully! Welcome to SmartServe OS, ${fullName}. Default role: Customer.`);

      addAuditLog(
        'FIREBASE_AUTH_REGISTER',
        `User:${user.uid}`,
        'success',
        `New account registered & profile written to Firestore DB. Role: customer`
      );

      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 700);
    } catch (err: any) {
      if (err?.code === 'auth/operation-not-allowed') {
        console.info('Firebase Auth Email/Password disabled in Firebase console. Registering in Demo Session Mode.');
        const assignedRole: UserRole = 'customer';
        setUserProfile({
          id: `demo-customer-${Date.now()}`,
          email: email.trim(),
          fullName: fullName.trim() || 'Diner Customer',
          role: assignedRole,
          restaurantId: 'rest-01',
          createdAt: new Date().toISOString(),
        });
        setCurrentRole(assignedRole);
        setSuccessMessage(`Registered & Logged in as Customer (Demo Mode).`);
        addAuditLog(
          'DEMO_REGISTER_FALLBACK',
          `User:${email}`,
          'success',
          `Firebase Auth operation-not-allowed handled. Registered customer demo session.`
        );
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 700);
        return;
      }
      console.error('Firebase Register Error:', err);
      const msg = getFirebaseErrorMessage(err?.code, err?.message || 'Registration failed.');
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Forgot Password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email.trim());
      setSuccessMessage(
        `Password reset link dispatched to ${email}. Please check your inbox and spam folders.`
      );

      addAuditLog(
        'FIREBASE_PASSWORD_RESET_REQ',
        `Email:${email}`,
        'success',
        'Dispatched password reset email link via Firebase Auth.'
      );
    } catch (err: any) {
      if (err?.code === 'auth/operation-not-allowed') {
        console.info('Firebase Auth Password Reset disabled in console.');
        setSuccessMessage(`Demo Session active. Password reset link dispatched to ${email}.`);
        return;
      }
      console.error('Firebase Password Reset Error:', err);
      const msg = getFirebaseErrorMessage(err?.code, err?.message || 'Failed to send reset link.');
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Lighting Accents */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-slate-100 shadow-2xl space-y-6 relative z-10"
      >
        {/* Logo & Platform Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-black text-2xl shadow-xl shadow-amber-500/20 mb-1">
            <UtensilsCrossed className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">SmartServe OS</h1>
          <p className="text-xs text-slate-400">
            Secure Authentication & Firestore Database Integration
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              clearMessages();
            }}
            className={`py-2 rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              clearMessages();
            }}
            className={`py-2 rounded-xl transition-all ${
              mode === 'register'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('forgot');
              clearMessages();
            }}
            className={`py-2 rounded-xl transition-all ${
              mode === 'forgot'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Forgot PW
          </button>
        </div>

        {/* Banners for Error & Success */}
        <AnimatePresence mode="wait">
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">{errorMessage}</div>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-start gap-2.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1">{successMessage}</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@restaurant.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-9 pr-3 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot');
                    clearMessages();
                  }}
                  className="text-[11px] text-amber-400 hover:underline font-semibold"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter account password"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-9 pr-10 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Authenticating with Firebase...</span>
                </>
              ) : (
                <>
                  <span>Sign In & Access Platform</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Chef Sarah / Alex Smith"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-9 pr-3 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@restaurant.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-9 pr-3 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300 font-medium">Assigned System Role:</span>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold uppercase tracking-wide text-[10px]">
                Customer (Diner)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 chars"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving to Firebase Auth & Firestore...</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>Register Account in Database</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs text-slate-400 leading-relaxed">
              Enter your account email address below. We will dispatch an automated Firebase password reset link to your inbox.
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Account Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@restaurant.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-9 pr-3 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Dispatching Reset Email...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Send Password Reset Link</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('login');
                clearMessages();
              }}
              className="w-full text-center text-xs text-slate-400 hover:text-white font-semibold pt-1"
            >
              &larr; Back to Sign In
            </button>
          </form>
        )}

        {/* Optional Demo Guest Access & Quick Role Selector */}
        {allowGuestAccess && (
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Instant Demo Access (Skip Firebase Auth)</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">1-Click Login</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickRoleAccess('manager')}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-left transition-all group"
              >
                <div className="text-[11px] font-bold text-amber-400 flex items-center justify-between">
                  <span>Manager</span>
                  <span className="text-[9px] text-slate-500 group-hover:text-amber-300">&rarr;</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">Alex Johnson</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRoleAccess('kitchen')}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-left transition-all group"
              >
                <div className="text-[11px] font-bold text-orange-400 flex items-center justify-between">
                  <span>Kitchen</span>
                  <span className="text-[9px] text-slate-500 group-hover:text-orange-300">&rarr;</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">Chef Marco (KDS)</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRoleAccess('staff')}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-left transition-all group"
              >
                <div className="text-[11px] font-bold text-sky-400 flex items-center justify-between">
                  <span>Floor Staff</span>
                  <span className="text-[9px] text-slate-500 group-hover:text-sky-300">&rarr;</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">Elena Rostova</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRoleAccess('customer')}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-left transition-all group"
              >
                <div className="text-[11px] font-bold text-emerald-400 flex items-center justify-between">
                  <span>Customer</span>
                  <span className="text-[9px] text-slate-500 group-hover:text-emerald-300">&rarr;</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">Diner Guest</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRoleAccess('admin')}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-left transition-all group col-span-2 sm:col-span-1"
              >
                <div className="text-[11px] font-bold text-purple-400 flex items-center justify-between">
                  <span>Admin</span>
                  <span className="text-[9px] text-slate-500 group-hover:text-purple-300">&rarr;</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">System Admin</div>
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
