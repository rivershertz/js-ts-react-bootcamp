// Shared by the exercise playgrounds. You do not need to read or change this file.
// It shows one exercise step and catches its "TODO" error so the rest of the page still works.
// (Catching render errors still needs a class component in React; your own code never will.)
import { Component, type ReactNode } from 'react';

type Props = { title: string; children: ReactNode };
type State = { error?: Error };

export class Step extends Component<Props, State> {
  state: State = {};

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    return (
      <section style={{ border: '1px solid #d0d7de', borderRadius: 8, padding: 16, marginBottom: 16 }}>
        <h2 style={{ marginTop: 0, fontSize: 18 }}>{this.props.title}</h2>
        {this.state.error ? (
          <p style={{ color: '#b42318' }}>Not working yet: {this.state.error.message}</p>
        ) : (
          this.props.children
        )}
      </section>
    );
  }
}
