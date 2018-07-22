
import * as React from 'react';
import { Editor, EditorState } from 'draft-js';
import { IDraftEditorProps } from './IDraftEditorProps';
import { IDraftEditorState } from './IDraftEditorState';

export default class DraftEditor extends React.Component<IDraftEditorProps, IDraftEditorState> {
  constructor(props: IDraftEditorProps) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty()
    };

    this._onChange = this._onChange.bind(this);
  }
  public render(): JSX.Element {
    return (
      <div className="container">
        <Editor editorState={this.state.editorState} onChange={this._onChange} />
      </div>
    )
  }

  private _onChange(editorState: EditorState) {
    this.setState({ editorState });
  }
}