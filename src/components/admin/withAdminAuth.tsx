import React, { useEffect, useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { AdminLoginGate } from './AdminLoginGate';
import { checkIsEmailInAuthorizedAdminsWhitelist } from '../../firebase/authService';
import { ShieldAlert, Loader2 } from 'lucide-react';

/**
 * Higher-Order Component (HOC) for AdminLayout.
 * Verifies the current user's email against the 'authorizedAdmins' collection in Cloud Firestore.
 * Automatically terminates unauthorized sessions and redirects unauthorized users to the public homepage.
 */
export function withAdminAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P> {
  const AuthenticatedAdminComponent: React.FC<P> = (props) => {
    const {
      adminUser,
      authLoading,
      signOutAdminSession,
      setActiveView
    } = usePortfolio();

    const [isVerifyingFirestore, setIsVerifyingFirestore] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
    const [redirecting, setRedirecting] = useState(false);

    useEffect(() => {
      let isMounted = true;

      async function verifyWhitelist() {
        if (!adminUser) {
          if (isMounted) {
            setIsAuthorized(null);
            setIsVerifyingFirestore(false);
          }
          return;
        }

        setIsVerifyingFirestore(true);

        try {
          // Verify current user's email against 'authorizedAdmins' whitelist in Cloud Firestore
          const authorized = await checkIsEmailInAuthorizedAdminsWhitelist(
            adminUser.email,
            adminUser.uid
          );

          if (!isMounted) return;

          if (authorized) {
            setIsAuthorized(true);
            setIsVerifyingFirestore(false);
          } else {
            // Unauthorized account: Trigger redirect flow to public homepage
            setIsAuthorized(false);
            setIsVerifyingFirestore(false);
            setRedirecting(true);

            // Terminate session
            await signOutAdminSession();

            // Redirect to public homepage after brief visual notice
            setTimeout(() => {
              if (isMounted) {
                if (window.location.hash === '#admin') {
                  window.location.hash = '';
                }
                setActiveView('public');
              }
            }, 1800);
          }
        } catch (error) {
          console.error('Whitelist verification error in HOC:', error);
          if (isMounted) {
            setIsAuthorized(false);
            setIsVerifyingFirestore(false);
            setRedirecting(true);
            await signOutAdminSession();
            setTimeout(() => {
              if (isMounted) {
                if (window.location.hash === '#admin') {
                  window.location.hash = '';
                }
                setActiveView('public');
              }
            }, 1800);
          }
        }
      }

      if (!authLoading) {
        verifyWhitelist();
      }

      return () => {
        isMounted = false;
      };
    }, [adminUser, authLoading, setActiveView, signOutAdminSession]);

    // 1. Initial Firebase Auth state resolution
    if (authLoading || isVerifyingFirestore) {
      return (
        <div className="min-h-screen bg-[#0B0B0C] flex items-center justify-center p-4">
          <div className="flex flex-col items-center gap-3 text-[#929292] font-mono text-xs text-center">
            <Loader2 className="w-6 h-6 text-[#668CFF] animate-spin" />
            <span>Verifying permissions...</span>
          </div>
        </div>
      );
    }

    // 2. User is not signed in: Render Login Gate
    if (!adminUser) {
      return <AdminLoginGate />;
    }

    // 3. User is signed in with an unauthorized account: Render redirecting notification
    if (redirecting || isAuthorized === false) {
      return (
        <div className="min-h-screen bg-[#0B0B0C] flex items-center justify-center p-4 text-[#F5F5F5]">
          <div className="max-w-md w-full p-8 rounded-xl bg-[#111114] border border-red-500/30 text-center space-y-4 shadow-2xl">
            <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-[#F5F5F5]">Access Denied</h3>
            <p className="text-xs text-[#929292] leading-relaxed">
              Your account is not on the administrator whitelist. Redirecting to homepage...
            </p>
            <div className="w-5 h-5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin mx-auto mt-2" />
          </div>
        </div>
      );
    }

    // 4. Authorized administrator: Render the protected Admin component
    return <WrappedComponent {...props} />;
  };

  AuthenticatedAdminComponent.displayName = `withAdminAuth(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return AuthenticatedAdminComponent;
}
