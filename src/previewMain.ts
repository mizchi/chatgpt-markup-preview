// import html2canvas from "html2canvas";
setInterval(() => {
  window.parent.postMessage({ type: "preview-ready" }, "*");
}, 300);

let root = document.getElementById("root")!;
window.addEventListener("message", (ev) => {
  // console.log('received message', ev.data);
  if (ev.data.type === "preview") {
    root.innerHTML = ev.data.html;
    const rect = root.getBoundingClientRect()!;
    window.parent.postMessage({ type: "change-size", height: rect.height, width: rect.width }, "*");
  }
});

// const copyElement = document.getElementById("copy-button")!;
// copyElement.addEventListener("click", async () => {
//   console.log('copying');
//   const canvas = await html2canvas(root);
//   canvas.toBlob((blob) => {
//     console.log('blob', blob);
//     const item = new ClipboardItem({ "image/png": blob! });
//     navigator.clipboard.write([item]); 
//   });
// });