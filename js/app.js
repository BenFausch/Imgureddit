import React from 'react';
import ReactDOM from 'react-dom';

class Beddit extends React.Component {
  constructor(props) {
    super(props);
    
    let size = (window.innerWidth/21)+'px';
    
    this.state = {
      subreddit:'all',
      posts: [],
      activePost:[0],
      activePostId:0,
      activePostComments:[0],
      headerSize:{'fontSize': size},
      loading:{'opacity': 1},
    };
  }

  activatePost(posturl, id, postid){
    this.setState({loading:{'opacity': 1}});
    this.setState({'activePostId':id});
    
    fetch('https://www.reddit.com'+posturl+'.json')
      .then((resp) => resp.json()).then(res => {
        let activePost = res[0].data.children.map(obj => obj.data);
        this.setState({ activePost });
        let activePostComments = res[1].data.children.map(obj => obj.data);
        this.setState({ activePostComments });

        // console.log(activePostComments);
        //scroll to next item in list
        if(document.getElementById(postid)!==null){
          var topPos = document.getElementById(postid).offsetTop-240;
          document.getElementById('nav').scrollTop = topPos;
        }
        //hide loading and scroll to top
        this.setState({loading:{'opacity': 0}});
        let loading = document.getElementById('loading');
        setTimeout(function () { loading.classList.add('hidden'); }, 800);

      });
  }

  fetchMore(){
    let length = this.state.posts.length-1;
    

    let url = 'https://www.reddit.com/r/'+this.state.subreddit+'.json?limit=50&count=50';
    if(this.state.posts[length]!==undefined){
      let last = this.state.posts[length].name;
      url = 'https://www.reddit.com/r/'+this.state.subreddit+'.json?limit=50&count=50&after='+last+'';
    }

    console.log(url);

    fetch(url)
      .then((resp) => resp.json()).then(res => {
        // console.log(res);
        let posts = res.data.children.map(obj => obj.data);
        let original = this.state.posts;
        posts = original.concat(posts);
        
        this.setState({ posts });
        

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
      window.scrollTo(0,0);
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
        window.scrollTo(0,0);
      }
    } 
    
  }

  scrolled(){
    let o = document.getElementById('nav');
    if(o!==null){
             
      if(o.offsetHeight + o.scrollTop +50> o.scrollHeight)
      {
        console.log('fetching more...');
        this.fetchMore();
      }
    }
  }

  

  fetchJSON(subreddit){
    console.log('https://www.reddit.com/r/'+subreddit+'.json?limit=50');
    fetch('https://www.reddit.com/r/'+subreddit+'.json?limit=50')
      .then((resp) => resp.json())
      .then(res => {
        let posts = res.data.children.map(obj => obj.data);
        this.setState({ posts });
        //get first post
        this.activatePost(this.state.posts[0].permalink,0);
      });
  }

  createChildren(){
    let component = [];
    this.state.activePostComments.map((comment) => {
      component.push(<li id={comment.id} key={Math.random()}>{comment.body}<span key={Math.random()}>{comment.author}<span key={Math.random()} className="commentPoints">+{comment.score}</span></span></li>);
    
      if (comment.replies){
          
        let grandchild = this.createGrandChildTree(comment.replies, 1);
        component.push( <input key={Math.random()} type="checkbox" id={'subChild-1'} className="checkbox"/>);
        component.push(grandchild);
      }                                    
    });

    
    return component;
  }

  createGrandChildTree(replies, i ){
    let container = [];
    let grandchild = replies.data.children;

    grandchild.map((childcomment)=>{
      if(childcomment.data.body!==undefined){
        container.push(<li className={'subChild-'+i} id={childcomment.data.id} key={Math.random()} >{childcomment.data.body}<span key={Math.random()}>{childcomment.data.author}<span key={Math.random()} className="commentPoints">+{childcomment.data.score}</span></span></li>);
           
        if(childcomment.data.replies){
          let smaller = this.getGrandChild(childcomment.data.replies, i++);
          if(smaller!==undefined){
            container.push(<input key={Math.random()} type="checkbox" id={'subChild-'+i} className="checkbox"/>);
            container.push(
              <ul key={Math.random()} id={'subChild-'+i}>
                {smaller}
              </ul>
            );
          }
        }
      }
    });

    //create random colors for comments
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
    subreddit = subreddit.replace(/[^\w\s]/gi, '');
    
    //resize title
    
    this.setState({'subreddit':subreddit});
    this.resizeSubHead();

    this.setState({ 'posts':[] });
    this.fetchJSON(subreddit);
  }

checkImage(url, backup){
    if(url!==undefined){
      if(url.match(/\.(jpeg|jpg|gif|png)$/) != null)
      {
        return url;
      }else if(backup!==undefined){
        if(backup.match(/\.(jpeg|jpg|gif|png)$/) != null){
          return backup;
        }else{
          return 'https://unsplash.it/200/300/?random';
        }

      }else{
        return 'https://unsplash.it/200/300/?random';
      }
    }
  }

getLargestImage(preview, url, thumbnail){
    if(url!==undefined&&(url.match(/\.(mp4|gifv)$/) != null)){
      console.log('using gifv or mp4');
      url = url.replace('gifv','mp4');
      return <video preload="auto" autoPlay="autoplay" loop="loop" src={url} type="video/mp4"></video>;
    }if(url!==undefined&&(url.match(/\.(gif)$/) != null)){
      return <img src={url}/>;
    }else if(preview!==undefined){
      
      console.log('fetching largest image of '+preview.images[0].resolutions.length);
      let biggest = preview.images[0].resolutions[0]; 
      if(preview.images[0].resolutions.length>1){
        biggest = preview.images[0].resolutions.slice(-2)[0];
      }
      let  image = biggest.url;
      image = image.replace(/&amp;/g,'&');
      console.log('biggest:'+image);
      return <img src={image}/>;

    }else{
      console.log('using checkimage');
      let image = this.checkImage(url, thumbnail);
      return <img src={image}/>;
    }
  }  

// resizeSubHead(){
//     let subreddit = this.state.subreddit;
//     let size = ((window.innerWidth)/(subreddit.length+2)/2.6);
//     console.log('update');
//     this.setState({
//       'headerSize':{'fontSize': size+'px'},
//     });
//   }

componentDidMount() {
    this.fetchJSON('all');
    document.addEventListener('keydown', this.handleKeys.bind(this), false);
    // this.resizeSubHead();
    // window.addEventListener('resize', this.resizeSubHead.bind(this));
  }

render() {
    return (
      <div className="content">
        <p className="loading" id="loading" style={this.state.loading}>[bendit] $ asking reddit for dank mems..<span className="blinking-cursor">&nbsp;</span></p>
        <div className="activePost">
          <h2>{this.state.activePost[0].title}</h2>
          <p id="ups">+{this.state.activePost[0].ups}</p>
          <p id="downs">-{this.state.activePost[0].downs}</p>
          <h3>
            <span>From the mind of</span> u/{this.state.activePost[0].author}
          </h3>
          {this.getLargestImage(this.state.activePost[0].preview,this.state.activePost[0].url, this.state.activePost[0].thumbnail)}
          <a href={this.state.activePost[0].url} target="_blank">
          Permalink
          </a>
          <ul key={Math.random()} className="comments">
            {this.createChildren()}
          </ul>
        </div>
        <div className="titling">
          <h1>r/{this.state.subreddit}</h1>
          <div className="submit">
            <input key={this.state.subreddit} id="subreddit" type="text"maxLength="100" placeholder="enter a sub"></input>
            <button onClick={()=>this.setSubReddit()}>Go</button>
          </div>
        </div>
        <div className="navBar" id="nav" onScroll={()=>this.scrolled()}>
            
          <ul key={Math.random()}>
            {this.state.posts.map((post,id) =>

              <li key={Math.random()} id={post.id}><button onClick={()=>this.activatePost(post.permalink,id, post.id)}>{post.title}
                <img src={this.checkImage(post.url, post.thumbnail)}/></button></li>
            )}
          </ul>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Beddit subreddit="reactjs"/>,
  document.getElementById('container')
);