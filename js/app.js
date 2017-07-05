import React from 'react';
import ReactDOM from 'react-dom';

class FetchDemo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      subreddit:'funny',
      posts: [],
      activePost:[0],
      activePostId:0,
      activePostComments:[0]

    };
  }

  activatePost(posturl, id, postid){
    this.setState({'activePostId':id});
    fetch('https://www.reddit.com'+posturl+'.json')
      .then((resp) => resp.json()).then(res => {
        let activePost = res[0].data.children.map(obj => obj.data);
        this.setState({ activePost });
        let activePostComments = res[1].data.children.map(obj => obj.data);
        this.setState({ activePostComments });


        if(document.getElementById(postid)!==null){
          var topPos = document.getElementById(postid).offsetTop;
          document.getElementById('nav').scrollTop = topPos-40;
        }
      });
  }

  fetchMore(){
    let length = this.state.posts.length-1;
    let last = this.state.posts[length].name;

    console.log('https://www.reddit.com/r/'+this.state.subreddit+'.json?limit=50&count=50&after='+last+'');

    fetch('https://www.reddit.com/r/'+this.state.subreddit+'.json?limit=50&count=50&after='+last)
      .then((resp) => resp.json()).then(res => {
        // console.log(res);
        let posts = res.data.children.map(obj => obj.data);
        let original = this.state.posts;
        posts = original.concat(posts);
        
        this.setState({ posts });
        // console.log(this.state.posts);
      });
  }


  handleKeys(e){
    if (e.keyCode == '13') {
      this.setSubReddit();
    } else if (e.keyCode == '37') {
      // left arrow
      let previous= this.state.activePostId-1;
      let url = this.state.posts[previous].permalink;
      this.activatePost(url,previous);
    }
    else if (e.keyCode == '39') {
      let next= this.state.activePostId+1;

      if((this.state.activePostId+1)==this.state.posts.length){
        console.log('fetching more...');
        this.fetchMore();
      }else{
        let url = this.state.posts[next].permalink;
        let postid = this.state.posts[next].id;
        this.activatePost(url,next,postid);
      }
    } 
    
  }

  scrolled(){
    let o = document.getElementById('nav');
    if(o!==null){
             
      if(o.offsetHeight + o.scrollTop > o.scrollHeight)
      {
        console.log('fetching more...');
        this.fetchMore();
      }
    }
  }

  componentDidMount() {
    this.fetchJSON('all');
    document.addEventListener('keydown', this.handleKeys.bind(this), false);
      
  }

  fetchJSON(subreddit){
    console.log('https://www.reddit.com/r/'+subreddit+'.json?limit=50')
    fetch('https://www.reddit.com/r/'+subreddit+'.json?limit=50')
      .then((resp) => resp.json()).then(res => {
        let posts = res.data.children.map(obj => obj.data);
        this.setState({ posts });
        //get first post
        this.activatePost(this.state.posts[0].permalink,0);
      });
  }

  createChildren(){
    let component = [];
    let parent = this.state.activePostComments.map((comment) => {
      component.push(<li id={comment.id} key={Math.random()}>{comment.body}</li>);
    
         if (comment.replies){
          
          let grandchild = this.createGrandChildTree(comment.replies, 1);
          
          component.push( <input type="checkbox" id={'subChild-1'}/>)
          component.push(grandchild)
        }                                    
    });

    
    return component;
  }

createGrandChildTree(replies, i ){
  let container = [];
  let grandchild = replies.data.children;

   grandchild.map((childcomment)=>{
     if(childcomment.data.body!==undefined){
           container.push(<li className={"subChild-"+i} id={childcomment.data.id} key={Math.random()} >{childcomment.data.body}</li>)
           
           if(childcomment.data.replies){
             let smaller = this.getGrandChild(childcomment.data.replies, i++);
            if(smaller!==undefined){
                        container.push(<input key={Math.random()}type="checkbox" id={'subChild-'+i}/>)
                         container.push(
                            <ul key={Math.random()} id={'subChild-'+i}>
                              {smaller}
                            </ul>
                          );
                       }
           }
     }
  });
   let cRandomColor = Math.floor(Math.random()*16777215).toString(16);
    let cBorder = {'borderLeftColor':'#'+cRandomColor};
    
    return (<ul key={Math.random()} className={'child-'+i} style={cBorder}>{container}</ul>);
}

getGrandChild = (body, id) => {
let comp = this.createGrandChildTree(body, id);
return comp;
}   

setSubReddit(){
  let subreddit = document.getElementById('subreddit').value;
  subreddit = subreddit.replace(/[^\w\s]/gi, '')
  this.setState({'subreddit':subreddit});
  this.setState({ 'posts':[] });
  this.fetchJSON(subreddit);
}


  render() {
    return (
      <div className="content">
        <div className="activePost">
          <h1>{this.state.activePost[0].title}</h1>
          <img src={this.state.activePost[0].thumbnail}/>
          <ul key={Math.random()} className="comments">
            {this.createChildren()}
          </ul>
        </div>
        <h1>{this.state.subreddit}</h1>
        <input key={this.state.subreddit} id="subreddit" type="text"></input>
        <button onClick={()=>this.setSubReddit()}>Go</button>
        <div className="navBar" id="nav" onScroll={()=>this.scrolled()}>
          
          <ul key={Math.random()}>
            {this.state.posts.map((post,id) =>

              <li key={Math.random()} id={post.id}><button onClick={()=>this.activatePost(post.permalink,id, post.id)}>{post.title}
                <img src={post.thumbnail}/></button></li>
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