import { Highlight, type PrismTheme } from 'prism-react-renderer';

// Token colours come from tokens.css, so code follows the light and dark theme.
const theme: PrismTheme = {
  plain: { color: 'var(--text)', backgroundColor: 'transparent' },
  styles: [
    { types: ['comment'], style: { color: 'var(--tok-comment)', fontStyle: 'italic' } },
    { types: ['keyword', 'operator-keyword', 'imports', 'module'], style: { color: 'var(--tok-keyword)' } },
    { types: ['string', 'template-string', 'attr-value', 'char'], style: { color: 'var(--tok-string)' } },
    { types: ['number', 'boolean', 'null', 'undefined', 'constant'], style: { color: 'var(--tok-number)' } },
    { types: ['function', 'method', 'function-variable'], style: { color: 'var(--tok-function)' } },
    { types: ['builtin', 'class-name', 'tag'], style: { color: 'var(--tok-builtin)' } },
    { types: ['punctuation', 'operator'], style: { color: 'var(--tok-punct)' } },
  ],
};

export type Lang = 'js' | 'ts' | 'tsx' | 'jsx' | 'python' | 'json' | 'text';
const prismLang: Record<Lang, string> = { js: 'javascript', ts: 'typescript', tsx: 'tsx', jsx: 'jsx', python: 'python', json: 'json', text: 'plain' };

type Props = {
  code: string;
  lang?: Lang;
  /** Lines (1-based) to emphasise; the others are dimmed. */
  focus?: number[];
  /** One line (1-based) marked as "running now", without dimming the rest. */
  active?: number;
  small?: boolean;
  /** Off by default for plain text (terminal output). */
  lineNumbers?: boolean;
};

export function Code({ code, lang = 'js', focus, active, small, lineNumbers = lang !== 'text' }: Props) {
  return (
    <Highlight code={code.trim()} language={prismLang[lang]} theme={theme}>
      {({ tokens, getLineProps, getTokenProps }) => (
        <pre className={`k-code${small ? ' small' : ''}`}>
          {tokens.map((line, i) => {
            const n = i + 1;
            const state = active === n ? ' active' : focus && !focus.includes(n) ? ' dim' : '';
            const { className, ...lineProps } = getLineProps({ line });
            return (
              <div key={i} {...lineProps} className={`${className} k-code-line${state}`}>
                {lineNumbers ? <span className="k-code-ln">{n}</span> : <span style={{ width: 20, flex: 'none' }} />}
                <span>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </span>
              </div>
            );
          })}
        </pre>
      )}
    </Highlight>
  );
}
