import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../Firebase/config';

export type UserRole = 'user' | 'admin';

interface AuthContextValue {
	user: FirebaseUser | null;
	role: UserRole;
	loading: boolean;
	isAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<FirebaseUser | null>(null);
	const [role, setRole] = useState<UserRole>('user');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
			setUser(currentUser);

			if (!currentUser) {
				setRole('user');
				setLoading(false);
				return;
			}

			try {
				const userRef = doc(db, 'users', currentUser.uid);
				const userDoc = await getDoc(userRef);
				const data = userDoc.data();
				const nextRole = data?.role === 'admin' ? 'admin' : 'user';

				if (!userDoc.exists()) {
					await setDoc(userRef, {
						email: currentUser.email,
						role: 'user',
						createdAt: serverTimestamp(),
					});
				}

				setRole(nextRole);
			} catch (error) {
				console.error('Error loading user role:', error);
				setRole('user');
			} finally {
				setLoading(false);
			}
		});

		return unsubscribe;
	}, []);

	const value = useMemo(
		() => ({
			user,
			role,
			loading,
			isAdmin: role === 'admin',
		}),
		[user, role, loading]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}

	return context;
}
