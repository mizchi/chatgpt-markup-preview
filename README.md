# ChatGPT Markup Preview Extension (PoC)

Chrome Extension to preview markup in chat.openai.com

This extension renders html preview by code block outputs.

- code block `html+preview` => preview html directly
- code block `tsx+preview` => renderToStaticMarkup as typescript react component
- Tailwind loaded
- Click 📎 to copy as an image (for image input)

Example.

![Alt text](assets/image0.png)

![Alt text](assets/image1.png)

## Install

- Download latest `chatgpt-markup-preview.zip` from https://github.com/mizchi/chatgpt-markup-preview/releases
- unzip
- Open chrome://extensions and load unpacked by developper mode https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked

## Prompt Example

### HTML + Tailwind

````markdown
Generate a button element

- Describe it in html
- Use tailwind class for decoration
- Code block attributes should be ``html+preview
- Do not output anything but code

Output Example:

```html+preview
<div class="">Click Me</div>
```
````

### HTML + CSS Animation

````markdown
Generate Loader

- Write it in html
- Code block attributes should be ``html+preview
- Do not output anything but code

Example output

```html+preview
<style>
.loader {}
</style>
<div class="loader"></div>
```
````

### React + Tailwind

````markdown
Generate a button component.

Condition

- Use react+tsx to write the code. jsx: "react-jsx", so import is not required.
- Use tailwind for decoration. css import is not required.
- Code block attributes should be ```tsx+preview
- Do not output anything but code
- export previewProps that satisfy the type ``props

Example output

Example output: ```tsx+preview
type ButtonProps = { name: string }
export default function Button(props: Props) {
  return <></>
}
export const previewProps = {}
```
````

### Form

````markdown
Generate form components.

FormProps = React.FormHTMLAttributes<HTMLFormElement> & {
  fields: Array<{label: string, value: string}>
}

Conditions

- Please write in react+tsx. jsx: "react-jsx" so import is not necessary.
- Use tailwind for decoration. css import is not required.
- Code block attributes should be ```tsx+preview
- Do not output anything but code
- export previewProps that satisfy the type ``props

Example output

```tsx+preview
type FormProps = { name: string }
export default function Form(props: Props) {
  return <></>
}
export const previewProps = {}
```
````

## Local Install

```
$ pnpm install
$ pnpm build
```

- Open chrome://extensions
- Load `dist` dir

## LICENSE

MIT