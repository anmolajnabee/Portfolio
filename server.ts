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

    const resendApiKey = process.env.RESEND_API_KEY?.trim();
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

    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0B0B0C; color: #F5F5F5; border-radius: 8px;">
        <h2 style="color: #668CFF; font-size: 20px; margin-top: 0;">New Contact Form Message</h2>
        <p style="color: #929292; font-size: 14px;">Someone submitted a message through your portfolio website.</p>
        
        <div style="background: #141416; border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; padding: 16px; margin: 16px 0;">
          <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>From:</strong> ${sanitizedName}</p>
          <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Email:</strong> <a href="mailto:${sanitizedEmail}" style="color: #668CFF; text-decoration: none;">${sanitizedEmail}</a></p>
          <p style="margin: 0; font-size: 12px; color: #929292;"><strong>Date:</strong> ${formattedDate}</p>
        </div>

        <div style="background: #111114; border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; padding: 16px; margin: 16px 0;">
          <p style="margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #929292;">Message</p>
          <p style="margin: 0; font-size: 14px; line-height: 1.6; white-space: pre-wrap; color: #F5F5F5;">${message.replace(/[<>]/g, '')}</p>
        </div>

        <p style="font-size: 12px; color: #929292; margin-top: 24px; border-top: 1px solid rgba(255,255,255,0.08); pt: 16px;">
          You can view and manage all messages in your <a href="https://ais-dev-xum74ah47zm5eh2rprilkh-957886984732.asia-east1.run.app/#admin" style="color: #668CFF;">Admin Dashboard</a>.
        </p>
      </div>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [targetEmail],
        reply_to: sanitizedEmail,
        subject: `New Portfolio Message from ${sanitizedName}`,
        html: emailHtml,
      }),
    });

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
    console.log('[Email Notification Sent Successfully]: ID', resData.id);

    return res.json({
      success: true,
      emailSent: true,
      configured: true,
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
  const hasKey = Boolean(process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.trim().length > 0);
  const targetEmail = process.env.NOTIFICATION_EMAIL?.trim() || 'anm8789667614@gmail.com';
  return res.json({
    configured: hasKey,
    provider: 'Resend',
    targetEmail,
  });
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
