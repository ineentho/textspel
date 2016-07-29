import React from 'react'
import { render } from 'react-dom'
import { Router, Link, browserHistory, Route, IndexRoute } from 'react-router'
import LoginApp from './components/loginApp.js'
import Game from './components/game.js'
import LoginPage from './components/loginPage.js'
import RegisterPage from './components/registerPage.js'
import GameIndex from './components/gameIndex.js'

const NotFound = () => (<p>Page not found</p>)
const Index = () => (<p>Fancy homepage!</p>)


const FullIndex = () => <LoginApp><Index /></LoginApp>
const FullLoginPage = () => <LoginApp><LoginPage /></LoginApp>
const FullRegisterPage = () => <LoginApp><RegisterPage /></LoginApp>

const routes = (
  <Route path='/'>
    <IndexRoute component={FullIndex} />
    <Route path='login' component={FullLoginPage} />
    <Route path='register' component={FullRegisterPage} />
    <Route path='game' component={Game}>
      <IndexRoute component={GameIndex} />
    </Route>
    <Route path='*' component={NotFound} />
  </Route>
)

class RenderForcer extends React.Component {
  constructor () {
    super()
  }
  componentWillMount () {
    this.forceUpdate() // a little hack to help us rerender when this module is reloaded
  }
  render () {
    return (
      <Router history={browserHistory}>
        {routes}
      </Router>
    )
  }
}

render((
  <RenderForcer />
  ), document.getElementById('root'))
