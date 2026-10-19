import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  setDoc
} from 'firebase/firestore';
import { auth, db, AUTHORIZED_ADMIN_EMAIL } from './config';
import { AdminUser } from '../types/portfolio';

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

/**
 * Checks Firestore collection 'authorizedAdmins' to verify if the given email is whitelisted.
 */
export async function checkIsEmailInAuthorizedAdminsWhitelist(
  email: string | null | undefined,
  uid?: string
): Promise<boolean> {
  if (!email) return false;
  const normalizedEmail = email.trim().toLowerCase();

  try {
    // 1. Direct document check by normalized email ID
    const emailDocRef = doc(db, 'authorizedAdmins', normalizedEmail);
    const emailDocSnap = await getDoc(emailDocRef);
    if (emailDocSnap.exists()) {
      return true;
    }

    // 2. Direct document check by UID if available
    if (uid) {
      const uidDocRef = doc(db, 'authorizedAdmins', uid);
      const uidDocSnap = await getDoc(uidDocRef);
      if (uidDocSnap.exists()) {
        return true;
      }
    }

    // 3. Query collection by 'email' field
    const adminsCol = collection(db, 'authorizedAdmins');
    const q = query(adminsCol, where('email', '==', normalizedEmail));
    const querySnap = await getDocs(q);
    if (!querySnap.empty) {
      return true;
    }

    // 4. Initial Bootstrap: If the email matches the configured project administrator,
    // auto-register it in the authorizedAdmins collection for persistence
    if (normalizedEmail === AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
      try {
        await setDoc(emailDocRef, {
          email: normalizedEmail,
          role: 'owner',
          createdAt: new Date().toISOString()
        }, { merge: true });
        return true;
      } catch (err) {
        console.warn('Could not bootstrap admin doc in authorizedAdmins collection:', err);
        // Still allow since email matches project administrator configuration
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error('Error verifying email in authorizedAdmins collection:', error);
    // Fallback: If network/rules issue during initial query, check against configured admin
    if (normalizedEmail === AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
      return true;
    }
    return false;
  }
}

export async function signInAdminWithGoogle(): Promise<AdminUser> {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  const userEmail = user.email || '';

  // Verify against authorizedAdmins whitelist in Firestore
  const isAuthorized = await checkIsEmailInAuthorizedAdminsWhitelist(userEmail, user.uid);

  if (!isAuthorized) {
    // Immediately terminate session for unauthorized account without leaking the whitelisted email
    await signOut(auth);
    throw new Error(
      `Access Denied: The Google account "${userEmail}" is not authorized on the administrator whitelist.`
    );
  }

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    isAuthorizedAdmin: true
  };
}

export async function signOutAdmin(): Promise<void> {
  await signOut(auth);
}

export function subscribeToAuthChanges(
  onChange: (admin: AdminUser | null, loading: boolean) => void
) {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (!user) {
      onChange(null, false);
      return;
    }

    const isAuthorized = await checkIsEmailInAuthorizedAdminsWhitelist(user.email, user.uid);

    if (isAuthorized) {
      onChange({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        isAuthorizedAdmin: true
      }, false);
    } else {
      // User is logged in with another Google account - revoke
      await signOut(auth).catch(() => {});
      onChange(null, false);
    }
  });
}
