# Prompts

プロンプト集

## HTML 要素

````markdown
ボタンコンポーネント を生成してください。

条件

- react+tsx で記述してください。 jsx: "react-jsx" なので import は不要です。
- 装飾には tailwind を使ってください。css の import は不要です。
- コードブロックの属性は ```tsx+preview としてください
- コード以外は出力しないでください
- props の型を満たす previewProps を export してください

出力例

```tsx+preview
type ButtonProps = { name: string }
export default function Button(props: Props) {
  return <></>
}
export const previewProps = {}
```
````

## HTML + CSS Animation

````markdown
loading spinner を生成してください

- html で記述してください
- コードブロックの属性は ```html+preview としてください
- コード以外は出力しないでください

出力例

```html+preview
<style>
.loader {}
</style>
<div class="loader"></div>
```
````

## Form (React + Tailwind)

````markdown
フォームコンポーネントを生成してください。

type FormProps = React.FormHTMLAttributes<HTMLFormElement> & {
  fields: Array<{label: string, value: string}>
}

条件

- react+tsx で記述してください。 jsx: "react-jsx" なので import は不要です。
- 装飾には tailwind を使ってください。css の import は不要です。
- コードブロックの属性は ```tsx+preview としてください
- コード以外は出力しないでください
- props の型を満たす previewProps を export してください

出力例

```tsx+preview
type FormProps = { name: string }
export default function Form(props: Props) {
  return <></>
}
export const previewProps = {}
```
````
