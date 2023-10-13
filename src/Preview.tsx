// import "./tailwind.prebuilt";
import {useCallback, useRef, useEffect} from "preact/hooks";
import html2canvas from 'html2canvas';

export function Preview(props: {lang?: string, content: string}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = props.content;
  }, [ref, props.content, props.lang]);

  const onClick = useCallback(async (ev: any) => {
    if (!ref.current) return;

    let canvas: HTMLCanvasElement;
    if (ref.current.childElementCount === 1) {
      canvas = await html2canvas(ref.current.firstElementChild as HTMLElement);  
    } else {
      canvas = await html2canvas(ref.current);
    }
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!);
      });
    });
    await navigator.clipboard.write([new ClipboardItem({[blob.type]: blob})]);
    const target = ev.target as HTMLButtonElement;
    target.textContent = 'copied!';
    await new Promise<void>((resolve) => setTimeout(resolve, 1000));
    target.textContent = '📎';
  }, [ref]);
  return <div class="preview-root h-full w-full relative">
    <button class="absolute" style={{right: 10, top: 10}} type="button" onClick={onClick}>📎</button>
    <h2>Preview</h2>
    <div class="w-full relative p-5 bg-white">
      <div style={{display: 'contents'}} ref={ref}/>
    </div>
  </div>;
}
