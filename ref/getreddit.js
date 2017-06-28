	function createNode(element) {
	    return document.createElement(element);
	}

	function append(parent, el) {
	    return parent.appendChild(el);
	}


	const ul = document.getElementById('container');
	let url = 'https://www.reddit.com/r/funny/top.json';
	let content;


	fetch(url)
	    .then((resp) => resp.json())
	    .then(function(body) {

	         content = body.data.children;
	        console.log(content)



	        return content.map(function(child) {
	            let li = createNode('li'),
	                img = createNode('img'),
	                a = createNode('a');
	                author = createNode('p')
	            img.src = child.data.url;
	            a.innerHTML = `${child.data.permalink}`;
	            author.innerHTML = `${child.data.author}`


	            append(li, img);
	            append(li, a);
	            append(li, author);
	            append(ul, li);

	        })

	    }).catch(function(error) {
	        console.log(error)
	    });


	    