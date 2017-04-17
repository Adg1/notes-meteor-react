import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import {Session} from 'meteor/session';
import { Meteor } from 'meteor/meteor';
import { browserHistory } from 'react-router';

import { Notes } from '../api/notes';
import Loading from 'react-loading';

export class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      body: ''
    }
  }
  handleBodyChange(e) {
    const body = e.target.value;
    this.setState({body});
    this.props.call('notes.update', this.props.note._id, { body });
  }
  handleTitleChange(e) {
    const title = e.target.value;
    this.setState({title});
    this.props.call('notes.update', this.props.note._id, { title });
  }
  componentDidUpdate(prevProps, prevState) {
    const currentNoteId = this.props.note ? this.props.note._id : undefined;
    const prevNoteId = prevProps.note ? prevProps.note._id : undefined;

    if (currentNoteId && currentNoteId !== prevNoteId) {
      this.setState({
        title: this.props.note.title,
        body: this.props.note.body
      });
    }
  }
  handleRemoval() {
    this.props.call('notes.remove', this.props.note._id);
    this.props.browserHistory.push('/dashboard');
  };
  render() {
    if (!this.props.loading) {
      if (this.props.note) {
        return (
          <div className="editor">
            <input className="editor__title" value={this.state.title} placeholder = "Title"
              onChange={this.handleTitleChange.bind(this)}/>
            <textarea className="editor__body" value={this.state.body} placeholder = "Your note here."
              onChange={this.handleBodyChange.bind(this)} ></textarea>
            <div>
              <button className="button button--secondary" onClick={this.handleRemoval.bind(this)}>Delete Note</button>
            </div>
          </div>
        );
      } else {
        return (
          <div className="editor">
            <p className="editor__message">
              { this.props.selectedNoteId ? 'Note not found.' : 'Pick or create a note to get started.'}
            </p>
          </div>
        );
      }
    }
    return (
      <div  className="loading">
        <Loading type="spin" color='#db4437' width="36px" height="36px"/>
      </div>
    );

  }
};

Editor.propTypes = {
  loading: React.PropTypes.bool.isRequired,
  note: React.PropTypes.object,
  selectedNoteId: React.PropTypes.string,
  call: React.PropTypes.func.isRequired,
  browserHistory: React.PropTypes.object.isRequired
};

export default createContainer(() => {
  const selectedNoteId = Session.get('selectedNoteId');
  const subscription = Meteor.subscribe('notes');
  const loading = !subscription.ready();
  const note = Notes.findOne(selectedNoteId);
  return {
    loading,
    selectedNoteId,
    note,
    call: Meteor.call,
    browserHistory
  };
}, Editor);
