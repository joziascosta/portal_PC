import { useEffect, useState, useCallback } from "react";

type FontSize = "base" | "lg" | "xl";
type Contrast = "normal" | "high";

const FONT_KEY = "a11y-font";
const CONTRAST_KEY = "a11y-contrast";

function apply(font: FontSize, contrast: Contrast) {
  if (typeof document === "undefined") return;
  const el = document.documentElement;
  if (font === "base") el.removeAttribute("data-font");
  else el.setAttribute("data-font", font);
  if (contrast === "normal") el.removeAttribute("data-contrast");
  else el.setAttribute("data-contrast", contrast);
}

export function useAccessibility() {
  const [font, setFont] = useState<FontSize>("base");
  const [contrast, setContrast] = useState<Contrast>("normal");

  useEffect(() => {
    const f = (localStorage.getItem(FONT_KEY) as FontSize) || "base";
    const c = (localStorage.getItem(CONTRAST_KEY) as Contrast) || "normal";
    setFont(f);
    setContrast(c);
    apply(f, c);
  }, []);

  const increase = useCallback(() => {
    setFont((p) => {
      const next: FontSize = p === "base" ? "lg" : p === "lg" ? "xl" : "xl";
      localStorage.setItem(FONT_KEY, next);
      apply(next, contrast);
      return next;
    });
  }, [contrast]);

  const decrease = useCallback(() => {
    setFont((p) => {
      const next: FontSize = p === "xl" ? "lg" : p === "lg" ? "base" : "base";
      localStorage.setItem(FONT_KEY, next);
      apply(next, contrast);
      return next;
    });
  }, [contrast]);

  const toggleContrast = useCallback(() => {
    setContrast((p) => {
      const next: Contrast = p === "normal" ? "high" : "normal";
      localStorage.setItem(CONTRAST_KEY, next);
      apply(font, next);
      return next;
    });
  }, [font]);

  return { font, contrast, increase, decrease, toggleContrast };
}
