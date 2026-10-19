import { PortfolioData } from '../types/portfolio';

export const initialPortfolioData: PortfolioData = {
  profile: {
    fullName: "Anmol Kumar",
    title: "Computer Science Engineering Student · Developer",
    headline: "B.Tech CSE Student · Exploring Software Development & AI",
    subheading: "B.Tech CSE student at Jaipur Engineering College, Kukas, Jaipur. Exploring software development, AI, and building practical technology projects.",
    introduction: "B.Tech CSE student at Jaipur Engineering College, Kukas, Jaipur. Exploring software development, AI, and building practical technology projects.",
    heroPitch: "Developing skills in programming, web technologies, and AI through hands-on project building and continuous learning.",
    bioParagraph1: "I’m Anmol Kumar, a Computer Science Engineering student at Jaipur Engineering College, Jaipur. I’m developing my skills in programming and software development while exploring AI, web technologies, hackathons, and entrepreneurial ideas. I enjoy learning by building practical projects and continuously improving my technical abilities.",
    bioParagraph2: "Focused on building strong foundations in computer science and solving real-world problems through technology. Eager to collaborate with fellow developers, participate in hackathons, and explore new advancements in the software ecosystem.",
    location: "Jaipur, Rajasthan, India",
    availabilityStatus: "CSE STUDENT · CLASS OF 2029",
    university: "Jaipur Engineering College, Kukas, Jaipur, Rajasthan",
    graduationYear: "Batch 2025–2029",
    published: true,
    socials: {
      github: "https://github.com/anmolajnabee",
      linkedin: "https://www.linkedin.com/in/anmol-kumar-243412398",
      twitter: "",
      email: "anm8789667614@gmail.com",
      resumeUrl: "#contact",
      discord: ""
    },
    stats: {
      hackathonsWon: 0,
      projectsCompleted: 2,
      contributionsCount: "Active",
      academicGpa: "In Progress"
    }
  },
  projects: [
    {
      id: "gh-capacity-connect",
      title: "Capacity Connect Training Platform",
      tagline: "Capacity Connect Training Platform - Made with Reflex Build",
      description: "Interactive training and capacity-building web platform built with Reflex and modern Python web workflows.",
      fullStory: "A full-featured training platform designed to streamline capacity building and user learning workflows. Built using Reflex for high-performance Python-driven web experiences.",
      category: "Web & AI Platform",
      technologies: ["Python", "Reflex", "Web Development"],
      githubUrl: "https://github.com/anmolajnabee/Capacity-Connect-Training-Platform",
      demoUrl: "https://capacity-connect-training-platform-gray-star.reflex.run/",
      featured: true,
      published: true,
      order: 0,
      date: "2026",
      repoName: "Capacity-Connect-Training-Platform",
      language: "Python",
      coverStyle: "network"
    },
    {
      id: "gh-fancytext",
      title: "FancyText",
      tagline: "Web text styling and formatting utility built with responsive web standards",
      description: "Creative web text formatting tool enabling customized typography and styling for online messaging and profiles.",
      fullStory: "A lightweight, client-side utility for transforming standard text into diverse stylistic typographic representations for social sharing and clean presentation.",
      category: "Web Development",
      technologies: ["HTML", "CSS", "JavaScript"],
      githubUrl: "https://github.com/anmolajnabee/FancyText",
      demoUrl: "https://fancy-text-two.vercel.app",
      featured: true,
      published: true,
      order: 1,
      date: "2025",
      repoName: "FancyText",
      language: "HTML",
      coverStyle: "terminal"
    }
  ],
  skillCategories: [
    {
      id: "software-web",
      name: "Software & Web Development",
      description: "Programming fundamentals, web development, and application building.",
      published: true,
      order: 1,
      skills: [
        { id: "s1", name: "Software Development", proficiency: 80, level: "Proficient" },
        { id: "s2", name: "Web Development", proficiency: 80, level: "Proficient" },
        { id: "s3", name: "Problem Solving", proficiency: 85, level: "Advanced" },
        { id: "s4", name: "Programming Fundamentals", proficiency: 85, level: "Advanced" }
      ]
    },
    {
      id: "ai-emerging",
      name: "AI & Emerging Technologies",
      description: "Exploring artificial intelligence, modern tools, and technology entrepreneurship.",
      published: true,
      order: 2,
      skills: [
        { id: "a1", name: "Artificial Intelligence", proficiency: 75, level: "Proficient" },
        { id: "a2", name: "Hackathons", proficiency: 80, level: "Proficient" },
        { id: "a3", name: "Technology Entrepreneurship", proficiency: 80, level: "Proficient" }
      ]
    }
  ],
  certificates: [],
  education: [
    {
      id: "edu-1",
      degree: "Bachelor of Technology (B.Tech)",
      institution: "Jaipur Engineering College, Kukas, Jaipur, Rajasthan",
      location: "Jaipur, Rajasthan",
      period: "2025 – 2029",
      status: "Currently pursuing",
      published: true,
      coursework: [
        "Computer Science and Engineering",
        "Programming & Problem Solving",
        "Data Structures & Algorithms",
        "Computer Science Fundamentals"
      ],
      achievements: []
    }
  ],
  appearance: {
    ambientGlow: true,
    meshBackground: true,
    accentColor: "blue",
    cardGlassEffect: true,
    published: true
  },
  media: [],
  lastPublishedAt: "2026-10-18T21:30:00Z"
};
