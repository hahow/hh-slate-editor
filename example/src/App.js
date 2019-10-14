import React, { Component } from 'react'

import SlateEditor from 'hh-slate-editor'

export default class App extends Component {
  constructor(props) {
    super(props);
    this.editorRef = React.createRef();
  }

  insertFragment = () => {
    if (this.editorRef && this.editorRef.current) {
      this.editorRef.current.insertFragment('<h4>開課緣起</h4><p>簡述開課動機或老師對此堂課的目標與期許</p>');
    }
  }

  render () {
    return (
      <div style={{ padding: 20 }}>
        <h1>Slate Editor Demo</h1>
        <div style={{ marginBottom: 10 }}>
          <button onClick={this.insertFragment}>插入段落</button>
        </div>
        <SlateEditor
          ref={this.editorRef}
        />
      </div>
    )
  }
}
