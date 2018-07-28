
import * as React from 'react';
import { Editor } from 'slate-react';
import { Value, Change } from 'slate';
import { isKeyHotkey } from 'is-hotkey';
import { IWysiwygProps } from './IWysiwygProps';
import { IWysiwygState } from './IWysiwygState';
import { Button, Icon, Toolbar } from '../components';
// import {Bold, Italic, H1, H2, H3, Underline, Code, Quote, OrderedList, UnorderedList} from '../components/Icons/Icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBold, faH1, faH2, faH3 } from '@fortawesome/pro-solid-svg-icons'
import { faItalic, faUnderline, faCode, faQuoteLeft, faListOl, faListUl } from '@fortawesome/pro-regular-svg-icons'

import initialValue from './value.json'

export default class Wysiwyg extends React.Component<IWysiwygProps, IWysiwygState> {
  private DEFAULT_NODE: string = 'paragraph';

  constructor(props: IWysiwygProps) {
    super(props);
    this.state = {
      value: Value.fromJSON(initialValue),
    };

    this._onChange = this._onChange.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._renderNode = this._renderNode.bind(this);
    this._renderMark = this._renderMark.bind(this);
  }
  public render(): JSX.Element {
    return (
      <div>
        <Toolbar>
          {this._renderMarkButton('bold', <FontAwesomeIcon icon={faBold} />)}
          {this._renderMarkButton('italic', <FontAwesomeIcon icon={faItalic} />)}
          {this._renderMarkButton('underlined', <FontAwesomeIcon icon={faUnderline} />)}
          {this._renderMarkButton('code', <FontAwesomeIcon icon={faCode} />)}
          {this._renderBlockButton('heading-one', <FontAwesomeIcon icon={faH1} />)}
          {this._renderBlockButton('heading-two', <FontAwesomeIcon icon={faH2} />)}
          {this._renderBlockButton('block-quote', <FontAwesomeIcon icon={faQuoteLeft} />)}
          {this._renderBlockButton('numbered-list', <FontAwesomeIcon icon={faListOl} />)}
          {this._renderBlockButton('bulleted-list', <FontAwesomeIcon icon={faListUl} />)}
        </Toolbar>
        <Editor
          spellCheck
          autoFocus
          placeholder="Enter some rich text..."
          value={this.props.value}
          onChange={this._onChange}
          onKeyDown={this._onKeyDown}
          renderNode={this._renderNode}
          renderMark={this._renderMark}
        />
      </div>
    )
  }

  private _hasMark(type: string): boolean {
    const { value } = this.props;
    return value.activeMarks.some(mark => mark && mark.type === type ? true : false); // TODO: Has to recheck
  }

  private _hasBlock(type: string): boolean {
    const { value } = this.props;
    return value.blocks.some(node => node && node.type === type ? true : false);
  }

  private _renderMarkButton(type: string, icon: JSX.Element): JSX.Element {
    const isActive = this._hasMark(type)

    return (
      <Button
        active={isActive}
        onMouseDown={event => this._onClickMark(event, type)}
      >
        {icon}
      </Button>
    )
  }

  private _renderBlockButton(type: string, icon: JSX.Element): JSX.Element {
    let isActive: boolean = this._hasBlock(type)

    if (['numbered-list', 'bulleted-list'].indexOf(type) >= 0) {
      const { value } = this.props
      const parent = value.document.getParent(value.blocks.first().key)
      isActive = this._hasBlock('list-item') && parent && parent["type"] === type ? true : false;
    }

    return (
      <Button
        active={isActive}
        onMouseDown={event => this._onClickBlock(event, type)}
      >
        {icon}
      </Button>
    )
  }

  /**
   * Render a Slate node.
   *
   * @param {Object} props
   * @return {Element}
   */

  private _renderNode(props): JSX.Element | null {
    const { attributes, children, node } = props

    switch (node.type) {
      case 'block-quote':
        return <blockquote {...attributes}>{children}</blockquote>
      case 'bulleted-list':
        return <ul {...attributes}>{children}</ul>
      case 'heading-one':
        return <h1 {...attributes}>{children}</h1>
      case 'heading-two':
        return <h2 {...attributes}>{children}</h2>
      case 'list-item':
        return <li {...attributes}>{children}</li>
      case 'numbered-list':
        return <ol {...attributes}>{children}</ol>
      default:
        return null;
    }
  }

  private _renderMark(props): JSX.Element {
    const { children, mark, attributes } = props

    switch (mark.type) {
      case 'bold':
        return <strong {...attributes}>{children}</strong>
      case 'code':
        return <code {...attributes}>{children}</code>
      case 'italic':
        return <em {...attributes}>{children}</em>
      case 'underlined':
        return <u {...attributes}>{children}</u>
    }
  }

  private _onChange(change: Change): void {
    this.props.onChange(change);
  }

  private _onKeyDown(event: KeyboardEvent, change: Change, editor: Editor): void | Change {
    const isBoldHotkey = isKeyHotkey('mod+b');
    const isItalicHotkey = isKeyHotkey('mod+i');
    const isUnderlinedHotkey = isKeyHotkey('mod+u');
    const isCodeHotkey = isKeyHotkey('mod+`');
    let mark

    if (isBoldHotkey(event)) {
      mark = 'bold'
    } else if (isItalicHotkey(event)) {
      mark = 'italic'
    } else if (isUnderlinedHotkey(event)) {
      mark = 'underlined'
    } else if (isCodeHotkey(event)) {
      mark = 'code'
    }

    event.preventDefault()
    change.toggleMark(mark)
  }

  private _onClickMark(event, type): void {
    event.preventDefault()
    const { value } = this.props
    const change = value.change().toggleMark(type)
    this._onChange(change)
  }

  private _onClickBlock(event, type) {
    event.preventDefault()
    const { value } = this.props
    const change = value.change()
    const { document } = value

    // Handle everything but list buttons.
    if (type != 'bulleted-list' && type != 'numbered-list') {
      const isActive = this._hasBlock(type)
      const isList = this._hasBlock('list-item')

      if (isList) {
        change
          .setBlocks(isActive ? this.DEFAULT_NODE : type)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
      } else {
        change.setBlocks(isActive ? this.DEFAULT_NODE : type)
      }
    } else {
      // Handle the extra wrapping required for list buttons.
      const isList = this._hasBlock('list-item')
      const isType = value.blocks.some(block => {
        return !!document.getClosest(block.key, parent => parent && parent['type'] === type)
      })

      if (isList && isType) {
        change
          .setBlocks(this.DEFAULT_NODE)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
      } else if (isList) {
        change
          .unwrapBlock(
            type == 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
          )
          .wrapBlock(type)
      } else {
        change.setBlocks('list-item').wrapBlock(type)
      }
    }

    this._onChange(change)
  }
}
