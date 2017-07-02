import React from 'react';
import ReactDOM from 'react-dom';

class FetchDemo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: [],
      activePost:[0],
      activePostId:0

    };
  }

  activatePost(posturl, id){
    console.log(id)
    this.setState({'activePostId':id})

console.log('https://www.reddit.com'+posturl+'.json')
  fetch('https://www.reddit.com'+posturl+'.json')
      .then((resp) => resp.json()).then(res => {
        // console.log(res)
        const activePost = res[0].data.children.map(obj => obj.data);
        this.setState({ activePost });
        console.log(this.state.activePost)
      });


  }

  handleKeys(e){
     if (e.keyCode == '37') {
        // left arrow
        console.log('previous')
        let previous= this.state.activePostId-1;
       let url = this.state.posts[previous].permalink;
       console.log(this.state.posts[this.state.activePostId-1].title)
       this.activatePost(url,previous);
    }
    else if (e.keyCode == '39') {
       // right arrow
       console.log('next')
       let next= this.state.activePostId+1;
       let url = this.state.posts[next].permalink;
       console.log(this.state.posts[this.state.activePostId+1].title)
       this.activatePost(url,next);
    } 
    
  }

  componentDidMount() {
   fetch('https://www.reddit.com/r/funny.json')
      .then((resp) => resp.json()).then(res => {
        console.log(res)
        const posts = res.data.children.map(obj => obj.data);
        this.setState({ posts });
        console.log(this.state.posts)
      });
      document.addEventListener("keydown", this.handleKeys.bind(this), false);
  }

  render() {
    return (
      <div className="content">
       <div className="activePost">
      <h1>{this.state.activePost[0].title}</h1>
      <img src={this.state.activePost[0].thumbnail}/>
      <ul>
        {/*
        {this.state.activePost[1].comments.map((comment) => 
          <li key={comment.toString()}>{comment.text}</li>
          )}
        }
      */}
      </ul>
      </div>
    
      <div className="navBar">
        <h1>{`/r/funny`}</h1>
        <ul>
          {this.state.posts.map((post,id) =>

            <li key={post.id}><button onClick={()=>this.activatePost(post.permalink,id)}>{post.title}
            <img src={post.thumbnail} width={post.thumbnail_width} height={post.thumbnail_height}/></button></li>
          )}
        </ul>
      </div>
      </div>
    );
  }
}

ReactDOM.render(
  <FetchDemo subreddit="reactjs"/>,
  document.getElementById('container')
);