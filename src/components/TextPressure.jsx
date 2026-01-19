// Component ported from https://codepen.io/JuanFuentes/full/rgXKGQ

import { useEffect, useRef, useState } from "react";

const TextPressure = ({
  text = "Compressa",
  fontFamily = "Compressa VF",
  // This font is just an example, you should not use it in commercial projects.
  fontUrl = "https://res.cloudinary.com/dr6lvwubh/raw/upload/v1529908256/CompressaPRO-GX.woff2",

  width = true,
  weight = true,
  italic = true,
  alpha = false,

  flex = true,
  stroke = false,
  scale = false,

  textColor = "#FFFFFF",
  strokeColor = "#FF0000",
  strokeWidth = 2,
  className = "",

  minFontSize = 24,
  maxFontSize = 160, // Maximum font size to prevent runaway scaling
  safePaddingX = 12, // Reserve horizontal space for font expansion
  maxWidthStretch = 140, // Cap maximum font width to prevent overflow
  lineTexts = null, // Array of strings for multi-line layout: ["Line 1", "Line 2"]
}) => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const spansRef = useRef([]);
  const lineRefs = useRef([]); // For multi-line tracking

  const mouseRef = useRef({ x: 0, y: 0 });
  const cursorRef = useRef({ x: 0, y: 0 });

  const [fontSize, setFontSize] = useState(minFontSize);
  const [scaleY, setScaleY] = useState(1);
  const [lineHeight, setLineHeight] = useState(1);

  // Support both single text and multi-line texts
  const isMultiLine = lineTexts && Array.isArray(lineTexts);
  const lines = isMultiLine ? lineTexts : [text];
  const chars = text.split("");

  const dist = (a, b) => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      cursorRef.current.x = e.clientX;
      cursorRef.current.y = e.clientY;
    };
    const handleTouchMove = (e) => {
      const t = e.touches[0];
      cursorRef.current.x = t.clientX;
      cursorRef.current.y = t.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    if (containerRef.current) {
      const { left, top, width, height } =
        containerRef.current.getBoundingClientRect();
      mouseRef.current.x = left + width / 2;
      mouseRef.current.y = top + height / 2;
      cursorRef.current.x = mouseRef.current.x;
      cursorRef.current.y = mouseRef.current.y;
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  const setSize = () => {
    if (!containerRef.current) return;

    const { width: containerW, height: containerH } =
      containerRef.current.getBoundingClientRect();

    // Calculate "safe width" by reserving space for font expansion
    const safeW = Math.max(0, containerW - safePaddingX * 2);

    if (isMultiLine) {
      // Multi-line: calculate based on longest line
      const longestLine = lines.reduce(
        (a, b) => (a.length > b.length ? a : b),
        "",
      );
      const charCount = longestLine.length;

      // Tuning constant K: adjust this to control how tightly text fits
      // Lower K = larger text, Higher K = smaller text
      const K = 0.55; // Empirically tuned for Compressa VF (increased from 0.65 for larger text)

      let newFontSize = (safeW / charCount) * K;

      // Clamp between min and max
      newFontSize = Math.max(minFontSize, Math.min(newFontSize, maxFontSize));

      setFontSize(newFontSize);
      setScaleY(1);

      // Tighter line height for multi-line to prevent 3rd line
      setLineHeight(0.95);
    } else {
      // Single line: original logic
      let newFontSize = safeW / (chars.length / 2);
      newFontSize = Math.max(minFontSize, Math.min(newFontSize, maxFontSize));

      setFontSize(newFontSize);
      setScaleY(1);
      setLineHeight(1);
    }

    requestAnimationFrame(() => {
      if (!titleRef.current) return;
      const textRect = titleRef.current.getBoundingClientRect();

      if (scale && textRect.height > 0) {
        const yRatio = containerH / textRect.height;
        setScaleY(yRatio);
        setLineHeight(yRatio);
      }
    });
  };

  useEffect(() => {
    setSize();
    window.addEventListener("resize", setSize);
    return () => window.removeEventListener("resize", setSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scale, text, lineTexts]);

  useEffect(() => {
    let rafId;
    const animate = () => {
      mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) / 15;
      mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) / 15;

      if (isMultiLine && lineRefs.current.length > 0) {
        // Multi-line: animate each line separately
        lineRefs.current.forEach((lineEl) => {
          if (!lineEl) return;

          const lineRect = lineEl.getBoundingClientRect();
          const maxDist = lineRect.width / 2;

          const lineSpans = lineEl.querySelectorAll("span.text-char");

          lineSpans.forEach((span) => {
            const rect = span.getBoundingClientRect();
            const charCenter = {
              x: rect.x + rect.width / 2,
              y: rect.y + rect.height / 2,
            };

            const d = dist(mouseRef.current, charCenter);

            const getAttr = (distance, minVal, maxVal) => {
              const val = maxVal - Math.abs((maxVal * distance) / maxDist);
              return Math.max(minVal, val + minVal);
            };

            const wdth = width
              ? Math.floor(getAttr(d, 5, maxWidthStretch))
              : 100;
            const wght = weight ? Math.floor(getAttr(d, 100, 900)) : 400;
            const italVal = italic ? getAttr(d, 0, 1).toFixed(2) : 0;
            const alphaVal = alpha ? getAttr(d, 0, 1).toFixed(2) : 1;

            span.style.opacity = alphaVal;
            span.style.fontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`;
          });
        });
      } else if (titleRef.current) {
        // Single line: original animation
        const titleRect = titleRef.current.getBoundingClientRect();
        const maxDist = titleRect.width / 2;

        spansRef.current.forEach((span) => {
          if (!span) return;

          const rect = span.getBoundingClientRect();
          const charCenter = {
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height / 2,
          };

          const d = dist(mouseRef.current, charCenter);

          const getAttr = (distance, minVal, maxVal) => {
            const val = maxVal - Math.abs((maxVal * distance) / maxDist);
            return Math.max(minVal, val + minVal);
          };

          const wdth = width ? Math.floor(getAttr(d, 5, maxWidthStretch)) : 100;
          const wght = weight ? Math.floor(getAttr(d, 100, 900)) : 400;
          const italVal = italic ? getAttr(d, 0, 1).toFixed(2) : 0;
          const alphaVal = alpha ? getAttr(d, 0, 1).toFixed(2) : 1;

          span.style.opacity = alphaVal;
          span.style.fontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`;
        });
      }

      rafId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(rafId);
  }, [
    width,
    weight,
    italic,
    alpha,
    chars.length,
    isMultiLine,
    maxWidthStretch,
  ]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-transparent"
      style={{
        paddingLeft: safePaddingX,
        paddingRight: safePaddingX,
      }}
    >
      <style>{`
        @font-face {
          font-family: '${fontFamily}';
          src: url('${fontUrl}');
          font-style: normal;
        }
        .stroke span {
          position: relative;
          color: ${textColor};
        }
        .stroke span::after {
          content: attr(data-char);
          position: absolute;
          left: 0;
          top: 0;
          color: transparent;
          z-index: -1;
          -webkit-text-stroke-width: ${strokeWidth}px;
          -webkit-text-stroke-color: ${strokeColor};
        }
        .text-pressure-line {
          white-space: normal;
          word-break: break-word;
          overflow-wrap: break-word;
        }
      `}</style>

      {isMultiLine ? (
        <div
          ref={titleRef}
          className={`text-pressure-title ${className} ${stroke ? "stroke" : ""} uppercase`}
          style={{
            fontFamily,
            fontSize: fontSize,
            lineHeight,
            transform: `scale(1, ${scaleY})`,
            transformOrigin: "center top",
            margin: 0,
            fontWeight: 100,
            color: stroke ? undefined : textColor,
            maxWidth: "100%",
          }}
        >
          {lines.map((lineText, lineIdx) => {
            const lineChars = lineText.split("");
            return (
              <div
                key={lineIdx}
                ref={(el) => (lineRefs.current[lineIdx] = el)}
                className={`text-pressure-line ${flex ? "flex justify-between" : ""}`}
                style={{
                  display: "block",
                  width: "100%",
                }}
              >
                {lineChars.map((char, charIdx) => (
                  <span
                    key={`${lineIdx}-${charIdx}`}
                    data-char={char}
                    className="inline-block text-char"
                  >
                    {char}
                  </span>
                ))}
              </div>
            );
          })}
        </div>
      ) : (
        <h1
          ref={titleRef}
          className={`text-pressure-title ${className} ${
            flex ? "flex justify-between" : ""
          } ${stroke ? "stroke" : ""} uppercase text-center`}
          style={{
            fontFamily,
            fontSize: fontSize,
            lineHeight,
            transform: `scale(1, ${scaleY})`,
            transformOrigin: "center top",
            margin: 0,
            fontWeight: 100,
            color: stroke ? undefined : textColor,
            maxWidth: "100%",
          }}
        >
          {chars.map((char, i) => (
            <span
              key={i}
              ref={(el) => (spansRef.current[i] = el)}
              data-char={char}
              className="inline-block"
            >
              {char}
            </span>
          ))}
        </h1>
      )}
    </div>
  );
};

export default TextPressure;
