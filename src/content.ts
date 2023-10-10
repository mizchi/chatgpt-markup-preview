import { render, h } from "preact";
import { Preview } from "./contentRenderer";

console.log("[crx] eval");

// const xorshift = (() => {
//   let x = 123456789;
//   let y = 362436069;
//   let z = 521288629;
//   let w = 88675123;
//   return () => {
//     let t = x ^ (x << 11);
//     x = y; y = z; z = w;
//     return w = (w ^ (w >>> 19)) ^ (t ^ (t >>> 8));
//   };
// })();

const stringToHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString(32);
}

// function isGenerating() {
//   const el = document.querySelector('[data-testid="send-button"]') as HTMLButtonElement | null;
//   if (!el) return false;
//   return el.disabled;
// }

function handleCodeBlock(codeBlock: HTMLPreElement, hlel: HTMLDivElement) {
  const lastHash = hlel.getAttribute('data-ext-preview');
  const content = (hlel as HTMLElement).innerText;
  const currentHash = stringToHash(content);
  if (lastHash === currentHash) return;
  hlel.setAttribute('data-ext-preview', currentHash);
  console.log("[new]", hlel);
  const lang = hlel.className.split(' ').find((className) => className.startsWith('language-'))?.replace('language-', '');
  if (lang !== 'html') return;
  console.log("render start!");

  const previewElement = document.createElement('div');
  previewElement.className = 'ext-preview-root w-full h-full';
  codeBlock.appendChild(previewElement);
  render(h(Preview, {lang, content}), previewElement.parentElement!,  previewElement);
}

function updatePreviews() {
  const elements = document.querySelectorAll('.hljs');
  for (const el of elements) {
    const codeBlockPre = el.closest('pre');
    if (codeBlockPre) {
      handleCodeBlock(codeBlockPre, el as HTMLDivElement);
    }
  }
}

async function start() {
  await ensurePresentation();

  // init once
  updatePreviews();

  setInterval(() => {
    // if (isGenerating()) return;
    updatePreviews();
  }, 500);

  async function ensurePresentation() {
    await new Promise<void>(r => {
      const id = setInterval(() => {
        const presentation = document.querySelector('[role="presentation"]');
        if (presentation) {
          clearInterval(id);
          r();
        }
      }, 500);  
    });
  }
}

start().catch(console.error);
