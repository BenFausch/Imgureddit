var destination = document.querySelector("#container");

	function createNode(element) {
	    return document.createElement(element);
	}
	function append(parent, el) {
	    return parent.appendChild(el);
	}
	const ul = document.getElementById('container');
	let url = 'https://www.reddit.com/r/funny/top.json';
	let content;
   




var NavBox=React.createClass({

getInitialState: function () {
    return {
      content: ['test'],
    }
  },


componentWillReceiveProps(nextProps) {
	
}

render: function(){
fetch(url)
	    .then((resp) => resp.json())
	    .then(function(body) {
	       this.setState({'content':body.data.children});
	        console.log(content)
	    }).catch(function(error) {
	        console.log(error)
	    });



console.log('content is')
console.log(this.state.content);
	return(
		<div>{this.state.content}</div>
		)
	}
})
ReactDOM.render(
<NavBox data={content}/>,
destination
);
