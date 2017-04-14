import React from 'react';
import { Meteor } from 'meteor/meteor';
import {Session} from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';

import { Notes } from '../api/notes';
import NoteListHeader from './NoteListHeader';
import SearchNotes from './SearchNotes';
import NoteListItem from './NoteListItem';
import NoteListEmptyItem from './NoteListEmptyItem';

export class NoteList extends React.Component {
  renderNotesList() {
    if (this.props.notes.length === 0 ) {
      return <NoteListEmptyItem/>;
    }
    if (!this.props.searchText) {
      return this.props.notes.map((note) => {
        return <NoteListItem key={note._id} note={note} />
      });
    } else {
      return this.props.notes.filter((note) => {
        title = note.title.toLowerCase();
        return title.indexOf(this.props.searchText) > -1;
      }).map((note) => {
        return <NoteListItem key={note._id} note={note} />
      });
    }

  }
  render() {
    return (
      <div className="item-list">
        <NoteListHeader/>
        <SearchNotes/>
        {this.renderNotesList()}
      </div>
    );
  }
};

NoteList.propTypes = {
  searchText: React.PropTypes.string.isRequired,
  notes: React.PropTypes.array.isRequired
};

export default createContainer(() => {
  const selectedNoteId = Session.get('selectedNoteId');
  Meteor.subscribe('notes');

  return {
    searchText: Session.get("searchText"),
    notes: Notes.find({},{
      sort: {
        updatedAt: -1
      }
    }).fetch().map((note) => {
      return {
        ...note,
        selected: note._id === selectedNoteId
      }
    })
  };
}, NoteList);
