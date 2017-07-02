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

  activatePost(posturl, id, postid){

    this.setState({'activePostId':id})
  
  fetch('https://www.reddit.com'+posturl+'.json')
      .then((resp) => resp.json()).then(res => {
        // console.log(res)
        const activePost = res[0].data.children.map(obj => obj.data);
        this.setState({ activePost });
        
        if(document.getElementById(postid)!==null){
                var topPos = document.getElementById(postid).offsetTop;
                document.getElementById('nav').scrollTop = topPos-40;
              }
      });
  }

  fetchMore(){
    let length = this.state.posts.length-1
    let last = this.state.posts[length].name;


    console.log('https://www.reddit.com/r/funny.json?limit=50&count=50&after='+last+'');

    fetch('https://www.reddit.com/r/funny.json?limit=50&count=50&after='+last)
      .then((resp) => resp.json()).then(res => {
        console.log(res)
        let posts = res.data.children.map(obj => obj.data);
        let original = this.state.posts;
        posts = original.concat(posts);
        
        this.setState({ posts });
        console.log(this.state.posts)
        
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
       console.log(this.state.activePostId+' of '+this.state.posts.length)
       let next= this.state.activePostId+1;

       if((this.state.activePostId+1)==this.state.posts.length){
        console.log('fetching more...')
        this.fetchMore()
      }else{
       let url = this.state.posts[next].permalink;
       let postid = this.state.posts[next].id;
       this.activatePost(url,next,postid);
     }
    } 
    
  }

  scrolled(){
    console.log('scrolling')
    let o = document.getElementById('nav');
    if(o!==null){
             
      if(o.offsetHeight + o.scrollTop > o.scrollHeight)
      {
        console.log('fetching more...')
        this.fetchMore()
      }
    }
  }

  componentDidMount() {
   fetch('https://www.reddit.com/r/funny.json?limit=50')
      .then((resp) => resp.json()).then(res => {
        console.log(res)
        let posts = res.data.children.map(obj => obj.data);
        this.setState({ posts });
        console.log(this.state.posts)
        //get first post
        this.activatePost(this.state.posts[0].permalink,0);
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
    
      <div className="navBar" id="nav" onScroll={()=>this.scrolled()}>
        <h1>{`/r/funny`}</h1>
        <ul>
          {this.state.posts.map((post,id) =>

            <li key={post.id} id={post.id}><button onClick={()=>this.activatePost(post.permalink,id, post.id)}>{post.title}
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