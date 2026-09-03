import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  GraduationCap,
  Building2,
  Shield,
  Sparkles,
  ArrowRight,
  Loader2,
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
import { RequestSchoolModal } from './RequestSchoolModal';

export const AuthModal: React.FC = () => {
  const {
    closeModal,
    showToast,
    schools,
    addSchool,
    setAuthUser
  } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      setErrorMsg('Please enter your email address to receive a password reset link.');
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
    setLoading(true);

    try {
      if (mode === 'signin') {
        const userCred = await signInWithEmailAndPassword(auth, email.trim(), password);
        const fbUser = userCred.user;

        // Try to fetch existing user profile from Firestore
        let userProfile = await getUserFromFirebase(fbUser.uid);
        if (!userProfile) {
          // If no profile exists yet, create one
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
        showToast(`Welcome back, ${userProfile.name}!`, 'success');
        closeModal();
      } else {
        // Sign Up
        if (!name.trim()) {
          setErrorMsg('Please enter your full name');
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
            // Gracefully sign in existing user if the password matches
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
                  bio: `${userType === 'student' ? 'Student' : userType === 'teacher' ? 'Faculty Teacher' : 'Member'} at ${finalSchoolName}. Passionate about learning and collaboration!`,
                  schoolId: finalSchoolId,
                  schoolName: finalSchoolName,
                  classLevel: classLevel.trim(),
                  interests: ['Academics', 'Campus Life', 'Leadership'],
                  creatorTalents: ['Campus Member'],
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
              showToast(`Welcome back, ${existingProfile.name}! Signed into your account.`, 'success');
              closeModal();
              return;
            } catch (authSignInErr: any) {
              // Password didn't match existing account; toggle to signin mode and prompt user
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
          bio: `${userType === 'student' ? 'Student' : userType === 'teacher' ? 'Faculty Teacher' : 'Member'} at ${finalSchoolName}. Passionate about learning and collaboration!`,
          schoolId: finalSchoolId,
          schoolName: finalSchoolName,
          classLevel: classLevel.trim(),
          interests: ['Academics', 'Campus Life', 'Leadership'],
          creatorTalents: ['Campus Member'],
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
        showToast(`Account created for ${newProfile.name}!`, 'success');
        closeModal();
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
        const defaultSchoolName = selectedSchool?.name || 'General Campus';
        const defaultSchoolId = selectedSchool?.id || 'school-general';
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
          classLevel: 'Year 12',
          interests: ['Campus Life', 'Tech'],
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
      closeModal();
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
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 p-6 text-white relative">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="w-6 h-6 text-blue-200" />
            <span className="text-xs font-black uppercase tracking-widest text-blue-200">
              Campus Connect Production
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            {mode === 'signin' ? 'Sign In to Campus Connect' : 'Create Student / Faculty Account'}
          </h2>
          <p className="text-xs text-blue-100 mt-1">
            Real Firebase Authentication & Cloud Database live synchronization
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-neutral-200 bg-neutral-50 px-6 pt-3">
          <button
            onClick={() => {
              setMode('signin');
              setErrorMsg(null);
            }}
            className={`pb-3 text-xs font-bold transition-colors border-b-2 mr-6 ${
              mode === 'signin'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Sign In with Email
          </button>
          <button
            onClick={() => {
              setMode('signup');
              setErrorMsg(null);
            }}
            className={`pb-3 text-xs font-bold transition-colors border-b-2 ${
              mode === 'signup'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Register New Account
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {resetSuccessNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-start gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span className="font-medium">{resetSuccessNotice}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex flex-col gap-2 animate-in fade-in duration-200">
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

          {/* Google Sign-In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-2.5 px-4 border border-neutral-300 rounded-xl text-xs font-bold text-neutral-700 hover:bg-neutral-50 active:bg-neutral-100 flex items-center justify-center gap-2.5 transition-colors shadow-2xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
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
            <span>Continue with Google Account</span>
          </button>

          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-neutral-200" />
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              Or with Email
            </span>
            <div className="flex-1 h-px bg-neutral-200" />
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-3.5 text-xs">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Full Legal Name</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Kofi Mensah"
                      className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:bg-white focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-neutral-700 block mb-1">Campus Affiliation</label>
                    <select
                      value={userType}
                      onChange={(e) => setUserType(e.target.value as UserType)}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-blue-500"
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher / Faculty</option>
                      <option value="staff">Staff / Admin</option>
                      <option value="alumni">Alumni</option>
                      <option value="other">Other Member</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-neutral-700 block mb-1">Campus School (Optional)</label>
                    <select
                      value={selectedSchoolId}
                      onChange={(e) => setSelectedSchoolId(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-blue-500 truncate text-xs"
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
                      School addition request sent for <strong>{requestedSchoolNotice}</strong>. Admin will review and add it to the system.
                    </span>
                    <button
                      type="button"
                      onClick={() => setRequestedSchoolNotice('')}
                      className="text-emerald-700 hover:text-emerald-900 font-bold ml-2"
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
                  <label className="font-bold text-neutral-700 block mb-1">Grade / Level</label>
                  <input
                    type="text"
                    value={classLevel}
                    onChange={(e) => setClassLevel(e.target.value)}
                    placeholder="e.g., Senior Secondary 3 / Year 12"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-blue-500"
                  />
                </div>
              </>
            )}

            <div>
              <label className="font-bold text-neutral-700 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@school.edu.gh or name@gmail.com"
                  className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:bg-white focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-neutral-700 block">Password</label>
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
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••••• (at least 6 characters)"
                  className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:bg-white focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connecting to Firebase Auth...</span>
                </>
              ) : (
                <>
                  <span>{mode === 'signin' ? 'Sign In Securely' : 'Complete Registration'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

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
