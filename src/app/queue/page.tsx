"use client";
import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import { useIsMobile } from "@/hooks/useIsMobile";
import PostPreviewModal from "@/components/modals/PostPreviewModal";
import { useFakeLoading } from "@/hooks/useFakeLoading";
import { SkeletonLine, SkeletonTable } from "@/components/Skeleton";

interface QueuePost {
  id: string;
  thumbnail: string;
  caption: string;
  page: { name: string; avatar: string; color: string };
  platforms: ("fb" | "ig" | "th")[];
  scheduledAt: string;
  scheduledDate: string;
  type: "photo" | "reel" | "text";
  status: "scheduled" | "publishing" | "failed" | "draft";
  comments: string[];
}

const HU = { name: "History Uncovered", avatar: "HU", color: "#FF6B2B" };
const LC = { name: "Laugh Central",     avatar: "LC", color: "#8B5CF6" };
const DH = { name: "Daily Health Tips", avatar: "DH", color: "#6366F1" };
const TB = { name: "TechByte",          avatar: "TB", color: "#14B8A6" };
const FF = { name: "Fitness Factory",   avatar: "FF", color: "#EC4899" };
const MM = { name: "Money Matters",     avatar: "MM", color: "#F59E0B" };
const KH = { name: "Know Her Name",     avatar: "KH", color: "#0EA5E9" };

const MOCK_QUEUE: QueuePost[] = [
  // ─────────────── MAR 27 — TODAY (5 per page = 35 posts) ───────────────
  // History Uncovered
  { id: "q101", thumbnail: "", caption: "The forgotten queen who ruled an empire for 40 years — yet history barely remembers her name", page: HU, platforms: ["fb","ig"], scheduledAt: "Today, 6:00 AM", scheduledDate: "Mar 27, 2026", type: "photo", status: "scheduled", comments: ["Born in 1402 in a small village in Anatolia...", "By age 20 she had already commanded three armies", "Her name was erased from official records after her death"] },
  { id: "q102", thumbnail: "", caption: "The Roman Empire didn't fall — it transformed. Here's the real story historians argue about", page: HU, platforms: ["fb"], scheduledAt: "Today, 9:00 AM", scheduledDate: "Mar 27, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q103", thumbnail: "", caption: "This 3,000-year-old map was accurate to within 50 miles. Ancient cartography was extraordinary", page: HU, platforms: ["fb","ig"], scheduledAt: "Today, 12:30 PM", scheduledDate: "Mar 27, 2026", type: "reel", status: "scheduled", comments: ["The Babylonian World Map (700 BC) shows Babylon at the center...", "It correctly identifies the Euphrates, major cities, and surrounding oceans"] },
  { id: "q104", thumbnail: "", caption: "Why the Library of Alexandria wasn't destroyed in a single fire — the real collapse took 600 years", page: HU, platforms: ["fb","ig"], scheduledAt: "Today, 4:00 PM", scheduledDate: "Mar 27, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q105", thumbnail: "", caption: "Genghis Khan's postal system connected 25% of the world's land. It worked faster than email", page: HU, platforms: ["fb"], scheduledAt: "Today, 7:30 PM", scheduledDate: "Mar 27, 2026", type: "photo", status: "scheduled", comments: ["The Yam system had relay stations every 25 miles across the Mongol Empire", "Riders could cover 200 miles per day — messages reached from China to Poland in weeks"] },
  { id: "q105b", thumbnail: "", caption: "The real reason Julius Caesar was assassinated — it wasn't just about power", page: HU, platforms: ["fb","ig"], scheduledAt: "Today, 5:00 PM", scheduledDate: "Mar 27, 2026", type: "reel", status: "scheduled", comments: [] },
  { id: "q105c", thumbnail: "", caption: "How the Aztec Empire built one of the world's most sophisticated water systems in 1400 AD", page: HU, platforms: ["fb"], scheduledAt: "Today, 8:00 PM", scheduledDate: "Mar 27, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q105d", thumbnail: "", caption: "The Black Death accidentally created the middle class — the economics of the plague explained", page: HU, platforms: ["fb","ig","th"], scheduledAt: "Today, 9:30 PM", scheduledDate: "Mar 27, 2026", type: "photo", status: "scheduled", comments: [] },

  // ── CONFLICT: Two LC posts at same time ──
  { id: "q_conflict1", thumbnail: "", caption: "POV: You stay up until 2am watching 'just one more episode'", page: LC, platforms: ["fb","ig","th"], scheduledAt: "Today, 3:30 PM", scheduledDate: "Mar 27, 2026", type: "reel", status: "scheduled", comments: [] },
  { id: "q_conflict2", thumbnail: "", caption: "The face you make when someone says 'can I ask you something' and then takes 10 minutes to ask it", page: LC, platforms: ["fb","ig"], scheduledAt: "Today, 3:30 PM", scheduledDate: "Mar 27, 2026", type: "photo", status: "scheduled", comments: [] },

  // Laugh Central
  { id: "q106", thumbnail: "", caption: "Monday morning energy hits different when you've had 3 coffees and no sleep", page: LC, platforms: ["fb","ig","th"], scheduledAt: "Today, 6:30 AM", scheduledDate: "Mar 27, 2026", type: "reel", status: "scheduled", comments: [] },
  { id: "q107", thumbnail: "", caption: "When your code works on the first try and you genuinely don't trust it", page: LC, platforms: ["fb","ig","th"], scheduledAt: "Today, 9:30 AM", scheduledDate: "Mar 27, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q108", thumbnail: "", caption: "POV: You're explaining to your parents why you can't just 'turn off' your anxiety", page: LC, platforms: ["fb","ig"], scheduledAt: "Today, 12:00 PM", scheduledDate: "Mar 27, 2026", type: "reel", status: "scheduled", comments: [] },
  { id: "q109", thumbnail: "", caption: "The audacity of being asked to do something at 4:59 PM on a Friday", page: LC, platforms: ["fb","ig","th"], scheduledAt: "Today, 3:30 PM", scheduledDate: "Mar 27, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q110", thumbnail: "", caption: "My WiFi password is stronger than most of my life decisions", page: LC, platforms: ["fb","ig","th"], scheduledAt: "Today, 7:00 PM", scheduledDate: "Mar 27, 2026", type: "photo", status: "scheduled", comments: [] },

  // Daily Health Tips
  { id: "q111", thumbnail: "", caption: "10-minute morning routine backed by neuroscience — your brain will thank you", page: DH, platforms: ["fb"], scheduledAt: "Today, 7:00 AM", scheduledDate: "Mar 27, 2026", type: "photo", status: "scheduled", comments: ["Step 1: 2 min cold water on face to spike cortisol naturally", "Step 2: 5 min sunlight exposure to set circadian rhythm", "Step 3: 3 min journaling — write 3 things you want to accomplish"] },
  { id: "q112", thumbnail: "", caption: "3 signs your body is telling you to drink more water — most people ignore #2", page: DH, platforms: ["fb"], scheduledAt: "Today, 10:00 AM", scheduledDate: "Mar 27, 2026", type: "photo", status: "scheduled", comments: ["Sign 1: Dark yellow urine — you're already dehydrated", "Sign 2: Persistent headaches with no obvious cause", "Sign 3: Dry skin that doesn't respond to moisturizer"] },
  { id: "q113", thumbnail: "", caption: "Sleep debt is real. 1 week of poor sleep = same cognitive decline as staying awake 24hrs straight", page: DH, platforms: ["fb"], scheduledAt: "Today, 1:00 PM", scheduledDate: "Mar 27, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q114", thumbnail: "", caption: "The productivity hack nobody wants to hear: stop multitasking entirely. Here's why it's destroying you", page: DH, platforms: ["fb"], scheduledAt: "Today, 4:30 PM", scheduledDate: "Mar 27, 2026", type: "reel", status: "scheduled", comments: [] },
  { id: "q115", thumbnail: "", caption: "Your gut bacteria affect your mood more than your brain does. The gut-brain connection explained", page: DH, platforms: ["fb"], scheduledAt: "Today, 8:00 PM", scheduledDate: "Mar 27, 2026", type: "photo", status: "scheduled", comments: [] },

  // TechByte
  { id: "q116", thumbnail: "", caption: "Apple just leaked their next chip — and it's not what anyone expected", page: TB, platforms: ["fb","ig","th"], scheduledAt: "Today, 7:30 AM", scheduledDate: "Mar 27, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q117", thumbnail: "", caption: "GPT-5 is here — honest breakdown of what actually changed vs GPT-4", page: TB, platforms: ["fb","ig"], scheduledAt: "Today, 10:30 AM", scheduledDate: "Mar 27, 2026", type: "photo", status: "scheduled", comments: ["Context: 256k tokens vs 128k (+100%)", "Reasoning: 34% better on MATH benchmark", "Speed: 2.1x faster on standard tasks"] },
  { id: "q118", thumbnail: "", caption: "This free tool replaces 5 paid apps — and nobody talks about it", page: TB, platforms: ["fb","ig"], scheduledAt: "Today, 1:30 PM", scheduledDate: "Mar 27, 2026", type: "reel", status: "scheduled", comments: ["App 1: Notion replaces Trello + Docs ($30/mo saved)", "App 2: Figma replaces Sketch + InVision ($50/mo)"] },
  { id: "q119", thumbnail: "", caption: "ChatGPT is not replacing programmers — it's replacing bad programmers", page: TB, platforms: ["fb","ig","th"], scheduledAt: "Today, 4:00 PM", scheduledDate: "Mar 27, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q120", thumbnail: "", caption: "Vision Pro 2 leaks: lighter, standalone, and half the price. Everything we know", page: TB, platforms: ["fb","ig"], scheduledAt: "Today, 7:00 PM", scheduledDate: "Mar 27, 2026", type: "reel", status: "scheduled", comments: ["Leak 1: 200g vs current 600g (66% lighter)", "Leak 2: Full standalone mode — no Mac required", "Leak 3: Target price $1,999 vs $3,499"] },

  // Fitness Factory
  { id: "q121", thumbnail: "", caption: "5 exercises you're doing wrong — the simple fixes that double your results", page: FF, platforms: ["fb","ig"], scheduledAt: "Today, 8:00 AM", scheduledDate: "Mar 27, 2026", type: "reel", status: "scheduled", comments: ["Fix 1: Squats — knees caving inward. Drive them OUT over your pinky toe", "Fix 2: Deadlift — not engaging lats. Tuck your armpits before pulling"] },
  { id: "q122", thumbnail: "", caption: "The only 3 supplements actually backed by peer-reviewed science. Everything else is marketing", page: FF, platforms: ["fb","ig"], scheduledAt: "Today, 11:00 AM", scheduledDate: "Mar 27, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q123", thumbnail: "", caption: "The gym at 5am vs 5pm — which one actually gets better results? Science has an answer", page: FF, platforms: ["fb"], scheduledAt: "Today, 2:00 PM", scheduledDate: "Mar 27, 2026", type: "reel", status: "scheduled", comments: ["Morning: cortisol is highest — good for fat burning", "Evening: body temperature peaks — strength is optimal 3-6pm"] },
  { id: "q124", thumbnail: "", caption: "The protein myth: you don't need 1g per pound of bodyweight. Here's what the research actually says", page: FF, platforms: ["fb","ig"], scheduledAt: "Today, 5:00 PM", scheduledDate: "Mar 27, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q125", thumbnail: "", caption: "I tried waking up at 4:30am for 30 days. Here's exactly what happened (honest review)", page: FF, platforms: ["fb","ig"], scheduledAt: "Today, 8:30 PM", scheduledDate: "Mar 27, 2026", type: "reel", status: "scheduled", comments: [] },

  // Money Matters — token expired, NO posts on Mar 27 (shows red in heatmap)
  // (intentionally empty for Mar 27 to demonstrate disconnected page state)

  // Know Her Name — new small page, only 2 posts/day (shows yellow in heatmap)
  { id: "q131", thumbnail: "", caption: "Elizabeth Cady Stanton organized the first women's rights convention in 1848. Most people can't name her", page: KH, platforms: ["fb","ig","th"], scheduledAt: "Today, 9:00 AM", scheduledDate: "Mar 27, 2026", type: "photo", status: "scheduled", comments: ["She organized Seneca Falls Convention at age 33", "Drafted the Declaration of Sentiments modeled on the Declaration of Independence", "Fought for suffrage for 50 years — died 18 years before women could vote"] },
  { id: "q132", thumbnail: "", caption: "Marie Curie was told women couldn't be scientists. She won two Nobel Prizes anyway", page: KH, platforms: ["fb","ig","th"], scheduledAt: "Today, 3:00 PM", scheduledDate: "Mar 27, 2026", type: "photo", status: "scheduled", comments: [] },

  // ─────────────── MAR 28 — TOMORROW (5 per page = 35 posts) ───────────────
  // History Uncovered
  { id: "q201", thumbnail: "", caption: "This 3,000-year-old artifact was found in a farmer's backyard. It rewrites what we know about trade routes", page: HU, platforms: ["fb","ig"], scheduledAt: "Tomorrow, 6:00 AM", scheduledDate: "Mar 28, 2026", type: "photo", status: "scheduled", comments: ["A bronze seal from the Hittite empire — found in rural Turkey in 2019", "Proves direct trade between Anatolia and Egypt 300 years earlier than believed"] },
  { id: "q202", thumbnail: "", caption: "Alexander the Great's battle strategy at Gaugamela. No modern army has successfully replicated it", page: HU, platforms: ["fb","ig"], scheduledAt: "Tomorrow, 9:30 AM", scheduledDate: "Mar 28, 2026", type: "reel", status: "scheduled", comments: ["The oblique order: concentrate force on enemy's strongest flank", "While his left held, Alexander led Companion Cavalry through the gap personally"] },
  { id: "q203", thumbnail: "", caption: "The Silk Road wasn't one road. It was 40+ interconnected routes spanning 3 continents", page: HU, platforms: ["fb"], scheduledAt: "Tomorrow, 1:00 PM", scheduledDate: "Mar 28, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q204", thumbnail: "", caption: "Cleopatra was not Egyptian. She was Greek — the last in a dynasty that never bothered to learn the local language", page: HU, platforms: ["fb","ig"], scheduledAt: "Tomorrow, 4:30 PM", scheduledDate: "Mar 28, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q205", thumbnail: "", caption: "The real reason the Ottoman Empire lasted 600 years — and what finally brought it down", page: HU, platforms: ["fb"], scheduledAt: "Tomorrow, 7:30 PM", scheduledDate: "Mar 28, 2026", type: "photo", status: "scheduled", comments: [] },

  // Laugh Central
  { id: "q206", thumbnail: "", caption: "POV: You mass-typo in a work email and hit send before noticing", page: LC, platforms: ["fb","ig","th"], scheduledAt: "Tomorrow, 6:30 AM", scheduledDate: "Mar 28, 2026", type: "reel", status: "scheduled", comments: [] },
  { id: "q207", thumbnail: "", caption: "When you're 5 minutes into a 'quick' meeting that could have been an email", page: LC, platforms: ["fb","ig","th"], scheduledAt: "Tomorrow, 10:00 AM", scheduledDate: "Mar 28, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q208", thumbnail: "", caption: "The audacity of recruiters sliding into your DMs with 'exciting opportunity' at 3x lower salary", page: LC, platforms: ["fb","ig"], scheduledAt: "Tomorrow, 1:00 PM", scheduledDate: "Mar 28, 2026", type: "reel", status: "scheduled", comments: [] },
  { id: "q209", thumbnail: "", caption: "POV: Your manager says this should only take 5 minutes and it's been 3 weeks", page: LC, platforms: ["fb","ig","th"], scheduledAt: "Tomorrow, 4:00 PM", scheduledDate: "Mar 28, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q210", thumbnail: "", caption: "Nobody: ... Me at 2am: I should learn to play guitar", page: LC, platforms: ["fb","ig","th"], scheduledAt: "Tomorrow, 7:00 PM", scheduledDate: "Mar 28, 2026", type: "photo", status: "scheduled", comments: [] },

  // Daily Health Tips
  { id: "q211", thumbnail: "", caption: "Why you're always tired even after 8 hours of sleep — the hidden culprits", page: DH, platforms: ["fb"], scheduledAt: "Tomorrow, 7:00 AM", scheduledDate: "Mar 28, 2026", type: "photo", status: "scheduled", comments: ["Culprit 1: Blue light suppresses melatonin for 3+ hours", "Culprit 2: Alcohol fragments REM sleep even in small amounts", "Culprit 3: Eating within 2hrs of bed raises core temperature"] },
  { id: "q212", thumbnail: "", caption: "What happens to your body in the first 24 hours after quitting sugar — timeline", page: DH, platforms: ["fb"], scheduledAt: "Tomorrow, 10:30 AM", scheduledDate: "Mar 28, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q213", thumbnail: "", caption: "Magnesium deficiency affects 75% of adults. These are the symptoms most people ignore", page: DH, platforms: ["fb"], scheduledAt: "Tomorrow, 1:30 PM", scheduledDate: "Mar 28, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q214", thumbnail: "", caption: "The 4-7-8 breathing method reduces anxiety in under 2 minutes. Here's exactly how to do it", page: DH, platforms: ["fb"], scheduledAt: "Tomorrow, 5:00 PM", scheduledDate: "Mar 28, 2026", type: "reel", status: "scheduled", comments: [] },
  { id: "q215", thumbnail: "", caption: "Walking 8,000 steps beats 10,000 for most health outcomes. Here's what the research says", page: DH, platforms: ["fb"], scheduledAt: "Tomorrow, 8:30 PM", scheduledDate: "Mar 28, 2026", type: "photo", status: "scheduled", comments: [] },

  // TechByte
  { id: "q216", thumbnail: "", caption: "Why every tech company is suddenly obsessed with 'agents' — what they actually are", page: TB, platforms: ["fb","ig"], scheduledAt: "Tomorrow, 7:30 AM", scheduledDate: "Mar 28, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q217", thumbnail: "", caption: "The browser tab you've had open for 6 months is slowing down your entire computer. Here's why", page: TB, platforms: ["fb","ig","th"], scheduledAt: "Tomorrow, 11:00 AM", scheduledDate: "Mar 28, 2026", type: "reel", status: "scheduled", comments: [] },
  { id: "q218", thumbnail: "", caption: "Figma just killed Adobe XD. Here's what that means for designers in 2026", page: TB, platforms: ["fb","ig"], scheduledAt: "Tomorrow, 2:00 PM", scheduledDate: "Mar 28, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q219", thumbnail: "", caption: "Linux is finally ready for mainstream users — and Windows users are noticing", page: TB, platforms: ["fb","ig"], scheduledAt: "Tomorrow, 5:30 PM", scheduledDate: "Mar 28, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q220", thumbnail: "", caption: "The dark pattern your favorite app uses to stop you from cancelling — and how to beat it", page: TB, platforms: ["fb","ig","th"], scheduledAt: "Tomorrow, 8:00 PM", scheduledDate: "Mar 28, 2026", type: "reel", status: "scheduled", comments: [] },

  // Fitness Factory
  { id: "q221", thumbnail: "", caption: "The real reason you're not losing weight despite working out 5 days a week", page: FF, platforms: ["fb","ig"], scheduledAt: "Tomorrow, 8:00 AM", scheduledDate: "Mar 28, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q222", thumbnail: "", caption: "Cold plunge vs sauna: which one actually works for recovery? The science is clear", page: FF, platforms: ["fb","ig"], scheduledAt: "Tomorrow, 11:30 AM", scheduledDate: "Mar 28, 2026", type: "reel", status: "scheduled", comments: [] },
  { id: "q223", thumbnail: "", caption: "You don't need a gym to build muscle. This 20-minute home workout proves it", page: FF, platforms: ["fb"], scheduledAt: "Tomorrow, 2:30 PM", scheduledDate: "Mar 28, 2026", type: "reel", status: "scheduled", comments: [] },
  { id: "q224", thumbnail: "", caption: "Progressive overload: the one principle that separates people who transform vs people who maintain", page: FF, platforms: ["fb","ig"], scheduledAt: "Tomorrow, 5:00 PM", scheduledDate: "Mar 28, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q225", thumbnail: "", caption: "What happens to your body if you stop working out for 2 weeks — week-by-week breakdown", page: FF, platforms: ["fb","ig"], scheduledAt: "Tomorrow, 8:00 PM", scheduledDate: "Mar 28, 2026", type: "photo", status: "scheduled", comments: [] },

  // Money Matters
  { id: "q226", thumbnail: "", caption: "The hidden fees eating your investment returns — most people have no idea they're paying this", page: MM, platforms: ["fb","ig"], scheduledAt: "Tomorrow, 8:30 AM", scheduledDate: "Mar 28, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q227", thumbnail: "", caption: "Why renting is not 'throwing money away' — the actual math might surprise you", page: MM, platforms: ["fb","ig"], scheduledAt: "Tomorrow, 12:00 PM", scheduledDate: "Mar 28, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q228", thumbnail: "", caption: "The 1% rule for real estate investing — how to quickly screen any rental property", page: MM, platforms: ["fb","ig"], scheduledAt: "Tomorrow, 3:00 PM", scheduledDate: "Mar 28, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q229", thumbnail: "", caption: "Credit score myths debunked: what actually moves your number up or down", page: MM, platforms: ["fb","ig"], scheduledAt: "Tomorrow, 6:00 PM", scheduledDate: "Mar 28, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q230", thumbnail: "", caption: "Your emergency fund is losing value every year. Here's where to actually keep it", page: MM, platforms: ["fb","ig"], scheduledAt: "Tomorrow, 8:30 PM", scheduledDate: "Mar 28, 2026", type: "photo", status: "scheduled", comments: [] },

  // Know Her Name
  { id: "q231", thumbnail: "", caption: "Ada Lovelace wrote the first computer program in 1843 — for a machine that didn't exist yet", page: KH, platforms: ["fb","ig","th"], scheduledAt: "Tomorrow, 9:00 AM", scheduledDate: "Mar 28, 2026", type: "photo", status: "scheduled", comments: ["Charles Babbage got the credit but Lovelace wrote the algorithm", "Her notes were more insightful than Babbage's own work on the Analytical Engine"] },
  { id: "q232", thumbnail: "", caption: "Harriet Tubman made 13 missions and freed 70 people. She never lost a single passenger", page: KH, platforms: ["fb","ig","th"], scheduledAt: "Tomorrow, 3:00 PM", scheduledDate: "Mar 28, 2026", type: "photo", status: "scheduled", comments: [] },

  // ─────────────── MAR 29 (5 per page = 35 posts) ───────────────
  // History Uncovered
  { id: "q301", thumbnail: "", caption: "The Black Death killed 60% of Europe's population — and accidentally triggered the Renaissance", page: HU, platforms: ["fb","ig"], scheduledAt: "Mar 29, 6:00 AM", scheduledDate: "Mar 29, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q302", thumbnail: "", caption: "Napoleon was 5'7\" — taller than average for his time. The 'short Napoleon' myth was British propaganda", page: HU, platforms: ["fb","ig","th"], scheduledAt: "Mar 29, 9:30 AM", scheduledDate: "Mar 29, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q303", thumbnail: "", caption: "The Viking Age ended not because of defeat — but because of climate change. The history is wild", page: HU, platforms: ["fb"], scheduledAt: "Mar 29, 1:00 PM", scheduledDate: "Mar 29, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q304", thumbnail: "", caption: "Ancient Rome had a welfare system, free healthcare, and universal basic income. Sound familiar?", page: HU, platforms: ["fb","ig"], scheduledAt: "Mar 29, 4:30 PM", scheduledDate: "Mar 29, 2026", type: "reel", status: "scheduled", comments: [] },
  { id: "q305", thumbnail: "", caption: "The Mongol Empire had the world's first international free trade zone. Merchants crossed borders without taxes", page: HU, platforms: ["fb"], scheduledAt: "Mar 29, 7:30 PM", scheduledDate: "Mar 29, 2026", type: "photo", status: "scheduled", comments: [] },

  // Laugh Central
  { id: "q306", thumbnail: "", caption: "That feeling when you open the fridge for the 4th time hoping something new appeared", page: LC, platforms: ["fb","ig","th"], scheduledAt: "Mar 29, 6:30 AM", scheduledDate: "Mar 29, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q307", thumbnail: "", caption: "POV: Someone asks 'are you busy?' before explaining the 3-hour task they need done today", page: LC, platforms: ["fb","ig","th"], scheduledAt: "Mar 29, 10:00 AM", scheduledDate: "Mar 29, 2026", type: "reel", status: "scheduled", comments: [] },
  { id: "q308", thumbnail: "", caption: "When you're 5 minutes into a workout and you've already mentally quit", page: LC, platforms: ["fb","ig"], scheduledAt: "Mar 29, 1:00 PM", scheduledDate: "Mar 29, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q309", thumbnail: "", caption: "The way people say 'we should catch up soon' knowing fully well it's never happening", page: LC, platforms: ["fb","ig","th"], scheduledAt: "Mar 29, 3:30 PM", scheduledDate: "Mar 29, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q310", thumbnail: "", caption: "When autocorrect changes a perfectly normal word and you send it before reading", page: LC, platforms: ["fb","ig","th"], scheduledAt: "Mar 29, 7:00 PM", scheduledDate: "Mar 29, 2026", type: "reel", status: "scheduled", comments: [] },

  // Daily Health Tips
  { id: "q311", thumbnail: "", caption: "Why you get hungrier on days you don't sleep well — the cortisol-ghrelin connection", page: DH, platforms: ["fb"], scheduledAt: "Mar 29, 7:00 AM", scheduledDate: "Mar 29, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q312", thumbnail: "", caption: "How long it actually takes to form a habit — it's not 21 days (science says something different)", page: DH, platforms: ["fb"], scheduledAt: "Mar 29, 10:30 AM", scheduledDate: "Mar 29, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q313", thumbnail: "", caption: "Sitting for 8 hours a day increases cardiovascular risk by 64% — here's what you can do about it", page: DH, platforms: ["fb"], scheduledAt: "Mar 29, 2:00 PM", scheduledDate: "Mar 29, 2026", type: "reel", status: "scheduled", comments: [] },
  { id: "q314", thumbnail: "", caption: "The ideal nap length for energy and memory — 10, 20, or 90 minutes? Science breaks it down", page: DH, platforms: ["fb"], scheduledAt: "Mar 29, 5:30 PM", scheduledDate: "Mar 29, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q315", thumbnail: "", caption: "Inflammation is the root cause of most chronic disease. These 7 foods fight it daily", page: DH, platforms: ["fb"], scheduledAt: "Mar 29, 8:30 PM", scheduledDate: "Mar 29, 2026", type: "photo", status: "scheduled", comments: [] },

  // TechByte
  { id: "q316", thumbnail: "", caption: "Why your phone battery degrades faster in summer — and how to slow it down", page: TB, platforms: ["fb","ig"], scheduledAt: "Mar 29, 7:30 AM", scheduledDate: "Mar 29, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q317", thumbnail: "", caption: "The difference between Wi-Fi 6 and Wi-Fi 7 — explained without the jargon", page: TB, platforms: ["fb","ig","th"], scheduledAt: "Mar 29, 11:00 AM", scheduledDate: "Mar 29, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q318", thumbnail: "", caption: "How to identify an AI-generated image in under 10 seconds — 5 dead giveaways", page: TB, platforms: ["fb","ig"], scheduledAt: "Mar 29, 2:30 PM", scheduledDate: "Mar 29, 2026", type: "reel", status: "scheduled", comments: [] },
  { id: "q319", thumbnail: "", caption: "GitHub Copilot vs ChatGPT for coding — which one actually makes you faster?", page: TB, platforms: ["fb","ig"], scheduledAt: "Mar 29, 5:30 PM", scheduledDate: "Mar 29, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q320", thumbnail: "", caption: "The website that was launched in 1991 and is still live today — a piece of internet history", page: TB, platforms: ["fb","ig","th"], scheduledAt: "Mar 29, 8:30 PM", scheduledDate: "Mar 29, 2026", type: "photo", status: "scheduled", comments: [] },

  // Fitness Factory
  { id: "q321", thumbnail: "", caption: "Why cardio before weights is the wrong order — and what to do instead", page: FF, platforms: ["fb","ig"], scheduledAt: "Mar 29, 8:00 AM", scheduledDate: "Mar 29, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q322", thumbnail: "", caption: "The truth about spot reduction — you cannot choose where you lose fat, but here's what you can do", page: FF, platforms: ["fb","ig"], scheduledAt: "Mar 29, 11:30 AM", scheduledDate: "Mar 29, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q323", thumbnail: "", caption: "Zone 2 cardio is having a moment — here's why elite athletes swear by it", page: FF, platforms: ["fb"], scheduledAt: "Mar 29, 2:00 PM", scheduledDate: "Mar 29, 2026", type: "reel", status: "scheduled", comments: [] },
  { id: "q324", thumbnail: "", caption: "How much muscle can you actually gain in a month? (Realistic numbers with sources)", page: FF, platforms: ["fb","ig"], scheduledAt: "Mar 29, 5:30 PM", scheduledDate: "Mar 29, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q325", thumbnail: "", caption: "Pre-workout vs coffee: which one is actually better for performance? The data is clear", page: FF, platforms: ["fb","ig"], scheduledAt: "Mar 29, 8:00 PM", scheduledDate: "Mar 29, 2026", type: "photo", status: "scheduled", comments: [] },

  // Money Matters
  { id: "q326", thumbnail: "", caption: "The compound interest calculator that will change how you think about money forever", page: MM, platforms: ["fb","ig"], scheduledAt: "Mar 29, 8:30 AM", scheduledDate: "Mar 29, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q327", thumbnail: "", caption: "Why most people stay broke even with a high salary — the lifestyle inflation trap", page: MM, platforms: ["fb","ig"], scheduledAt: "Mar 29, 12:00 PM", scheduledDate: "Mar 29, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q328", thumbnail: "", caption: "The 3 accounts you need to open before you're 30 (and it's not a savings account)", page: MM, platforms: ["fb","ig"], scheduledAt: "Mar 29, 3:00 PM", scheduledDate: "Mar 29, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q329", thumbnail: "", caption: "How to negotiate your salary — the exact script that works every time", page: MM, platforms: ["fb","ig"], scheduledAt: "Mar 29, 6:00 PM", scheduledDate: "Mar 29, 2026", type: "reel", status: "scheduled", comments: [] },
  { id: "q330", thumbnail: "", caption: "Inflation explained simply: why your $100 in 2000 is worth $173 today", page: MM, platforms: ["fb","ig"], scheduledAt: "Mar 29, 8:30 PM", scheduledDate: "Mar 29, 2026", type: "photo", status: "scheduled", comments: [] },

  // Know Her Name
  { id: "q331", thumbnail: "", caption: "Simone de Beauvoir wrote 'The Second Sex' in 14 months. It changed feminism forever", page: KH, platforms: ["fb","ig","th"], scheduledAt: "Mar 29, 9:00 AM", scheduledDate: "Mar 29, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q332", thumbnail: "", caption: "Frida Kahlo painted 55 of her 143 works while lying flat in bed recovering from injuries", page: KH, platforms: ["fb","ig","th"], scheduledAt: "Mar 29, 3:00 PM", scheduledDate: "Mar 29, 2026", type: "photo", status: "scheduled", comments: [] },

  // ─────────────── MAR 30 (5 per page = 35 posts) ───────────────
  // History Uncovered
  { id: "q401", thumbnail: "", caption: "The Spanish Flu killed more people than WWI. Most history books dedicate one paragraph to it", page: HU, platforms: ["fb","ig"], scheduledAt: "Mar 30, 6:00 AM", scheduledDate: "Mar 30, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q402", thumbnail: "", caption: "How the printing press caused the Protestant Reformation — technology always disrupts power", page: HU, platforms: ["fb","ig"], scheduledAt: "Mar 30, 9:30 AM", scheduledDate: "Mar 30, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q403", thumbnail: "", caption: "The Byzantine Empire lasted 1,000 years after Rome fell. Most people don't even know it existed", page: HU, platforms: ["fb"], scheduledAt: "Mar 30, 1:00 PM", scheduledDate: "Mar 30, 2026", type: "reel", status: "scheduled", comments: [] },
  { id: "q404", thumbnail: "", caption: "Nikola Tesla predicted smartphones, wireless internet, and video calls — in 1909", page: HU, platforms: ["fb","ig","th"], scheduledAt: "Mar 30, 4:30 PM", scheduledDate: "Mar 30, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q405", thumbnail: "", caption: "The real story of Pompeii: they had running water, fast food restaurants, and traffic laws", page: HU, platforms: ["fb","ig"], scheduledAt: "Mar 30, 7:30 PM", scheduledDate: "Mar 30, 2026", type: "photo", status: "scheduled", comments: [] },

  // Laugh Central
  { id: "q406", thumbnail: "", caption: "That one coworker who replies to a group email with a reply-all just to say 'thanks'", page: LC, platforms: ["fb","ig","th"], scheduledAt: "Mar 30, 6:30 AM", scheduledDate: "Mar 30, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q407", thumbnail: "", caption: "When you tell someone you're going to bed and then spend 2 hours on your phone", page: LC, platforms: ["fb","ig","th"], scheduledAt: "Mar 30, 10:00 AM", scheduledDate: "Mar 30, 2026", type: "reel", status: "scheduled", comments: [] },
  { id: "q408", thumbnail: "", caption: "POV: You're telling a story and someone interrupts with 'actually that's not how it works'", page: LC, platforms: ["fb","ig"], scheduledAt: "Mar 30, 1:00 PM", scheduledDate: "Mar 30, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q409", thumbnail: "", caption: "When you meant to send a voice note and accidentally sent 47 seconds of pure pocket noise", page: LC, platforms: ["fb","ig","th"], scheduledAt: "Mar 30, 4:00 PM", scheduledDate: "Mar 30, 2026", type: "reel", status: "scheduled", comments: [] },
  { id: "q410", thumbnail: "", caption: "The annual tradition of starting a diet on Monday and abandoning it by Wednesday", page: LC, platforms: ["fb","ig","th"], scheduledAt: "Mar 30, 7:00 PM", scheduledDate: "Mar 30, 2026", type: "photo", status: "scheduled", comments: [] },

  // Daily Health Tips
  { id: "q411", thumbnail: "", caption: "Your eyes weren't designed to stare at screens. The 20-20-20 rule can save your vision", page: DH, platforms: ["fb"], scheduledAt: "Mar 30, 7:00 AM", scheduledDate: "Mar 30, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q412", thumbnail: "", caption: "The Mediterranean diet isn't a diet — it's a lifestyle. Here's what people actually eat", page: DH, platforms: ["fb"], scheduledAt: "Mar 30, 10:30 AM", scheduledDate: "Mar 30, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q413", thumbnail: "", caption: "Why you should never skip breakfast — and why intermittent fasting works for some people (not a contradiction)", page: DH, platforms: ["fb"], scheduledAt: "Mar 30, 2:00 PM", scheduledDate: "Mar 30, 2026", type: "reel", status: "scheduled", comments: [] },
  { id: "q414", thumbnail: "", caption: "Sunlight in the morning literally sets your biological clock. Here's how 10 minutes changes your day", page: DH, platforms: ["fb"], scheduledAt: "Mar 30, 5:30 PM", scheduledDate: "Mar 30, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q415", thumbnail: "", caption: "Dehydration at just 2% affects decision-making, memory and mood. Most people live at this level", page: DH, platforms: ["fb"], scheduledAt: "Mar 30, 8:30 PM", scheduledDate: "Mar 30, 2026", type: "photo", status: "scheduled", comments: [] },

  // TechByte
  // TechByte — token expiring, no posts scheduled Mar 30 (shows red gap in heatmap)

  // Fitness Factory
  { id: "q421", thumbnail: "", caption: "Rest days are not optional — here's what your body actually does when you take one", page: FF, platforms: ["fb","ig"], scheduledAt: "Mar 30, 8:00 AM", scheduledDate: "Mar 30, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q422", thumbnail: "", caption: "The best time to eat protein for maximum muscle synthesis — morning vs post-workout vs before bed", page: FF, platforms: ["fb","ig"], scheduledAt: "Mar 30, 11:30 AM", scheduledDate: "Mar 30, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q423", thumbnail: "", caption: "Stretching before a workout is actually counterproductive. Here's what to do instead", page: FF, platforms: ["fb"], scheduledAt: "Mar 30, 2:30 PM", scheduledDate: "Mar 30, 2026", type: "reel", status: "scheduled", comments: [] },
  { id: "q424", thumbnail: "", caption: "How many calories do you actually burn in a 45-minute workout? The numbers will surprise you", page: FF, platforms: ["fb","ig"], scheduledAt: "Mar 30, 5:30 PM", scheduledDate: "Mar 30, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q425", thumbnail: "", caption: "The 3 muscle groups most people completely neglect — and why they're holding back your results", page: FF, platforms: ["fb","ig"], scheduledAt: "Mar 30, 8:30 PM", scheduledDate: "Mar 30, 2026", type: "photo", status: "scheduled", comments: [] },

  // Money Matters
  { id: "q426", thumbnail: "", caption: "The difference between good debt and bad debt — most people get this completely wrong", page: MM, platforms: ["fb","ig"], scheduledAt: "Mar 30, 8:30 AM", scheduledDate: "Mar 30, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q427", thumbnail: "", caption: "How to read a balance sheet in 5 minutes — the skill that separates investors from gamblers", page: MM, platforms: ["fb","ig"], scheduledAt: "Mar 30, 12:00 PM", scheduledDate: "Mar 30, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q428", thumbnail: "", caption: "The psychological reason people overspend — and a simple trick to stop it", page: MM, platforms: ["fb","ig"], scheduledAt: "Mar 30, 3:00 PM", scheduledDate: "Mar 30, 2026", type: "reel", status: "scheduled", comments: [] },
  { id: "q429", thumbnail: "", caption: "Why most people will never retire — and the 3 decisions that change that trajectory", page: MM, platforms: ["fb","ig"], scheduledAt: "Mar 30, 6:00 PM", scheduledDate: "Mar 30, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q430", thumbnail: "", caption: "Tax-loss harvesting: the legal way wealthy people reduce their tax bill every year", page: MM, platforms: ["fb","ig"], scheduledAt: "Mar 30, 8:30 PM", scheduledDate: "Mar 30, 2026", type: "photo", status: "scheduled", comments: [] },

  // Know Her Name
  { id: "q431", thumbnail: "", caption: "Amelia Earhart was told flying was for men. She flew solo across the Atlantic anyway", page: KH, platforms: ["fb","ig","th"], scheduledAt: "Mar 30, 9:00 AM", scheduledDate: "Mar 30, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q432", thumbnail: "", caption: "Toni Morrison was a single mother working as an editor when she wrote 'The Bluest Eye' at 5am every morning", page: KH, platforms: ["fb","ig","th"], scheduledAt: "Mar 30, 3:00 PM", scheduledDate: "Mar 30, 2026", type: "photo", status: "scheduled", comments: [] },
];

const platformIcons: Record<string, { label: string; color: string }> = {
  fb: { label: "FB", color: "#1877F2" },
  ig: { label: "IG", color: "#E1306C" },
  th: { label: "TH", color: "#000" },
};

const typeColors: Record<string, string> = {
  photo: "#0C6AFF",
  reel: "#EC4899",
  text: "#9494A8",
};

function QueueSkeleton() {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 0 20px" }}>
        <div>
          <SkeletonLine width={80} height={22} />
          <div style={{ marginTop: 8 }}><SkeletonLine width={200} height={12} /></div>
        </div>
        <SkeletonLine width={110} height={38} style={{ borderRadius: "12px" }} />
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <SkeletonLine width={160} height={38} style={{ borderRadius: "12px" }} />
        <SkeletonLine width={200} height={38} style={{ borderRadius: "12px" }} />
      </div>
      <SkeletonTable rows={8} columns={8} />
    </div>
  );
}

export default function QueuePage() {
  const isMobile = useIsMobile();
  const isLoading = useFakeLoading();
  const [simulateEmpty, setSimulateEmpty] = useState(false);
  const [reslotted, setReslotted] = useState(false);
  const [filter, setFilter] = useState<"all" | "scheduled">("all");
  const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set());
  const [showPageDropdown, setShowPageDropdown] = useState(false);
  const [pageSearch, setPageSearch] = useState("");
  const pageDropdownRef = useRef<HTMLDivElement>(null);
  const [activeDate, setActiveDate] = useState<string>("");
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [queue, setQueue] = useState<QueuePost[]>(MOCK_QUEUE);
  const [swapToast, setSwapToast] = useState<string | null>(null);
  const [previewPost, setPreviewPost] = useState<QueuePost | null>(null);
  const [previewTab, setPreviewTab] = useState<"preview" | "comments" | "settings">("preview");
  const [bulkAction, setBulkAction] = useState<string | null>(null);
  const [showBulkThreadModal, setShowBulkThreadModal] = useState(false);
  const [bulkThreadText, setBulkThreadText] = useState("");
  const [bulkThreadOverwrite, setBulkThreadOverwrite] = useState(false);
  const [threadSuccessToast, setThreadSuccessToast] = useState<string | null>(null);

  // Feature 1: Density / Visual view
  const [viewMode, setViewMode] = useState<"list" | "visual" | "density">("list");

  // Inline caption editing (visual mode)
  const [editingCaptionId, setEditingCaptionId] = useState<string | null>(null);
  const [editingCaptionText, setEditingCaptionText] = useState("");

  const startEditCaption = (post: QueuePost, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCaptionId(post.id);
    setEditingCaptionText(post.caption);
  };

  const saveCaption = (postId: string) => {
    setQueue(prev => prev.map(p => p.id === postId ? { ...p, caption: editingCaptionText } : p));
    setEditingCaptionId(null);
  };

  const cancelCaption = () => {
    setEditingCaptionId(null);
    setEditingCaptionText("");
  };

  // Feature 2: Reschedule modal
  const [reschedulePost, setReschedulePost] = useState<QueuePost | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const openReschedule = (post: QueuePost) => {
    setReschedulePost(post);
    setRescheduleDate(post.scheduledDate);
    const rawTime = post.scheduledAt
      .replace("Today, ", "")
      .replace("Tomorrow, ", "")
      .replace(/^Mar \d+, \d+, /, "");
    // Convert "6:00 AM" → "06:00"
    const to24 = (t: string) => {
      const m = t.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
      if (!m) return "06:00";
      let h = parseInt(m[1]);
      const min = m[2];
      const ampm = m[3].toUpperCase();
      if (ampm === "PM" && h !== 12) h += 12;
      if (ampm === "AM" && h === 12) h = 0;
      return `${String(h).padStart(2, "0")}:${min}`;
    };
    setRescheduleTime(to24(rawTime));
  };

  // Feature 3: Advanced filters
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "photo" | "reel" | "text">("all");
  const [filterPlatform, setFilterPlatform] = useState<"all" | "fb" | "ig" | "th">("all");
  const [filterThread, setFilterThread] = useState<"all" | "has" | "missing">("all");
  const hasAdvancedFilters = filterType !== "all" || filterPlatform !== "all" || filterThread !== "all";

  // Undo delete
  const [undoToast, setUndoToast] = useState<{ deletedPosts: QueuePost[]; count: number; timer: ReturnType<typeof setTimeout> | null } | null>(null);
  const [undoCountdown, setUndoCountdown] = useState(5);

  const handleBulkDelete = () => {
    const deletedPosts = queue.filter(p => selectedPosts.has(p.id));
    const count = deletedPosts.length;
    // Optimistically remove from queue
    setQueue(prev => prev.filter(p => !selectedPosts.has(p.id)));
    setSelectedPosts(new Set());
    setBulkAction(null);
    // Start countdown
    setUndoCountdown(5);
    let seconds = 5;
    const interval = setInterval(() => {
      seconds -= 1;
      setUndoCountdown(seconds);
      if (seconds <= 0) clearInterval(interval);
    }, 1000);
    const timer = setTimeout(() => {
      clearInterval(interval);
      setUndoToast(null);
    }, 5500);
    setUndoToast({ deletedPosts, count, timer });
  };

  const handleUndo = () => {
    if (!undoToast) return;
    if (undoToast.timer) clearTimeout(undoToast.timer);
    // Restore deleted posts back into queue
    setQueue(prev => [...prev, ...undoToast.deletedPosts]);
    setUndoToast(null);
  };

  // Feature 4: Group By
  const [groupBy, setGroupBy] = useState<"time" | "page">("time");
  const [showGroupByDropdown, setShowGroupByDropdown] = useState(false);
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set());
  const togglePageAccordion = (pageName: string) => {
    setExpandedPages(prev => {
      const next = new Set(prev);
      next.has(pageName) ? next.delete(pageName) : next.add(pageName);
      return next;
    });
  };

  const openPreview = (post: QueuePost, tab: "preview" | "comments" | "settings" = "preview") => {
    setPreviewPost(post);
    setPreviewTab(tab);
  };

  const handleDrop = (targetId: string) => {
    if (!dragId || dragId === targetId) { setDragId(null); setDragOverId(null); return; }
    const dragPost = queue.find(p => p.id === dragId);
    const targetPost = queue.find(p => p.id === targetId);
    if (!dragPost || !targetPost) { setDragId(null); setDragOverId(null); return; }
    // Only allow within same day group
    if (dragPost.scheduledDate !== targetPost.scheduledDate) {
      setSwapToast("cross-date");
      setTimeout(() => setSwapToast(null), 3000);
      setDragId(null); setDragOverId(null); return;
    }

    // Shift/insert — not swap
    // Get all posts in this day sorted by time
    const dayPosts = queue
      .filter(p => p.scheduledDate === dragPost.scheduledDate)
      .sort((a, b) => {
        const toMs = (at: string) => {
          const t = at.replace("Today, ", "").replace("Tomorrow, ", "");
          return new Date(`${a.scheduledDate} ${t}`).getTime();
        };
        return toMs(a.scheduledAt) - toMs(b.scheduledAt);
      });

    const fromIdx = dayPosts.findIndex(p => p.id === dragId);
    const toIdx   = dayPosts.findIndex(p => p.id === targetId);
    if (fromIdx === -1 || toIdx === -1) { setDragId(null); setDragOverId(null); return; }

    // Collect the ordered times before the move
    const times = dayPosts.map(p => p.scheduledAt);

    // Reorder the posts array (insert dragged item at target position)
    const reordered = [...dayPosts];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);

    // Reassign times in new order (position keeps its original time slot)
    const timeMap: Record<string, string> = {};
    reordered.forEach((p, i) => { timeMap[p.id] = times[i]; });

    setQueue(prev => prev.map(p => timeMap[p.id] ? { ...p, scheduledAt: timeMap[p.id] } : p));
    setSwapToast("reordered");
    setTimeout(() => setSwapToast(null), 2500);
    setDragId(null); setDragOverId(null);
  };

  const PAGE_DEFS = [
    { id: "lc", name: "Laugh Central", avatar: "LC", color: "#8B5CF6", followers: "3.2M" },
    { id: "hu", name: "History Uncovered", avatar: "HU", color: "#FF6B2B", followers: "2.4M" },
    { id: "tb", name: "TechByte", avatar: "TB", color: "#14B8A6", followers: "1.1M" },
    { id: "dh", name: "Daily Health Tips", avatar: "DH", color: "#6366F1", followers: "420K" },
    { id: "ff", name: "Fitness Factory", avatar: "FF", color: "#EC4899", followers: "310K" },
    { id: "mm", name: "Money Matters", avatar: "MM", color: "#F59E0B", followers: "680K" },
    { id: "khn", name: "Know Her Name", avatar: "KH", color: "#0EA5E9", followers: "136" },
  ];
  const BATCH_DEFS = [
    { id: "b1", name: "Partner A \u2013 Lifestyle", pages: ["lc","ff","dh"] },
    { id: "b2", name: "Partner B \u2013 Education", pages: ["hu","tb","mm"] },
    { id: "b3", name: "Partner C \u2013 Women\u2019s", pages: ["khn"] },
  ];
  const PAGE_NAMES: Record<string,string> = { lc:"Laugh Central", hu:"History Uncovered", tb:"TechByte", dh:"Daily Health Tips", ff:"Fitness Factory", mm:"Money Matters", khn:"Know Her Name" };

  const filterNames = selectedPages.size === 0 ? null : [...selectedPages].map(id => PAGE_NAMES[id]).filter(Boolean);

  // Click-outside handler for page dropdown
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (pageDropdownRef.current && !pageDropdownRef.current.contains(e.target as Node)) {
        setShowPageDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Parse "Today, 2:30 PM" / "Tomorrow, 9:00 AM" / "Mar 29, 10:00 AM" into sortable number
  const parseTime = (post: QueuePost): number => {
    const timeStr = post.scheduledAt.replace("Today, ", "").replace("Tomorrow, ", "");
    const datePrefix = post.scheduledDate; // "Mar 27, 2026"
    try {
      return new Date(`${datePrefix} ${timeStr}`).getTime();
    } catch {
      return 0;
    }
  };

  const matchesScope = (p: QueuePost) => !filterNames || filterNames.includes(p.page.name);

  const filtered = queue
    .filter(p => {
      if (filter === "scheduled" && p.status !== "scheduled") return false;
      if (filterNames && !filterNames.includes(p.page.name)) return false;
      if (filterType !== "all" && p.type !== filterType) return false;
      if (filterPlatform !== "all" && !p.platforms.includes(filterPlatform as "fb" | "ig" | "th")) return false;
      if (filterThread === "has" && p.comments.length === 0) return false;
      if (filterThread === "missing" && p.comments.length > 0) return false;
      return true;
    })
    .sort((a, b) => parseTime(a) - parseTime(b)); // always sorted by publish time

  const counts = {
    all: queue.filter(matchesScope).length,
    scheduled: queue.filter(p => p.status === "scheduled" && matchesScope(p)).length,
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedPosts);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedPosts(next);
  };

  const selectAll = () => {
    if (selectedPosts.size === displayPosts.length) {
      setSelectedPosts(new Set());
    } else {
      setSelectedPosts(new Set(displayPosts.map(p => p.id)));
    }
  };

  const displayFiltered = simulateEmpty ? [] : filtered;
  const availableDates = [...new Set(displayFiltered.map(p => p.scheduledDate))];

  // Auto-select first date when filter/page changes or dates change
  useEffect(() => {
    if (availableDates.length > 0 && !availableDates.includes(activeDate)) {
      setActiveDate(availableDates[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayFiltered.length, filter, selectedPages.size, simulateEmpty]);

  const displayPosts = displayFiltered.filter(p => p.scheduledDate === activeDate);

  // Detect slot conflicts: same page + same scheduledAt on the same date
  const conflictKeys = new Set<string>();
  const slotMap: Record<string, string[]> = {};
  displayPosts.forEach(p => {
    const key = `${p.page.name}::${p.scheduledAt}`;
    if (!slotMap[key]) slotMap[key] = [];
    slotMap[key].push(p.id);
  });
  Object.values(slotMap).forEach(ids => {
    if (ids.length > 1) ids.forEach(id => conflictKeys.add(id));
  });
  const conflictCount = Object.values(slotMap).filter(ids => ids.length > 1).length;

  const activeDateIdx = availableDates.indexOf(activeDate);

  // Friendly label helpers
  const dateLabelBadge = (date: string): string | null => {
    if (date === "Mar 27, 2026") return "Today";
    if (date === "Mar 28, 2026") return "Tomorrow";
    return null;
  };
  const dateShort = (date: string): string => {
    // "Mar 27, 2026" → "Mar 27"
    return date.replace(/, \d{4}$/, "");
  };

  if (isLoading) return <QueueSkeleton />;

  if (isMobile) {
    const todayPosts = MOCK_QUEUE.filter(p => p.scheduledDate === "Mar 27, 2026");
    return (
      <div className="px-4 py-4">
        {/* Desktop-only banner */}
        <div className="flex items-center gap-2 p-3 rounded-xl mb-4" style={{ backgroundColor: "rgba(255,107,43,0.1)", border: "1px solid rgba(255,107,43,0.2)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6B2B" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          <span className="text-[12px] font-medium" style={{ color: "#FF6B2B" }}>Manage your queue from desktop</span>
        </div>

        <div className="text-[13px] font-semibold mb-3" style={{ color: "#F0F0F5" }}>
          Today — {todayPosts.length} posts
        </div>

        <div className="space-y-2">
          {todayPosts.map(post => (
            <div key={post.id} className="flex items-start gap-3 p-3 rounded-xl" style={{ backgroundColor: "#2D2D44", border: "1px solid #3A3A52" }}>
              {/* Thumbnail placeholder */}
              <div className="w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center text-[9px] font-bold" style={{ backgroundColor: post.page.color, color: "white" }}>
                {post.type === "reel" ? "▶" : "IMG"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-medium leading-snug mb-1" style={{ color: "#F0F0F5" }}>
                  {post.caption.length > 60 ? post.caption.slice(0, 60) + "…" : post.caption}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: post.page.color + "33", color: post.page.color }}>
                    {post.page.name}
                  </span>
                  <span className="text-[10px]" style={{ color: "#9494A8" }}>{post.scheduledAt}</span>
                  <span className="text-[10px]" style={{ color: "#9494A8" }}>{post.platforms.map(p => p.toUpperCase()).join(" + ")}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Wireframe designer toggle */}
      <div className="flex justify-end mb-2">
        <button
          onClick={() => setSimulateEmpty(v => !v)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border"
          style={{ backgroundColor: simulateEmpty ? "var(--primary-muted)" : "var(--surface)", color: simulateEmpty ? "var(--primary)" : "var(--text-muted)", borderColor: simulateEmpty ? "var(--primary)" : "var(--border)" }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/></svg>
          {simulateEmpty ? "Showing empty state" : "Preview empty state"}
        </button>
      </div>

      <Header
        title="Queue"
        subtitle={simulateEmpty ? "0 posts queued" : `${counts.all} posts queued across ${new Set(queue.map(p => p.page.name)).size} pages`}
        actions={
          <div className="flex items-center gap-3">
            {/* View mode toggle */}
            <div className="flex items-center p-1 rounded-xl" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
              <button
                onClick={() => setViewMode("list")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all"
                style={{
                  backgroundColor: viewMode === "list" ? "var(--primary)" : "transparent",
                  color: viewMode === "list" ? "white" : "var(--text-secondary)",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                Compact
              </button>
              <button
                onClick={() => setViewMode("visual")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all"
                style={{
                  backgroundColor: viewMode === "visual" ? "var(--primary)" : "transparent",
                  color: viewMode === "visual" ? "white" : "var(--text-secondary)",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="7" rx="1"/>
                  <rect x="3" y="14" width="18" height="7" rx="1"/>
                </svg>
                Visual
              </button>
              <button
                onClick={() => setViewMode("density")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all"
                style={{
                  backgroundColor: viewMode === "density" ? "var(--primary)" : "transparent",
                  color: viewMode === "density" ? "white" : "var(--text-secondary)",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                Density
              </button>
            </div>
            <button
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white"
              style={{ backgroundColor: "var(--primary)", boxShadow: "0 4px 14px var(--primary-glow)" }}
              onClick={() => window.location.href = "/upload"}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Posts
            </button>
          </div>
        }
      />

      {/* Filters bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 rounded-xl" style={{ backgroundColor: "var(--surface)" }}>
              {(["all", "scheduled"] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-medium transition-all"
                  style={{
                    backgroundColor: filter === f ? "var(--primary)" : "transparent",
                    color: filter === f ? "white" : "var(--text-secondary)",
                  }}
                >
                  {f === "all" ? "All" : "Scheduled"}
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{
                    backgroundColor: filter === f ? "rgba(255,255,255,0.2)" : "var(--surface-hover)",
                    color: filter === f ? "white" : "var(--text-muted)",
                  }}>
                    {counts[f]}
                  </span>
                </button>
              ))}
            </div>
            {/* Filters toggle button */}
            <button
              onClick={() => setShowAdvancedFilters(v => !v)}
              className="relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-medium border transition-all"
              style={{
                backgroundColor: showAdvancedFilters ? "var(--primary-muted)" : "var(--surface)",
                color: showAdvancedFilters ? "var(--primary)" : "var(--text-secondary)",
                borderColor: showAdvancedFilters ? "var(--primary)" : "var(--border)",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
              Filters
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              {hasAdvancedFilters && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full" style={{ backgroundColor: "var(--primary)" }} />
              )}
            </button>

            {/* Group By dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowGroupByDropdown(v => !v)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-medium border transition-all"
                style={{
                  backgroundColor: groupBy !== "time" ? "var(--primary-muted)" : "var(--surface)",
                  color: groupBy !== "time" ? "var(--primary)" : "var(--text-secondary)",
                  borderColor: groupBy !== "time" ? "var(--primary)" : "var(--border)",
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="3" y2="18"/></svg>
                Group: {groupBy === "time" ? "Time" : "Page"}
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              {showGroupByDropdown && (
                <div
                  className="absolute left-0 top-full mt-1 z-50 rounded-xl shadow-2xl overflow-hidden"
                  style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", minWidth: 200 }}
                >
                  {([
                    { value: "time", label: "Time", desc: "Chronological — what's publishing next", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
                    { value: "page", label: "Page", desc: "Grouped by page — collapsible", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
                  ] as const).map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => { setGroupBy(opt.value); setShowGroupByDropdown(false); setExpandedPages(new Set()); }}
                      className="w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:opacity-80"
                      style={{
                        backgroundColor: groupBy === opt.value ? "var(--primary-muted)" : "transparent",
                        borderBottom: opt.value === "time" ? "1px solid var(--border)" : "none",
                      }}
                    >
                      <span style={{ color: groupBy === opt.value ? "var(--primary)" : "var(--text-muted)", marginTop: 2 }}>{opt.icon}</span>
                      <div>
                        <div className="text-[12px] font-semibold" style={{ color: groupBy === opt.value ? "var(--primary)" : "var(--text)" }}>{opt.label}</div>
                        <div className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>{opt.desc}</div>
                      </div>
                      {groupBy === opt.value && (
                        <svg className="ml-auto mt-0.5 shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Multi-select page filter */}
            <div className="relative" ref={pageDropdownRef}>
              <button
                onClick={() => setShowPageDropdown(v => !v)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border text-[13px] font-medium"
                style={{ backgroundColor: "var(--surface)", borderColor: showPageDropdown ? "var(--primary)" : "var(--border)", color: "var(--text)", minWidth: 180 }}
              >
                <span className="flex-1 text-left">
                  {selectedPages.size === 0 ? "✦ All Pages" : selectedPages.size === 1 ? PAGE_NAMES[[...selectedPages][0]] : `${selectedPages.size} pages selected`}
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-muted)", transform: showPageDropdown ? "rotate(180deg)" : "none", transition: "transform 0.15s", flexShrink: 0 }}><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              {showPageDropdown && (
                <div style={{ position: "absolute", top: "calc(100% + 4px)", right: 0, width: 280, backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "0 8px 30px rgba(0,0,0,0.3)", zIndex: 50 }}>
                  {/* Search */}
                  <div className="p-3 pb-2">
                    <input
                      type="text"
                      value={pageSearch}
                      onChange={e => setPageSearch(e.target.value)}
                      placeholder="Search pages..."
                      className="w-full px-3 py-2 rounded-lg text-[12px] outline-none"
                      style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
                    />
                  </div>
                  {/* Quick select */}
                  <div className="px-3 pb-2">
                    <div className="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>Quick select</div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedPages(new Set())}
                        className="px-3 py-1 rounded-lg text-[11px] font-medium"
                        style={{ backgroundColor: selectedPages.size === 0 ? "var(--primary)" : "var(--surface-hover)", color: selectedPages.size === 0 ? "white" : "var(--text)" }}
                      >All</button>
                      <button
                        onClick={() => setSelectedPages(new Set(PAGE_DEFS.map(p => p.id)))}
                        className="px-3 py-1 rounded-lg text-[11px] font-medium"
                        style={{ backgroundColor: "var(--surface-hover)", color: "var(--text)" }}
                      >None</button>
                    </div>
                  </div>
                  <div style={{ height: 1, backgroundColor: "var(--border)", margin: "4px 0" }} />
                  {/* Batches */}
                  {!pageSearch && (
                    <>
                      <div className="px-3 pt-2 pb-1">
                        <div className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Batches</div>
                        {BATCH_DEFS.map(batch => {
                          const allIn = batch.pages.every(id => selectedPages.has(id));
                          return (
                            <button
                              key={batch.id}
                              onClick={() => {
                                const next = new Set(selectedPages);
                                if (allIn) { batch.pages.forEach(id => next.delete(id)); }
                                else { batch.pages.forEach(id => next.add(id)); }
                                setSelectedPages(next);
                              }}
                              className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-left"
                              style={{ backgroundColor: allIn ? "var(--primary-muted)" : "transparent" }}
                              onMouseEnter={e => { if (!allIn) e.currentTarget.style.backgroundColor = "var(--surface-hover)"; }}
                              onMouseLeave={e => { if (!allIn) e.currentTarget.style.backgroundColor = "transparent"; }}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={allIn ? "var(--primary)" : "var(--text-muted)"} strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
                              <span className="text-[12px] flex-1 truncate" style={{ color: allIn ? "var(--primary)" : "var(--text)" }}>{batch.name}</span>
                              <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{batch.pages.length}p</span>
                            </button>
                          );
                        })}
                      </div>
                      <div style={{ height: 1, backgroundColor: "var(--border)", margin: "4px 0" }} />
                    </>
                  )}
                  {/* Pages */}
                  <div className="px-3 pt-1 pb-3">
                    <div className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Pages</div>
                    <div className="max-h-[220px] overflow-y-auto">
                      {PAGE_DEFS.filter(p => p.name.toLowerCase().includes(pageSearch.toLowerCase())).map(page => {
                        const checked = selectedPages.has(page.id);
                        return (
                          <button
                            key={page.id}
                            onClick={() => {
                              const next = new Set(selectedPages);
                              checked ? next.delete(page.id) : next.add(page.id);
                              setSelectedPages(next);
                            }}
                            className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-left"
                            style={{ backgroundColor: checked ? "var(--primary-muted)" : "transparent" }}
                            onMouseEnter={e => { if (!checked) e.currentTarget.style.backgroundColor = "var(--surface-hover)"; }}
                            onMouseLeave={e => { if (!checked) e.currentTarget.style.backgroundColor = "transparent"; }}
                          >
                            <input type="checkbox" checked={checked} readOnly style={{ accentColor: "var(--primary)", flexShrink: 0 }} />
                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0" style={{ backgroundColor: page.color }}>{page.avatar}</div>
                            <span className="text-[12px] flex-1 truncate" style={{ color: checked ? "var(--primary)" : "var(--text)" }}>{page.name}</span>
                            <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{page.followers}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Advanced filter panel */}
        {showAdvancedFilters && (
          <div className="mt-3 flex items-start gap-6 px-4 py-3 rounded-xl" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
            {/* Media Type */}
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Media Type</div>
              <div className="flex items-center gap-1 p-0.5 rounded-lg" style={{ backgroundColor: "var(--bg)" }}>
                {([["all","All"],["photo","📷 Photo"],["reel","🎬 Reel"],["text","📝 Text"]] as const).map(([val,label]) => (
                  <button key={val} onClick={() => setFilterType(val as typeof filterType)}
                    className="px-2.5 py-1 rounded-md text-[11px] font-medium transition-all"
                    style={{
                      backgroundColor: filterType === val ? "var(--primary)" : "transparent",
                      color: filterType === val ? "white" : "var(--text-secondary)",
                    }}>{label}</button>
                ))}
              </div>
            </div>
            {/* Platform */}
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Platform</div>
              <div className="flex items-center gap-1 p-0.5 rounded-lg" style={{ backgroundColor: "var(--bg)" }}>
                {([["all","All"],["fb","FB"],["ig","IG"],["th","TH"]] as const).map(([val,label]) => (
                  <button key={val} onClick={() => setFilterPlatform(val as typeof filterPlatform)}
                    className="px-2.5 py-1 rounded-md text-[11px] font-medium transition-all"
                    style={{
                      backgroundColor: filterPlatform === val ? "var(--primary)" : "transparent",
                      color: filterPlatform === val ? "white" : "var(--text-secondary)",
                    }}>{label}</button>
                ))}
              </div>
            </div>
            {/* Thread Status */}
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Thread Status</div>
              <div className="flex items-center gap-1 p-0.5 rounded-lg" style={{ backgroundColor: "var(--bg)" }}>
                {([["all","All"],["has","Has Thread"],["missing","Missing Thread"]] as const).map(([val,label]) => (
                  <button key={val} onClick={() => setFilterThread(val as typeof filterThread)}
                    className="px-2.5 py-1 rounded-md text-[11px] font-medium transition-all"
                    style={{
                      backgroundColor: filterThread === val ? "var(--primary)" : "transparent",
                      color: filterThread === val ? "white" : "var(--text-secondary)",
                    }}>{label}</button>
                ))}
              </div>
            </div>
            {/* Clear filters */}
            {hasAdvancedFilters && (
              <div className="flex items-end pb-0.5 ml-auto">
                <button
                  onClick={() => { setFilterType("all"); setFilterPlatform("all"); setFilterThread("all"); }}
                  className="text-[11px] font-medium hover:underline"
                  style={{ color: "var(--primary)" }}
                >Clear filters</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Date Navigator — hidden in density mode */}
      {availableDates.length > 0 && (viewMode === "list" || viewMode === "visual") && (
        <div className="flex items-center gap-2 mb-5">
          {/* ← arrow */}
          <button
            onClick={() => setActiveDate(availableDates[activeDateIdx - 1])}
            disabled={activeDateIdx <= 0}
            className="flex items-center justify-center w-8 h-8 rounded-lg border transition-all"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
              color: activeDateIdx <= 0 ? "var(--text-muted)" : "var(--text-secondary)",
              opacity: activeDateIdx <= 0 ? 0.4 : 1,
              cursor: activeDateIdx <= 0 ? "not-allowed" : "pointer",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>

          {availableDates.map(date => {
            const isActive = date === activeDate;
            const badge = dateLabelBadge(date);
            const count = displayFiltered.filter(p => p.scheduledDate === date).length;
            return (
              <button
                key={date}
                onClick={() => setActiveDate(date)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border transition-all text-[12px] font-semibold"
                style={{
                  backgroundColor: isActive ? "var(--primary)" : "var(--surface)",
                  color: isActive ? "white" : "var(--text-secondary)",
                  borderColor: isActive ? "var(--primary)" : "var(--border)",
                  transform: isActive ? "scale(1.04)" : "scale(1)",
                }}
              >
                <span>{dateShort(date)}</span>
                {badge && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: isActive ? "rgba(255,255,255,0.25)" : "var(--surface-hover)",
                      color: isActive ? "white" : "var(--text-muted)",
                    }}
                  >
                    {badge}
                  </span>
                )}
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: isActive ? "rgba(255,255,255,0.2)" : "var(--surface-hover)",
                    color: isActive ? "white" : "var(--text-muted)",
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}

          {/* → arrow */}
          <button
            onClick={() => setActiveDate(availableDates[activeDateIdx + 1])}
            disabled={activeDateIdx >= availableDates.length - 1}
            className="flex items-center justify-center w-8 h-8 rounded-lg border transition-all"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
              color: activeDateIdx >= availableDates.length - 1 ? "var(--text-muted)" : "var(--text-secondary)",
              opacity: activeDateIdx >= availableDates.length - 1 ? 0.4 : 1,
              cursor: activeDateIdx >= availableDates.length - 1 ? "not-allowed" : "pointer",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      )}

      {/* ── Density / Heatmap View ── */}
      {viewMode === "density" && (() => {
        const allDates = [...new Set(MOCK_QUEUE.map(p => p.scheduledDate))];
        const allPages = [HU, LC, DH, TB, FF, MM, KH];
        const countFor = (pageName: string, date: string) =>
          MOCK_QUEUE.filter(p => p.page.name === pageName && p.scheduledDate === date).length;
        const totalForDate = (date: string) =>
          MOCK_QUEUE.filter(p => p.scheduledDate === date).length;
        const totalAll = MOCK_QUEUE.length;
        const cellColor = (n: number) => {
          if (n === 0) return { bg: "rgba(239,68,68,0.15)", text: "#EF4444" };
          if (n <= 3) return { bg: "rgba(251,191,36,0.15)", text: "#FBBF24" };
          if (n <= 6) return { bg: "rgba(74,222,128,0.15)", text: "#4ADE80" };
          return { bg: "rgba(59,130,246,0.15)", text: "#60A5FA" };
        };
        return (
          <div style={{ backgroundColor: "var(--surface)", borderRadius: 16, border: "1px solid var(--border)", padding: 24, marginBottom: 24 }}>
            {/* Summary + legend row */}
            <div className="flex items-center justify-between mb-5">
              <span className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
                Schedule density across {allPages.length} pages · {allDates.length} days · {totalAll} posts total
              </span>
              <div className="flex items-center gap-4">
                {([["#EF4444","0 posts"],["#FBBF24","1–3"],["#4ADE80","4–6"],["#60A5FA","7+"]] as const).map(([color, label]) => (
                  <span key={label} className="flex items-center gap-1 text-[11px]" style={{ color: "var(--text-secondary)" }}>
                    <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: color }} />
                    {label}
                  </span>
                ))}
              </div>
            </div>
            {/* Grid */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ borderCollapse: "separate", borderSpacing: 6, width: "100%" }}>
                <thead>
                  <tr>
                    <th style={{ width: 160, textAlign: "left", padding: "0 8px 8px", color: "var(--text-muted)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Page</th>
                    {allDates.map(date => (
                      <th key={date} style={{ width: 110, textAlign: "center", padding: "0 0 8px", color: "var(--text-muted)", fontSize: 11, fontWeight: 600 }}>
                        <div>{dateShort(date)}</div>
                        {dateLabelBadge(date) && <div style={{ color: "var(--primary)", fontSize: 10, fontWeight: 700 }}>{dateLabelBadge(date)}</div>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allPages.map(page => (
                    <tr key={page.name}>
                      <td style={{ padding: "3px 8px 3px 0" }}>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0" style={{ backgroundColor: page.color }}>{page.avatar}</div>
                          <span className="text-[12px] font-medium truncate" style={{ color: "var(--text-secondary)", maxWidth: 110 }}>{page.name}</span>
                        </div>
                      </td>
                      {allDates.map(date => {
                        const n = countFor(page.name, date);
                        const { bg, text } = cellColor(n);
                        return (
                          <td key={date} style={{ padding: 3 }}>
                            <button
                              onClick={() => { setViewMode("list"); setActiveDate(date); const pid = page.avatar.toLowerCase() === "kh" ? "khn" : page.avatar.toLowerCase(); setSelectedPages(new Set([pid])); }}
                              style={{
                                width: "100%", height: 70, borderRadius: 10,
                                backgroundColor: bg, border: `1px solid ${n === 0 ? "rgba(239,68,68,0.25)" : "transparent"}`,
                                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                cursor: "pointer", transition: "filter 0.15s",
                              }}
                              onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.25)")}
                              onMouseLeave={e => (e.currentTarget.style.filter = "brightness(1)")}
                              title={`${n} post${n !== 1 ? "s" : ""} · ${page.name} · ${dateShort(date)} — click to view`}
                            >
                              <span style={{ fontSize: 22, fontWeight: 700, color: text, lineHeight: 1 }}>{n === 0 ? "–" : n}</span>
                              {n > 0 && <span style={{ fontSize: 10, color: text, opacity: 0.7, marginTop: 2 }}>posts</span>}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  {/* Total row */}
                  <tr>
                    <td style={{ padding: "8px 8px 3px 0" }}>
                      <span className="text-[12px] font-bold" style={{ color: "var(--text)" }}>Total</span>
                    </td>
                    {allDates.map(date => {
                      const n = totalForDate(date);
                      return (
                        <td key={date} style={{ padding: "8px 3px 3px" }}>
                          <div style={{
                            width: "100%", height: 44, borderRadius: 10,
                            backgroundColor: "var(--bg)", border: "1px solid var(--border)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>{n}</span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      })()}

      {/* Queue grid header — list/visual mode only */}
      {(viewMode === "list" || viewMode === "visual") && (<>{viewMode === "visual" ? (
        <div className="mb-3 flex items-center gap-3 px-4 py-2" style={{ backgroundColor: "rgba(255,107,43,0.06)", border: "1px solid rgba(255,107,43,0.15)", borderRadius: 10, fontSize: 12, color: "var(--text-secondary)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          <span>Visual mode — click any caption to edit inline</span>
          <span style={{ color: "var(--text-muted)" }}>·</span>
          <button onClick={() => setViewMode("list")} style={{ color: "var(--primary)", background: "none", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Switch to Compact</button>
        </div>
      ) : (
      <div className="rounded-t-xl border border-b-0" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="grid items-center px-4 py-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)", gridTemplateColumns: "36px 3fr 120px 60px 90px 140px 60px 32px" }}>
          <div>
            <input
              type="checkbox"
              checked={selectedPosts.size === displayPosts.length && displayPosts.length > 0}
              onChange={selectAll}
              className="rounded"
              style={{ accentColor: "var(--primary)" }}
            />
          </div>
          <div>Post</div>
          <div>Page</div>
          <div>To</div>
          <div>Status</div>
          <div>Scheduled</div>
          <div>Threads</div>
          <div></div>
        </div>
      </div>
      )}

      {/* Conflict warning banner */}
        {conflictCount > 0 && !reslotted && (
          <div className="rounded-xl mb-3 overflow-hidden" style={{ border: "1px solid rgba(251,191,36,0.3)" }}>
            {/* Main banner row */}
            <div className="flex items-center justify-between px-4 py-3"
              style={{ backgroundColor: "rgba(251,191,36,0.07)" }}>
              <div className="flex items-center gap-2.5">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <div>
                  <span className="text-[13px] font-semibold" style={{ color: "#FBBF24" }}>
                    {conflictCount} manually scheduled post{conflictCount !== 1 ? "s" : ""} conflict{conflictCount === 1 ? "s" : ""} with existing slots
                  </span>
                  <p className="text-[11px] mt-0.5" style={{ color: "var(--text-secondary)" }}>
                    This only happens when posts are scheduled manually. Auto-Schedule never creates conflicts.
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setReslotted(true); }}
                className="flex items-center gap-1.5 text-[12px] font-semibold px-4 py-2 rounded-lg flex-shrink-0 ml-4"
                style={{ backgroundColor: "#22c55e", color: "white", boxShadow: "0 2px 8px rgba(34,197,94,0.3)" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                Re-slot Automatically
              </button>
            </div>
            {/* Tip row */}
            <div className="flex items-center gap-2 px-4 py-2 border-t" style={{ borderColor: "rgba(251,191,36,0.2)", backgroundColor: "rgba(251,191,36,0.03)" }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2" style={{ opacity: 0.6, flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                Tip: Use <span style={{ color: "var(--primary)", fontWeight: 600 }}>⚡ Slot it in</span> in the Schedule modal to always fill the next available slot without conflicts.
              </span>
            </div>
          </div>
        )}
        {reslotted && (
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl mb-3"
            style={{ backgroundColor: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.2)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            <span className="text-[13px] font-semibold" style={{ color: "#4ADE80" }}>Conflicts resolved</span>
            <span className="text-[12px]" style={{ color: "var(--text-secondary)" }}>— Posts re-slotted into next available times using page rhythms.</span>
            <button onClick={() => setReslotted(false)} className="ml-auto text-[11px]" style={{ color: "var(--text-muted)" }}>Undo</button>
          </div>
        )}

      {/* Queue rows for active date */}
      <div className="rounded-b-xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
        {displayFiltered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20" style={{ backgroundColor: "var(--surface)" }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: "var(--primary-muted)" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <h3 className="text-[16px] font-semibold mb-1" style={{ color: "var(--text)" }}>No posts in queue</h3>
            <p className="text-[13px] mb-4" style={{ color: "var(--text-secondary)" }}>Upload content or create a single post to get started</p>
            <button className="px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white" style={{ backgroundColor: "var(--primary)", boxShadow: "0 4px 14px var(--primary-glow)" }}
              onClick={() => window.location.href = "/upload"}>
              Add Posts
            </button>
          </div>
        ) : displayPosts.length === 0 ? (
          (() => {
            const singlePage = filterNames && filterNames.length === 1 ? filterNames[0] : null;
            const PAGE_NEXT_SLOTS: Record<string, { nextSlot: string; interval: number; tz: string }> = {
              "History Uncovered": { nextSlot: "Tomorrow, 6:00 AM",  interval: 2,   tz: "EST" },
              "Laugh Central":     { nextSlot: "Tomorrow, 6:30 AM",  interval: 2.5, tz: "EST" },
              "Fitness Factory":   { nextSlot: "Tomorrow, 8:00 AM",  interval: 3,   tz: "PST" },
              "TechByte":          { nextSlot: "Tomorrow, 7:30 AM",  interval: 2,   tz: "EST" },
              "Daily Health Tips": { nextSlot: "Tomorrow, 7:00 AM",  interval: 4,   tz: "EST" },
              "Money Matters":     { nextSlot: "Tomorrow, 8:30 AM",  interval: 3,   tz: "EST" },
              "Know Her Name":     { nextSlot: "Tomorrow, 9:00 AM",  interval: 6,   tz: "EST" },
            };
            const rhythm = singlePage ? PAGE_NEXT_SLOTS[singlePage] : null;
            return (
              <div className="flex flex-col items-center justify-center py-20" style={{ backgroundColor: "var(--surface)" }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: rhythm ? "rgba(34,197,94,0.1)" : "var(--primary-muted)" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={rhythm ? "#4ADE80" : "var(--primary)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </div>
                <h3 className="text-[16px] font-semibold mb-1" style={{ color: "var(--text)" }}>
                  {singlePage ? `${singlePage} queue is empty` : `No posts scheduled for ${activeDate}`}
                </h3>
                {rhythm ? (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[13px]" style={{ color: "var(--text-secondary)" }}>Next slot opens</span>
                      <span className="text-[13px] font-semibold px-3 py-1 rounded-lg" style={{ backgroundColor: "rgba(34,197,94,0.1)", color: "#4ADE80" }}>{rhythm.nextSlot}</span>
                    </div>
                    <p className="text-[12px] mb-5" style={{ color: "var(--text-muted)" }}>
                      Every {rhythm.interval}h · {rhythm.tz} · Add content to fill this slot automatically
                    </p>
                  </>
                ) : (
                  <p className="text-[13px] mb-4" style={{ color: "var(--text-secondary)" }}>Select another day or add posts via Bulk Upload</p>
                )}
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white" style={{ backgroundColor: "var(--primary)", boxShadow: "0 4px 14px var(--primary-glow)" }}
                    onClick={() => window.location.href = "/upload"}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add Content
                  </button>
                  {rhythm && (
                    <button className="px-5 py-2.5 rounded-xl text-[13px] font-medium border" style={{ backgroundColor: "transparent", color: "var(--text-secondary)", borderColor: "var(--border)" }}
                      onClick={() => window.location.href = "/settings/pages"}>
                      Edit Rhythm
                    </button>
                  )}
                </div>
              </div>
            );
          })()
        ) : groupBy === "page" ? (
          // ── GROUP BY PAGE: collapsible accordions ──
          <>
            {(() => {
              // Group displayPosts by page name
              const pageGroups: Record<string, QueuePost[]> = {};
              displayPosts.forEach(p => {
                if (!pageGroups[p.page.name]) pageGroups[p.page.name] = [];
                pageGroups[p.page.name].push(p);
              });
              return Object.entries(pageGroups).map(([pageName, posts]) => {
                const isExpanded = expandedPages.has(pageName);
                const pageInfo = posts[0].page;
                return (
                  <div key={pageName}>
                    {/* Accordion header */}
                    <button
                      className="w-full flex items-center gap-3 px-4 py-3 border-b transition-all"
                      style={{
                        backgroundColor: isExpanded ? "rgba(255,107,43,0.06)" : "var(--bg)",
                        borderColor: "var(--border)",
                        borderLeft: isExpanded ? "3px solid var(--primary)" : "3px solid transparent",
                        cursor: "pointer",
                      }}
                      onClick={() => togglePageAccordion(pageName)}
                    >
                      {/* Chevron */}
                      <svg
                        width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                        style={{ color: "var(--text-muted)", transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s ease", flexShrink: 0 }}
                      >
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                      {/* Page avatar */}
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0" style={{ backgroundColor: pageInfo.color }}>
                        {pageInfo.avatar}
                      </div>
                      {/* Page name */}
                      <span className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>{pageName}</span>
                      {/* Post count badge */}
                      <span className="ml-2 text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: isExpanded ? "var(--primary-muted)" : "var(--surface-hover)", color: isExpanded ? "var(--primary)" : "var(--text-muted)" }}>
                        {posts.length} post{posts.length !== 1 ? "s" : ""}
                      </span>
                      {/* Earliest time */}
                      <span className="ml-auto text-[11px]" style={{ color: "var(--text-muted)" }}>
                        First: {posts[0].scheduledAt.replace("Today, ", "").replace("Tomorrow, ", "")}
                      </span>
                      {/* Thread missing indicator */}
                      {posts.some(p => p.comments.length === 0) && (
                        <span className="ml-3 text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ backgroundColor: "rgba(251,191,36,0.15)", color: "#FBBF24" }}>
                          {posts.filter(p => p.comments.length === 0).length} missing threads
                        </span>
                      )}
                    </button>

                    {/* Accordion body — posts list */}
                    {isExpanded && posts.map((post) => (
                      <div key={post.id} className="group">
                        {viewMode === "visual" ? (
                          /* ── Visual row (group-by-page) ── */
                          <div
                            className="grid border-b transition-all cursor-pointer"
                            style={{
                              minHeight: 130,
                              gridTemplateColumns: "20px 36px 120px 1fr 160px",
                              padding: "12px 16px",
                              paddingLeft: 48,
                              borderBottom: "1px solid var(--border)",
                              backgroundColor: selectedPosts.has(post.id) ? "var(--primary-muted)" : dragOverId === post.id ? "rgba(255,107,43,0.08)" : dragId === post.id ? "var(--surface-hover)" : "var(--surface)",
                              borderLeft: dragOverId === post.id ? "2px solid var(--primary)" : "2px solid transparent",
                              opacity: dragId === post.id ? 0.5 : 1,
                              alignItems: "start",
                            }}
                            onDragOver={(e) => { e.preventDefault(); setDragOverId(post.id); }}
                            onDragLeave={() => setDragOverId(null)}
                            onDrop={() => handleDrop(post.id)}
                            onClick={(e) => { if (editingCaptionId) { e.stopPropagation(); return; } openPreview(post, "preview"); }}
                          >
                            {/* Col 1: Drag handle */}
                            <div
                              draggable
                              className="cursor-grab active:cursor-grabbing flex items-start justify-center pt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={e => e.stopPropagation()}
                              onDragStart={e => { e.stopPropagation(); setDragId(post.id); }}
                              onDragEnd={() => { setDragId(null); setDragOverId(null); }}
                              title="Drag to reorder"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-muted)" }}>
                                <circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/>
                                <circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/>
                                <circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/>
                              </svg>
                            </div>
                            {/* Col 2: Checkbox */}
                            <div className="flex items-start pt-1" onClick={e => e.stopPropagation()}>
                              <input type="checkbox" checked={selectedPosts.has(post.id)} onChange={() => toggleSelect(post.id)} style={{ accentColor: "var(--primary)" }} />
                            </div>
                            {/* Col 3: Thumbnail */}
                            <div className="flex flex-col gap-2 shrink-0">
                              <div className="relative flex items-center justify-center" style={{ width: 120, height: 120, borderRadius: 10, backgroundColor: "var(--surface-hover)", overflow: "hidden" }}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--text-muted)" }}>
                                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                                </svg>
                                {post.type === "reel" && (
                                  <div style={{ position: "absolute", bottom: 0, left: 0, backgroundColor: "rgba(0,0,0,0.6)", borderRadius: "0 6px 0 10px", padding: "2px 6px", fontSize: 9, color: "white" }}>▶ REEL</div>
                                )}
                              </div>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-center w-fit" style={{
                                backgroundColor: post.type === "photo" ? "rgba(59,130,246,0.15)" : post.type === "reel" ? "rgba(236,72,153,0.15)" : "var(--surface-hover)",
                                color: post.type === "photo" ? "#3B82F6" : post.type === "reel" ? "#EC4899" : "var(--text-muted)",
                              }}>{post.type}</span>
                            </div>
                            {/* Col 4: Content */}
                            <div className="flex flex-col gap-1.5 min-w-0 px-3">
                              {/* Page info row */}
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0" style={{ backgroundColor: post.page.color }}>{post.page.avatar}</div>
                                <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{post.page.name}</span>
                                <span style={{ color: "var(--text-muted)", fontSize: 11 }}>·</span>
                                {post.platforms.map(p => (
                                  <span key={p}>
                                    {p === "fb" && <svg width="12" height="12" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>}
                                    {p === "ig" && <svg width="12" height="12" viewBox="0 0 24 24" fill="#E1306C"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>}
                                    {p === "th" && <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--text-muted)"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.181 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-5.602.04-8.196 3.2-8.257 8.358v.457c.504 5.07 3.278 7.957 8.254 7.957h.023c2.627-.02 4.643-.64 6.163-1.898.93-.77 1.614-1.742 2.033-2.89l1.98.676c-.56 1.54-1.46 2.82-2.674 3.803C18.14 23.02 15.478 23.978 12.186 24z"/><path d="M12.167 17.053c-3.091 0-5.15-2.514-5.15-5.053 0-2.54 2.059-5.054 5.15-5.054 3.092 0 5.15 2.514 5.15 5.054 0 2.539-2.058 5.053-5.15 5.053zm0-8.14c-1.843 0-3.183 1.394-3.183 3.087 0 1.693 1.34 3.087 3.183 3.087 1.844 0 3.184-1.394 3.184-3.087 0-1.693-1.34-3.087-3.184-3.087z"/></svg>}
                                  </span>
                                ))}
                                <span style={{ color: "var(--text-muted)", fontSize: 11 }}>·</span>
                                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "var(--success-bg)", color: "var(--success)" }}>{post.status}</span>
                              </div>
                              {/* Caption row */}
                              <div className="relative">
                                {editingCaptionId === post.id ? (
                                  <div onClick={e => e.stopPropagation()}>
                                    <textarea
                                      autoFocus
                                      rows={4}
                                      value={editingCaptionText}
                                      onChange={e => setEditingCaptionText(e.target.value)}
                                      onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); saveCaption(post.id); } if (e.key === "Escape") cancelCaption(); }}
                                      onBlur={() => saveCaption(post.id)}
                                      onClick={e => e.stopPropagation()}
                                      style={{ width: "100%", backgroundColor: "var(--bg)", border: "1px solid var(--primary)", borderRadius: 8, padding: 8, fontSize: 13, color: "var(--text)", resize: "none", outline: "none", lineHeight: 1.5 }}
                                    />
                                    <div className="text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>Enter to save · Esc to cancel</div>
                                  </div>
                                ) : (
                                  <div className="relative cursor-text" onClick={e => startEditCaption(post, e)}>
                                    <p className="text-[13px] font-medium" style={{ color: "var(--text)", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" } as React.CSSProperties}>{post.caption}</p>
                                    <span className="text-[10px] opacity-0 group-hover:opacity-60 transition-opacity mt-0.5 block" style={{ color: "var(--text-muted)" }}>✏️ Click to edit</span>
                                  </div>
                                )}
                              </div>
                              {/* Thread comment summary */}
                              {post.comments.length > 0 && (
                                <button onClick={e => { e.stopPropagation(); openPreview(post, "comments"); }} className="flex items-center gap-1 text-left" style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                                  <span style={{ fontSize: 11 }}>💬</span>
                                  <span className="text-[11px] truncate" style={{ color: "var(--text-muted)" }}>{post.comments[0]}</span>
                                </button>
                              )}
                            </div>
                            {/* Col 5: Metadata */}
                            <div className="flex flex-col items-end gap-1 shrink-0">
                              <button onClick={e => { e.stopPropagation(); openReschedule(post); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "right" }}>
                                <div className="text-[14px] font-bold hover:underline" style={{ color: "var(--primary)" }}>{post.scheduledAt.replace(post.scheduledDate + ", ", "").replace("Today, ", "").replace("Tomorrow, ", "")}</div>
                                <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>{post.scheduledDate}</div>
                              </button>
                              <div className="mt-1">
                                {post.comments.length > 0 ? (
                                  <button onClick={e => { e.stopPropagation(); openPreview(post, "comments"); }} className="flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md" style={{ backgroundColor: "var(--primary-muted)", color: "var(--primary)" }}>
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                    {post.comments.length}
                                  </button>
                                ) : (
                                  <button onClick={e => { e.stopPropagation(); openPreview(post, "comments"); }} className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-md" style={{ color: "var(--text-muted)" }}>
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>+
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                        /* ── Compact row (group-by-page) ── */
                        <div
                          className="grid items-center px-4 py-3 border-b transition-all cursor-pointer"
                          style={{
                            backgroundColor: selectedPosts.has(post.id) ? "var(--primary-muted)" : dragOverId === post.id ? "rgba(255,107,43,0.08)" : dragId === post.id ? "var(--surface-hover)" : "var(--surface)",
                            borderColor: "var(--border)",
                            borderLeft: dragOverId === post.id ? "2px solid var(--primary)" : "2px solid transparent",
                            opacity: dragId === post.id ? 0.5 : 1,
                            gridTemplateColumns: "20px 36px 3fr 60px 90px 140px 60px",
                            paddingLeft: 48,
                          }}
                          onDragOver={(e) => { e.preventDefault(); setDragOverId(post.id); }}
                          onDragLeave={() => setDragOverId(null)}
                          onDrop={() => handleDrop(post.id)}
                          onClick={() => openPreview(post, "preview")}
                        >
                          {/* Drag handle — far left, visible only on row hover */}
                          <div
                            draggable
                            className="cursor-grab active:cursor-grabbing flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={e => e.stopPropagation()}
                            onDragStart={e => { e.stopPropagation(); setDragId(post.id); }}
                            onDragEnd={() => { setDragId(null); setDragOverId(null); }}
                            title="Drag to reorder"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-muted)" }}>
                              <circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/>
                              <circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/>
                              <circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/>
                            </svg>
                          </div>
                          <div onClick={e => e.stopPropagation()}>
                            <input type="checkbox" checked={selectedPosts.has(post.id)} onChange={() => toggleSelect(post.id)} style={{ accentColor: "var(--primary)" }} />
                          </div>
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="text-[16px] shrink-0">{post.type === "photo" ? "📷" : post.type === "reel" ? "🎬" : "📝"}</span>
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--surface-hover)" }}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--text-muted)" }}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                            </div>
                            <p className="text-[12px] font-medium truncate" style={{ color: "var(--text)" }}>{post.caption}</p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {post.platforms.map(p => (
                              <span key={p} title={p.toUpperCase()}>
                                {p === "fb" && <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>}
                                {p === "ig" && <svg width="16" height="16" viewBox="0 0 24 24" fill="#E1306C"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>}
                                {p === "th" && <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--text-muted)"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.181 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-5.602.04-8.196 3.2-8.257 8.358v.457c.504 5.07 3.278 7.957 8.254 7.957h.023c2.627-.02 4.643-.64 6.163-1.898.93-.77 1.614-1.742 2.033-2.89l1.98.676c-.56 1.54-1.46 2.82-2.674 3.803C18.14 23.02 15.478 23.978 12.186 24z"/><path d="M12.167 17.053c-3.091 0-5.15-2.514-5.15-5.053 0-2.54 2.059-5.054 5.15-5.054 3.092 0 5.15 2.514 5.15 5.054 0 2.539-2.058 5.053-5.15 5.053zm0-8.14c-1.843 0-3.183 1.394-3.183 3.087 0 1.693 1.34 3.087 3.183 3.087 1.844 0 3.184-1.394 3.184-3.087 0-1.693-1.34-3.087-3.184-3.087z"/></svg>}
                              </span>
                            ))}
                          </div>
                          <div>
                            <span className="text-[10px] font-semibold px-2 py-1 rounded-full flex items-center gap-1 w-fit" style={{ backgroundColor: "var(--success-bg)", color: "var(--success)" }}>
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--success)" }} />scheduled
                            </span>
                          </div>
                          <div>
                            <button onClick={e => { e.stopPropagation(); openReschedule(post); }} className="text-[12px] font-medium hover:underline" style={{ color: "var(--text-secondary)", cursor: "pointer", background: "none", border: "none" }} title="Click to reschedule">
                              {post.scheduledAt}
                            </button>
                            {conflictKeys.has(post.id) && !reslotted && (
                              <span className="flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded flex-shrink-0 mt-1"
                                title="Manually scheduled — conflicts with another post at this time"
                                style={{ backgroundColor: "rgba(251,191,36,0.12)", color: "#FBBF24", cursor: "help" }}>
                                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                                Manual conflict
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            {post.comments.length > 0 ? (
                              <button onClick={e => { e.stopPropagation(); openPreview(post, "comments"); }} className="flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md" style={{ backgroundColor: "var(--primary-muted)", color: "var(--primary)" }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                {post.comments.length}
                              </button>
                            ) : (
                              <button onClick={e => { e.stopPropagation(); openPreview(post, "comments"); }} className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-md" style={{ color: "var(--text-muted)" }}>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>+
                              </button>
                            )}
                          </div>
                        </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              });
            })()}
          </>
        ) : (
          <>
            {displayPosts.map((post) => (
                <div key={post.id} className="group">
                  {viewMode === "visual" ? (
                  /* ── Visual row (group-by-time) ── */
                  <div
                    className="grid border-b transition-all cursor-pointer"
                    style={{
                      minHeight: 130,
                      gridTemplateColumns: "36px 120px 1fr 160px",
                      padding: "12px 16px",
                      borderBottom: "1px solid var(--border)",
                      backgroundColor: selectedPosts.has(post.id) ? "var(--primary-muted)" : "var(--surface)",
                      alignItems: "start",
                    }}
                    onClick={(e) => { if (editingCaptionId) { e.stopPropagation(); return; } openPreview(post, "preview"); }}
                  >
                    {/* Col 1: Checkbox */}
                    <div className="flex items-start pt-1" onClick={e => e.stopPropagation()}>
                      <input type="checkbox" checked={selectedPosts.has(post.id)} onChange={() => toggleSelect(post.id)} style={{ accentColor: "var(--primary)" }} />
                    </div>
                    {/* Col 2: Thumbnail */}
                    <div className="flex flex-col gap-2 shrink-0">
                      <div className="relative flex items-center justify-center" style={{ width: 120, height: 120, borderRadius: 10, backgroundColor: "var(--surface-hover)", overflow: "hidden" }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--text-muted)" }}>
                          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                        </svg>
                        {post.type === "reel" && (
                          <div style={{ position: "absolute", bottom: 0, left: 0, backgroundColor: "rgba(0,0,0,0.6)", borderRadius: "0 6px 0 10px", padding: "2px 6px", fontSize: 9, color: "white" }}>▶ REEL</div>
                        )}
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-center w-fit" style={{
                        backgroundColor: post.type === "photo" ? "rgba(59,130,246,0.15)" : post.type === "reel" ? "rgba(236,72,153,0.15)" : "var(--surface-hover)",
                        color: post.type === "photo" ? "#3B82F6" : post.type === "reel" ? "#EC4899" : "var(--text-muted)",
                      }}>{post.type}</span>
                    </div>
                    {/* Col 3: Content */}
                    <div className="flex flex-col gap-1.5 min-w-0 px-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0" style={{ backgroundColor: post.page.color }}>{post.page.avatar}</div>
                        <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{post.page.name}</span>
                        <span style={{ color: "var(--text-muted)", fontSize: 11 }}>·</span>
                        {post.platforms.map(p => (
                          <span key={p}>
                            {p === "fb" && <svg width="12" height="12" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>}
                            {p === "ig" && <svg width="12" height="12" viewBox="0 0 24 24" fill="#E1306C"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>}
                            {p === "th" && <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--text-muted)"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.181 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-5.602.04-8.196 3.2-8.257 8.358v.457c.504 5.07 3.278 7.957 8.254 7.957h.023c2.627-.02 4.643-.64 6.163-1.898.93-.77 1.614-1.742 2.033-2.89l1.98.676c-.56 1.54-1.46 2.82-2.674 3.803C18.14 23.02 15.478 23.978 12.186 24z"/><path d="M12.167 17.053c-3.091 0-5.15-2.514-5.15-5.053 0-2.54 2.059-5.054 5.15-5.054 3.092 0 5.15 2.514 5.15 5.054 0 2.539-2.058 5.053-5.15 5.053zm0-8.14c-1.843 0-3.183 1.394-3.183 3.087 0 1.693 1.34 3.087 3.183 3.087 1.844 0 3.184-1.394 3.184-3.087 0-1.693-1.34-3.087-3.184-3.087z"/></svg>}
                          </span>
                        ))}
                        <span style={{ color: "var(--text-muted)", fontSize: 11 }}>·</span>
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "var(--success-bg)", color: "var(--success)" }}>{post.status}</span>
                      </div>
                      <div className="relative">
                        {editingCaptionId === post.id ? (
                          <div onClick={e => e.stopPropagation()}>
                            <textarea
                              autoFocus
                              rows={4}
                              value={editingCaptionText}
                              onChange={e => setEditingCaptionText(e.target.value)}
                              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); saveCaption(post.id); } if (e.key === "Escape") cancelCaption(); }}
                              onBlur={() => saveCaption(post.id)}
                              onClick={e => e.stopPropagation()}
                              style={{ width: "100%", backgroundColor: "var(--bg)", border: "1px solid var(--primary)", borderRadius: 8, padding: 8, fontSize: 13, color: "var(--text)", resize: "none", outline: "none", lineHeight: 1.5 }}
                            />
                            <div className="text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>Enter to save · Esc to cancel</div>
                          </div>
                        ) : (
                          <div className="relative cursor-text" onClick={e => startEditCaption(post, e)}>
                            <p className="text-[13px] font-medium" style={{ color: "var(--text)", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" } as React.CSSProperties}>{post.caption}</p>
                            <span className="text-[10px] opacity-0 group-hover:opacity-60 transition-opacity mt-0.5 block" style={{ color: "var(--text-muted)" }}>✏️ Click to edit</span>
                          </div>
                        )}
                      </div>
                      {post.comments.length > 0 && (
                        <button onClick={e => { e.stopPropagation(); openPreview(post, "comments"); }} className="flex items-center gap-1 text-left" style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                          <span style={{ fontSize: 11 }}>💬</span>
                          <span className="text-[11px] truncate" style={{ color: "var(--text-muted)" }}>{post.comments[0]}</span>
                        </button>
                      )}
                    </div>
                    {/* Col 4: Metadata */}
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <button onClick={e => { e.stopPropagation(); openReschedule(post); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "right" }}>
                        <div className="text-[14px] font-bold hover:underline" style={{ color: "var(--primary)" }}>{post.scheduledAt.replace(post.scheduledDate + ", ", "").replace("Today, ", "").replace("Tomorrow, ", "")}</div>
                        <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>{post.scheduledDate}</div>
                      </button>
                      <div className="mt-1">
                        {post.comments.length > 0 ? (
                          <button onClick={e => { e.stopPropagation(); openPreview(post, "comments"); }} className="flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md" style={{ backgroundColor: "var(--primary-muted)", color: "var(--primary)" }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                            {post.comments.length}
                          </button>
                        ) : (
                          <button onClick={e => { e.stopPropagation(); openPreview(post, "comments"); }} className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-md" style={{ color: "var(--text-muted)" }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>+
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  ) : (
                  /* ── Compact row (group-by-time) ── */
                  <div
                    className="grid items-center px-4 py-3 border-b transition-all cursor-pointer"
                    style={{
                      backgroundColor: selectedPosts.has(post.id) ? "var(--primary-muted)" : "var(--surface)",
                      borderColor: "var(--border)",
                      borderLeft: "2px solid transparent",
                      gridTemplateColumns: "36px 3fr 120px 60px 90px 140px 60px 32px",
                    }}
                    onClick={() => openPreview(post, "preview")}
                  >
                    {/* Checkbox */}
                    <div onClick={e => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedPosts.has(post.id)}
                        onChange={() => toggleSelect(post.id)}
                        style={{ accentColor: "var(--primary)" }}
                      />
                    </div>

                    {/* Post: type emoji + thumbnail + caption */}
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-[16px] shrink-0">{post.type === "photo" ? "📷" : post.type === "reel" ? "🎬" : "📝"}</span>
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 overflow-hidden" style={{ backgroundColor: "var(--surface-hover)" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--text-muted)" }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      </div>
                      <p className="text-[12px] font-medium truncate" style={{ color: "var(--text)" }}>
                        {post.caption}
                      </p>
                    </div>

                    {/* Page */}
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0" style={{ backgroundColor: post.page.color }}>
                        {post.page.avatar}
                      </div>
                      <span className="text-[11px] font-medium truncate" style={{ color: "var(--text-secondary)" }}>
                        {post.page.name}
                      </span>
                    </div>

                    {/* Platforms — icon logos */}
                    <div className="flex items-center gap-1.5">
                      {post.platforms.map(p => (
                        <span key={p} title={platformIcons[p].label}>
                          {p === "fb" && <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>}
                          {p === "ig" && <svg width="16" height="16" viewBox="0 0 24 24" fill="#E1306C"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>}
                          {p === "th" && <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--text-muted)"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.181 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-5.602.04-8.196 3.2-8.257 8.358v.457c.504 5.07 3.278 7.957 8.254 7.957h.023c2.627-.02 4.643-.64 6.163-1.898.93-.77 1.614-1.742 2.033-2.89l1.98.676c-.56 1.54-1.46 2.82-2.674 3.803C18.14 23.02 15.478 23.978 12.186 24z"/><path d="M12.167 17.053c-3.091 0-5.15-2.514-5.15-5.053 0-2.54 2.059-5.054 5.15-5.054 3.092 0 5.15 2.514 5.15 5.054 0 2.539-2.058 5.053-5.15 5.053zm0-8.14c-1.843 0-3.183 1.394-3.183 3.087 0 1.693 1.34 3.087 3.183 3.087 1.844 0 3.184-1.394 3.184-3.087 0-1.693-1.34-3.087-3.184-3.087z"/></svg>}
                        </span>
                      ))}
                    </div>

                    {/* Status */}
                    <div>
                      <span className="text-[10px] font-semibold px-2 py-1 rounded-full flex items-center gap-1 w-fit" style={{
                        backgroundColor: post.status === "scheduled" ? "var(--success-bg)" : post.status === "failed" ? "var(--error-bg)" : post.status === "draft" ? "var(--warning-bg)" : "var(--primary-muted)",
                        color: post.status === "scheduled" ? "var(--success)" : post.status === "failed" ? "var(--error)" : post.status === "draft" ? "var(--warning)" : "var(--primary)",
                      }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{
                          backgroundColor: post.status === "scheduled" ? "var(--success)" : post.status === "failed" ? "var(--error)" : post.status === "draft" ? "var(--warning)" : "var(--primary)",
                        }} />
                        {post.status}
                      </span>
                    </div>

                    {/* Schedule time — click to reschedule */}
                    <div>
                      <button
                        onClick={e => { e.stopPropagation(); openReschedule(post); }}
                        className="text-[12px] font-medium hover:underline"
                        style={{ color: "var(--text-secondary)", cursor: "pointer", background: "none", border: "none", padding: 0 }}
                        title="Click to reschedule"
                      >
                        {post.scheduledAt}
                      </button>
                      {conflictKeys.has(post.id) && !reslotted && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded flex-shrink-0 mt-1"
                          title="Manually scheduled — conflicts with another post at this time"
                          style={{ backgroundColor: "rgba(251,191,36,0.12)", color: "#FBBF24", cursor: "help" }}>
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                          Manual conflict
                        </span>
                      )}
                    </div>

                    {/* Thread comments count — click opens modal on Comments tab */}
                    <div className="flex items-center gap-1">
                      {post.comments.length > 0 ? (
                        <button
                          onClick={e => { e.stopPropagation(); openPreview(post, "comments"); }}
                          className="flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md hover:opacity-80 transition-opacity"
                          style={{ backgroundColor: "var(--primary-muted)", color: "var(--primary)" }}
                          title="View & edit threaded comments"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                          {post.comments.length}
                        </button>
                      ) : (
                        <button
                          onClick={e => { e.stopPropagation(); openPreview(post, "comments"); }}
                          className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-md hover:opacity-80 transition-opacity"
                          style={{ color: "var(--text-muted)" }}
                          title="Add threaded comments"
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                          +
                        </button>
                      )}
                    </div>

                    {/* Drag disabled in Time view — tooltip hints Group by Page */}
                    <div
                      className="flex items-center justify-center opacity-25"
                      title="Switch to 'Group by Page' to drag-reorder posts"
                      onClick={e => e.stopPropagation()}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-muted)" }}>
                        <circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/>
                        <circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/>
                        <circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/>
                      </svg>
                    </div>
                  </div>
                  )}
                </div>
            ))}
          </>
        )}
      </div>

      </>)}

      {/* Drag swap toast */}
      {swapToast === "reordered" && (
        <div className="fixed top-6 right-8 z-50 transition-all">
          <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--success)",
              boxShadow: "0 8px 30px rgba(74,222,128,0.15)"
            }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            <span className="text-sm font-medium" style={{ color: "var(--text)" }}>Publish times swapped</span>
          </div>
        </div>
      )}

      {/* Post Preview Modal */}
      {previewPost && (
        <PostPreviewModal post={previewPost} initialTab={previewTab} onClose={() => setPreviewPost(null)} />
      )}

      {/* ── Quick Reschedule Modal ── */}
      {reschedulePost && (() => {
        const allDates = [...new Set(MOCK_QUEUE.map(p => p.scheduledDate))];
        const quickTimes = ["06:00","09:00","12:00","15:00","18:00","21:00"];
        const quickLabels = ["6:00 AM","9:00 AM","12:00 PM","3:00 PM","6:00 PM","9:00 PM"];
        const to12 = (t: string) => {
          const [hStr, mStr] = t.split(":");
          let h = parseInt(hStr);
          const ampm = h >= 12 ? "PM" : "AM";
          if (h > 12) h -= 12;
          if (h === 0) h = 12;
          return `${h}:${mStr} ${ampm}`;
        };
        const handleSave = () => {
          const dateLabel = rescheduleDate === "Mar 27, 2026" ? "Today" : rescheduleDate === "Mar 28, 2026" ? "Tomorrow" : dateShort(rescheduleDate);
          const timeLabel = to12(rescheduleTime);
          const newScheduledAt = rescheduleDate === "Mar 27, 2026" || rescheduleDate === "Mar 28, 2026"
            ? `${dateLabel}, ${timeLabel}`
            : `${dateShort(rescheduleDate)}, ${timeLabel}`;
          setQueue(prev => prev.map(p =>
            p.id === reschedulePost.id ? { ...p, scheduledAt: newScheduledAt, scheduledDate: rescheduleDate } : p
          ));
          setReschedulePost(null);
        };
        return (
          <div
            style={{ position: "fixed", inset: 0, zIndex: 100, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={() => setReschedulePost(null)}
          >
            <div
              style={{ width: 400, backgroundColor: "var(--surface)", borderRadius: 16, padding: 24, border: "1px solid var(--border)", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[15px] font-bold" style={{ color: "var(--text)" }}>Reschedule Post</span>
                <button onClick={() => setReschedulePost(null)} style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              {/* Thumbnail + caption */}
              <div className="flex items-center gap-3 mb-5 p-3 rounded-xl" style={{ backgroundColor: "var(--bg)" }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: reschedulePost.page.color }}>
                  <span className="text-[9px] font-bold text-white">{reschedulePost.page.avatar}</span>
                </div>
                <p className="text-[11px] font-medium" style={{ color: "var(--text-secondary)" }}>
                  {reschedulePost.caption.slice(0, 40)}{reschedulePost.caption.length > 40 ? "…" : ""}
                </p>
              </div>
              {/* Date */}
              <div className="mb-4">
                <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: "var(--text-muted)" }}>Date</label>
                <select
                  value={rescheduleDate}
                  onChange={e => setRescheduleDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-[13px] font-medium"
                  style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)", outline: "none" }}
                >
                  {allDates.map(d => (
                    <option key={d} value={d}>{d === "Mar 27, 2026" ? `${d} (Today)` : d === "Mar 28, 2026" ? `${d} (Tomorrow)` : d}</option>
                  ))}
                </select>
              </div>
              {/* Time */}
              <div className="mb-4">
                <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: "var(--text-muted)" }}>Time</label>
                <input
                  type="time"
                  value={rescheduleTime}
                  onChange={e => setRescheduleTime(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-[13px] font-medium"
                  style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)", outline: "none" }}
                />
              </div>
              {/* Quick picks */}
              <div className="mb-5">
                <label className="text-[11px] font-semibold uppercase tracking-wider mb-2 block" style={{ color: "var(--text-muted)" }}>Quick picks</label>
                <div className="flex flex-wrap gap-1.5">
                  {quickTimes.map((t, i) => (
                    <button
                      key={t}
                      onClick={() => setRescheduleTime(t)}
                      className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all"
                      style={{
                        backgroundColor: rescheduleTime === t ? "var(--primary)" : "var(--surface-hover)",
                        color: rescheduleTime === t ? "white" : "var(--text-secondary)",
                      }}
                    >{quickLabels[i]}</button>
                  ))}
                </div>
              </div>
              {/* Footer */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setReschedulePost(null)}
                  className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold"
                  style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-secondary)" }}
                >Cancel</button>
                <button
                  onClick={handleSave}
                  className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-white flex items-center justify-center gap-2"
                  style={{ backgroundColor: "var(--primary)" }}
                >Save Changes <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Queue summary bar */}
      <div className="mt-4 flex items-center justify-between px-4 py-3 rounded-xl" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--success)" }} />
            <span className="text-[12px] font-medium" style={{ color: "var(--text-secondary)" }}>
              {displayPosts.length} posts on {activeDate || "—"}
            </span>
          </div>
          <div className="text-[12px]" style={{ color: "var(--text-muted)" }}>
            {counts.scheduled} total scheduled
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Next:</span>
          <span className="text-[12px] font-semibold" style={{ color: "var(--primary)" }}>
            {displayPosts.length > 0 ? displayPosts[0].scheduledAt : "—"}
          </span>
        </div>
      </div>

      {/* ── Sticky Bulk Action Bar ── slides up when posts are selected */}
      <div
        className="fixed bottom-0 left-[250px] right-0 z-40 transition-all duration-300 ease-out"
        style={{
          transform: selectedPosts.size > 0 ? "translateY(0)" : "translateY(100%)",
          opacity: selectedPosts.size > 0 ? 1 : 0,
          pointerEvents: selectedPosts.size > 0 ? "auto" : "none",
        }}
      >
        <div className="mx-8 mb-6">
          <div className="rounded-2xl border shadow-2xl px-5 py-4 flex items-center justify-between"
            style={{ backgroundColor: "var(--surface)", borderColor: "var(--primary)", boxShadow: "0 8px 40px rgba(255,107,43,0.15)" }}>

            {/* Left: selection info */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm text-white" style={{ backgroundColor: "var(--primary)" }}>
                  {selectedPosts.size}
                </div>
                <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                  {selectedPosts.size === 1 ? "post selected" : "posts selected"}
                </span>
              </div>
              <button
                onClick={() => setSelectedPosts(new Set())}
                className="text-xs px-2.5 py-1 rounded-lg transition-colors"
                style={{ color: "var(--text-muted)", backgroundColor: "var(--surface-hover)" }}
              >
                Deselect all
              </button>
            </div>

            {/* Right: actions */}
            <div className="flex items-center gap-2">
              {/* Reschedule */}
              <button
                onClick={() => setBulkAction("reschedule")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                style={{ backgroundColor: "var(--surface-hover)", color: "var(--text)" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Reschedule
              </button>

              {/* Add Thread */}
              <button
                onClick={() => { setBulkThreadText(""); setBulkThreadOverwrite(false); setShowBulkThreadModal(true); }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                style={{ backgroundColor: "var(--surface-hover)", color: "var(--text)" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Add Thread
              </button>

              {/* Move to Drafts */}
              <button
                onClick={() => setBulkAction("draft")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                style={{ backgroundColor: "var(--surface-hover)", color: "var(--text)" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                Move to Drafts
              </button>

              {/* Duplicate */}
              <button
                onClick={() => setBulkAction("duplicate")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                style={{ backgroundColor: "var(--surface-hover)", color: "var(--text)" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                Duplicate
              </button>

              {/* Divider */}
              <div className="w-px h-6 mx-1" style={{ backgroundColor: "var(--border)" }} />

              {/* Delete — optimistic with undo toast */}
              {bulkAction === "delete" ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>This cannot be undone immediately —</span>
                  <button
                    onClick={handleBulkDelete}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-red-500"
                  >
                    Delete {selectedPosts.size} posts
                  </button>
                  <button
                    onClick={() => setBulkAction(null)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium"
                    style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-muted)" }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setBulkAction("delete")}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors text-red-400 hover:bg-red-400/10"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bulk Add Thread Modal ── */}
      {showBulkThreadModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setShowBulkThreadModal(false)}>
          <div style={{ width: 480, backgroundColor: "var(--surface)", borderRadius: 16, padding: 24, border: "1px solid var(--border)", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}
            onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-[15px] font-bold" style={{ color: "var(--text)" }}>Bulk Add Thread Comment</span>
              <button onClick={() => setShowBulkThreadModal(false)} style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            {/* Info bar */}
            <div className="flex items-center gap-2 mb-4 px-4 py-2.5 rounded-xl" style={{ backgroundColor: "rgba(255,107,43,0.08)", borderRadius: 10 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <span className="text-[12px] font-medium" style={{ color: "var(--primary)" }}>Applying to {selectedPosts.size} selected post{selectedPosts.size !== 1 ? "s" : ""}</span>
            </div>
            {/* Textarea */}
            <div className="mb-4">
              <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: "var(--text-muted)" }}>Thread Comment</label>
              <textarea
                value={bulkThreadText}
                onChange={e => setBulkThreadText(e.target.value)}
                placeholder="Type your thread comment here..."
                rows={4}
                className="w-full px-3 py-2.5 rounded-xl text-[13px] resize-none outline-none"
                style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
              />
              <p className="mt-1.5 text-[11px]" style={{ color: "var(--text-muted)" }}>This comment will be added as the first reply on each selected post when it publishes.</p>
            </div>
            {/* Overwrite checkbox */}
            <label className="flex items-start gap-2 mb-5 cursor-pointer">
              <input type="checkbox" checked={bulkThreadOverwrite} onChange={e => setBulkThreadOverwrite(e.target.checked)} style={{ accentColor: "var(--primary)", marginTop: 2 }} />
              <div>
                <span className="text-[12px] font-medium block" style={{ color: "var(--text)" }}>Apply to posts that already have threads</span>
                <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>This will add as an additional comment to posts that already have thread replies</span>
              </div>
            </label>
            {/* Footer */}
            <div className="flex items-center gap-3">
              <button onClick={() => setShowBulkThreadModal(false)} className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-secondary)" }}>Cancel</button>
              <button
                onClick={() => {
                  if (!bulkThreadText.trim()) return;
                  const n = selectedPosts.size;
                  setQueue(prev => prev.map(p => {
                    if (!selectedPosts.has(p.id)) return p;
                    if (!bulkThreadOverwrite && p.comments.length > 0) return { ...p, comments: [...p.comments, bulkThreadText.trim()] };
                    return { ...p, comments: [...p.comments, bulkThreadText.trim()] };
                  }));
                  const msg = `Thread comment added to ${n} post${n !== 1 ? "s" : ""}`;
                  setThreadSuccessToast(msg);
                  setTimeout(() => setThreadSuccessToast(null), 2500);
                  setShowBulkThreadModal(false);
                  setSelectedPosts(new Set());
                }}
                className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-white flex items-center justify-center gap-2"
                style={{ backgroundColor: bulkThreadText.trim() ? "var(--primary)" : "var(--border)", cursor: bulkThreadText.trim() ? "pointer" : "not-allowed" }}
              >
                Apply to {selectedPosts.size} post{selectedPosts.size !== 1 ? "s" : ""} <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Thread success toast */}
      {threadSuccessToast && (
        <div className="fixed top-6 right-8 z-50">
          <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border"
            style={{ backgroundColor: "var(--surface)", borderColor: "var(--success)", boxShadow: "0 8px 30px rgba(74,222,128,0.15)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            <span className="text-sm font-medium" style={{ color: "var(--text)" }}>{threadSuccessToast}</span>
          </div>
        </div>
      )}

      {/* ── Action feedback toast ── */}
      {bulkAction && bulkAction !== "delete" && (
        <div className="fixed bottom-28 right-8 z-50">
          <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border"
            style={{ backgroundColor: "var(--surface)", borderColor: "var(--success)", boxShadow: "0 8px 30px rgba(74,222,128,0.15)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
              {bulkAction === "reschedule" && `${selectedPosts.size} posts queued for rescheduling`}
              {bulkAction === "draft" && `${selectedPosts.size} posts moved to drafts`}
              {bulkAction === "duplicate" && `${selectedPosts.size} posts duplicated`}
            </span>
            <button onClick={() => { setBulkAction(null); setSelectedPosts(new Set()); }} style={{ color: "var(--text-muted)" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>
      )}

      {/* ── Undo Delete Toast ── */}
      {undoToast && (
        <div className="fixed bottom-8 left-1/2 z-50" style={{ transform: "translateX(-50%)" }}>
          <div
            className="flex items-center gap-4 px-5 py-3.5 rounded-2xl shadow-2xl border"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
              minWidth: 360,
            }}
          >
            {/* Icon */}
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(239,68,68,0.12)" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
              </svg>
            </div>

            {/* Message */}
            <div className="flex-1">
              <span className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>
                {undoToast.count} post{undoToast.count !== 1 ? "s" : ""} deleted
              </span>
              <span className="text-[12px] ml-2" style={{ color: "var(--text-muted)" }}>
                · undoable for {undoCountdown}s
              </span>
            </div>

            {/* Countdown ring + Undo button */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Visual countdown bar */}
              <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--surface-hover)" }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(undoCountdown / 5) * 100}%`,
                    backgroundColor: undoCountdown <= 2 ? "#EF4444" : "#FF6B2B",
                    transition: "width 1s linear",
                  }}
                />
              </div>
              <button
                onClick={handleUndo}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-bold transition-all"
                style={{
                  backgroundColor: "var(--primary)",
                  color: "white",
                  boxShadow: "0 4px 14px var(--primary-glow)",
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 7v6h6"/><path d="M3 13C5.5 7 12 5 17 8s6 10 3 15"/>
                </svg>
                Undo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
