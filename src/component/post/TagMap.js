import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { TagCloud } from 'react-tagcloud'

const customRenderer = (tag, count, color) => {
  return (
    <span
      key={tag.value}
      style={{
        display: 'inline-block',
        margin: `${count / 10}px`,
        borderRadius: '0.25em',
        padding: `0.05em 0.25em`,
        backgroundColor: '#F1F2F2',
        fontSize: `${count / 15}em`,
        color: `${color}`,
      }}
    >
      {tag.value}
    </span>
  )
}

function TagMap(props) {
  const tagMap = props.tagMap;
  const history = props.history;

  const [tags, setTags] = useState([]);

  useEffect(() => {
    setTags([...tagMap].map(([key, value]) => {
      return {
        value: key, 
        count: value,
        props: {
          style: {
            borderRadius: '0.25em',
            padding: '8px',
            backgroundColor: '#F1F2F2',
            lineHeight: '100%'
          }
        }
      }
    }));
  }, [tagMap])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: 'calc(100% - 33px * 2)',
      padding: '33px',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '1010px',
        color: '#242A2D',
      }}>
        <TagCloud
          minSize={25}
          maxSize={75}
          tags={tags}
          shuffle={false}
          // disableRandomColor={true}
          colorOptions={{
            luminosity: 'dark',
            hue: '#49C5B1',
            alpha: '1'
          }}
          renderer={customRenderer}
          onClick={it => {
            history.push({
              pathname: '/posts',
              search: `?tag=${it.value}`
            });
          }}
        />
      </div>
    </div>
  )
}

export default withRouter(TagMap);
