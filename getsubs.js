var fetch = require('node-fetch');
var fs = require('fs');

function extend(obj, src) {
    Object.keys(src).forEach(function(key) { obj[key] = src[key]; });
    return obj;
}

  let container = [];


    fetch('https://www.reddit.com/subreddits.json?limit=100')
      .then((resp) => resp.json())
      .then(res => {
        let subs = res.data.children.map(obj => obj.data);
        let names = res.data.children.map(obj => obj.data.display_name);
        
        for(n in names){
          container.push(names[n])
        }
        
        console.log('subreds:')
        console.log(names)
          
          let after = subs.slice(-1)[0];

          console.log('after id is')
          console.log(after.name);
          
          
          i=0;
          
          let paginate = (after) => fetch('https://www.reddit.com/subreddits.json?limit=100&after='+after.name)
            .then((resp) => resp.json())
            .then(res => {
              let subs = res.data.children.map((obj) => obj.data);
              let names = res.data.children.map(obj => obj.data.display_name);
              
              for(n in names){
               container.push(names[n])
              }
              console.log(names)
              
              // this.setState({ subs });
              after = subs.slice(-1)[0];
                
                if (i>4700){
                  console.log('done!')
                  createFile(container)

                }else{
                  paginate(after);
                  console.log(subs.length)
                  console.log(i+' of 5,000')
                  i+=100;
                  console.log('after:'+after.display_name)
                }
                            

            });  

            paginate(after);
            ///endres      
          
       ////endwhile/////
      });
/////////////////////////



function createFile(container) {
    console.log('FINAL CONTAINER')
    console.log(container)
    container= 'var subredditList = '+JSON.stringify(container);
    //create downloadble file
    fs.writeFile("subreddits.js", container, function(err) {
            if(err) {
              return console.log(err);
          }

          console.log("The file was saved!");
          });
}




