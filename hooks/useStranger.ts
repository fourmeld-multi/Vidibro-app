import { useState, useEffect, useCallback } from "react";

const USERNAMES = [
  "void_pixel","neon_surge","frost_byte","cipher_x","echo_dash",
  "phantom_kb","lunar_glitch","static_ace","dark_lattice","prism_rush",
  "byte_storm","neon_shift","ghost_sync","rapid_flux","iron_ghost",
  "storm_pixel","cold_wire","laser_arc","null_pulse","apex_void",
  "drift_code","pixel_nova","arc_shift","zero_lag","blaze_bit",
  "haze_runner","flint_wave","delta_core","mono_spike","echo_wire",
];

export type MatchState = "searching" | "connected" | "closed";
export interface Stranger { username: string; isBot: boolean; }

function randUsername() {
  return USERNAMES[Math.floor(Math.random() * USERNAMES.length)];
}

export function useStranger(timeoutMs = 20000) {
  const [matchState, setMatchState] = useState<MatchState>("searching");
  const [stranger, setStranger]     = useState<Stranger | null>(null);
  const [elapsed, setElapsed]       = useState(0);
  const [searchKey, setSearchKey]   = useState(0);
  const [active, setActive]         = useState(true);

  useEffect(() => {
    if (!active) return;

    setMatchState("searching");
    setStranger(null);
    setElapsed(0);

    const tick = setInterval(() => setElapsed(e => e + 1), 1000);
    const go   = setTimeout(() => {
      clearInterval(tick);
      setStranger({ username: randUsername(), isBot: true });
      setMatchState("connected");
    }, timeoutMs);

    return () => { clearInterval(tick); clearTimeout(go); };
  }, [searchKey, active, timeoutMs]);

  const findNext = useCallback(() => {
    setActive(true);
    setSearchKey(k => k + 1);
  }, []);

  const close = useCallback(() => {
    setActive(false);
    setMatchState("closed");
    setStranger(null);
  }, []);

  return { matchState, stranger, elapsed, findNext, close };
}
