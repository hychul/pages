import React, { useEffect, useState } from 'react';

function TagMap(props) {
  const tagMap = props.tagMap;

  const [tagView, setTagView] = useState([]);

  const getView = (map) => {
    // TODO: tag cloud
    return [...map].map(([key, value]) => {
      return <div key={key}>{key} {value}</div>
    });
  }

  useEffect(() => {
    setTagView(getView(tagMap));
  }, [tagMap])

  return (
    <div>
      {tagView}
    </div>
  )
}

export default TagMap;