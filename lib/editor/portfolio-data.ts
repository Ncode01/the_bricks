import type { ClipMeta, Marker, MediaItem, Sequence, TimelineClip, Track } from "./types";

const defaultTransform = {
	x: 0,
	y: 0,
	scale: 1,
	rotation: 0,
	opacity: 1
};

type PortfolioSequenceData = {
	id: string;
	sequence: Sequence;
	tracks: Track[];
	clips: TimelineClip[];
	markers: Marker[];
};

const baseTracks: Track[] = [
	{
		id: "v3",
		name: "V3",
		type: "video",
		muted: false,
		solo: false,
		locked: false,
		visible: true
	},
	{
		id: "v2",
		name: "V2",
		type: "video",
		muted: false,
		solo: false,
		locked: false,
		visible: true
	},
	{
		id: "v1",
		name: "V1",
		type: "video",
		muted: false,
		solo: false,
		locked: false,
		visible: true
	},
	{
		id: "a1",
		name: "A1",
		type: "audio",
		muted: false,
		solo: false,
		locked: false,
		visible: true
	},
	{
		id: "a2",
		name: "A2",
		type: "audio",
		muted: false,
		solo: false,
		locked: false,
		visible: true
	}
];

const mainSequence: Sequence = {
	id: "seq-main",
	name: "SEQ_01: THE BRICKS",
	fps: 24,
	width: 1920,
	height: 1080
};

const projectSequence: Sequence = {
	id: "seq-arc",
	name: "SEQ_02: ARC / FJORD",
	fps: 24,
	width: 1920,
	height: 1080
};

const makeClip = (payload: {
	id: string;
	trackId: string;
	name: string;
	start: number;
	end: number;
	type: "video" | "audio";
	meta?: ClipMeta;
	mediaId?: string;
}): TimelineClip => ({
	id: payload.id,
	mediaId: payload.mediaId,
	trackId: payload.trackId,
	name: payload.name,
	type: payload.type,
	start: payload.start,
	end: payload.end,
	inPoint: 0,
	outPoint: payload.end - payload.start,
	transform: { ...defaultTransform },
	meta: payload.meta
});

const mainClips: TimelineClip[] = [
	makeClip({
		id: "clip-brand-intro",
		trackId: "v2",
		name: "BRAND INTRO",
		start: 0,
		end: 10,
		type: "video",
		meta: {
			category: "brand",
			label: "BRAND INTRO",
			subtitle: "Story-first production house",
			summary:
				"The Bricks builds cinematic narratives that move with intention and finish with impact.",
			description:
				"We architect every production like a sequence: structured, modular, and built to carry the client objective through to final delivery.",
			tags: ["Manifesto", "Studio Identity", "Story-First"],
			services: ["Creative Direction", "Production", "Post"],
			deliverables: ["Hero Film", "Cutdowns", "Social Kit"],
			display: "slate",
			color: "violet"
		}
	}),
	makeClip({
		id: "clip-about",
		trackId: "v2",
		name: "ABOUT THE BRICKS",
		start: 10,
		end: 22,
		type: "video",
		meta: {
			category: "about",
			label: "ABOUT THE BRICKS",
			subtitle: "Concept to final, fully in-house",
			summary:
				"A production house engineered for clarity. We design, shoot, and finish under one roof.",
			description:
				"Our teams stay lean and aligned, keeping the vision intact from the first treatment to the final master.",
			tags: ["In-House", "Full Service", "Precision"],
			services: ["Strategy", "Production", "Post"],
			deliverables: ["Treatment", "Shoot", "Master"],
			display: "slate",
			color: "lavender"
		}
	}),
	makeClip({
		id: "clip-work",
		trackId: "v2",
		name: "FEATURED WORK",
		start: 22,
		end: 36,
		type: "video",
		meta: {
			category: "work",
			label: "FEATURED WORK",
			subtitle: "Commercials, fashion, narrative",
			summary:
				"Signature work spanning documentary, fashion, branded film, and narrative campaigns.",
			description:
				"Every project is structured around a clear objective, crafted visuals, and a delivery plan built to travel.",
			tags: ["Campaigns", "Narrative", "Branded Content"],
			services: ["Cinematography", "Edit", "Finishing"],
			deliverables: ["Hero", "Broadcast", "Social"],
			display: "grid",
			color: "violet",
			sequenceId: "seq-arc"
		}
	}),
	makeClip({
		id: "clip-services",
		trackId: "v2",
		name: "SERVICES",
		start: 36,
		end: 48,
		type: "video",
		meta: {
			category: "services",
			label: "SERVICES",
			subtitle: "Strategic to technical",
			summary:
				"Creative development, production, post, and delivery under one pipeline.",
			description:
				"We cover story development, casting, production management, edit, color, sound, and final delivery.",
			tags: ["Concept", "Production", "Post"],
			services: ["Creative Development", "Production", "Post"],
			deliverables: ["Campaign Toolkit", "Masters"],
			display: "stack",
			color: "lavender"
		}
	}),
	makeClip({
		id: "clip-process-concept",
		trackId: "v2",
		name: "PROCESS: CONCEPT",
		start: 48,
		end: 58,
		type: "video",
		meta: {
			category: "process",
			label: "PROCESS: CONCEPT",
			subtitle: "Strategy, narrative, boards",
			summary:
				"We translate the brief into a story map and a visual treatment.",
			description:
				"Writers, directors, and producers align on tone, pacing, and delivery targets.",
			tags: ["Brief", "Treatment", "Story"],
			services: ["Creative Direction"],
			deliverables: ["Treatment", "Boards"],
			display: "slate",
			color: "violet"
		}
	}),
	makeClip({
		id: "clip-process-production",
		trackId: "v2",
		name: "PROCESS: PRODUCTION",
		start: 58,
		end: 70,
		type: "video",
		meta: {
			category: "process",
			label: "PROCESS: PRODUCTION",
			subtitle: "Crewed, captured, controlled",
			summary:
				"Lean crews with disciplined shot planning keep the story intact on set.",
			description:
				"We run a modular unit: camera, lighting, and art locked to a consistent visual language.",
			tags: ["Set", "Capture", "Direction"],
			services: ["Production"],
			deliverables: ["Principal Photography"],
			display: "slate",
			color: "lavender"
		}
	}),
	makeClip({
		id: "clip-process-post",
		trackId: "v2",
		name: "PROCESS: POST",
		start: 70,
		end: 80,
		type: "video",
		meta: {
			category: "process",
			label: "PROCESS: POST",
			subtitle: "Edit, color, sound",
			summary:
				"Editorial rhythm, finishing, and sound design happen in one continuous flow.",
			description:
				"We keep feedback tight and revisions clean, delivering ready-to-launch masters.",
			tags: ["Edit", "Color", "Sound"],
			services: ["Post Production"],
			deliverables: ["Master Cut"],
			display: "slate",
			color: "violet"
		}
	}),
	makeClip({
		id: "clip-process-delivery",
		trackId: "v2",
		name: "PROCESS: DELIVERY",
		start: 80,
		end: 90,
		type: "video",
		meta: {
			category: "process",
			label: "PROCESS: DELIVERY",
			subtitle: "Versioning and rollout",
			summary:
				"Final outputs arrive as a complete deliverables package.",
			description:
				"We hand off format-safe masters, social cutdowns, and archival project files.",
			tags: ["Export", "Versioning"],
			services: ["Delivery"],
			deliverables: ["Masters", "Cutdowns"],
			display: "slate",
			color: "lavender"
		}
	}),
	makeClip({
		id: "clip-clients",
		trackId: "v2",
		name: "CLIENTS",
		start: 90,
		end: 102,
		type: "video",
		meta: {
			category: "clients",
			label: "CLIENTS",
			subtitle: "Trusted partners",
			summary:
				"We collaborate with brands, agencies, and studios who value precision.",
			description:
				"Automotive, fashion, tech, and culture partners rely on our end-to-end pipeline.",
			tags: ["Partnerships", "Retention"],
			services: ["Production"],
			deliverables: ["Campaign Toolkits"],
			display: "grid",
			color: "violet"
		}
	}),
	makeClip({
		id: "clip-testimonials",
		trackId: "v2",
		name: "TESTIMONIALS",
		start: 102,
		end: 112,
		type: "video",
		meta: {
			category: "testimonials",
			label: "TESTIMONIALS",
			subtitle: "Client notes",
			summary:
				"\"The Bricks kept the story clean and elevated our visual language.\"",
			description:
				"\"They delivered a full suite ahead of schedule without compromising craft.\"",
			tags: ["Feedback", "Approval"],
			services: ["Post"],
			deliverables: ["Final Delivery"],
			display: "slate",
			color: "lavender"
		}
	}),
	makeClip({
		id: "clip-contact",
		trackId: "v2",
		name: "CONTACT",
		start: 112,
		end: 124,
		type: "video",
		meta: {
			category: "contact",
			label: "CONTACT",
			subtitle: "Start the sequence",
			summary: "hello@thebricks.studio · Los Angeles",
			description:
				"Tell us the objective, timeline, and target audience. We respond within 48 hours.",
			tags: ["Inquiry", "Availability"],
			services: ["Production"],
			deliverables: ["Estimate", "Treatment"],
			display: "slate",
			color: "violet"
		}
	}),
	makeClip({
		id: "clip-booking",
		trackId: "v2",
		name: "BOOKING",
		start: 124,
		end: 138,
		type: "video",
		meta: {
			category: "booking",
			label: "BOOKING",
			subtitle: "Reserve production window",
			summary:
				"Booking opens for Q3 and Q4. Priority to multi-deliverable campaigns.",
			description:
				"We assemble a tailored production stack after the discovery call.",
			tags: ["Scheduling", "Pipeline"],
			services: ["Production"],
			deliverables: ["Schedule", "Crew"],
			display: "slate",
			color: "lavender"
		}
	}),
	makeClip({
		id: "clip-delivery",
		trackId: "v2",
		name: "FINAL OUTPUT",
		start: 138,
		end: 150,
		type: "video",
		meta: {
			category: "delivery",
			label: "FINAL OUTPUT",
			subtitle: "Export and delivery",
			summary: "Mastered deliverables with full archive handoff.",
			description:
				"We deliver masters, cutdowns, and the full project package for future expansions.",
			tags: ["Delivery", "Archive"],
			services: ["Post"],
			deliverables: ["Masters", "Archive"],
			display: "slate",
			color: "violet"
		}
	}),
	makeClip({
		id: "clip-brief-note",
		trackId: "v3",
		name: "CLIENT BRIEF: OBJECTIVE",
		start: 4,
		end: 26,
		type: "video",
		meta: {
			category: "notes",
			label: "CLIENT BRIEF",
			subtitle: "Objective alignment",
			summary:
				"Define impact: awareness, conversion, or cultural moment. Every brick fits the objective.",
			display: "slate",
			color: "lavender"
		}
	}),
	makeClip({
		id: "clip-support-visuals",
		trackId: "v1",
		name: "SHOTS / VISUAL KEYS",
		start: 32,
		end: 58,
		type: "video",
		meta: {
			category: "notes",
			label: "VISUAL KEYS",
			subtitle: "Frame references",
			summary: "Shot list blocks for product, talent, and atmosphere coverage.",
			display: "grid",
			color: "lavender"
		}
	}),
	makeClip({
		id: "clip-audio-narration",
		trackId: "a1",
		name: "NARRATION - BRICKS MANIFESTO",
		start: 0,
		end: 90,
		type: "audio",
		meta: {
			category: "audio",
			label: "NARRATION",
			subtitle: "Studio mission",
			summary: "Voiceover describing the studio philosophy and pipeline.",
			display: "slate",
			color: "cyan"
		}
	}),
	makeClip({
		id: "clip-audio-ambience",
		trackId: "a2",
		name: "AMBIENCE - STUDIO FLOOR",
		start: 20,
		end: 150,
		type: "audio",
		meta: {
			category: "audio",
			label: "AMBIENCE",
			subtitle: "Room tone",
			summary: "Low industrial ambience supporting the edit bay atmosphere.",
			display: "slate",
			color: "cyan"
		}
	})
];

const mainMarkers: Marker[] = [
	{ id: "mk-brand", time: 0, label: "MANIFESTO", tone: "cyan" },
	{ id: "mk-about", time: 10, label: "ABOUT", tone: "cyan" },
	{ id: "mk-work", time: 22, label: "WORK", tone: "cyan" },
	{ id: "mk-services", time: 36, label: "SERVICES", tone: "cyan" },
	{ id: "mk-process", time: 48, label: "PROCESS", tone: "cyan" },
	{ id: "mk-clients", time: 90, label: "CLIENTS", tone: "cyan" },
	{ id: "mk-contact", time: 112, label: "CONTACT", tone: "cyan" },
	{ id: "mk-delivery", time: 138, label: "DELIVERY", tone: "cyan" }
];

const projectClips: TimelineClip[] = [
	makeClip({
		id: "clip-arc-brief",
		trackId: "v2",
		name: "BRIEF",
		start: 0,
		end: 12,
		type: "video",
		meta: {
			category: "project",
			label: "ARC / FJORD",
			subtitle: "Aurora Studios · Documentary",
			summary:
				"A cold-water portrait of a coastal research team mapping new currents.",
			description:
				"We framed breath, gloved hands, and field instruments to keep the science human.",
			tags: ["Documentary", "Field Unit"],
			services: ["Cinematography", "Edit"],
			deliverables: ["Hero Film"],
			display: "slate",
			color: "violet"
		}
	}),
	makeClip({
		id: "clip-arc-concept",
		trackId: "v2",
		name: "CONCEPT",
		start: 12,
		end: 26,
		type: "video",
		meta: {
			category: "project",
			label: "CONCEPT",
			subtitle: "Expedition journal",
			summary:
				"A moving logbook with controlled pacing and measured inserts.",
			description:
				"Natural light paired with minimal bounce to keep the palette steel-blue.",
			tags: ["Mood", "Story"],
			services: ["Creative"],
			deliverables: ["Treatment"],
			display: "slate",
			color: "lavender"
		}
	}),
	makeClip({
		id: "clip-arc-production",
		trackId: "v2",
		name: "PRODUCTION",
		start: 26,
		end: 42,
		type: "video",
		meta: {
			category: "project",
			label: "PRODUCTION",
			subtitle: "Remote unit, two-day run",
			summary:
				"Captured dawn, mid-day, and night sequences with a minimal footprint.",
			description:
				"ARRI Alexa Mini LF with Cooke S4 lenses for soft, grounded texture.",
			tags: ["Capture", "Crew"],
			services: ["Production"],
			deliverables: ["Principal Photography"],
			display: "slate",
			color: "violet"
		}
	}),
	makeClip({
		id: "clip-arc-post",
		trackId: "v2",
		name: "POST / FINISH",
		start: 42,
		end: 58,
		type: "video",
		meta: {
			category: "project",
			label: "POST / FINISH",
			subtitle: "Measured edits",
			summary:
				"Cuts paced to the crew rhythm with instrument inserts as tempo.",
			description:
				"DaVinci Resolve finish with restrained highlights and deep water density.",
			tags: ["Edit", "Color"],
			services: ["Post"],
			deliverables: ["Master"],
			display: "slate",
			color: "lavender"
		}
	}),
	makeClip({
		id: "clip-arc-outcome",
		trackId: "v2",
		name: "OUTCOME",
		start: 58,
		end: 70,
		type: "video",
		meta: {
			category: "project",
			label: "OUTCOME",
			subtitle: "Precise and human",
			summary:
				"A film aligned with the research team experience and brand voice.",
			description:
				"Delivered a primary film and a set of trimmed dispatches for partners.",
			tags: ["Delivery"],
			services: ["Delivery"],
			deliverables: ["Hero", "Cutdowns"],
			display: "slate",
			color: "violet"
		}
	}),
	makeClip({
		id: "clip-arc-audio",
		trackId: "a1",
		name: "NARRATION / FIELD TONE",
		start: 0,
		end: 70,
		type: "audio",
		meta: {
			category: "audio",
			label: "FIELD AUDIO",
			subtitle: "Wind + instruments",
			summary: "Cleaned dialogue and instrument textures.",
			display: "slate",
			color: "cyan"
		}
	})
];

const projectMarkers: Marker[] = [
	{ id: "mk-arc-brief", time: 0, label: "BRIEF", tone: "cyan" },
	{ id: "mk-arc-concept", time: 12, label: "CONCEPT", tone: "cyan" },
	{ id: "mk-arc-prod", time: 26, label: "PROD", tone: "cyan" },
	{ id: "mk-arc-post", time: 42, label: "POST", tone: "cyan" },
	{ id: "mk-arc-outcome", time: 58, label: "OUTCOME", tone: "cyan" }
];

export const portfolioSequences: PortfolioSequenceData[] = [
	{
		id: "seq-main",
		sequence: mainSequence,
		tracks: baseTracks,
		clips: mainClips,
		markers: mainMarkers
	},
	{
		id: "seq-arc",
		sequence: projectSequence,
		tracks: baseTracks,
		clips: projectClips,
		markers: projectMarkers
	}
];

export const portfolioMedia: MediaItem[] = [
	{
		id: "media-seq-main",
		name: "SEQ_01: THE BRICKS",
		type: "portfolio",
		duration: 150,
		createdAt: 0,
		group: "SEQUENCES",
		kind: "sequence",
		summary: "Master brand sequence"
	},
	{
		id: "media-seq-arc",
		name: "SEQ_02: ARC / FJORD",
		type: "portfolio",
		duration: 70,
		createdAt: 0,
		group: "SEQUENCES",
		kind: "sequence",
		summary: "Project sequence"
	},
	{
		id: "media-arc-fjord",
		name: "Arc / Fjord",
		type: "portfolio",
		duration: 260,
		createdAt: 0,
		group: "01_Footage",
		kind: "project",
		summary: "A cold-water portrait of a coastal research team."
	},
	{
		id: "media-citrine-bloom",
		name: "Citrine Bloom",
		type: "portfolio",
		duration: 104,
		createdAt: 0,
		group: "01_Footage",
		kind: "project",
		summary: "Architectural fashion film with sculpted light."
	},
	{
		id: "media-common-thread",
		name: "Common Thread",
		type: "portfolio",
		duration: 45,
		createdAt: 0,
		group: "01_Footage",
		kind: "project",
		summary: "Tactile commercial built around hands and craft."
	},
	{
		id: "media-dialogue-l",
		name: "Dialogue L",
		type: "portfolio",
		duration: 150,
		createdAt: 0,
		group: "02_Audio",
		kind: "clip",
		summary: "Dialogue stem left"
	},
	{
		id: "media-dialogue-r",
		name: "Dialogue R",
		type: "portfolio",
		duration: 150,
		createdAt: 0,
		group: "02_Audio",
		kind: "clip",
		summary: "Dialogue stem right"
	},
	{
		id: "media-bricks-logo",
		name: "BRICKS_LOGO.ai",
		type: "portfolio",
		duration: 0,
		createdAt: 0,
		group: "03_Graphics",
		kind: "note",
		summary: "Stacked brick mark"
	}
];

export const portfolioSequenceTabs = portfolioSequences.map((entry, index) => ({
	id: entry.id,
	name: entry.sequence.name,
	code: `SEQ ${String(index + 1).padStart(2, "0")}`
}));

export function getPortfolioSequence(id: string) {
	return (
		portfolioSequences.find((sequence) => sequence.id === id) ??
		portfolioSequences[0]
	);
}