// @vitest-environment jsdom
// Tests for the lesson kit itself (authoring). Juniors never run these.
import '@testing-library/jest-dom/vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Deck, PredictSlide, Reveal, Slide, WalkthroughSlide } from './index';

const meta = { id: 'test/01', title: 'Test deck', time: '1 min' };

function key(k: string) {
  act(() => {
    fireEvent.keyDown(window, { key: k });
  });
}

describe('Deck', () => {
  it('steps through build steps before moving to the next slide', () => {
    const onSlideChange = vi.fn();
    render(
      <Deck meta={meta} onSlideChange={onSlideChange}>
        <Slide title="One" steps={1}>
          <p>always</p>
          <Reveal at={1}>
            <p>later</p>
          </Reveal>
        </Slide>
        <Slide title="Two" />
      </Deck>,
    );
    expect(screen.queryByText('later')).toBeNull();
    key('ArrowRight');
    expect(screen.getByText('later')).toBeInTheDocument();
    key('ArrowRight');
    expect(screen.getByText('Two')).toBeInTheDocument();
    expect(onSlideChange).toHaveBeenLastCalledWith(1);
    key('ArrowLeft');
    expect(screen.getByText('later'), 'going back lands on the last build step').toBeInTheDocument();
  });

  it('starts at the slide from the URL and stops at both ends', () => {
    render(
      <Deck meta={meta} initialSlide={1}>
        <Slide title="One" />
        <Slide title="Two" />
      </Deck>,
    );
    expect(screen.getByText('2 / 2')).toBeInTheDocument();
    key('ArrowRight');
    expect(screen.getByText('2 / 2')).toBeInTheDocument();
    key('Home');
    key('ArrowLeft');
    expect(screen.getByText('1 / 2')).toBeInTheDocument();
  });

  it('ignores arrow keys while typing in a code box', () => {
    render(
      <Deck meta={meta}>
        <Slide title="One">
          <textarea aria-label="code" />
        </Slide>
        <Slide title="Two" />
      </Deck>,
    );
    fireEvent.keyDown(screen.getByLabelText('code'), { key: 'ArrowRight' });
    expect(screen.getByText('1 / 2')).toBeInTheDocument();
  });
});

describe('slides with built-in steps', () => {
  it('PredictSlide hides the answer until the next step', () => {
    render(
      <Deck meta={meta}>
        <PredictSlide code="1 + 1" answer="2" explanation="Numbers add." />
      </Deck>,
    );
    expect(screen.queryByText('2')).toBeNull();
    key('ArrowRight');
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('WalkthroughSlide shows one memory state per step and marks changed values', () => {
    render(
      <Deck meta={meta}>
        <WalkthroughSlide
          title="Walk"
          code={'let a = 1;\na = 2;'}
          steps={[
            { line: 1, note: 'first', stack: [{ name: 'global', vars: { a: '1' } }] },
            { line: 2, note: 'second', stack: [{ name: 'global', vars: { a: '2' } }] },
          ]}
        />
      </Deck>,
    );
    expect(screen.getByText('first')).toBeInTheDocument();
    key('ArrowRight');
    expect(screen.getByText('second')).toBeInTheDocument();
    expect(screen.getByText('2', { selector: '.k-var-value' }).closest('.k-var')).toHaveClass('changed');
  });
});
