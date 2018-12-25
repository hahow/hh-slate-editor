# hh-slate-editor

> Slate Editor customized by Hahow

## Install
找 release 裡面的檔案，複製網址。例如：

```bash
npm install --save https://github.com/hahow/hh-slate-editor/releases/download/1.0.1/hh-slate-editor-1.0.1.tgz
```
or
```bash
yarn add https://github.com/hahow/hh-slate-editor/releases/download/1.0.1/hh-slate-editor-1.0.1.tgz
```

## ScreenShot
![](https://i.imgur.com/jSPRnb9.png)

## Usage

### Example
```jsx
import React, { Component } from 'react';

import SlateEditor from 'hh-slate-editor';

class Demo extends Component {
  constructor (props) {
    super(props);
    this.state = {
      value,
    };
  }

  onChange = (newValue) => {
    this.setState({
      value: newValue,
    });
  }

  uploadImage = (file, fulfilledCallback) => {
    // You need to implement the function to upload image
  }

  onWarning = (msg) => {
  }

  render () {
    return (
      <SlateEditor
        value={value}
        onChange={this.onChange}
        debounceTime={250}
        height={350}
        debugMode={false}
        uploadImage={this.uploadImage}
        onWarning={this.onWarning}
        normalizeValue={false}
        normalizePastedValue={false}
        errorMessage=""
      />
    );
  }
}
```

### Props Explanation
| prop | type | explanation | default value |
|---|---|---|---|
| value | String | 編輯器文字內容 (html string) | "`<p></p>`" |
| onChange(`newValue`) | function | 內容有更改時的 onChange。會有 debounce，時間為 `debounceTime`。`newValue` 為更動後新的值。 |  |
| debounceTime | Number | debounce time (in 毫秒) | 250 |
| height | Number | 編輯器預設的寬度 (in px) | 350 |
| uploadImage(`file`, `fulfilledCallback`) | function | 上傳圖片的 function。 `file` 為 file reference object ，包含 `type`, `name` 等參數。 `fulfilledCallback` 為上傳完成後執行的 callback function |  |
| normalizePastedValue | boolean | 是否在複製、貼上時，執行 normalize html string 的功能。| true |
| debugMode | boolean | (平常不會用到) 是否開啟 debug 模式 |   |
| onWarning(`text`) | function | (平常不會用到) 編輯器內部在某些無法處理的情況下，可以噴輸出警告訊息。 |   |
| normalizeValue | boolean | (平常不會用到) 是否在每一次更新內容時，重新 normalize html string ，以符合 slate editor 的格式。這個功能基本上只有在換編輯器時會用到。 | false |
| errorMessage | String | (平常不會用到) 顯示在編輯器下方的警告文字 | ""（空字串） |

## Run example
```bash
  cd ./example
  yarn start
```
