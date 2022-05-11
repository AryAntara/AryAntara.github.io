const page = async(blogtitle) => {
  //const All = fs.readdirSync(defaultDir)
  const file = blogtitle + '.js'
  let blog
  try{
    blog = await axios.get('https://raw.githubusercontent.com/aryarte/blogPage/main/'+file)
    blog = blog.data
    //console.log(blog)
  }catch(e){
    return res.status(404).send('page not found')
  }
  try{
    const html = parseToHtml(blog)
    console.log('sending',req.params.blogtitle)
    return html
  }catch(e){
    console.log('reported err > ',e)
    return '<center><h2>PAGE ERROR WHEN INITILIZE</h2>( _err reported )</center>'
  }
}

const parseToHtml = (value) => {
  const title = value.split('title = ')[1].split('\n')[0].replaceAll("'",'')
  const author = value.split('author = ')[1].split('\n')[0].replaceAll("'",'')
  const date = value.split('date = ')[1].split('\n')[0].replaceAll("'",'')
  const theme = value.split('theme = ')[1].split('\n')[0].replaceAll("'",'')
  const contentScoope = value.split('content\n\n')[1].split('\n\nendContent\n')[0].replaceAll("'",'').split(',\n')
  let body = `<p><h1 class="title" >${title}</h1></p><p class="author">${author}</p><p class="date">${date}</p>`
  let styleComponent = `<link href="https://raw.githubusercontent.com/aryarte/blogPage/main/f${theme}.css" rel="stylesheet"`
  //content parse
  let bodyContent = ''
  //function mini element
  const pCreated = (v) => {
    return `<p class="content" >&nbsp&nbsp${v}</p>`
  }
  const imgCreated = (v) => {
    return `<img class="content" src='${v}' alt='rendered img'>`
  }
  const subTitleCreated = (v) =>{
    return `<h2 class="content">${v}</h2>`
  }
  //nanti
  for(let i = 0;i < contentScoope.length; i++){
    if(contentScoope[i].includes('p =')){
      bodyContent = bodyContent + pCreated(contentScoope[i].split('p = ')[1])
    }else if(contentScoope[i].includes('img =')){
      bodyContent = bodyContent + imgCreated(contentScoope[i].split('img = ')[1])
    }else if(contentScoope[i].includes('subTitle =')){
      bodyContent = bodyContent + subTitleCreated(contentScoope[i].split('subTitle = ')[1])
    }
  }
  let css = `https://raw.githubusercontent.com/aryarte/blogPage/main/${theme}.css`
  let HTML = `<div class='container'><div class='identity'>${body}</div><div class='content'>${bodyContent}</div></div>`
  let head = document.getElementsByTagName('head')[0]
  let link = document.createElement("link")
  link.href = css
  link.type = "text/css"
  link.rel = "stylesheet"
  head.appendChild(link)
  return HTML
}
