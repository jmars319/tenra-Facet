import type { OrientationBlock } from "../index";
import type { MockOrientationScenario } from "./types";

export const mockOrientationScenarios: MockOrientationScenario[] = [
  {
    id: "coding-stale-closure",
    matchers: [
      ["react", "stale", "closure"],
      ["event", "handler", "closure"],
      ["useeffect", "handler"],
    ],
    block: {
      id: "orientation_coding_01",
      mode: "distinguish",
      heading: "Separate the symptom from the mechanism",
      line: "Before picking a fix, decide whether the problem comes from stale state, effect timing, or callback identity.",
      followups: [
        { id: "orientation_coding_followup_01", prompt: "Which value is becoming outdated at the moment the handler runs?" },
        { id: "orientation_coding_followup_02", prompt: "Do you need the latest state inside the handler, or a stable function reference around it?" },
        { id: "orientation_coding_followup_03", prompt: "Would moving the logic out of the effect change the failure mode?" },
      ],
      relatedConcepts: [
        { id: "orientation_coding_concept_01", label: "Stale closures", queryHint: "react stale closure examples in callbacks" },
        { id: "orientation_coding_concept_02", label: "Effect lifecycle", queryHint: "react effect lifecycle versus user event timing" },
      ],
    },
  },
  {
    id: "movie-recall-dream-heist",
    matchers: [
      ["movie", "dream", "spinning", "top"],
      ["enter", "dreams", "movie"],
      ["dream", "heist"],
    ],
    block: {
      id: "orientation_movie_01",
      mode: "distinguish",
      heading: "Pin down the strongest recall cues",
      line: "Use one scene clue, one structural clue, and one cast or release clue before broadening the search.",
      followups: [
        { id: "orientation_movie_followup_01", prompt: "Is the spinning top the anchor you trust most, or just the image you remember first?" },
        { id: "orientation_movie_followup_02", prompt: "Do you remember nested dream levels, false waking, or something closer to memory manipulation?" },
        { id: "orientation_movie_followup_03", prompt: "Can you attach the film to a performer or release window?" },
      ],
      relatedConcepts: [
        { id: "orientation_movie_concept_01", label: "Nested dream stories", queryHint: "movies with nested dreams and heist plot" },
        { id: "orientation_movie_concept_02", label: "False waking scenes", queryHint: "movies with false waking scenes and memory confusion" },
      ],
    },
  },
  {
    id: "song-recall-hotel-california",
    matchers: [
      ["song", "hotel", "california"],
      ["live", "version", "hotel", "california"],
      ["cover", "hotel", "california"],
    ],
    block: {
      id: "orientation_song_01",
      mode: "compare",
      heading: "Separate the remembered phrase from the remembered recording",
      line: "A lyric fragment, a live solo, and a studio release can point to different recordings of the same song.",
      followups: [
        { id: "orientation_song_followup_01", prompt: "Do you remember the words, the vocal tone, or the arrangement more clearly?" },
        { id: "orientation_song_followup_02", prompt: "Was the version you remember longer, rougher, or more performance-driven than a studio cut?" },
        { id: "orientation_song_followup_03", prompt: "Could the memory be anchored to a cover, a live recording, or a similar chorus?" },
      ],
      relatedConcepts: [
        { id: "orientation_song_concept_01", label: "Live versions", queryHint: "hotel california live versions and arrangements" },
        { id: "orientation_song_concept_02", label: "Similar songs", queryHint: "songs commonly confused with hotel california" },
      ],
    },
  },
  {
    id: "cost-research-used-ev",
    matchers: [
      ["used", "ev", "cost"],
      ["electric", "car", "insurance"],
      ["charging", "battery", "cost"],
    ],
    block: {
      id: "orientation_cost_01",
      mode: "contextualize",
      heading: "Expand cost into ownership conditions",
      line: "Keep purchase price separate from charging setup, insurance, incentives, warranty, and resale assumptions.",
      followups: [
        { id: "orientation_cost_followup_01", prompt: "What part of the cost question is fixed up front, and what part depends on your usage pattern?" },
        { id: "orientation_cost_followup_02", prompt: "How would the picture change if home charging is unavailable or inconsistent?" },
        { id: "orientation_cost_followup_03", prompt: "Which assumption matters more for you: battery risk, insurance, or resale horizon?" },
      ],
      relatedConcepts: [
        { id: "orientation_cost_concept_01", label: "Home charging", queryHint: "used EV home charging setup costs" },
        { id: "orientation_cost_concept_02", label: "Battery warranty", queryHint: "used EV battery warranty and degradation questions" },
      ],
    },
  },
];

export const fallbackOrientation: OrientationBlock = {
  id: "orientation_fallback_01",
  mode: "broaden",
  heading: "Choose one of the built-in scenarios",
  line: "This phase supports a focused set of local preview queries. The orientation layer stays constrained and does not answer for the user.",
  followups: [
    { id: "orientation_fallback_followup_01", prompt: "Which example scenario is closest to the question you want to inspect?" },
    { id: "orientation_fallback_followup_02", prompt: "Do you need a recall aid, a comparison frame, or a hidden-dimension check?" },
  ],
};

