import {render} from 'preact'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Hello world
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