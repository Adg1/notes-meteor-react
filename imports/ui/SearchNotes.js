import React from 'react';
import { Meteor } from 'meteor/meteor';
import {Session} from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';

import { Notes } from '../api/notes';

export const SearchNotes = (props) => {
  return (
    <div className="item-list__search">
      <input placeholder="Search" onChange={(e) => {
        let searchText = e.target.value.trim();
        props.Session.set("searchText",searchText.toLowerCase());
      }}/>
    </div>
  );
};

export default createContainer(() => {
  return {
    meteorCall: Meteor.call,
    Session
  };
}, SearchNotes);
