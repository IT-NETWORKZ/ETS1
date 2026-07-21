import * as ReactCountUpModule from "react-countup";

// Vite's CJS/ESM interop for this package can sometimes wrap the whole
// module as the default export instead of just the component — this
// resolves whichever shape it actually gave us at runtime.
const CountUpJs =
  ReactCountUpModule.default?.default || ReactCountUpModule.default || ReactCountUpModule;

// Animates a numeric value up from 0 on scroll into view. Mixed strings
// (e.g. "₹18.4L", "99.98%", "212ms") are split into a numeric run plus a
// prefix/suffix so the count-up still applies wherever a number is present.
export default function CountUp({ value, duration = 1.4, delay = 0 }) {
  const str = String(value);
  const match = str.match(/^([^\d]*)([\d,]*\.?\d+)([^\d]*)$/);

  if (!match) return <span>{str}</span>;

  const [, prefix, numStr, suffix] = match;
  const end = parseFloat(numStr.replace(/,/g, ""));
  const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;

  return (
    <CountUpJs
      end={end}
      decimals={decimals}
      duration={duration}
      prefix={prefix}
      suffix={suffix}
      enableScrollSpy
      scrollSpyOnce
      delay={delay}
    />
  );
}