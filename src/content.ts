import { render, h } from "preact";
import { Preview } from "./Preview";
import { createRenderer } from "./quickjsHelpers";
import prebuiltSource from "./gen/prebuilt.js?raw";

// console.log("[crx] eval");

async function getPreviewResult(lang: string | undefined, content: string) {
  if (lang === 'html+preview') {
    // ok
    return content;
  };
  if (lang === 'tsx+preview') {
    try {
      const transpiled = await transpile(content);
      const renderer = await getRenderer();
      return await renderer.render(transpiled, {name: "Xxx"});  
    } catch (err) {
      if (err instanceof Error) {
        return err.message;
      }
    }
  }
  return '';
}

async function start() {
  await ensurePresentation();
  // init once
  updatePreviews();
  setInterval(() => {
    if (!location.pathname.startsWith('/c/')) {
      return;
    }
    updatePreviews();
  }, 1000);

  return;

  async function updatePreviews() {
    const elements = [...document.querySelectorAll('.hljs')] as HTMLDivElement[];
    if (elements.length > 0) {
      await loadTailwind();
    };

    // const elements = [...document.querySelectorAll('pre > code')] as HTMLDivElement[];
    for (const el of elements) {
      handleCodeBlock(el);
    }
    return;
  }

  async function handleCodeBlock(hlel: HTMLDivElement) {
    const codeBlock = hlel.closest('pre')!;
    const lastHash = hlel.getAttribute('data-preview-hash');
    const content = (hlel as HTMLElement).innerText!;
    const currentHash = stringToHash(content);
    if (lastHash === currentHash) return;
    hlel.setAttribute('data-preview-hash', currentHash);
    const lang = hlel.className.split(' ').find((className) => className.startsWith('language-'))?.replace('language-', '');
    const result = await getPreviewResult(lang, content);
    if (!codeBlock.lastElementChild!.classList.contains('preview-root')) {
      const previewElement = document.createElement('div');
      codeBlock.appendChild(previewElement);
    }
    // @ts-ignore
    render(h(Preview, {lang, content: result}), codeBlock,  codeBlock.lastElementChild!);  
  }
  
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

// ----

async function loadTailwind() {
  // @ts-ignore
  await import('./tailwind.prebuilt');
}

function stringToHash(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString(32);
}

let _renderer: Awaited<ReturnType<typeof createRenderer>> | null = null;
async function getRenderer() {
  if (!_renderer) {
    _renderer = await createRenderer(prebuiltSource);
  }
  return _renderer;
}

let _ts: typeof import('typescript') | null = null;
async function transpile(code: string) {
  if (!_ts) {
    _ts = await import('typescript');
  }
  return _ts.transpile(code, {
    jsx: _ts.JsxEmit.ReactJSX,
    target: _ts.ScriptTarget.ESNext,
    module: _ts.ModuleKind.ESNext,
  });
  // return _ts;
}

