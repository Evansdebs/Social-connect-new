import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Building2,
  Lock,
  Mail,
  User as UserIcon,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  ShieldCheck,
  Sparkles,
  Users,
  Award,
  BookOpen,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { auth } from '../../lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { saveUserToFirebase, getUserFromFirebase, saveSchoolToFirebase } from '../../lib/firestoreService';
import { User, UserRole, UserType, School } from '../../types';
import { RequestSchoolModal } from '../Modals/RequestSchoolModal';

export const LoginView: React.FC = () => {
  const { schools, addSchool, setAuthUser, showToast } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [userType, setUserType] = useState<UserType>('student');
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(schools[0]?.id || '');
  const [showRequestSchoolModal, setShowRequestSchoolModal] = useState<boolean>(false);
  const [requestedSchoolNotice, setRequestedSchoolNotice] = useState<string>('');
  const [classLevel, setClassLevel] = useState('Senior Secondary (Year 12)');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccessNotice, setResetSuccessNotice] = useState<string | null>(null);

  const selectedSchool = schools.find((s) => s.id === selectedSchoolId);

  const handlePasswordReset = async () => {
    if (!email.trim()) {
      setErrorMsg('Please enter your email address above to receive a password reset link.');
      return;
    }
    setResetLoading(true);
    setErrorMsg(null);
    setResetSuccessNotice(null);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setResetSuccessNotice(`Password reset instructions sent to ${email.trim()}! Please check your inbox or spam folder.`);
      showToast('Password reset link sent to your email!', 'success');
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setErrorMsg('No registered account was found with this email address.');
      } else if (err.code === 'auth/invalid-email') {
        setErrorMsg('Please enter a valid email address format.');
      } else {
        setErrorMsg('Could not send reset email. Please try again.');
      }
    } finally {
      setResetLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setResetSuccessNotice(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        const userCred = await signInWithEmailAndPassword(auth, email.trim(), password);
        const fbUser = userCred.user;

        let userProfile = await getUserFromFirebase(fbUser.uid);
        if (!userProfile) {
          const defaultSchoolName = selectedSchool?.name || 'General Campus';
          const defaultSchoolId = selectedSchool?.id || 'school-general';
          userProfile = {
            id: fbUser.uid,
            name: fbUser.displayName || email.split('@')[0],
            username: (fbUser.displayName || email.split('@')[0]).toLowerCase().replace(/[^a-z0-9]/g, '_'),
            email: fbUser.email || email,
            role: 'user',
            userType: 'student',
            accountStatus: 'active',
            avatar: fbUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${fbUser.uid}`,
            coverImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80',
            bio: 'Student at Campus Connect',
            schoolId: defaultSchoolId,
            schoolName: defaultSchoolName,
            classLevel: 'Senior Year',
            interests: ['Academics', 'Campus Life'],
            creatorTalents: [],
            badges: ['Verified Student'],
            followersCount: 0,
            followingCount: 0,
            connectionsCount: 0,
            isVerified: false,
            isPrivate: false,
            allowDownloads: true,
            whoCanMessage: 'everyone',
            whoCanConnect: 'everyone'
          };
          await saveUserToFirebase(userProfile);
        }

        setAuthUser(userProfile);
        showToast(`Welcome to Campus Connect, ${userProfile.name}!`, 'success');
      } else {
        // Sign Up Mode
        if (!name.trim()) {
          setErrorMsg('Please enter your full name.');
          setLoading(false);
          return;
        }

        let finalSchoolId = selectedSchool?.id || '';
        let finalSchoolName = selectedSchool?.name || (requestedSchoolNotice ? `Pending Approval: ${requestedSchoolNotice}` : 'Independent Member');

        let userCred;
        try {
          userCred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        } catch (createErr: any) {
          if (createErr.code === 'auth/email-already-in-use') {
            // Email is already in use. Attempt graceful sign-in with the provided password
            try {
              const signInCred = await signInWithEmailAndPassword(auth, email.trim(), password);
              const existingFbUser = signInCred.user;
              let existingProfile = await getUserFromFirebase(existingFbUser.uid);
              if (!existingProfile) {
                existingProfile = {
                  id: existingFbUser.uid,
                  name: existingFbUser.displayName || name.trim() || email.split('@')[0],
                  username: (existingFbUser.displayName || name.trim() || email.split('@')[0]).toLowerCase().replace(/[^a-z0-9]/g, '_'),
                  email: existingFbUser.email || email.trim(),
                  role: 'user',
                  userType: userType,
                  accountStatus: 'active',
                  avatar: existingFbUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${existingFbUser.uid}`,
                  coverImage: selectedSchool?.coverImage || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80',
                  bio: `Member at ${finalSchoolName}. Ready to collaborate and connect!`,
                  schoolId: finalSchoolId,
                  schoolName: finalSchoolName,
                  classLevel: classLevel.trim(),
                  interests: ['Academics', 'Campus Life', 'Student Clubs'],
                  creatorTalents: ['Leadership'],
                  badges: ['Verified Member', finalSchoolName],
                  followersCount: 0,
                  followingCount: 0,
                  connectionsCount: 0,
                  isVerified: false,
                  isPrivate: false,
                  allowDownloads: true,
                  whoCanMessage: 'everyone',
                  whoCanConnect: 'everyone'
                };
                await saveUserToFirebase(existingProfile);
              }
              setAuthUser(existingProfile);
              showToast(`Welcome back, ${existingProfile.name}! Signed into your existing account.`, 'success');
              setLoading(false);
              return;
            } catch (authSignInErr: any) {
              // Password didn't match existing account or needs reset
              setMode('signin');
              setErrorMsg('An account with this email already exists. Please enter your existing password to sign in, or click "Forgot password" below.');
              setLoading(false);
              return;
            }
          }
          throw createErr;
        }

        const fbUser = userCred.user;

        await updateProfile(fbUser, {
          displayName: name.trim()
        });

        const newProfile: User = {
          id: fbUser.uid,
          name: name.trim(),
          username: (username.trim() || name.trim().toLowerCase().replace(/\s+/g, '_')).replace('@', ''),
          email: fbUser.email || email.trim(),
          role: 'user',
          userType: userType,
          accountStatus: 'active',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${fbUser.uid}`,
          coverImage: selectedSchool?.coverImage || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80',
          bio: `${userType === 'student' ? 'Student' : userType === 'teacher' ? 'Faculty Teacher' : 'Member'} at ${finalSchoolName}. Ready to collaborate and connect!`,
          schoolId: finalSchoolId,
          schoolName: finalSchoolName,
          classLevel: classLevel.trim(),
          interests: ['Academics', 'Campus Life', 'Student Clubs'],
          creatorTalents: ['Leadership'],
          badges: ['New Member', finalSchoolName],
          followersCount: 0,
          followingCount: 0,
          connectionsCount: 0,
          isVerified: false,
          isPrivate: false,
          allowDownloads: true,
          whoCanMessage: 'everyone',
          whoCanConnect: 'everyone'
        };

        await saveUserToFirebase(newProfile);
        setAuthUser(newProfile);
        showToast(`Account created for ${newProfile.name}! Welcome to Campus Connect.`, 'success');
      }
    } catch (err: any) {
      const standardAuthCodes = [
        'auth/email-already-in-use',
        'auth/invalid-credential',
        'auth/wrong-password',
        'auth/user-not-found',
        'auth/weak-password',
        'auth/invalid-email',
        'auth/popup-closed-by-user',
        'auth/cancelled-popup-request'
      ];
      if (!standardAuthCodes.includes(err?.code)) {
        console.warn('Firebase Auth notice:', err);
      }

      let message = err.message || 'Authentication failed';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        message = 'Invalid email or password. Please verify your credentials or reset your password.';
      } else if (err.code === 'auth/user-not-found') {
        message = 'No account found with this email. Please register first.';
      } else if (err.code === 'auth/email-already-in-use') {
        message = 'An account with this email already exists. Please sign in instead.';
      } else if (err.code === 'auth/weak-password') {
        message = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      }
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;

      let userProfile = await getUserFromFirebase(fbUser.uid);
      if (!userProfile) {
        const assignedSchool = selectedSchool || schools[0];
        const defaultSchoolName = assignedSchool?.name || 'Independent Member';
        const defaultSchoolId = assignedSchool?.id || '';

        userProfile = {
          id: fbUser.uid,
          name: fbUser.displayName || 'Campus Member',
          username: (fbUser.displayName || 'student').toLowerCase().replace(/[^a-z0-9]/g, '_'),
          email: fbUser.email || '',
          role: 'user',
          userType: 'student',
          accountStatus: 'active',
          avatar: fbUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${fbUser.uid}`,
          coverImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80',
          bio: 'Campus Connect member',
          schoolId: defaultSchoolId,
          schoolName: defaultSchoolName,
          classLevel: 'Student',
          interests: ['Campus Life', 'Academics'],
          creatorTalents: [],
          badges: ['Google Verified'],
          followersCount: 0,
          followingCount: 0,
          connectionsCount: 0,
          isVerified: true,
          isPrivate: false,
          allowDownloads: true,
          whoCanMessage: 'everyone',
          whoCanConnect: 'everyone'
        };
        await saveUserToFirebase(userProfile);
      }

      setAuthUser(userProfile);
      showToast(`Signed in with Google as ${userProfile.name}!`, 'success');
    } catch (err: any) {
      console.warn('Google sign-in exception:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setErrorMsg(err.message || 'Google sign-in could not be completed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden">
      {/* Background Decorative Ambient Gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Brand Header Bar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
              Campus Connect
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Official
              </span>
            </span>
            <p className="text-[11px] text-slate-400">Inter-Campus Academic & Social Network</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Secure Campus Portal</span>
        </div>
      </header>

      {/* Main Content Split Grid */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        {/* Left Column: Platform Mission & Visual Showcase */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-900/30 border border-blue-700/40 text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>High Schools, Colleges & Universities</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
              Your Entire Campus Community, in One Verified Hub.
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              Connect with classmates and faculty, follow official campus announcements, discover student-run clubs, and compete in inter-school academic and cultural leagues.
            </p>
          </div>

          {/* Value Cards */}
          <div className="grid sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm space-y-1">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-2">
                <Building2 className="w-4 h-4" />
              </div>
              <h2 className="text-xs font-bold text-white">Official School Hubs</h2>
              <p className="text-[11px] text-slate-400 leading-normal">
                Direct faculty notices, verified directories, and inter-campus leaderboards.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm space-y-1">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2">
                <Users className="w-4 h-4" />
              </div>
              <h2 className="text-xs font-bold text-white">Clubs & Societies</h2>
              <p className="text-[11px] text-slate-400 leading-normal">
                Join debate teams, robotics labs, sports collectives, and creative circles.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm space-y-1">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2">
                <Award className="w-4 h-4" />
              </div>
              <h2 className="text-xs font-bold text-white">Campus Challenges</h2>
              <p className="text-[11px] text-slate-400 leading-normal">
                Vote and participate in inter-school competitions, quizzes, and live hackathons.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm space-y-1">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
                <BookOpen className="w-4 h-4" />
              </div>
              <h2 className="text-xs font-bold text-white">Opportunities & Grants</h2>
              <p className="text-[11px] text-slate-400 leading-normal">
                Access curated student internships, study exchange programs, and grants.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Authentication Card Gate */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end">
          <div className="w-full max-w-md bg-white text-neutral-900 rounded-3xl shadow-2xl p-6 sm:p-8 border border-neutral-100 relative">
            {/* Form Header */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                  Access Portal
                </span>
              </div>
              <h2 className="text-2xl font-black tracking-tight text-neutral-900">
                {mode === 'signin' ? 'Sign in to your campus' : 'Create student / faculty account'}
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                {mode === 'signin'
                  ? 'Sign in to access your school feed, classmates, and clubs.'
                  : 'Join your high school or university network today.'}
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex bg-neutral-100 p-1 rounded-2xl mb-5">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMsg(null);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  mode === 'signin'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMsg(null);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  mode === 'signup'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                Register
              </button>
            </div>

            {/* Success Notice for Password Reset */}
            {resetSuccessNotice && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-start gap-2 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <span className="font-medium">{resetSuccessNotice}</span>
              </div>
            )}

            {/* Error Banner */}
            {errorMsg && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs flex flex-col gap-2 animate-in fade-in duration-200">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                  <span className="font-medium flex-1">{errorMsg}</span>
                </div>
                {errorMsg.toLowerCase().includes('already exists') && (
                  <div className="flex items-center gap-2 pt-1 border-t border-rose-200/60 pl-6">
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signin');
                        setErrorMsg('Please enter your password to sign in to this account.');
                      }}
                      className="px-2.5 py-1 bg-neutral-900 text-white font-bold rounded-lg text-[11px] hover:bg-neutral-800 cursor-pointer shadow-xs transition-colors"
                    >
                      Sign In to this Account
                    </button>
                    <button
                      type="button"
                      onClick={handlePasswordReset}
                      disabled={resetLoading}
                      className="px-2.5 py-1 bg-white text-neutral-700 border border-neutral-300 font-bold rounded-lg text-[11px] hover:bg-neutral-50 cursor-pointer transition-colors"
                    >
                      {resetLoading ? 'Sending...' : 'Reset Password'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* One-Click Google Authentication */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-2.5 px-4 border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 rounded-2xl text-xs font-bold text-neutral-800 flex items-center justify-center gap-3 transition-colors shadow-2xs mb-4 cursor-pointer disabled:opacity-60"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative flex items-center justify-center mb-4">
              <div className="border-t border-neutral-200 w-full" />
              <span className="bg-white px-3 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider shrink-0">
                Or with email
              </span>
            </div>

            {/* Email / Password Form */}
            <form onSubmit={handleEmailAuth} className="space-y-3.5 text-left text-xs">
              {mode === 'signup' && (
                <>
                  <div>
                    <label className="font-bold text-neutral-700 block mb-1">Full Name *</label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (!username) {
                            setUsername(e.target.value.toLowerCase().replace(/\s+/g, '_'));
                          }
                        }}
                        placeholder="e.g. Kwame Mensah"
                        className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-neutral-700 block mb-1">Campus Affiliation *</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: 'student', label: 'Student' },
                        { id: 'teacher', label: 'Teacher' },
                        { id: 'staff', label: 'Staff' },
                        { id: 'alumni', label: 'Alumni' }
                      ].map((r) => (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => setUserType(r.id as UserType)}
                          className={`py-1.5 px-1 rounded-xl font-bold text-xs border text-center transition-all ${
                            userType === r.id
                              ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-2xs'
                              : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                          }`}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-neutral-700 block mb-1">Select School / Campus (Optional)</label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                      <select
                        value={selectedSchoolId}
                        onChange={(e) => setSelectedSchoolId(e.target.value)}
                        className="w-full pl-9 pr-8 py-2 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition-colors text-xs"
                      >
                        <option value="">No School Selected (Optional / Skip for now)</option>
                        {schools.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} {s.location ? `(${s.location})` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {requestedSchoolNotice && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
                      <span>
                        School addition request sent for <strong>{requestedSchoolNotice}</strong>. Admin will review and add it!
                      </span>
                      <button
                        type="button"
                        onClick={() => setRequestedSchoolNotice('')}
                        className="text-emerald-700 hover:text-emerald-900 font-bold ml-2 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowRequestSchoolModal(true)}
                    className="w-full py-2 px-3 rounded-xl border border-dashed border-blue-300 bg-blue-50/60 hover:bg-blue-100/60 text-blue-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Can't find your school? Send a request to Admin</span>
                  </button>

                  <div>
                    <label className="font-bold text-neutral-700 block mb-1">Academic Grade / Level</label>
                    <input
                      type="text"
                      value={classLevel}
                      onChange={(e) => setClassLevel(e.target.value)}
                      placeholder="e.g. Senior Secondary Year 12, Undergraduate Year 2, Faculty"
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition-colors"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@school.edu or personal email"
                    className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-neutral-700 block">Password *</label>
                  <button
                    type="button"
                    onClick={handlePasswordReset}
                    disabled={resetLoading}
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer disabled:opacity-50"
                  >
                    {resetLoading ? 'Sending link...' : 'Forgot password?'}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-9 pr-10 py-2 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Connecting to Campus...</span>
                  </>
                ) : (
                  <>
                    <span>{mode === 'signin' ? 'Sign In to Campus' : 'Create Account & Enter'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-neutral-100 text-center">
              {mode === 'signin' ? (
                <p className="text-xs text-neutral-500">
                  New to Campus Connect?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setErrorMsg(null);
                    }}
                    className="font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    Register your school profile
                  </button>
                </p>
              ) : (
                <p className="text-xs text-neutral-500">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setErrorMsg(null);
                    }}
                    className="font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    Sign in to your account
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer Meta */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-slate-500 relative z-10 border-t border-slate-900">
        <p>© {new Date().getFullYear()} Campus Connect. All rights reserved. Built for verified campus communities.</p>
      </footer>

      <RequestSchoolModal
        isOpen={showRequestSchoolModal}
        onClose={() => setShowRequestSchoolModal(false)}
        defaultName={name}
        defaultEmail={email}
        onSubmitted={(reqName) => {
          setRequestedSchoolNotice(reqName);
          setSelectedSchoolId('');
        }}
      />
    </div>
  );
};
