import React from 'react';
import queryStirng from 'query-string';
import TagMapContainer from 'container/tag/TagMapContainer';

function TagMapPage({location, history}) {
  const query = queryStirng.parse(location.search);

  return(
    <TagMapContainer tag={query.tag} page={query.page} history={history} />
  );
}

export default TagMapPage;
