import {render} from 'preact'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          ChatGPT Preview
        </p>
      </header>
    </div>
  )
}
render(
  <App />,
  document.getElementById('root')!
)


console.log('hello world')