import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '1mb' }));

// In-memory rate limiter for spam protection (max 5 contact submissions per 10 minutes per IP)
const submissionRateLimits = new Map<string, { count: number; firstSeen: number }>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_SUBMISSIONS_PER_WINDOW = 5;

// Cleanup old rate limit entries every 15 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of submissionRateLimits.entries()) {
    if (now - entry.firstSeen > RATE_LIMIT_WINDOW_MS) {
      submissionRateLimits.delete(ip);
    }
  }
}, 15 * 60 * 1000);

// Endpoint 1: Contact Submission Email Notification
app.post('/api/contact-notify', async (req: Request, res: Response) => {
  try {
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    // Rate Limiting Check
    const rateEntry = submissionRateLimits.get(clientIp);
    if (rateEntry) {
      if (now - rateEntry.firstSeen < RATE_LIMIT_WINDOW_MS) {
        if (rateEntry.count >= MAX_SUBMISSIONS_PER_WINDOW) {
          return res.status(429).json({
            error: 'Too many submissions from this connection. Please wait a few minutes before sending another message.',
          });
        }
        rateEntry.count += 1;
      } else {
        submissionRateLimits.set(clientIp, { count: 1, firstSeen: now });
      }
    } else {
      submissionRateLimits.set(clientIp, { count: 1, firstSeen: now });
    }

    const { name, email, message, messageId, createdAt } = req.body;

    // Server-side Input Validation & Sanitization
    if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
      return res.status(400).json({ error: 'Name must be between 2 and 100 characters' });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim()) || email.trim().length > 150) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10 || message.trim().length > 2000) {
      return res.status(400).json({ error: 'Message must be between 10 and 2000 characters' });
    }

    const resendApiKey = process.env.RESEND_API_KEY?.trim() || '';
    const targetEmail = process.env.NOTIFICATION_EMAIL?.trim() || 'anm8789667614@gmail.com';
    const fromEmail = process.env.RESEND_FROM_EMAIL?.trim() || 'Portfolio Contact <onboarding@resend.dev>';

    // If Resend API Key is not configured in environment variables, respond with clear setup status
    if (!resendApiKey) {
      console.log(
        `[Email Notification Notice] RESEND_API_KEY is not configured. Message (${messageId || 'new'}) is securely stored in database.`
      );
      return res.json({
        success: true,
        emailSent: false,
        configured: false,
        reason: 'RESEND_API_KEY environment variable is not configured. Message is securely persisted in Firestore database.',
      });
    }

    // Call Resend REST API securely on server-side (private key is never sent to browser)
    const sanitizedName = name.replace(/[<>]/g, '');
    const sanitizedEmail = email.replace(/[<>]/g, '');
    const formattedDate = createdAt ? new Date(createdAt).toLocaleString() : new Date().toLocaleString();

    const generateEmailHtml = (extraNotice = '') => `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0B0B0C; color: #F5F5F5; border-radius: 8px;">
        <h2 style="color: #668CFF; font-size: 20px; margin-top: 0;">New Portfolio Inquiry — Anmol Kumar</h2>
        <p style="color: #929292; font-size: 14px;">Someone submitted a new message through your portfolio contact form.</p>
        
        ${extraNotice ? `<div style="background: rgba(102,140,255,0.1); border: 1px solid rgba(102,140,255,0.3); border-radius: 6px; padding: 12px; margin: 16px 0; font-size: 12px; color: #9bb7ff;">${extraNotice}</div>` : ''}

        <div style="background: #141416; border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; padding: 16px; margin: 16px 0;">
          <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>From:</strong> ${sanitizedName}</p>
          <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Email:</strong> <a href="mailto:${sanitizedEmail}" style="color: #668CFF; text-decoration: none;">${sanitizedEmail}</a></p>
          <p style="margin: 0; font-size: 12px; color: #929292;"><strong>Date:</strong> ${formattedDate}</p>
        </div>

        <div style="background: #111114; border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; padding: 16px; margin: 16px 0;">
          <p style="margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #929292;">Message</p>
          <p style="margin: 0; font-size: 14px; line-height: 1.6; white-space: pre-wrap; color: #F5F5F5;">${message.replace(/[<>]/g, '')}</p>
        </div>

        <p style="font-size: 12px; color: #929292; margin-top: 24px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px;">
          You can view, manage, and reply to all messages in your <a href="https://ais-dev-xum74ah47zm5eh2rprilkh-957886984732.asia-east1.run.app/#admin" style="color: #668CFF;">Admin Messages Dashboard</a>.
        </p>
      </div>
    `;

    // Attempt delivery to requested target email
    let deliveryEmail = targetEmail;
    let extraNotice = '';
    let response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [deliveryEmail],
        reply_to: sanitizedEmail,
        subject: `New Portfolio Inquiry — Anmol Kumar (from ${sanitizedName})`,
        html: generateEmailHtml(),
      }),
    });

    // If Resend onboarding testing domain restricts delivery to account owner email, fallback gracefully
    if (!response.ok && response.status === 403) {
      const errorText = await response.text();
      console.warn('[Resend Sandbox Restriction]:', errorText);
      const match = errorText.match(/your own email address \(([^)]+)\)/);
      const accountOwnerEmail = match ? match[1] : 'anm8789667614@gmail.com';

      if (deliveryEmail !== accountOwnerEmail) {
        deliveryEmail = accountOwnerEmail;
        extraNotice = `Note: Delivered to your Resend account email (${deliveryEmail}) because Resend's free onboarding domain restricts external test delivery. To send directly to ${targetEmail}, verify a custom domain at resend.com/domains.`;

        response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [deliveryEmail],
            reply_to: sanitizedEmail,
            subject: `New Portfolio Inquiry — Anmol Kumar (from ${sanitizedName})`,
            html: generateEmailHtml(extraNotice),
          }),
        });
      }
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Resend API Error]:', errorText);
      return res.status(502).json({
        success: false,
        emailSent: false,
        configured: true,
        error: `Resend service returned: ${errorText}`,
      });
    }

    const resData = (await response.json()) as { id: string };
    console.log('[Email Notification Sent Successfully]: ID', resData.id, 'to', deliveryEmail);

    return res.json({
      success: true,
      emailSent: true,
      configured: true,
      deliveredTo: deliveryEmail,
      notificationId: resData.id,
    });
  } catch (error) {
    console.error('[Notification Handler Exception]:', error);
    return res.status(500).json({
      error: 'An unexpected error occurred while processing email notification',
    });
  }
});

// Endpoint 2: Email Configuration Status
app.get('/api/email-status', (_req: Request, res: Response) => {
  const apiKey = process.env.RESEND_API_KEY?.trim() || '';
  const hasKey = Boolean(apiKey && apiKey.length > 0);
  const targetEmail = process.env.NOTIFICATION_EMAIL?.trim() || 'anm8789667614@gmail.com';
  return res.json({
    configured: hasKey,
    provider: 'Resend',
    targetEmail,
    accountOwnerEmail: 'anm8789667614@gmail.com',
  });
});

// Endpoint 3: GitHub Public Projects Proxy (Guarantees reliable delivery & strictly excludes portfolio repo)
interface GitHubCache {
  timestamp: number;
  data: any[];
}
let githubProjectsCache: GitHubCache | null = null;
const GITHUB_CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes

app.get('/api/github-projects', async (req: Request, res: Response) => {
  const forceRefresh = req.query.refresh === 'true';

  if (!forceRefresh && githubProjectsCache && Date.now() - githubProjectsCache.timestamp < GITHUB_CACHE_TTL_MS) {
    return res.json({
      success: true,
      projects: githubProjectsCache.data,
      fromCache: true,
    });
  }

  try {
    const ghRes = await fetch('https://api.github.com/users/anmolajnabee/repos?per_page=100&sort=pushed&direction=desc', {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'Anmol-Portfolio-Server',
      },
    });

    if (!ghRes.ok) {
      if (githubProjectsCache) {
        return res.json({
          success: true,
          projects: githubProjectsCache.data,
          fromCache: true,
          notice: 'Serving cached GitHub repositories due to upstream rate limit.',
        });
      }
      throw new Error(`GitHub upstream returned ${ghRes.status}`);
    }

    const repos = (await ghRes.json()) as any[];
    // Strictly exclude any portfolio repository
    const filteredRepos = repos.filter((r) => {
      const name = (r.name || '').toLowerCase().trim();
      return name !== 'portfolio' && !name.endsWith('/portfolio') && !name.includes('portfolio');
    });

    // Map to projects in newest first order
    const mappedProjects = filteredRepos.map((repo, idx) => {
      const name = (repo.name || '').toLowerCase();
      const isComplaint = name.includes('complaint');
      const isCapacity = name.includes('capacity');
      const isFancy = name.includes('fancy');

      let title = repo.name.replace(/[-_]+/g, ' ').trim();
      let tagline = repo.description || 'Public software project on GitHub.';
      let description = tagline;
      let demoUrl = repo.homepage || '';
      let category = 'Web Development';
      let technologies = [repo.language || 'Software Development'];
      let coverStyle = 'neural';

      if (isComplaint) {
        title = 'Complaint Management Portal';
        tagline = 'JEC KUKAS Complaint Management & Resolution Portal';
        description = 'Full-stack institutional complaint resolution web portal featuring categorized grievance submission, automated routing, status tracking, and administrative review workflows.';
        demoUrl = repo.homepage || 'https://complaint-management-portal.anmolkr.workers.dev/';
        category = 'Full-Stack Web App';
        technologies = ['TypeScript', 'React', 'Express', 'SQL', 'Tailwind CSS'];
        coverStyle = 'analytics';
      } else if (isCapacity) {
        title = 'Capacity Connect Training Platform';
        tagline = 'Capacity Connect Training Platform - Made with Reflex Build';
        description = 'Interactive training and capacity-building web platform built with Reflex and modern Python web workflows.';
        demoUrl = repo.homepage || 'https://capacity-connect-training-platform.vercel.app';
        category = 'Web & AI Platform';
        technologies = ['Python', 'Reflex', 'Web Development'];
        coverStyle = 'network';
      } else if (isFancy) {
        title = 'FancyText';
        tagline = 'Web text styling and formatting utility built with responsive web standards';
        description = 'Creative web text formatting tool enabling customized typography and styling for online messaging and profiles.';
        demoUrl = repo.homepage || 'https://fancy-text-two.vercel.app';
        category = 'Web Development';
        technologies = ['HTML', 'CSS', 'JavaScript'];
        coverStyle = 'terminal';
      }

      return {
        id: `gh-${repo.id || repo.name.toLowerCase()}`,
        title,
        tagline,
        description,
        fullStory: description,
        category,
        technologies,
        githubUrl: repo.html_url,
        demoUrl,
        imageUrl: '',
        featured: true,
        published: true,
        order: idx,
        date: repo.updated_at ? new Date(repo.updated_at).getFullYear().toString() : '2026',
        repoName: repo.name,
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        isFork: repo.fork,
        language: repo.language || technologies[0],
        lastUpdated: repo.updated_at,
        coverStyle,
      };
    });

    // Ensure confirmed Newest first ordering: Complaint Portal -> Capacity Connect -> FancyText
    mappedProjects.sort((a, b) => {
      if (a.repoName.toLowerCase().includes('complaint')) return -1;
      if (b.repoName.toLowerCase().includes('complaint')) return 1;
      if (a.repoName.toLowerCase().includes('capacity')) return -1;
      if (b.repoName.toLowerCase().includes('capacity')) return 1;
      return 0;
    });

    // Re-assign order index 0, 1, 2...
    mappedProjects.forEach((p, index) => {
      p.order = index;
    });

    githubProjectsCache = {
      timestamp: Date.now(),
      data: mappedProjects,
    };

    return res.json({
      success: true,
      projects: mappedProjects,
      fromCache: false,
    });
  } catch (err: any) {
    console.error('[GitHub Proxy Error]:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch GitHub repositories.',
    });
  }
});

async function start() {
  if (process.env.NODE_ENV === 'production') {
    // Serve production static build
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    // Development mode: Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT} (PID: ${process.pid})`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
