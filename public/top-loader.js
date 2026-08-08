/**
 * Modern Browser-Style Top Loading Progress Bar
 * Enhanced with fluid spring transitions, shimmer gradients, glowing peg pulse, and exit scale animations.
 */
class TopProgressBar {
  constructor(options = {}) {
    this.color = options.color || "#3b82f6";
    this.gradientColor = options.gradientColor || "#60a5fa";
    this.height = options.height || "3px";
    this.autoStart = options.autoStart ?? false;
    this.status = null;
    this.timer = null;

    this._initDOM();
    if (this.autoStart) {
      this.start();
    }
  }

  _initDOM() {
    if (typeof document === "undefined") return;
    if (document.getElementById("top-progress-bar-container")) return;

    const style = document.createElement("style");
    style.id = "top-progress-bar-styles";
    style.textContent = `
      @keyframes top-bar-shimmer {
        0% { background-position: 0% 0%; }
        100% { background-position: 200% 0%; }
      }
      @keyframes top-bar-peg-pulse {
        0%, 100% { opacity: 0.8; transform: scaleY(1); }
        50% { opacity: 1; transform: scaleY(1.3); }
      }
      #top-progress-bar-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: ${this.height};
        pointer-events: none;
        z-index: 999999;
        opacity: 0;
        transform: translateY(0px) scaleY(1);
        transform-origin: top;
        transition: opacity 300ms ease-in-out, transform 300ms cubic-bezier(0.08, 0.82, 0.17, 1);
      }
      #top-progress-bar-container.active {
        opacity: 1;
        transform: translateY(0px) scaleY(1);
      }
      #top-progress-bar-container.finishing {
        opacity: 0;
        transform: translateY(-2px) scaleY(1.4);
      }
      #top-progress-bar-fill {
        height: 100%;
        width: 0%;
        background: linear-gradient(90deg, ${this.color} 0%, ${this.gradientColor} 50%, ${this.color} 100%);
        background-size: 200% 100%;
        animation: top-bar-shimmer 2s linear infinite;
        box-shadow: 0 0 12px ${this.color}, 0 0 6px ${this.gradientColor};
        transition: width 350ms cubic-bezier(0.08, 0.82, 0.17, 1);
        border-radius: 0 3px 3px 0;
        position: relative;
      }
      #top-progress-bar-peg {
        display: block;
        position: absolute;
        right: 0px;
        width: 120px;
        height: 100%;
        box-shadow: 0 0 14px ${this.gradientColor}, 0 0 8px ${this.color};
        opacity: 1.0;
        transform: rotate(3deg) translate(0px, -4px);
        animation: top-bar-peg-pulse 1.5s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);

    const container = document.createElement("div");
    container.id = "top-progress-bar-container";

    const fill = document.createElement("div");
    fill.id = "top-progress-bar-fill";

    const peg = document.createElement("div");
    peg.id = "top-progress-bar-peg";
    fill.appendChild(peg);

    container.appendChild(fill);
    document.body.appendChild(container);

    this.container = container;
    this.fill = fill;
  }

  start() {
    if (this.status !== null) return this;
    this.status = 0;
    this.container.classList.remove("finishing");
    this.container.classList.add("active");
    this.set(0.08);

    const trickle = () => {
      if (this.status === null) return;
      let amount = 0;
      if (this.status >= 0 && this.status < 0.25) amount = 0.12;
      else if (this.status >= 0.25 && this.status < 0.6) amount = 0.05;
      else if (this.status >= 0.6 && this.status < 0.85) amount = 0.025;
      else if (this.status >= 0.85 && this.status < 0.95) amount = 0.008;
      else amount = 0;

      this.set(this.status + amount);
      this.timer = setTimeout(trickle, 280);
    };

    trickle();
    return this;
  }

  set(n) {
    n = Math.max(0, Math.min(1.0, n));
    this.status = n;
    if (this.fill) {
      this.fill.style.width = `${n * 100}%`;
    }
    return this;
  }

  inc(amount = 0.05) {
    if (this.status === null) return this.start();
    return this.set(this.status + amount);
  }

  finish() {
    if (this.status === null) return this;

    clearTimeout(this.timer);
    if (this.fill && this.container) {
      // Transition width to 100% with fast acceleration
      this.fill.style.transition = "width 200ms cubic-bezier(0, 0, 0.2, 1)";
      this.fill.style.width = "100%";
      this.status = 1;

      setTimeout(() => {
        // Apply expansion transition & fade-out
        this.container.classList.add("finishing");
        this.container.classList.remove("active");

        setTimeout(() => {
          this.container.classList.remove("finishing");
          this.fill.style.transition = "width 350ms cubic-bezier(0.08, 0.82, 0.17, 1)";
          this.fill.style.width = "0%";
          this.status = null;
        }, 320);
      }, 200);
    }
    return this;
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = TopProgressBar;
}
