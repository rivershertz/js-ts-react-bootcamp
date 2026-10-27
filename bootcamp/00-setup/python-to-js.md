# Python to JavaScript cheat sheet

Keep this open during Phase 1. Each row is the closest JavaScript to a Python habit.

Exercises only expect what a lesson taught or what is on this page. When a step needs something from here, it says so in its `Needs:` line.

## Basics

| Python | JavaScript | Watch out |
| --- | --- | --- |
| `x = 1` | `const x = 1;` or `let x = 1;` | Use `const` unless you reassign. Never `var`. |
| `None` | `null` and `undefined` | A missing property or argument is `undefined`. |
| `True`, `False` | `true`, `false` | |
| `and`, `or`, `not` | `&&`, <code>&#124;&#124;</code>, `!` | |
| `a == b` | `a === b` | Always three `=`. `==` converts types first: `'1' == 1` is `true`. |
| `x if cond else y` | `cond ? x : y` | |
| `f"Hi {name}"` | `` `Hi ${name}` `` | Backticks, not quotes. |
| `print(x)` | `console.log(x)` | |
| `# comment` | `// comment` | |
| `len(items)` | `items.length` | A property, not a function. |
| `str(5)`, `int("5")` | `String(5)`, `Number('5')` | `Number('abc')` is `NaN`, not an error. |
| `x // 2` | `Math.floor(x / 2)` | All numbers are floats. |
| `value or "default"` | `value ?? 'default'` | `??` only replaces `null` and `undefined`. <code>&#124;&#124;</code> also replaces `0` and `''`. |
| `obj.get("a")` | `obj?.a` | `?.` stops at `null` / `undefined` instead of throwing. |

## Truthiness

Falsy in both: `0`, `''` (empty string), `None` / `null` / `undefined`, `False` / `false`.

Different: an empty list `[]` and an empty dict `{}` are **falsy in Python** but **truthy in JavaScript**. Check `items.length === 0` instead.

## Functions

| Python | JavaScript |
| --- | --- |
| `def add(a, b): return a + b` | `function add(a, b) { return a + b; }` |
| `lambda x: x * 2` | `(x) => x * 2` |
| `def f(x, y=10)` | `function f(x, y = 10)` |
| `def f(*args)` | `function f(...args)` |
| keyword arguments `f(name="a")` | pass an object: `f({ name: 'a' })` and destructure: `function f({ name })` |

Calling a function with too few arguments is not an error: the missing ones are `undefined`.

## Lists and dicts

| Python | JavaScript | Watch out |
| --- | --- | --- |
| `items = [1, 2]` | `const items = [1, 2];` | |
| `items.append(3)` | `items.push(3)` | Mutates, like Python. |
| `items[-1]` | `items.at(-1)` | `items[-1]` is `undefined`. |
| `items[1:3]` | `items.slice(1, 3)` | |
| `[x * 2 for x in items]` | `items.map((x) => x * 2)` | |
| `[x for x in items if x > 1]` | `items.filter((x) => x > 1)` | |
| `sum(items)` | `items.reduce((total, x) => total + x, 0)` | |
| `sorted(items)` | `items.toSorted((a, b) => a - b)` | `.sort()` changes the original array. Without a compare function it sorts as text: `[10, 9].sort()` gives `[10, 9]`. |
| `x in items` | `items.includes(x)` | |
| `any(...)`, `all(...)` | `items.some(...)`, `items.every(...)` | |
| `d = {"a": 1}` | `const d = { a: 1 };` | Keys do not need quotes. |
| `d["a"]` | `d.a` or `d['a']` | A missing key gives `undefined`, not `KeyError`. |
| `d.items()` | `Object.entries(d)` | |
| `dict(pairs)` | `Object.fromEntries(pairs)` | |
| `{**a, "b": 2}` | `{ ...a, b: 2 }` | |
| `[*a, *b]` | `[...a, ...b]` | |
| `a, b = pair` | `const [a, b] = pair;` | |
| `copy.deepcopy(d)` | `structuredClone(d)` | |
| `set()` | `new Set()` | |
| a dict with any key type | `new Map()` | Plain objects only have string keys. |
| `d[k] = v`, `k in d`, `d[k]` on that dict | `map.set(k, v)`, `map.has(k)`, `map.get(k)` | |

## Strings and numbers

| Python | JavaScript | Watch out |
| --- | --- | --- |
| `s.strip()` | `s.trim()` | |
| `s.lower()`, `s.upper()` | `s.toLowerCase()`, `s.toUpperCase()` | |
| `"log" in s` | `s.includes('log')` | |
| `s.startswith("v")` | `s.startsWith('v')` | |
| `s.split(".")` | `s.split('.')` | |
| `s[0]`, `s[1:]` | `s[0]`, `s.slice(1)` | Capital first letter: `s[0].toUpperCase() + s.slice(1)` |
| `s.lstrip("^~")` | `s.replace(/^[\^~]/, '')` | The `/.../` is a regular expression, like Python's `re`. |
| `re.fullmatch(r"\d{4}-\d{2}-\d{2}", s)` | `/^\d{4}-\d{2}-\d{2}$/.test(s)` | `^` and `$` make it match the whole string. |
| `round(x, 1)` | `Math.round(x * 10) / 10` | `Math.round` has no digits argument. |

## Checking values at run time

| Python | JavaScript | Watch out |
| --- | --- | --- |
| `isinstance(x, str)` | `typeof x === 'string'` | Also `'number'`, `'boolean'`, `'function'`, `'undefined'`. |
| `isinstance(x, list)` | `Array.isArray(x)` | |
| `isinstance(x, dict)` | `typeof x === 'object' && x !== null && !Array.isArray(x)` | `typeof null` and `typeof []` are both `'object'`. |
| `d.keys()`, `d.values()` | `Object.keys(d)`, `Object.values(d)` | |
| a frozen object | `Object.freeze(obj)` | One level only, like spread. Changing a frozen object throws. |

## Dates and timers

| Python | JavaScript | Watch out |
| --- | --- | --- |
| `datetime.now()` | `new Date()` | |
| `datetime.fromisoformat(s)` | `new Date(s)` | |
| `(b - a).days` | `Math.floor((b.getTime() - a.getTime()) / 86_400_000)` | `getTime()` is milliseconds since 1970; a day is 86 400 000 ms. |
| `d.isoformat()` | `d.toISOString()` | `'2026-10-27T18:00:00.000Z'`. `.slice(0, 10)` gives the date, `'2026-10-27'`. |
| comparing ISO dates | `'2026-01-05' < '2026-10-15'` | ISO date strings compare correctly as text. |
| run something later | `const id = setTimeout(fn, ms)` | Runs `fn` once after `ms` ms. Nothing waits: the next line runs at once. `clearTimeout(id)` cancels it. Lesson 01-js/04 explains why. |

## Classes of errors you will meet

| Python | JavaScript |
| --- | --- |
| `NameError` | `ReferenceError: x is not defined` |
| `AttributeError: 'NoneType'` | `TypeError: Cannot read properties of undefined (reading 'x')` |
| `raise ValueError("bad")` | `throw new Error('bad')` |
| `try / except / finally` | `try / catch / finally` |

## Async

| Python | JavaScript |
| --- | --- |
| `async def load():` | `async function load() {}` |
| `await fetch_tickets()` | `await fetchTickets()` |
| `asyncio.gather(a(), b())` | `Promise.all([a(), b()])` |
| `requests.get(url).json()` | `(await axios.get(url)).data` |

## Modules

| Python | JavaScript |
| --- | --- |
| `from stats import compute` | `import { compute } from './stats.js';` |
| `import stats` | `import * as stats from './stats.js';` |
| everything in a module is importable | only what you `export` is importable |

## Naming

Python uses `snake_case`. JavaScript uses `camelCase` for variables and functions, `PascalCase` for React components and types, and `UPPER_CASE` for constants like `STATUSES`.
