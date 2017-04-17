import React from 'react';
import { Meteor } from 'meteor/meteor';
import {Session} from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';

import { Notes } from '../api/notes';
import NoteListHeader from './NoteListHeader';
import SearchNotes from './SearchNotes';
import NoteListItem from './NoteListItem';
import NoteListEmptyItem from './NoteListEmptyItem';
import Loading from './Loading';

export class NoteList extends React.Component {
  renderNotesList() {
    if (!this.props.loading) {
      if (this.props.notes.length === 0 ) {
        console.log("called");
        return <NoteListEmptyItem/>;
        this.props.notLoading = false;
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
    return <Loading/>;

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
  loading: React.PropTypes.bool.isRequired,
  searchText: React.PropTypes.string.isRequired,
  notes: React.PropTypes.array.isRequired
};

export default createContainer(() => {
  const selectedNoteId = Session.get('selectedNoteId');
  const subscription = Meteor.subscribe('notes');
  const loading = !subscription.ready();
  const notes = Notes.find({},{
    sort: {
      updatedAt: -1
    }
  }).fetch().map((note) => {
    return {
      ...note,
      selected: note._id === selectedNoteId
    }
  });

  return {
    loading,
    searchText: Session.get("searchText"),
    notes
  };
}, NoteList);
