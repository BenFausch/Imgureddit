import React from 'react';
import ReactDOM from 'react-dom';

class FetchDemo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: []
    };
  }

  componentDidMount() {
   fetch('https://www.reddit.com/r/funny.json')
      .then((resp) => resp.json()).then(res => {
        console.log(res)
        const posts = res.data.children.map(obj => obj.data);
        this.setState({ posts });

      });
  }

  render() {
    return (
      <div>
        <h1>{`/r/funny`}</h1>
        <ul>
          {this.state.posts.map(post =>
            <li key={post.id}>{post.title}</li>
          )}
        </ul>
      </div>
    );
  }
}

ReactDOM.render(
  <FetchDemo subreddit="reactjs"/>,
  document.getElementById('app')
);