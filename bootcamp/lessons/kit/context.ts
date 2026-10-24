import { createContext, useContext } from 'react';

export type DeckMeta = {
  /** Module id, as used by yarn verify, for example '01-js/03'. */
  id: string;
  title: string;
  /** Time guide shown on the title slide, for example '60 to 75 min'. */
  time: string;
  /** One line under the title. */
  subtitle?: string;
};

export const DeckContext = createContext<{ meta: DeckMeta; step: number }>({
  meta: { id: '', title: '', time: '' },
  step: 0,
});

/** The current build step of the slide being shown (0 when the slide first appears). */
export function useStep() {
  return useContext(DeckContext).step;
}

export function useMeta() {
  return useContext(DeckContext).meta;
}
