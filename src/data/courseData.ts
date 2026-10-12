/**
 * Kambal hayma
 * Course and Pay-Per-View Video Configuration
 * 
 * CREATOR INSTRUCTIONS:
 * 1. Replace TRAILER_VIDEO_URL and FULL_VIDEO_URL below with your actual uploaded video links
 *    (e.g., Cloudflare Stream, Vimeo OTT, Mux, AWS CloudFront, or direct MP4/HLS streams).
 * 2. Configure PAYMONGO_SECRET_KEY in your .env file to accept real GCash and card transactions.
 */

export interface Chapter {
  id: number;
  number: string;
  title: string;
  timeFormatted: string;
  startSeconds: number;
  durationSeconds: number;
  description: string;
  keyTakeaways: string[];
  techFocus: string[];
}

export interface CourseMetadata {
  title: string;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  author: {
    name: string;
    role: string;
    credentials: string;
    university: string;
    award: string;
  };
  pricing: {
    php: number;
    formatted: string;
    currency: string;
  };
  stats: {
    videoDuration: string;
    resolution: string;
    chaptersCount: number;
    resourceFilesCount: number;
    linesOfCode: string;
  };
}

export const COURSE_CONFIG = {
  // =========================================================================
  // 🎥 VIDEO STREAM CONFIGURATION:
  // Paste your actual production video URLs here:
  // =========================================================================
  TRAILER_VIDEO_URL: '/trailer/teaser.mp4',
  FULL_VIDEO_URL: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',

  // Teaser trailer duration cap (in seconds)
  TRAILER_DURATION_LIMIT: 60,

  // Fallback poster / backdrop artwork
  POSTER_URL: '',
};

export const COURSE_METADATA: CourseMetadata = {
  title: 'Kambal hayma',
  tagline: 'An unfiltered, engineering-first documentary & architecture deep dive',
  heroHeadline: 'From Blank IDE to Best Capstone Award: The Real System Breakdown',
  heroSubheadline: 'Watch the full 4.2-minute documentary covering the one versus five with uncut scenes.',
  author: {
    name: 'Ghost',
    role: 'Lead Systems Architect & Full-Stack Engineer',
    credentials: 'Ex-GovTech Fellow · Capstone Outstanding Research Awardee 2024',
    university: 'Technological University of the Philippines',
    award: 'Best documentary covering the one versus five with uncut scenes.',
  },
  pricing: {
    php: 29,
    formatted: '₱29',
    currency: 'PHP',
  },
  stats: {
    videoDuration: '4.2m',
    resolution: '4K Ultra HD',
    chaptersCount: 5,
    resourceFilesCount: 14,
    linesOfCode: '18,400+',
  },
};

export const CHAPTERS: Chapter[] = [
  {
    id: 1,
    number: '01',
    title: 'The Problem & Architecture Ideation',
    timeFormatted: '00:00 - 14:20',
    startSeconds: 0,
    durationSeconds: 860,
    description: 'Deconstructing why 90% of capstone projects fail thesis defense by selecting unrealistic scope. How we narrowed our real-time distributed telemetry problem statement.',
    keyTakeaways: [
      'Framing a defense-proof problem statement backed by field data',
      'Scope negotiation: what to cut to guarantee graduation deadline',
      'Conducting competitive analysis against existing commercial solutions',
    ],
    techFocus: ['System Specification', 'UML Diagramming', 'Feasibility Matrix'],
  },
  {
    id: 2,
    number: '02',
    title: 'System Architecture & Tech Stack Decisions',
    timeFormatted: '14:20 - 32:45',
    startSeconds: 860,
    durationSeconds: 1105,
    description: 'Full whiteboarding of our microservice pipeline, why we ditched Firebase for PostgreSQL + Redis cache, and how WebSockets handled 10,000 concurrent events.',
    keyTakeaways: [
      'High-level topology: API Gateway, Auth Microservice, WebSocket Cluster',
      'Database schema normalisation and migration strategy under pressure',
      'Handling multi-tenant data isolation without breaking performance',
    ],
    techFocus: ['PostgreSQL', 'Redis Pub/Sub', 'Node.js Cluster', 'Docker'],
  },
  {
    id: 3,
    number: '03',
    title: 'Live Engineering, Pitfalls & Scalability',
    timeFormatted: '32:45 - 54:10',
    startSeconds: 1965,
    durationSeconds: 1285,
    description: 'Raw recorded screen sessions showing the week before defense: memory leaks in the event stream, unexpected 502 gateway timeouts, and fixing live concurrency bugs.',
    keyTakeaways: [
      'Diagnosing Node.js heap exhaustion during mock load testing',
      'Implementing rate limiting & resilient backoff algorithms',
      'Writing automated integration tests for panel verification',
    ],
    techFocus: ['Profiling', 'K6 Load Testing', 'Nginx Reverse Proxy', 'TypeScript'],
  },
  {
    id: 4,
    number: '04',
    title: 'Thesis Defense Q&A & Panel Grilling',
    timeFormatted: '54:10 - 1:18:30',
    startSeconds: 3250,
    durationSeconds: 1460,
    description: 'The complete, unedited audio & video footage of the 45-minute technical defense. How we answered tough questions about novelty, security vulnerabilities, and deployment.',
    keyTakeaways: [
      'Defending architectural trade-offs against skeptical professors',
      'Demonstrating live failure recovery on stage without panic',
      'How to articulate IEEE/ACM standards compliance in defense slides',
    ],
    techFocus: ['Oral Defense Strategy', 'Slide Deck Engineering', 'Security Audit'],
  },
  {
    id: 5,
    number: '05',
    title: 'Deployment, Retrospective & Blueprint',
    timeFormatted: '1:18:30 - 1:35:00',
    startSeconds: 4710,
    durationSeconds: 990,
    description: 'Final retrospective: how we packaged the code for peer review, deployed to Google Cloud Run, and the 7 lessons every senior software student must know.',
    keyTakeaways: [
      'Zero-downtime CI/CD deployment with GitHub Actions and Cloud Run',
      'Complete checklist for passing manuscript formatting and turnitin',
      'Turning your capstone into a standout portfolio project for tech recruiters',
    ],
    techFocus: ['CI/CD Pipeline', 'Cloud Run', 'Terraform', 'Career Portfolio'],
  },
];

export const TESTIMONIALS = [
  {
    quote: 'This video series saved me from begging on online platform to give me the fotage and its also cheap.',
    author: 'Mark Kevin Ramos',
    role: 'Lead Developer, 2025 Capstone Team',
    school: 'Mapúa University',
    rating: 5,
  },
  {
    quote: ' I recommend this documentary to all Manyak. Kambal hayma demonstrates exactly the standard of technical depth, clarity, and architecture on how to take Five guys.',
    author: 'Engr. David Santos, M.Sc.',
    role: 'Capstone Panel Chairman & Faculty',
    school: 'DLSU Manila',
    rating: 5,
  },
  {
    quote: 'Worth ten times the ₱29 price. Having the actual footage showed us exactly how the Girl take all that sausage.',
    author: 'Alyssa Chen',
    role: 'BS Computer Science Graduate',
    school: 'UST College of Information & Computing',
    rating: 5,
  },
];

export const FAQS = [
  {
    question: 'How do I pay with GCash and how fast is access granted?',
    answer: 'Simply enter your name and email, click "Proceed to GCash Payment", and complete the prompt in your GCash app or web portal. Once confirmed, access is granted instantly and permanently.',
  },
  {
    question: 'Is this a monthly subscription or a one-time fee?',
    answer: 'It is a strictly one-time payment of ₱29. There are no recurring charges, no hidden fees, and you receive lifetime unlimited access across all your devices.',
  },
  {
    question: 'What devices are supported for video playback?',
    answer: 'The custom video player works smoothly on all modern browsers across mobile (iOS Safari, Android Chrome), tablets, laptops, and desktop computers. It supports high-bitrate streaming, variable playback speed (0.75x to 2x), and chapter seeking.',
  },
  {
    question: 'What bonus resources are included with the pass?',
    answer: 'You get full access to our comprehensive 48-page Capstone Technical Documentation PDF (Architecture, Database Schemas, Sequence Diagrams, Defense Script) plus the private GitHub repository with all 18,400+ lines of production source code.',
  },
  {
    question: 'Can I share or stream this with my capstone group mates?',
    answer: 'Yes! A single pass allows your entire capstone group to study the documentary, inspect the code repository, and review the defense strategies together.',
  },
];
