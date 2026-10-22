export { Deck } from './Deck';
export { Code } from './Code';
export type { DeckMeta } from './context';
export { useStep } from './context';
export { Slide, Reveal, TitleSlide, CompareSlide, PredictSlide, RecapSlide } from './Slides';
export { WalkthroughSlide, type WalkStep } from './Memory';
export { RunSlide } from './RunCode';

/** Props every lesson's default export accepts and passes on to <Deck>. */
export type LessonProps = { initialSlide?: number; onSlideChange?: (index: number) => void };
