"use client";
import { useState } from "react";
import Header from "@/components/Header";
import PostPreviewModal from "@/components/modals/PostPreviewModal";
import PageBatchSelector from "@/components/PageBatchSelector";

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

  // Money Matters
  { id: "q126", thumbnail: "", caption: "The one budgeting rule that actually works — and it's not the 50/30/20 split", page: MM, platforms: ["fb","ig"], scheduledAt: "Today, 8:30 AM", scheduledDate: "Mar 27, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q127", thumbnail: "", caption: "The $5 coffee habit is NOT why you're broke. Here's what actually matters", page: MM, platforms: ["fb","ig"], scheduledAt: "Today, 11:30 AM", scheduledDate: "Mar 27, 2026", type: "photo", status: "failed", comments: [] },
  { id: "q128", thumbnail: "", caption: "Index funds beat 90% of actively managed funds over 20 years. Here's the data", page: MM, platforms: ["fb","ig"], scheduledAt: "Today, 2:30 PM", scheduledDate: "Mar 27, 2026", type: "photo", status: "scheduled", comments: ["S&P 500 20yr annualized return: 9.8%", "Average actively managed fund: 7.1% after fees", "That 2.7% gap = $340k difference on a $100k investment over 20 years"] },
  { id: "q129", thumbnail: "", caption: "How to build a $10k/month income with nothing but a smartphone — realistic 12-month breakdown", page: MM, platforms: ["fb","ig"], scheduledAt: "Today, 5:30 PM", scheduledDate: "Mar 27, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q130", thumbnail: "", caption: "The most expensive financial mistake people make in their 30s (nobody talks about this)", page: MM, platforms: ["fb","ig"], scheduledAt: "Today, 8:00 PM", scheduledDate: "Mar 27, 2026", type: "photo", status: "scheduled", comments: [] },

  // Know Her Name
  { id: "q131", thumbnail: "", caption: "Elizabeth Cady Stanton organized the first women's rights convention in 1848. Most people can't name her", page: KH, platforms: ["fb","ig","th"], scheduledAt: "Today, 9:00 AM", scheduledDate: "Mar 27, 2026", type: "photo", status: "scheduled", comments: ["She organized Seneca Falls Convention at age 33", "Drafted the Declaration of Sentiments modeled on the Declaration of Independence", "Fought for suffrage for 50 years — died 18 years before women could vote"] },
  { id: "q132", thumbnail: "", caption: "Marie Curie was told women couldn't be scientists. She won two Nobel Prizes anyway", page: KH, platforms: ["fb","ig","th"], scheduledAt: "Today, 11:00 AM", scheduledDate: "Mar 27, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q133", thumbnail: "", caption: "Rosalind Franklin discovered the structure of DNA. Watson and Crick took the credit and the Nobel Prize", page: KH, platforms: ["fb","ig"], scheduledAt: "Today, 1:30 PM", scheduledDate: "Mar 27, 2026", type: "photo", status: "scheduled", comments: ["Her Photo 51 X-ray image was shown to Watson without her permission", "Watson admitted this in his autobiography — she was never acknowledged", "She died in 1958, four years before Watson, Crick and Wilkins won the Nobel Prize"] },
  { id: "q134", thumbnail: "", caption: "Hedy Lamarr was Hollywood's biggest star — and secretly invented the technology behind WiFi and Bluetooth", page: KH, platforms: ["fb","ig","th"], scheduledAt: "Today, 4:00 PM", scheduledDate: "Mar 27, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q135", thumbnail: "", caption: "Sojourner Truth never learned to read or write. Her speeches changed the course of American history", page: KH, platforms: ["fb","ig"], scheduledAt: "Today, 7:00 PM", scheduledDate: "Mar 27, 2026", type: "reel", status: "scheduled", comments: [] },

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
  { id: "q226", thumbnail: "", caption: "The hidden fees eating your investment returns — most people have no idea they're paying this", page: MM, platforms: ["fb","ig"], scheduledAt: "Tomorrow, 8:30 AM", scheduledDate: "Mar 28, 2026", type: "photo", status: "failed", comments: [] },
  { id: "q227", thumbnail: "", caption: "Why renting is not 'throwing money away' — the actual math might surprise you", page: MM, platforms: ["fb","ig"], scheduledAt: "Tomorrow, 12:00 PM", scheduledDate: "Mar 28, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q228", thumbnail: "", caption: "The 1% rule for real estate investing — how to quickly screen any rental property", page: MM, platforms: ["fb","ig"], scheduledAt: "Tomorrow, 3:00 PM", scheduledDate: "Mar 28, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q229", thumbnail: "", caption: "Credit score myths debunked: what actually moves your number up or down", page: MM, platforms: ["fb","ig"], scheduledAt: "Tomorrow, 6:00 PM", scheduledDate: "Mar 28, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q230", thumbnail: "", caption: "Your emergency fund is losing value every year. Here's where to actually keep it", page: MM, platforms: ["fb","ig"], scheduledAt: "Tomorrow, 8:30 PM", scheduledDate: "Mar 28, 2026", type: "photo", status: "scheduled", comments: [] },

  // Know Her Name
  { id: "q231", thumbnail: "", caption: "Ada Lovelace wrote the first computer program in 1843 — for a machine that didn't exist yet", page: KH, platforms: ["fb","ig","th"], scheduledAt: "Tomorrow, 9:00 AM", scheduledDate: "Mar 28, 2026", type: "photo", status: "scheduled", comments: ["Charles Babbage got the credit but Lovelace wrote the algorithm", "Her notes were more insightful than Babbage's own work on the Analytical Engine"] },
  { id: "q232", thumbnail: "", caption: "Harriet Tubman made 13 missions and freed 70 people. She never lost a single passenger", page: KH, platforms: ["fb","ig","th"], scheduledAt: "Tomorrow, 11:30 AM", scheduledDate: "Mar 28, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q233", thumbnail: "", caption: "Katherine Johnson calculated the trajectories for Apollo 11 by hand. NASA double-checked her math — she was right", page: KH, platforms: ["fb","ig"], scheduledAt: "Tomorrow, 2:00 PM", scheduledDate: "Mar 28, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q234", thumbnail: "", caption: "Wangari Maathai planted 47 million trees and won the Nobel Peace Prize. This is her story", page: KH, platforms: ["fb","ig","th"], scheduledAt: "Tomorrow, 5:00 PM", scheduledDate: "Mar 28, 2026", type: "reel", status: "scheduled", comments: [] },
  { id: "q235", thumbnail: "", caption: "Malala Yousafzai survived a Taliban assassination attempt at 15. She graduated from Oxford at 20", page: KH, platforms: ["fb","ig"], scheduledAt: "Tomorrow, 7:30 PM", scheduledDate: "Mar 28, 2026", type: "photo", status: "scheduled", comments: [] },

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
  { id: "q332", thumbnail: "", caption: "Frida Kahlo painted 55 of her 143 works while lying flat in bed recovering from injuries", page: KH, platforms: ["fb","ig","th"], scheduledAt: "Mar 29, 11:30 AM", scheduledDate: "Mar 29, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q333", thumbnail: "", caption: "Maya Angelou had more than 50 jobs before writing 'I Know Why the Caged Bird Sings' at age 41", page: KH, platforms: ["fb","ig"], scheduledAt: "Mar 29, 2:00 PM", scheduledDate: "Mar 29, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q334", thumbnail: "", caption: "Coco Chanel single-handedly ended the corset era and redefined what women wear. Here's how", page: KH, platforms: ["fb","ig","th"], scheduledAt: "Mar 29, 4:30 PM", scheduledDate: "Mar 29, 2026", type: "reel", status: "scheduled", comments: [] },
  { id: "q335", thumbnail: "", caption: "Ruth Bader Ginsburg applied to 40 law firms after graduating top of her class. All rejected her for being a woman", page: KH, platforms: ["fb","ig"], scheduledAt: "Mar 29, 7:00 PM", scheduledDate: "Mar 29, 2026", type: "photo", status: "scheduled", comments: [] },

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
  { id: "q416", thumbnail: "", caption: "The programming language you learn first matters less than you think — here's what actually matters", page: TB, platforms: ["fb","ig"], scheduledAt: "Mar 30, 7:30 AM", scheduledDate: "Mar 30, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q417", thumbnail: "", caption: "Every website you visit knows your location, device, browser, and browsing history. Here's how to stop it", page: TB, platforms: ["fb","ig","th"], scheduledAt: "Mar 30, 11:00 AM", scheduledDate: "Mar 30, 2026", type: "reel", status: "scheduled", comments: [] },
  { id: "q418", thumbnail: "", caption: "Quantum computing explained for normal people — and why it's not the threat to encryption everyone thinks", page: TB, platforms: ["fb","ig"], scheduledAt: "Mar 30, 2:00 PM", scheduledDate: "Mar 30, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q419", thumbnail: "", caption: "The 10 keyboard shortcuts that will save you 45 minutes every single day", page: TB, platforms: ["fb","ig","th"], scheduledAt: "Mar 30, 5:00 PM", scheduledDate: "Mar 30, 2026", type: "reel", status: "scheduled", comments: [] },
  { id: "q420", thumbnail: "", caption: "Why the best developers write less code, not more — the philosophy behind elegant software", page: TB, platforms: ["fb","ig"], scheduledAt: "Mar 30, 8:00 PM", scheduledDate: "Mar 30, 2026", type: "photo", status: "scheduled", comments: [] },

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
  { id: "q432", thumbnail: "", caption: "Toni Morrison was a single mother working as an editor when she wrote 'The Bluest Eye' at 5am every morning", page: KH, platforms: ["fb","ig","th"], scheduledAt: "Mar 30, 11:30 AM", scheduledDate: "Mar 30, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q433", thumbnail: "", caption: "Angela Merkel led Germany for 16 years and is the longest-serving female head of government in history", page: KH, platforms: ["fb","ig"], scheduledAt: "Mar 30, 2:00 PM", scheduledDate: "Mar 30, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q434", thumbnail: "", caption: "Serena Williams won the Australian Open while 8 weeks pregnant and didn't know it", page: KH, platforms: ["fb","ig","th"], scheduledAt: "Mar 30, 5:00 PM", scheduledDate: "Mar 30, 2026", type: "reel", status: "scheduled", comments: [] },
  { id: "q435", thumbnail: "", caption: "Florence Nightingale invented data visualization. Her 'rose diagram' saved more lives than her nursing did", page: KH, platforms: ["fb","ig"], scheduledAt: "Mar 30, 7:30 PM", scheduledDate: "Mar 30, 2026", type: "photo", status: "scheduled", comments: [] },
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

export default function QueuePage() {
  const [filter, setFilter] = useState<"all" | "scheduled" | "failed">("all");
  const [selectedPage, setSelectedPage] = useState("all");
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [queue, setQueue] = useState<QueuePost[]>(MOCK_QUEUE);
  const [swapToast, setSwapToast] = useState<string | null>(null);
  const [previewPost, setPreviewPost] = useState<QueuePost | null>(null);
  const [previewTab, setPreviewTab] = useState<"preview" | "comments" | "settings">("preview");
  const [bulkAction, setBulkAction] = useState<string | null>(null);

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

  const pages = [
    { id: "all", name: "All Pages" },
    { id: "hu", name: "History Uncovered" },
    { id: "lc", name: "Laugh Central" },
    { id: "tb", name: "TechByte" },
    { id: "ff", name: "Fitness Factory" },
    { id: "dh", name: "Daily Health Tips" },
    { id: "mm", name: "Money Matters" },
    { id: "khn", name: "Know Her Name" },
  ];

  const pageIdToName: Record<string, string> = { hu: "History Uncovered", lc: "Laugh Central", tb: "TechByte", ff: "Fitness Factory", dh: "Daily Health Tips", mm: "Money Matters", khn: "Know Her Name" };
  const batchPages: Record<string, string[]> = { b1: ["lc", "ff", "dh"], b2: ["hu", "tb", "mm"], b3: ["khn"] };

  const getFilteredNames = (): string[] | null => {
    if (selectedPage === "all") return null;
    if (batchPages[selectedPage]) return batchPages[selectedPage].map(id => pageIdToName[id]);
    return [pageIdToName[selectedPage]].filter(Boolean);
  };

  const filterNames = getFilteredNames();

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
      if (filter !== "all" && p.status !== filter) return false;
      if (filterNames && !filterNames.includes(p.page.name)) return false;
      return true;
    })
    .sort((a, b) => parseTime(a) - parseTime(b)); // always sorted by publish time

  const counts = {
    all: queue.filter(matchesScope).length,
    scheduled: queue.filter(p => p.status === "scheduled" && matchesScope(p)).length,
    failed: queue.filter(p => p.status === "failed" && matchesScope(p)).length,
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedPosts);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedPosts(next);
  };

  const selectAll = () => {
    if (selectedPosts.size === filtered.length) {
      setSelectedPosts(new Set());
    } else {
      setSelectedPosts(new Set(filtered.map(p => p.id)));
    }
  };

  // Group by date
  const grouped = filtered.reduce<Record<string, QueuePost[]>>((acc, post) => {
    const key = post.scheduledDate;
    if (!acc[key]) acc[key] = [];
    acc[key].push(post);
    return acc;
  }, {});

  return (
    <div>
      <Header
        title="Queue"
        subtitle={`${counts.all} posts queued across ${new Set(queue.map(p => p.page.name)).size} pages`}
        actions={
          <button
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white"
            style={{ backgroundColor: "var(--primary)", boxShadow: "0 4px 14px var(--primary-glow)" }}
            onClick={() => window.location.href = "/upload"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Posts
          </button>
        }
      />

      {/* Filters bar */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-1 p-1 rounded-xl" style={{ backgroundColor: "var(--surface)" }}>
          {(["all", "scheduled", "failed"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-medium transition-all"
              style={{
                backgroundColor: filter === f ? "var(--primary)" : "transparent",
                color: filter === f ? "white" : "var(--text-secondary)",
              }}
            >
              {f === "all" ? "All" : f === "scheduled" ? "Scheduled" : "Failed"}
              <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{
                backgroundColor: filter === f ? "rgba(255,255,255,0.2)" : "var(--surface-hover)",
                color: filter === f ? "white" : "var(--text-muted)",
              }}>
                {counts[f]}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Page filter */}
          <PageBatchSelector
            selected={selectedPage}
            onChange={(id) => setSelectedPage(id)}
          />

        </div>
      </div>

      {/* Queue grid header */}
      <div className="rounded-t-xl border border-b-0" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="grid items-center px-4 py-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)", gridTemplateColumns: "36px 3fr 120px 60px 90px 140px 60px 32px" }}>
          <div>
            <input
              type="checkbox"
              checked={selectedPosts.size === filtered.length && filtered.length > 0}
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

      {/* Queue rows grouped by date */}
      <div className="rounded-b-xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
        {Object.keys(grouped).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20" style={{ backgroundColor: "var(--surface)" }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: "var(--primary-muted)" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <h3 className="text-[16px] font-semibold mb-1" style={{ color: "var(--text)" }}>No posts in queue</h3>
            <p className="text-[13px] mb-4" style={{ color: "var(--text-secondary)" }}>Upload content or create a single post to get started</p>
            <button className="px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white" style={{ backgroundColor: "var(--primary)", boxShadow: "0 4px 14px var(--primary-glow)" }}>
              Go to Bulk Upload
            </button>
          </div>
        ) : (
          Object.entries(grouped).map(([date, posts]) => (
            <div key={date}>
              {/* Date separator */}
              <div className="px-4 py-2.5 border-b flex items-center gap-2" style={{ backgroundColor: "var(--bg)", borderColor: "var(--border)" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-muted)" }}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{date}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-muted)" }}>{posts.length}</span>
              </div>

              {posts.map((post) => (
                <div key={post.id}>
                  <div
                    className="grid items-center px-4 py-3 border-b transition-all cursor-pointer"
                    style={{
                      backgroundColor: selectedPosts.has(post.id) ? "var(--primary-muted)" : dragOverId === post.id ? "rgba(255,107,43,0.08)" : dragId === post.id ? "var(--surface-hover)" : "var(--surface)",
                      borderColor: "var(--border)",
                      borderLeft: dragOverId === post.id ? "2px solid var(--primary)" : "2px solid transparent",
                      opacity: dragId === post.id ? 0.5 : 1,
                      gridTemplateColumns: "36px 3fr 120px 60px 90px 140px 60px 32px",
                    }}
                    onDragOver={(e) => { e.preventDefault(); setDragOverId(post.id); }}
                    onDragLeave={() => setDragOverId(null)}
                    onDrop={() => handleDrop(post.id)}
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

                    {/* Schedule time */}
                    <div className="text-[12px] font-medium" style={{ color: "var(--text-secondary)" }}>
                      {post.scheduledAt}
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

                    {/* Drag handle */}
                    <div
                      draggable
                      className="cursor-grab active:cursor-grabbing flex items-center justify-center"
                      onClick={e => e.stopPropagation()}
                      onDragStart={e => { e.stopPropagation(); setDragId(post.id); }}
                      onDragEnd={() => { setDragId(null); setDragOverId(null); }}
                      title="Drag to swap publish time"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-muted)" }}>
                        <circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/>
                        <circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/>
                        <circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/>
                      </svg>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {/* Drag swap toast */}
      {swapToast && (
        <div className="fixed top-6 right-8 z-50 transition-all">
          <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: swapToast === "cross-date" ? "var(--warning)" : "var(--success)",
              boxShadow: swapToast === "cross-date" ? "0 8px 30px rgba(251,191,36,0.15)" : "0 8px 30px rgba(74,222,128,0.15)"
            }}>
            {swapToast === "cross-date" ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                <span className="text-sm font-medium" style={{ color: "var(--text)" }}>Can&apos;t drag across days — use Reschedule instead</span>
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span className="text-sm font-medium" style={{ color: "var(--text)" }}>Publish times swapped</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Post Preview Modal */}
      {previewPost && (
        <PostPreviewModal post={previewPost} initialTab={previewTab} onClose={() => setPreviewPost(null)} />
      )}

      {/* Queue summary bar */}
      <div className="mt-4 flex items-center justify-between px-4 py-3 rounded-xl" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--success)" }} />
            <span className="text-[12px] font-medium" style={{ color: "var(--text-secondary)" }}>{counts.scheduled} scheduled</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--error)" }} />
            <span className="text-[12px] font-medium" style={{ color: "var(--text-secondary)" }}>{counts.failed} failed</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Next publish:</span>
          <span className="text-[12px] font-semibold" style={{ color: "var(--primary)" }}>Today, 2:30 PM</span>
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

              {/* Delete — destructive */}
              {bulkAction === "delete" ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>Delete {selectedPosts.size} posts?</span>
                  <button
                    onClick={() => { setSelectedPosts(new Set()); setBulkAction(null); }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-red-500"
                  >
                    Confirm Delete
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
    </div>
  );
}
