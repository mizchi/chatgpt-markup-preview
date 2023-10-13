# ChatGPT Markup Preview Extension

Chrome Extension

## What's this

- `html+preview`
- `tsx+preview`

## Install

TBD

## Prompt Example

### HTML + Tailwind

````markdown
ボタン要素を生成してください。

- html で記述してください
- 装飾には tailwind の class を使ってください
- コードブロックの属性は ```html+preview としてください
- コード以外は出力しないでください

出力例

```html+preview
<div class="">Click Me</div>
```
````

### React + Tailwind

#### Button

````markdown
ボタンコンポーネント を生成してください。

## 条件

- react+tsx で記述してください。 jsx: "react-jsx" なので import は不要です。
- 装飾には tailwind を使ってください。css の import は不要です。
- コードブロックの属性は ```tsx+preview としてください
- コード以外は出力しないでください
- props の型を満たす previewProps を export してください

## 出力例

```tsx+preview
type ButtonProps = { name: string }
export default function Button(props: Props) {
  return <></>
}
export const previewProps = {}
```
````

#### Form

````markdown
フォームコンポーネントを生成してください。

## Props Type

type FormProps = React.FormHTMLAttributes<HTMLFormElement> & {
  fields: Array<{label: string, value: string}>
}

## 条件

- react+tsx で記述してください。 jsx: "react-jsx" なので import は不要です。
- 装飾には tailwind を使ってください。css の import は不要です。
- コードブロックの属性は ```tsx+preview としてください
- コード以外は出力しないでください
- props の型を満たす previewProps を export してください

## 出力例

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