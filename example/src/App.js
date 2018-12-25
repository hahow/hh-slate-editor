import React, { Component } from 'react'

import SlateEditor from 'hh-slate-editor'

export default class App extends Component {
  render () {
    return (
      <div>
        <h1>Slate Editor Demo</h1>
        <SlateEditor text='Modern React component module' />
      </div>
    )
  }
}
