'use client'

import React, { useState } from 'react'
import {
  ArrowRight,
  RefreshCw,
  RotateCcw,
  Sparkles,
  PenLine,
  ShieldCheck,
} from 'lucide-react'
import { SplineScene } from '@/components/ui/splite'
import { Spotlight } from '@/components/ui/spotlight'
import { TestimonialsColumn } from '@/components/ui/testimonials-columns-1'
import { Card } from '@/components/ui/card'
import { diffHighlight } from '@/lib/diff'

const SAMPLES: Record<string, string> = {
  essay:
    'This essay will discuss how technology has changed communication in modern society. The internet has made it possible for people to communicate across the world. This is important because it allows for the sharing of information and ideas between different cultures.',
  email:
    'I am writing to follow up on our previous conversation about the project timeline. I wanted to check in to see if there are any updates. Please let me know if you need any additional information from my side and I will be happy to provide it.',
  marketing:
    'Our product helps teams work better together by improving their productivity. It makes communication easier and allows people to collaborate more effectively. Our customers have seen significant improvements in their overall output and satisfaction.',
  linkedin:
    'I am very excited to share that I have recently started a new position at a leading technology company. This role is focused on using AI to improve writing and communication across teams. I am looking forward to the challenges and opportunities ahead.',
  job:
    'I am applying for this position because I believe I have the skills and experience that are needed for this role. I have worked in this field for several years and have developed strong abilities in the relevant areas.',
}

const SAMPLE_LABELS: Record<string, string> = {
  essay: 'Essay intro',
  email: 'Work email',
  marketing: 'Marketing',
  linkedin: 'LinkedIn post',
  job: 'Job application',
}

// PREDEFINED: higher-quality, more human rewrites synchronized with the static HTML version
const PREDEFINED: Record<string, string> = {
  essay:
    'Technology has fundamentally changed how we communicate. The internet lets people connect across the world instantly: which means ideas, stories, and perspectives can travel between cultures in ways that were never possible before.',
  email:
    "I'm following up on our conversation about the project timeline. Any updates on your end? Let me know if there's anything you need from me.",
  marketing:
    'Our product helps teams work together more clearly. It cuts down communication overhead and gives people a better way to collaborate: our customers report real gains in both output and satisfaction.',
  linkedin:
    'I recently joined a tech company working on AI tools for writing and communication. Still getting up to speed, but the problems are genuinely interesting and the team has been great.',
  job:
    "I'm applying because I think my background is a strong match for what you're looking for. I've spent several years in this field and have hands-on experience in the areas this role focuses on.",
}

const testimonials = [
  {
    text: 'The preview-first flow made it obvious what Grammarly would change. The rewrite preserved my argument and improved clarity without losing my voice.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=60',
    name: 'Briana Patton',
    role: 'Graduate Student',
  },
  {
    text: 'We standardized tone across client emails in one pass. It sounds human, but still crisp and professional.',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=60',
    name: 'Bilal Ahmed',
    role: 'Client Success Lead',
  },
  {
    text: 'The rewrite keeps key product terms intact and removes the awkward phrasing our team kept missing.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=60',
    name: 'Saman Malik',
    role: 'Product Marketing',
  },
  {
    text: 'I used to spend an hour editing my essays for tone. Now I get it right in seconds. The personalization is spot on.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=60',
    name: 'Elena Rodriguez',
    role: 'Journalism Student',
  },
  {
    text: 'Finally, an AI tool that doesn’t sound like a robot. It actually understands the nuance of professional emails.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60',
    name: 'David Chen',
    role: 'Operations Manager',
  },
  {
    text: 'The before/after comparison is genius. It teaches me how to write better while helping me get my work done.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&auto=format&fit=crop&q=60',
    name: 'Sarah Jenkins',
    role: 'Content Strategy',
  },
]

const features = [
  {
    title: 'Keep your meaning',
    description: 'Preserve the facts and intent while smoothing the delivery.',
    icon: PenLine,
  },
  {
    title: 'Natural flow',
    description: 'Reduce repetitive phrasing and improve rhythm.',
    icon: Sparkles,
  },
  {
    title: 'Brand-safe tone',
    description: 'Match the voice your audience expects.',
    icon: ShieldCheck,
  },
]

const normalizeText = (value: string) => value.replace(/\s+/g, ' ').trim()

const getSampleKey = (value: string) => {
  const normalized = normalizeText(value)
  return Object.entries(SAMPLES).find(([, sample]) => normalizeText(sample) === normalized)?.[0]
}

const fallbackRewrite = (value: string) =>
  value
    .replace(/\bIn today's world\b/gi, "Today")
    .replace(/\bIn an era of\b/gi, "With")
    .replace(/\bIt is important to note that\b/gi, "Note that")
    .replace(/\bFurthermore\b/gi, "Also")
    .replace(/\bMoreover\b/gi, "Additionally")
    .replace(/\bIn addition\b/gi, "Also")
    .replace(/\bthe realm of\b/gi, "the field of")
    .replace(/\bWhen it comes to\b/gi, "For")
    .replace(/\bWith regard to\b/gi, "About")
    .replace(/\bIn terms of\b/gi, "Regarding")
    .replace(/\bMoving forward\b/gi, "Next")
    .replace(/\bIt can be argued that\b/gi, "Some argue")
    .replace(/\bOne could say that\b/gi, "One might say")
    .replace(/\bIt is possible that\b/gi, "Perhaps")
    .replace(/\bI am writing to follow up\b/g, "I'm writing to follow up")
    .replace(/\bI am very excited to share\b/g, "I'm very excited to share")
    .replace(/\bI am applying for\b/g, "I'm applying for")
    .replace(/\bI have worked\b/g, "I've worked")
    .replace(/\bwill discuss\b/g, 'will explore')
    .replace(/\bthe sharing of information and ideas\b/g, 'sharing information and ideas')
    .replace(/\s+/g, ' ')
    .trim()

const VOICE_MAP: Record<string, string[]> = {
  work_professional:   ['Clear', 'Professional', 'Polished'],
  work_confident:      ['Clear', 'Confident', 'Direct'],
  work_natural:        ['Clear', 'Authentic', 'Readable'],
  work_conversational: ['Clear', 'Approachable', 'Warm'],
  essay_professional:  ['Precise', 'Professional', 'Articulate'],
  essay_natural:       ['Precise', 'Natural', 'Structured'],
  essay_confident:     ['Precise', 'Confident', 'Authoritative'],
  essay_conversational:['Precise', 'Accessible', 'Natural'],
  marketing_confident: ['Engaging', 'Confident', 'Sharp'],
  marketing_natural:   ['Engaging', 'Warm', 'Readable'],
  marketing_conversational: ['Engaging', 'Conversational', 'Punchy'],
  marketing_professional:   ['Engaging', 'Professional', 'Polished'],
  general_natural:     ['Natural', 'Clear', 'Authentic'],
  general_professional:['Natural', 'Polished', 'Readable'],
  general_conversational: ['Natural', 'Warm', 'Approachable'],
  general_confident:   ['Natural', 'Direct', 'Confident'],
}

export default function LandingPage() {
  const [text, setText] = useState('')
  const [diffParts, setDiffParts] = useState<{ text: string; highlight: boolean }[]>([])
  const [editableSuggestion, setEditableSuggestion] = useState('')
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isRefining, setIsRefining] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState('Generating preview…')
  const [error, setError] = useState<string | null>(null)
  const [apiKeySet, setApiKeySet] = useState<boolean | null>(null)

  React.useEffect(() => {
    fetch('/api/rewrite', { method: 'GET' }).then(res => setApiKeySet(res.status !== 404))
  }, [])

  const trackEvent = (name: string, props: Record<string, unknown> = {}) => {
    console.log('[trackEvent]', name, {
      variant_id: 'preview_first_v1',
      ts: new Date().toISOString(),
      ...props,
    })
  }

  const applyRewrite = (rewrite: string) => {
    setDiffParts(diffHighlight(text, rewrite))
    setEditableSuggestion(rewrite)
  }

  const requestRewrite = async (
    input: string,
    options?: { forceApi?: boolean; answers?: Record<string, string> }
  ) => {
    // Only use predefined for the initial sample preview (no answers, not forceApi)
    const sampleKey = getSampleKey(input)
    if (sampleKey && !options?.forceApi && !options?.answers) {
      trackEvent('sample_text_used', { sample_used: sampleKey })
      return PREDEFINED[sampleKey]
    }

    // Normalize answers: new quiz sends full strings, API expects short keys
    const normalizeAnswers = (raw: Record<string, string>) => {
      const useCaseNorm: Record<string, string> = {
        'Academic writing': 'essay', 'Work email': 'work', 'Social post': 'marketing',
        'Job application': 'essay', 'Other': 'general',
        // passthrough short keys
        work: 'work', essay: 'essay', marketing: 'marketing', general: 'general',
      };
      const toneNorm: Record<string, string> = {
        'Clear': 'natural', 'Confident': 'confident', 'Friendly': 'conversational',
        'Professional': 'professional',
        // passthrough
        natural: 'natural', professional: 'professional', conversational: 'conversational', confident: 'confident',
      };
      const strengthNorm: Record<string, string> = {
        'Light polish': 'light', 'Balanced': 'balanced', 'Strong humanization': 'strong',
        light: 'light', balanced: 'balanced', strong: 'strong',
      };
      return {
        useCase: useCaseNorm[raw.useCase] || raw.useCase || '',
        tone: toneNorm[raw.tone] || raw.tone || '',
        strength: strengthNorm[raw.strength] || raw.strength || '',
      };
    };

    // Always call the API when answers are provided or forceApi is set
    try {
      const normalizedAnswers = options?.answers ? normalizeAnswers(options.answers) : {};
      const res = await fetch('/api/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input, answers: normalizedAnswers }),
      })
      const data = await res.json()
      if (res.ok && data.rewrite && data.rewrite.trim() !== input.trim()) return data.rewrite
      // If API returns identical text (shouldn't happen), use fallback
      if (res.ok && data.rewrite) return data.rewrite
      throw new Error(data.error || 'Rewrite API failed')
    } catch (err) {
      console.warn('Rewrite API failed, using fallback:', err)
      return fallbackRewrite(input)
    }
  }

  const handlePreview = async () => {
    if (!text.trim()) {
      setError('Paste text or choose a sample to continue.')
      return
    }
    setError(null)
    setIsLoading(true)
    setLoadingMsg('Generating preview…')
    trackEvent('preview_requested', { chars: text.length })
    const t1 = setTimeout(() => setLoadingMsg('Removing AI patterns…'), 900)
    const t2 = setTimeout(() => setLoadingMsg('Polishing flow…'), 1800)

    const rewrite = await requestRewrite(text)
    clearTimeout(t1); clearTimeout(t2)
    applyRewrite(rewrite)
    setStep(1)
    setIsLoading(false)
    trackEvent('preview_generated')
  }

  const voiceTags = (() => {
    const key = `${answers.useCase || 'general'}_${answers.tone || 'natural'}`
    return VOICE_MAP[key] || ['Clear', 'Natural', 'Authentic']
  })()

  const handleAnswer = async (qIndex: number, key: string, val: string) => {
    const newAnswers = { ...answers, [key]: val }
    setAnswers(newAnswers)
    trackEvent('quiz_step_completed', { step: qIndex, answer: val })

    if (qIndex === 3) {
      setIsRefining(true)
      setLoadingMsg('Personalizing your rewrite…')
      const refined = await requestRewrite(text, { forceApi: true, answers: newAnswers })
      applyRewrite(refined)
      setStep(4)
      setIsRefining(false)
      trackEvent('preview_refined', { answers: newAnswers })
      return
    }

    setStep(qIndex + 1)
    trackEvent('quiz_step_viewed', { step: qIndex + 1 })
  }

  const handleRewriteAgain = async () => {
    if (!text.trim()) return
    setError(null)
    if (step === 4) {
      setIsRefining(true)
      const refined = await requestRewrite(text, {
        forceApi: true,
        answers,
      })
      applyRewrite(refined)
      setIsRefining(false)
      trackEvent('rewrite_regenerated', { stage: 'refined' })
      return
    }

    setIsLoading(true)
    const rewrite = await requestRewrite(text, { forceApi: true })
    applyRewrite(rewrite)
    setIsLoading(false)
    trackEvent('rewrite_regenerated', { stage: 'preview' })
  }

  const handleReset = () => {
    setText('')
    setDiffParts([])
    setStep(0)
    setAnswers({})
    setError(null)
    trackEvent('flow_reset')
  }

  const improvementItems = [
    'Clearer flow and rhythm',
    'Meaning preserved',
    'Redundant phrasing removed',
    answers.useCase
      ? `Optimized for ${answers.useCase} tone`
      : 'Tone matched to your intent',
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="font-semibold text-lg tracking-tight text-foreground flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#14a46c]">
            <path d="M16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0ZM16 26.6667C10.1086 26.6667 5.33333 21.8914 5.33333 16C5.33333 10.1086 10.1086 5.33333 16 5.33333C19.3444 5.33333 22.3381 6.87238 24.3168 9.27714L20.579 12.3916C19.4312 11.3112 17.7951 10.6667 16 10.6667C13.0545 10.6667 10.6667 13.0545 10.6667 16C10.6667 18.9455 13.0545 21.3333 16 21.3333C17.7951 21.3333 19.4312 20.6888 20.579 19.6084V16H16V12H26.6667V22.6667C24.0883 25.127 20.3702 26.6667 16 26.6667Z" fill="currentColor"/>
          </svg>
          <span className="text-primary">Grammarly</span>
          {apiKeySet === false && (
            <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full animate-pulse">API Key Missing</span>
          )}
        </div>
        <div className="flex items-center gap-6">
          <a href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Internal Dashboard
          </a>
          <a
            href="https://www.grammarly.com/signup"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#14a46c] text-white text-sm font-semibold transition-colors hover:bg-[#118c5c]"
          >
            Get Grammarly Free
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-6 py-8 md:py-12">
        <section className={`transition-all duration-500 ${step === 0 ? 'mb-24' : 'mb-12'}`}>
          <div className={`w-full overflow-hidden rounded-[40px] bg-[#16201b] text-white transition-all duration-500 ${step === 0 ? 'min-h-[500px]' : 'min-h-[200px] py-8'}`}>
            <div className="relative grid grid-cols-12 gap-8 h-full p-8 md:p-12">
              <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
              
              <div className={`col-span-12 ${step === 0 ? 'lg:col-span-7' : 'lg:col-span-12 text-center'} relative z-10 flex flex-col justify-center gap-6`}>
                {step === 0 ? (
                  <>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight">
                      Make AI writing sound natural without changing your meaning
                    </h1>
                    <p className="text-base md:text-lg text-blue-100 max-w-xl opacity-90">
                      Paste your text, preview a more natural version, then personalize it in 3 quick choices.
                    </p>

                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 mt-4 shadow-2xl">
                      <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Paste your AI-generated text here…"
                        className="w-full h-32 p-4 rounded-xl border border-white/20 bg-white/5 text-white placeholder:text-white/40 focus:border-white focus:ring-4 focus:ring-white/10 outline-none transition-all resize-none text-lg font-medium"
                      />
                      {error && <p className="text-sm text-red-300 mt-2 font-medium">{error}</p>}
                      
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <span className="text-sm text-white/60 font-medium">Try a sample:</span>
                        {Object.keys(SAMPLES).map((key) => (
                            <button
                              key={key}
                              onClick={() => {
                                setText(SAMPLES[key])
                                setError(null)
                              }}
                              className="px-4 py-1.5 rounded-full border border-white/20 text-xs font-semibold text-white/90 hover:bg-white/15 hover:text-white transition-all active:scale-95"
                            >
                              {SAMPLE_LABELS[key]}
                            </button>
                        ))}
                      </div>
                      <button
                        onClick={handlePreview}
                        disabled={isLoading}
                        className="w-full mt-6 py-4 rounded-2xl bg-accent text-accent-foreground font-bold text-lg shadow-[0_0_20px_rgba(255,113,0,0.3)] transition-all hover:bg-[#c96905] hover:shadow-[0_0_30px_rgba(255,113,0,0.5)] hover:-translate-y-1 disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none cursor-pointer"
                      >
                        {isLoading ? (
                          <span className="inline-flex items-center gap-2">
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            {loadingMsg}
                          </span>
                        ) : 'Humanize my text'}
                      </button>
                      <p className="mt-4 text-center text-xs text-white/50 font-medium">
                        Paste text to preview instantly. No credit card or registration required.
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center">
                     <h2 className="text-3xl md:text-4xl font-semibold mb-2">Personalize Your Rewrite</h2>
                     <button
                        onClick={handleReset}
                        className="text-white/60 hover:text-white text-sm underline transition-colors"
                     >
                        Start over with new text
                     </button>
                  </div>
                )}
              </div>

              {step === 0 && (
                <div className="col-span-12 lg:col-span-5 relative hidden lg:flex flex-col items-center justify-center">
                  <SplineScene
                    scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                    className="w-full h-full min-h-[400px]"
                  />
                  <div className="absolute bottom-10 right-10 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-xs font-medium text-white/80 flex items-center gap-2" aria-hidden="true">
                    <Sparkles className="w-4 h-4 text-accent" />
                    Previewing Humanizer AI
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* AFTER HERO */}
        {step >= 1 && (
           <div className="max-w-5xl mx-auto space-y-12 mb-24">
             {/* Preview */}
             {step < 4 && (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex items-center justify-between">
                 <h3 className="text-2xl font-bold flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-primary" />
                    Initial Preview
                 </h3>
                 <button onClick={handleRewriteAgain} disabled={isLoading || isRefining} className="text-sm font-semibold flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <RefreshCw className="w-4 h-4" />
                    Regenerate
                 </button>
               </div>
               
               <div className="grid md:grid-cols-2 gap-6">
                 <div className="bg-[#fffdf0] border border-[#e8e0c0] p-6 rounded-2xl shadow-sm">
                   <div className="text-xs font-bold text-[#92835a] uppercase tracking-wider mb-3">Original Text</div>
                   <p className="text-foreground leading-relaxed text-base">{text}</p>
                 </div>
                 <div className="bg-[#f0faf5] border border-[#b8e0cc] p-6 rounded-2xl shadow-sm relative overflow-hidden">
                   <div className="flex items-center justify-between mb-3">
                     <div className="text-xs font-bold text-primary uppercase tracking-wider">Humanized Preview</div>
                     <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Balanced tone</span>
                   </div>
                   <p className="text-foreground leading-relaxed text-base pb-10 whitespace-pre-wrap break-words">
                     {diffParts.map((part, i) => (
                       <React.Fragment key={i}>
                         {part.highlight ? (
                           <mark className="bg-accent/30 text-foreground rounded-sm px-1 font-medium transition-colors">{part.text}</mark>
                         ) : (
                           <span>{part.text}</span>
                         )}
                         {i < diffParts.length - 1 && ' '}
                       </React.Fragment>
                     ))}
                   </p>
                   <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#f0faf5] to-transparent pointer-events-none" />
                 </div>
               </div>

               {/* Prompt for questions */}
               {step >= 1 && step < 4 && (
                 <div className="bg-muted/40 border border-border rounded-2xl p-6 text-center mt-8">
                    <h4 className="font-semibold text-lg mb-2">Want a better version?</h4>
                    <p className="text-muted-foreground text-sm">Answer 3 quick questions so Grammarly can match the rewrite to your goal.</p>
                 </div>
               )}
             </div>
             )}

             {/* Personalization steps */}
             {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Question 1 of 3</p>
                  <h4 className="text-3xl font-semibold mb-6">Where will you use this?</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                     {[
                       { id: 'Academic writing', title: 'Academic writing', desc: 'Essays and research' },
                       { id: 'Work email', title: 'Work email', desc: 'Professional communication' },
                       { id: 'Social post', title: 'Social post', desc: 'Engaging and public' },
                       { id: 'Job application', title: 'Job application', desc: 'Cover letters and resumes' },
                       { id: 'Other', title: 'Other', desc: 'General use' }
                     ].map(opt => (
                        <button
                           key={opt.id}
                           onClick={() => handleAnswer(1, 'useCase', opt.id)}
                           className="text-left p-5 rounded-2xl border-2 border-transparent bg-muted/50 hover:bg-muted hover:border-primary/30 transition-all cursor-pointer group"
                        >
                           <div className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{opt.title}</div>
                           <div className="text-sm text-muted-foreground mt-1">{opt.desc}</div>
                        </button>
                     ))}
                  </div>
                </div>
             )}

             {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm font-semibold inline-block mb-4">
                     ✓ Use case selected: {answers.useCase}
                  </div>
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Question 2 of 3</p>
                  <h4 className="text-3xl font-semibold mb-6">What tone do you want?</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     {[
                       { id: 'Clear', title: 'Clear', desc: 'Direct and easy to read' },
                       { id: 'Confident', title: 'Confident', desc: 'Assertive and professional' },
                       { id: 'Friendly', title: 'Friendly', desc: 'Warm and approachable' },
                       { id: 'Professional', title: 'Professional', desc: 'Polished and respectful' },
                     ].map(opt => (
                        <button
                           key={opt.id}
                           onClick={() => handleAnswer(2, 'tone', opt.id)}
                           className="text-left p-5 rounded-2xl border-2 border-transparent bg-muted/50 hover:bg-muted hover:border-primary/30 transition-all cursor-pointer group"
                        >
                           <div className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{opt.title}</div>
                           <div className="text-sm text-muted-foreground mt-1">{opt.desc}</div>
                        </button>
                     ))}
                  </div>
                </div>
             )}

             {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex gap-2 mb-4 flex-wrap">
                     <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-sm font-semibold">✓ {answers.useCase}</div>
                     <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-sm font-semibold">✓ Tone updated: more {answers.tone?.toLowerCase()} and natural.</div>
                  </div>
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Question 3 of 3</p>
                  <h4 className="text-3xl font-semibold mb-6">How strong should the rewrite be?</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                     {[
                       { id: 'Light polish', title: 'Light polish', desc: 'Fix errors, keep exact style' },
                       { id: 'Balanced', title: 'Balanced', desc: 'Improve flow, preserve meaning' },
                       { id: 'Strong humanization', title: 'Strong humanization', desc: 'Maximum clarity and naturalness' },
                     ].map(opt => (
                        <button
                           key={opt.id}
                           onClick={() => handleAnswer(3, 'strength', opt.id)}
                           disabled={isRefining}
                           className="text-left p-5 rounded-2xl border-2 border-transparent bg-muted/50 hover:bg-muted hover:border-primary/30 transition-all cursor-pointer group disabled:opacity-50"
                        >
                           <div className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{opt.title}</div>
                           <div className="text-sm text-muted-foreground mt-1">{opt.desc}</div>
                        </button>
                     ))}
                  </div>
                  {isRefining && (
                     <div className="flex items-center justify-center p-8 bg-muted/20 rounded-2xl border border-border mt-6">
                        <div className="flex items-center gap-3">
                           <span className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                           <span className="font-medium text-foreground">Applying your preferences to generate the final version...</span>
                        </div>
                     </div>
                  )}
                </div>
             )}

             {/* STEP 4: Final Output & Profile Card */}
             {step === 4 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12">
                   <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#f0faf5] text-primary mb-6 shadow-sm border border-[#b8e0cc]">
                         <Sparkles className="w-8 h-8" />
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold mb-4">Your personalized humanized version is ready</h2>
                   </div>

                   <div className="grid lg:grid-cols-2 gap-8 items-start">
                      {/* Left: Locked final output */}
                      <div className="relative bg-white border border-[#b8e0cc] p-8 rounded-3xl overflow-hidden shadow-lg shadow-[#b8e0cc]/20">
                        <div className="flex items-center justify-between mb-6">
                          <div className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                            <Sparkles className="w-5 h-5" />
                            Final Result
                          </div>
                        </div>
                        
                        <div className="relative">
                          <p className="text-foreground leading-relaxed text-base whitespace-pre-wrap break-words min-h-[80px]">
                            {editableSuggestion.split(' ').slice(0, 15).join(' ')}
                            <span className="blur-[5px] opacity-50 select-none pointer-events-none">
                              {editableSuggestion.split(' ').length > 15
                                ? ' ' + editableSuggestion.split(' ').slice(15).join(' ')
                                : ' and the rest of your personalized rewrite continues here with your preferred tone and style applied throughout the full text.'}
                            </span>
                          </p>
                          
                          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent flex flex-col items-center justify-end pb-2">
                            <button className="bg-white border border-border text-foreground px-6 py-3 rounded-xl font-bold shadow-sm flex items-center gap-2 opacity-80 cursor-not-allowed">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                              Copy Locked
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Right: Personal writing profile card */}
                      <div className="bg-white border border-border p-8 rounded-3xl shadow-2xl shadow-primary/10 flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                           <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Your writing profile</h3>
                        <p className="text-muted-foreground text-sm mb-6">Based on your choices, Grammarly can save a personal writing profile.</p>
                        
                        <div className="w-full bg-muted/40 rounded-2xl p-5 text-left space-y-4 mb-8 border border-border/50">
                          <div className="flex justify-between items-center border-b border-border/60 pb-3">
                            <span className="text-sm font-medium text-muted-foreground">Use case:</span>
                            <span className="text-base font-bold capitalize text-foreground">{answers.useCase || 'General'}</span>
                          </div>
                          <div className="flex justify-between items-center border-b border-border/60 pb-3">
                            <span className="text-sm font-medium text-muted-foreground">Tone:</span>
                            <span className="text-base font-bold capitalize text-foreground">{answers.tone || 'Balanced'}</span>
                          </div>
                          <div className="flex justify-between items-center border-b border-border/60 pb-3">
                            <span className="text-sm font-medium text-muted-foreground">Rewrite strength:</span>
                            <span className="text-base font-bold capitalize text-foreground">{answers.strength || 'Balanced'}</span>
                          </div>
                          <div className="flex justify-between items-center pt-1">
                            <span className="text-sm font-medium text-muted-foreground">Goal:</span>
                            <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                               Natural, clear, {answers.tone?.toLowerCase() || 'professional'}
                            </span>
                          </div>
                        </div>

                        <a
                          href="https://www.grammarly.com/signup"
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => trackEvent('signup_cta_clicked')}
                          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-accent text-accent-foreground font-bold text-lg transition-all hover:bg-[#c96905] hover:shadow-xl hover:shadow-accent/20 hover:-translate-y-1"
                        >
                          Create free account to copy full rewrite & save my profile
                        </a>
                        <p className="text-xs text-muted-foreground mt-4 font-medium leading-relaxed">
                          No credit card required. Next time, Grammarly can instantly humanize text in your preferred tone: no need to answer the same questions again.
                        </p>
                      </div>
                   </div>
                </div>
             )}
           </div>
        )}

        <section className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 mb-24 px-4 md:px-10">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.title} className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-primary mb-2">
                  <Icon className="h-5 w-5" />
                  <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                </div>
                <p className="text-base text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </section>

        <section className="mb-20">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 border border-border px-4 py-1 rounded-full text-sm font-medium bg-card">
              <Sparkles className="h-4 w-4 text-accent" />
              Testimonials
            </div>
            <h2 className="text-3xl font-semibold mt-4 text-foreground">
              What users say after the preview
            </h2>
          </div>
          <div className="flex justify-center gap-6 overflow-hidden max-h-[520px] [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
            <TestimonialsColumn testimonials={testimonials.slice(0, 3)} duration={20} />
            <TestimonialsColumn testimonials={testimonials.slice(3, 6)} duration={25} className="hidden md:block" />
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-primary text-primary-foreground px-10 py-12 text-center">
          <h2 className="text-3xl font-semibold mb-3">Turn drafts into human writing faster</h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-6">
            Preview a rewrite, personalize tone, and save your voice profile for future edits.
          </p>
          <a
            href="https://www.grammarly.com/signup"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-accent text-accent-foreground font-semibold hover:bg-[#c96905] transition-colors"
          >
            Get Grammarly Free
            <ArrowRight className="h-4 w-4" />
          </a>
        </section>
      </main>
    </div>
  )
}
