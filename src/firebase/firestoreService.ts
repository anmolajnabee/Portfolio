import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './config';
import {
  Profile,
  Project,
  Certificate,
  SkillCategory,
  EducationItem,
  AppearanceSettings
} from '../types/portfolio';
import { initialPortfolioData } from '../data/initialData';

// Collection paths
export const PATHS = {
  PROFILE: 'portfolio/profile',
  APPEARANCE: 'portfolio/appearance',
  PROJECTS: 'projects',
  CERTIFICATES: 'certificates',
  SKILLS: 'skillCategories',
  EDUCATION: 'education',
  ADMINS: 'admins',
};

// 1. Subscribe to Profile Document
export function subscribeProfile(
  onUpdate: (profile: Profile) => void,
  isAdmin: boolean = false
) {
  const docRef = doc(db, 'portfolio', 'profile');
  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as Profile;
        if (isAdmin || data.published !== false) {
          onUpdate(data);
        }
      }
    },
    (error) => {
      // In public view without data yet, we gracefully don't crash
      if (!isAdmin && error.message.includes('permission')) {
        console.warn('Public visitor viewing fallback profile while Firestore is uninitialized');
      } else {
        handleFirestoreError(error, OperationType.GET, PATHS.PROFILE);
      }
    }
  );
}

// 2. Save Profile Document
export async function saveProfile(profile: Profile): Promise<void> {
  const docRef = doc(db, 'portfolio', 'profile');
  try {
    await setDoc(docRef, {
      ...profile,
      published: profile.published ?? true,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, PATHS.PROFILE);
  }
}

// 3. Subscribe to Appearance Document
export function subscribeAppearance(onUpdate: (appearance: AppearanceSettings) => void) {
  const docRef = doc(db, 'portfolio', 'appearance');
  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onUpdate(snapshot.data() as AppearanceSettings);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, PATHS.APPEARANCE);
    }
  );
}

// 4. Save Appearance Document
export async function saveAppearance(appearance: AppearanceSettings): Promise<void> {
  const docRef = doc(db, 'portfolio', 'appearance');
  try {
    await setDoc(docRef, appearance, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, PATHS.APPEARANCE);
  }
}

// 5. Subscribe to Projects Collection
export function subscribeProjects(
  onUpdate: (projects: Project[]) => void,
  isAdmin: boolean = false
) {
  const colRef = collection(db, PATHS.PROJECTS);
  const q = isAdmin
    ? colRef
    : query(colRef, where('published', '==', true));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: Project[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ ...(docSnap.data() as Project), id: docSnap.id });
      });
      onUpdate(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, PATHS.PROJECTS);
    }
  );
}

// 6. Save Project (Create / Update)
export async function saveProject(project: Project): Promise<void> {
  const docRef = doc(db, PATHS.PROJECTS, project.id);
  try {
    await setDoc(docRef, {
      ...project,
      published: project.published ?? true
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${PATHS.PROJECTS}/${project.id}`);
  }
}

// 7. Delete Project
export async function deleteProjectDoc(projectId: string): Promise<void> {
  const docRef = doc(db, PATHS.PROJECTS, projectId);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${PATHS.PROJECTS}/${projectId}`);
  }
}

// 8. Subscribe to Certificates Collection
export function subscribeCertificates(
  onUpdate: (certs: Certificate[]) => void,
  isAdmin: boolean = false
) {
  const colRef = collection(db, PATHS.CERTIFICATES);
  const q = isAdmin
    ? colRef
    : query(colRef, where('published', '==', true));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: Certificate[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ ...(docSnap.data() as Certificate), id: docSnap.id });
      });
      onUpdate(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, PATHS.CERTIFICATES);
    }
  );
}

// 9. Save Certificate
export async function saveCertificate(cert: Certificate): Promise<void> {
  const docRef = doc(db, PATHS.CERTIFICATES, cert.id);
  try {
    await setDoc(docRef, {
      ...cert,
      published: cert.published ?? true
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${PATHS.CERTIFICATES}/${cert.id}`);
  }
}

// 10. Delete Certificate
export async function deleteCertificateDoc(certId: string): Promise<void> {
  const docRef = doc(db, PATHS.CERTIFICATES, certId);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${PATHS.CERTIFICATES}/${certId}`);
  }
}

// 11. Subscribe to Skill Categories
export function subscribeSkills(
  onUpdate: (categories: SkillCategory[]) => void,
  isAdmin: boolean = false
) {
  const colRef = collection(db, PATHS.SKILLS);
  const q = isAdmin
    ? colRef
    : query(colRef, where('published', '==', true));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: SkillCategory[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ ...(docSnap.data() as SkillCategory), id: docSnap.id });
      });
      // Sort by order if available
      items.sort((a, b) => (a.order || 0) - (b.order || 0));
      onUpdate(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, PATHS.SKILLS);
    }
  );
}

// 12. Save Skill Category
export async function saveSkillCategory(category: SkillCategory): Promise<void> {
  const docRef = doc(db, PATHS.SKILLS, category.id);
  try {
    await setDoc(docRef, {
      ...category,
      published: category.published ?? true
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${PATHS.SKILLS}/${category.id}`);
  }
}

// 13. Delete Skill Category
export async function deleteSkillCategoryDoc(categoryId: string): Promise<void> {
  const docRef = doc(db, PATHS.SKILLS, categoryId);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${PATHS.SKILLS}/${categoryId}`);
  }
}

// 14. Subscribe to Education Collection
export function subscribeEducation(
  onUpdate: (education: EducationItem[]) => void,
  isAdmin: boolean = false
) {
  const colRef = collection(db, PATHS.EDUCATION);
  const q = isAdmin
    ? colRef
    : query(colRef, where('published', '==', true));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: EducationItem[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ ...(docSnap.data() as EducationItem), id: docSnap.id });
      });
      onUpdate(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, PATHS.EDUCATION);
    }
  );
}

// 15. Save Education
export async function saveEducationDoc(education: EducationItem): Promise<void> {
  const docRef = doc(db, PATHS.EDUCATION, education.id);
  try {
    await setDoc(docRef, {
      ...education,
      published: education.published ?? true
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${PATHS.EDUCATION}/${education.id}`);
  }
}

// 16. Delete Education
export async function deleteEducationDoc(educationId: string): Promise<void> {
  const docRef = doc(db, PATHS.EDUCATION, educationId);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${PATHS.EDUCATION}/${educationId}`);
  }
}

// 17. Seed initial portfolio data to Firestore (Authorized Administrator only)
export async function seedInitialFirestoreData(): Promise<{ success: boolean; message: string }> {
  try {
    const batch = writeBatch(db);

    // Profile
    const profileRef = doc(db, 'portfolio', 'profile');
    batch.set(profileRef, {
      ...initialPortfolioData.profile,
      published: true,
      updatedAt: new Date().toISOString()
    });

    // Appearance
    const appearanceRef = doc(db, 'portfolio', 'appearance');
    batch.set(appearanceRef, initialPortfolioData.appearance);

    // Projects
    initialPortfolioData.projects.forEach((proj) => {
      const projRef = doc(db, PATHS.PROJECTS, proj.id);
      batch.set(projRef, {
        ...proj,
        published: true
      });
    });

    // Certificates
    initialPortfolioData.certificates.forEach((cert) => {
      const certRef = doc(db, PATHS.CERTIFICATES, cert.id);
      batch.set(certRef, {
        ...cert,
        published: true
      });
    });

    // Skills
    initialPortfolioData.skillCategories.forEach((cat) => {
      const catRef = doc(db, PATHS.SKILLS, cat.id);
      batch.set(catRef, {
        ...cat,
        published: true
      });
    });

    // Education
    initialPortfolioData.education.forEach((edu) => {
      const eduRef = doc(db, PATHS.EDUCATION, edu.id);
      batch.set(eduRef, {
        ...edu,
        published: true
      });
    });

    await batch.commit();
    return { success: true, message: 'All portfolio collections initialized in Firestore.' };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'portfolio_batch_seed');
  }
}

// 18. Check if Firestore contains initialized data
export async function checkHasInitializedData(): Promise<boolean> {
  try {
    const projectsSnap = await getDocs(collection(db, PATHS.PROJECTS));
    return !projectsSnap.empty;
  } catch {
    return false;
  }
}
