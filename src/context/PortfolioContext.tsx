import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PortfolioData,
  Project,
  SkillCategory,
  Certificate,
  Profile,
  AppearanceSettings,
  EducationItem,
  AdminUser
} from '../types/portfolio';
import { GitHubRepository } from '../types/github';
import { fetchGitHubRepositories, mapRepoToProject } from '../services/githubService';
import { initialPortfolioData } from '../data/initialData';
import {
  subscribeProfile,
  saveProfile,
  subscribeAppearance,
  saveAppearance,
  subscribeProjects,
  saveProject,
  deleteProjectDoc,
  subscribeCertificates,
  saveCertificate,
  deleteCertificateDoc,
  subscribeSkills,
  saveSkillCategory,
  deleteSkillCategoryDoc,
  subscribeEducation,
  saveEducationDoc,
  deleteEducationDoc,
  seedInitialFirestoreData,
  checkHasInitializedData
} from '../firebase/firestoreService';
import {
  signInAdminWithGoogle,
  signOutAdmin,
  subscribeToAuthChanges
} from '../firebase/authService';
import { testFirestoreConnection, AUTHORIZED_ADMIN_EMAIL } from '../firebase/config';

interface PortfolioContextType {
  data: PortfolioData;
  adminUser: AdminUser | null;
  authLoading: boolean;
  authError: string | null;
  signInAdmin: () => Promise<void>;
  signOutAdminSession: () => Promise<void>;
  clearAuthError: () => void;
  updateProfile: (profile: Partial<Profile>) => Promise<void>;
  updateAppearance: (appearance: Partial<AppearanceSettings>) => Promise<void>;
  addProject: (project: Omit<Project, 'id'>) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  toggleProjectPublish: (id: string) => Promise<void>;
  toggleProjectFeature: (id: string) => Promise<void>;
  reorderProject: (id: string, direction: 'up' | 'down') => Promise<void>;
  githubRepos: GitHubRepository[];
  isFetchingGitHub: boolean;
  githubError: string | null;
  rateLimitRemaining: number | null;
  refreshGitHubRepos: (forceRefresh?: boolean) => Promise<void>;
  addCertificate: (cert: Omit<Certificate, 'id'>) => Promise<void>;
  updateCertificate: (id: string, cert: Partial<Certificate>) => Promise<void>;
  deleteCertificate: (id: string) => Promise<void>;
  toggleCertificatePublish: (id: string) => Promise<void>;
  reorderCertificate: (id: string, direction: 'up' | 'down') => Promise<void>;
  addSkill: (categoryId: string, name: string, proficiency: number, level: 'Expert' | 'Advanced' | 'Proficient') => Promise<void>;
  updateSkill: (categoryId: string, skillId: string, updates: { name?: string; proficiency?: number; level?: 'Expert' | 'Advanced' | 'Proficient' }) => Promise<void>;
  deleteSkill: (categoryId: string, skillId: string) => Promise<void>;
  addSkillCategory: (name: string, description: string) => Promise<void>;
  toggleSkillCategoryPublish: (categoryId: string) => Promise<void>;
  updateEducation: (id: string, updates: Partial<EducationItem>) => Promise<void>;
  seedFirestore: () => Promise<void>;
  resetToDefault: () => void;
  exportDataJSON: () => string;
  isFirestoreConnected: boolean;
  activeView: 'public' | 'admin';
  setActiveView: (view: 'public' | 'admin') => void;
  authorizedAdminEmail: string;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData>(initialPortfolioData);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isFirestoreConnected, setIsFirestoreConnected] = useState(false);
  const [activeView, setActiveView] = useState<'public' | 'admin'>('public');

  // GitHub Repositories live state
  const [githubRepos, setGithubRepos] = useState<GitHubRepository[]>([]);
  const [isFetchingGitHub, setIsFetchingGitHub] = useState(false);
  const [githubError, setGithubError] = useState<string | null>(null);
  const [rateLimitRemaining, setRateLimitRemaining] = useState<number | null>(null);

  // 1. Listen for Authentication changes
  useEffect(() => {
    const unsubscribeAuth = subscribeToAuthChanges((user, loading) => {
      setAdminUser(user);
      setAuthLoading(loading);
    });
    return () => unsubscribeAuth();
  }, []);

  // 2. Validate Firestore connection & initial state
  useEffect(() => {
    testFirestoreConnection().then((connected) => {
      setIsFirestoreConnected(connected);
    });
  }, []);

  // 3. Connect real-time Firestore listeners
  useEffect(() => {
    const isAdmin = !!adminUser?.isAuthorizedAdmin;

    const unsubs = [
      subscribeProfile((updatedProfile) => {
        if (!updatedProfile || updatedProfile.fullName === 'Alex Chen') {
          return;
        }
        setData(prev => ({
          ...prev,
          profile: {
            ...prev.profile,
            ...updatedProfile,
            fullName: (updatedProfile.fullName && updatedProfile.fullName !== 'Alex Chen') ? updatedProfile.fullName : prev.profile.fullName,
            title: updatedProfile.title || prev.profile.title,
            availabilityStatus: updatedProfile.availabilityStatus || prev.profile.availabilityStatus,
            university: (updatedProfile.university && !updatedProfile.university.includes('State University')) ? updatedProfile.university : prev.profile.university,
            graduationYear: (updatedProfile.graduationYear && !updatedProfile.graduationYear.includes('2027')) ? updatedProfile.graduationYear : prev.profile.graduationYear,
            socials: {
              ...prev.profile.socials,
              ...updatedProfile.socials,
              linkedin: (updatedProfile.socials?.linkedin && updatedProfile.socials.linkedin !== 'https://linkedin.com' && !updatedProfile.socials.linkedin.includes('alex'))
                ? updatedProfile.socials.linkedin
                : 'https://www.linkedin.com/in/anmol-kumar-243412398',
            }
          }
        }));
      }, isAdmin),

      subscribeAppearance((updatedAppearance) => {
        setData(prev => ({
          ...prev,
          appearance: { ...prev.appearance, ...updatedAppearance }
        }));
      }),

      subscribeProjects((projects) => {
        const verified = projects.filter(p => !['aurasent', 'hypervektor', 'nexushack', 'synapse-code'].includes(p.id));
        if (verified.length > 0) {
          setData(prev => ({ ...prev, projects: verified }));
        }
      }, isAdmin),

      subscribeCertificates((certificates) => {
        const sorted = [...certificates].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
        setData(prev => ({ ...prev, certificates: sorted }));
      }, isAdmin),

      subscribeSkills((skillCategories) => {
        if (skillCategories.length > 0) {
          setData(prev => ({ ...prev, skillCategories }));
        }
      }, isAdmin),

      subscribeEducation((education) => {
        const verified = education.filter(e => !e.institution.includes('State University'));
        if (verified.length > 0) {
          setData(prev => ({ ...prev, education: verified }));
        }
      }, isAdmin),
    ];

    return () => {
      unsubs.forEach(unsub => unsub());
    };
  }, [adminUser]);

  // Auth Actions
  const signInAdmin = async () => {
    setAuthError(null);
    try {
      const user = await signInAdminWithGoogle();
      setAdminUser(user);
      // Auto-check if database needs initial seeding on first admin login
      const hasData = await checkHasInitializedData();
      if (!hasData) {
        await seedInitialFirestoreData();
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed');
      throw err;
    }
  };

  const signOutAdminSession = async () => {
    await signOutAdmin();
    setAdminUser(null);
    setAuthError(null);
  };

  const clearAuthError = () => {
    setAuthError(null);
  };

  // Firestore Mutations (Executed only by verified admin)
  const updateProfile = async (profileUpdates: Partial<Profile>) => {
    const updated = {
      ...data.profile,
      ...profileUpdates,
      socials: { ...data.profile.socials, ...(profileUpdates.socials || {}) },
      stats: { ...data.profile.stats, ...(profileUpdates.stats || {}) }
    };
    setData(prev => ({ ...prev, profile: updated }));
    if (adminUser?.isAuthorizedAdmin) {
      await saveProfile(updated);
    }
  };

  const updateAppearance = async (appearanceUpdates: Partial<AppearanceSettings>) => {
    const updated = { ...data.appearance, ...appearanceUpdates };
    setData(prev => ({ ...prev, appearance: updated }));
    if (adminUser?.isAuthorizedAdmin) {
      await saveAppearance(updated);
    }
  };

  const addProject = async (projectData: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...projectData,
      id: `proj-${Date.now()}`,
      published: projectData.published ?? true
    };
    setData(prev => ({ ...prev, projects: [newProject, ...prev.projects] }));
    if (adminUser?.isAuthorizedAdmin) {
      await saveProject(newProject);
    }
  };

  const updateProject = async (id: string, projectUpdates: Partial<Project>) => {
    const existing = data.projects.find(p => p.id === id);
    if (!existing) return;
    const updated = { ...existing, ...projectUpdates };
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? updated : p)
    }));
    if (adminUser?.isAuthorizedAdmin) {
      await saveProject(updated);
    }
  };

  const deleteProject = async (id: string) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id)
    }));
    if (adminUser?.isAuthorizedAdmin) {
      await deleteProjectDoc(id);
    }
  };

  const toggleProjectPublish = async (id: string) => {
    const proj = data.projects.find(p => p.id === id);
    if (!proj) return;
    await updateProject(id, { published: !proj.published });
  };

  const toggleProjectFeature = async (id: string) => {
    const proj = data.projects.find(p => p.id === id);
    if (!proj) return;
    await updateProject(id, { featured: !proj.featured });
  };

  const reorderProject = async (id: string, direction: 'up' | 'down') => {
    const list = [...data.projects];
    const index = list.findIndex(p => p.id === id);
    if (index === -1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    // Swap items
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    // Update order indices
    const updatedList = list.map((item, idx) => ({ ...item, order: idx }));
    setData(prev => ({ ...prev, projects: updatedList }));

    if (adminUser?.isAuthorizedAdmin) {
      for (const p of updatedList) {
        await saveProject(p);
      }
    }
  };

  // GitHub Repositories synchronization logic
  const refreshGitHubRepos = async (forceRefresh = false) => {
    setIsFetchingGitHub(true);
    setGithubError(null);
    try {
      const { repos, rateLimitRemaining: rlRemaining } = await fetchGitHubRepositories(forceRefresh);
      setGithubRepos(repos);
      setRateLimitRemaining(rlRemaining);

      setData(prev => {
        const currentProjects = [...prev.projects];
        let changed = false;

        repos.forEach((repo, idx) => {
          const matchIndex = currentProjects.findIndex(
            p =>
              p.githubUrl?.toLowerCase() === repo.html_url.toLowerCase() ||
              p.id === `gh-${repo.id}` ||
              p.repoName?.toLowerCase() === repo.name.toLowerCase() ||
              p.title.toLowerCase() === repo.name.replace(/[-_]+/g, ' ').toLowerCase()
          );

          if (matchIndex >= 0) {
            // Keep user customizations (custom title, description, demoUrl, order, featured, published)
            // but update live GitHub stats and repository links
            const existing = currentProjects[matchIndex];
            currentProjects[matchIndex] = {
              ...existing,
              stars: repo.stargazers_count,
              forks: repo.forks_count,
              isFork: repo.fork,
              language: repo.language || existing.language,
              lastUpdated: repo.updated_at,
              githubUrl: repo.html_url,
              repoName: repo.name,
            };
            changed = true;
          } else {
            // Add newly discovered repository as a portfolio project
            const newProj = mapRepoToProject(repo, undefined, currentProjects.length + idx);
            currentProjects.push(newProj);
            changed = true;
          }
        });

        // Sort by order property if defined
        currentProjects.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

        return changed ? { ...prev, projects: currentProjects } : prev;
      });
    } catch (err: any) {
      setGithubError(err.message || 'Failed to fetch GitHub repositories.');
    } finally {
      setIsFetchingGitHub(false);
    }
  };

  // Auto-fetch GitHub repositories on mount
  useEffect(() => {
    refreshGitHubRepos(false);
  }, []);

  const addCertificate = async (certData: Omit<Certificate, 'id'>) => {
    const newCert: Certificate = {
      ...certData,
      id: `cert-${Date.now()}`,
      category: certData.category || 'Certificate',
      order: certData.order ?? data.certificates.length,
      published: certData.published ?? true
    };
    setData(prev => ({ ...prev, certificates: [...prev.certificates, newCert] }));
    if (adminUser?.isAuthorizedAdmin) {
      await saveCertificate(newCert);
    }
  };

  const updateCertificate = async (id: string, certUpdates: Partial<Certificate>) => {
    const existing = data.certificates.find(c => c.id === id);
    if (!existing) return;
    const updated: Certificate = { ...existing, ...certUpdates };
    setData(prev => ({
      ...prev,
      certificates: prev.certificates.map(c => c.id === id ? updated : c)
    }));
    if (adminUser?.isAuthorizedAdmin) {
      await saveCertificate(updated);
    }
  };

  const reorderCertificate = async (id: string, direction: 'up' | 'down') => {
    const list = [...data.certificates];
    const index = list.findIndex(c => c.id === id);
    if (index === -1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    // Swap items
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    // Update order indices
    const updatedList = list.map((item, idx) => ({ ...item, order: idx }));
    setData(prev => ({ ...prev, certificates: updatedList }));

    if (adminUser?.isAuthorizedAdmin) {
      for (const c of updatedList) {
        await saveCertificate(c);
      }
    }
  };

  const deleteCertificate = async (id: string) => {
    setData(prev => ({
      ...prev,
      certificates: prev.certificates.filter(c => c.id !== id)
    }));
    if (adminUser?.isAuthorizedAdmin) {
      await deleteCertificateDoc(id);
    }
  };

  const toggleCertificatePublish = async (id: string) => {
    const cert = data.certificates.find(c => c.id === id);
    if (!cert) return;
    await updateCertificate(id, { published: !cert.published });
  };

  const addSkill = async (
    categoryId: string,
    name: string,
    proficiency: number,
    level: 'Expert' | 'Advanced' | 'Proficient'
  ) => {
    const category = data.skillCategories.find(c => c.id === categoryId);
    if (!category) return;
    const updatedCategory = {
      ...category,
      skills: [...category.skills, { id: `skill-${Date.now()}`, name, proficiency, level }]
    };
    setData(prev => ({
      ...prev,
      skillCategories: prev.skillCategories.map(c => c.id === categoryId ? updatedCategory : c)
    }));
    if (adminUser?.isAuthorizedAdmin) {
      await saveSkillCategory(updatedCategory);
    }
  };

  const updateSkill = async (
    categoryId: string,
    skillId: string,
    updates: { name?: string; proficiency?: number; level?: 'Expert' | 'Advanced' | 'Proficient' }
  ) => {
    const category = data.skillCategories.find(c => c.id === categoryId);
    if (!category) return;
    const updatedCategory = {
      ...category,
      skills: category.skills.map(s => s.id === skillId ? { ...s, ...updates } : s)
    };
    setData(prev => ({
      ...prev,
      skillCategories: prev.skillCategories.map(c => c.id === categoryId ? updatedCategory : c)
    }));
    if (adminUser?.isAuthorizedAdmin) {
      await saveSkillCategory(updatedCategory);
    }
  };

  const deleteSkill = async (categoryId: string, skillId: string) => {
    const category = data.skillCategories.find(c => c.id === categoryId);
    if (!category) return;
    const updatedCategory = {
      ...category,
      skills: category.skills.filter(s => s.id !== skillId)
    };
    setData(prev => ({
      ...prev,
      skillCategories: prev.skillCategories.map(c => c.id === categoryId ? updatedCategory : c)
    }));
    if (adminUser?.isAuthorizedAdmin) {
      await saveSkillCategory(updatedCategory);
    }
  };

  const addSkillCategory = async (name: string, description: string) => {
    const newCategory: SkillCategory = {
      id: `cat-${Date.now()}`,
      name,
      description,
      published: true,
      skills: [],
      order: data.skillCategories.length + 1
    };
    setData(prev => ({
      ...prev,
      skillCategories: [...prev.skillCategories, newCategory]
    }));
    if (adminUser?.isAuthorizedAdmin) {
      await saveSkillCategory(newCategory);
    }
  };

  const toggleSkillCategoryPublish = async (categoryId: string) => {
    const cat = data.skillCategories.find(c => c.id === categoryId);
    if (!cat) return;
    const updated = { ...cat, published: !cat.published };
    setData(prev => ({
      ...prev,
      skillCategories: prev.skillCategories.map(c => c.id === categoryId ? updated : c)
    }));
    if (adminUser?.isAuthorizedAdmin) {
      await saveSkillCategory(updated);
    }
  };

  const updateEducation = async (id: string, updates: Partial<EducationItem>) => {
    const existing = data.education.find(e => e.id === id);
    if (!existing) return;
    const updated = { ...existing, ...updates };
    setData(prev => ({
      ...prev,
      education: prev.education.map(e => e.id === id ? updated : e)
    }));
    if (adminUser?.isAuthorizedAdmin) {
      await saveEducationDoc(updated);
    }
  };

  const seedFirestore = async () => {
    if (!adminUser?.isAuthorizedAdmin) {
      throw new Error('Only the authorized administrator can initialize Firestore data.');
    }
    await seedInitialFirestoreData();
  };

  const resetToDefault = () => {
    setData(initialPortfolioData);
  };

  const exportDataJSON = () => {
    return JSON.stringify(data, null, 2);
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        adminUser,
        authLoading,
        authError,
        signInAdmin,
        signOutAdminSession,
        clearAuthError,
        updateProfile,
        updateAppearance,
        addProject,
        updateProject,
        deleteProject,
        toggleProjectPublish,
        toggleProjectFeature,
        reorderProject,
        githubRepos,
        isFetchingGitHub,
        githubError,
        rateLimitRemaining,
        refreshGitHubRepos,
        addCertificate,
        updateCertificate,
        deleteCertificate,
        toggleCertificatePublish,
        reorderCertificate,
        addSkill,
        updateSkill,
        deleteSkill,
        addSkillCategory,
        toggleSkillCategoryPublish,
        updateEducation,
        seedFirestore,
        resetToDefault,
        exportDataJSON,
        isFirestoreConnected,
        activeView,
        setActiveView,
        authorizedAdminEmail: AUTHORIZED_ADMIN_EMAIL
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
