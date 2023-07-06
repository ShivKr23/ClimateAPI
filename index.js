const port=8000
const express=require('express')
const axios=require('axios')
const cheerio=require('cheerio')

const app=express()

const articles=[]

const newspapers=[
    {
        name:'telegraph',
        url:'https://www.telegraph.co.uk/climate-change/',
        base:'https://www.telegraph.co.uk'
    },
    {
        name:'theguardian',
        url:'https://www.theguardian.com/environment/climate-crisis+commentisfree/commentisfree',
        base:'https://www.theguardian.com'
    },
    {
        name:'thetimes',
        url:'https://www.thetimes.co.uk/environment/climate-change',
        base:'https://www.thetimes.co.uk'
    }

]

newspapers.forEach(newspaper=>{
    axios.get(newspaper.url)
    .then((response)=>{
        const html=response.data
        const $=cheerio.load(html)

        $('a:contains("climate")',html).each(function () {
            const title=$(this).text()
            const address=$(this).attr('href')

            articles.push({
                title,
                address: newspaper.base + address,
                source:newspaper.name
            })
        })
    })
})

app.get('/',(req,res)=>{
    res.json('Welcome to my climate news api')
})

app.get('/news',(req,res)=>{
   res.json(articles)
})

app.get('/news/:newspaperId',async(req,res)=>{
    const newspaperId=req.params.newspaperId
    const newspaperurl=newspapers.filter(newspaper=>newspaper.name==newspaperId)[0].url
    const newspaperbase=newspapers.filter(newspaper=>newspaper.name==newspaperId)[0].base

    axios.get(newspaperurl)
    .then((response)=>{
        const html=response.data
        const $=cheerio.load(html)
        const specificArticle=[]

        $('a:contains("climate")',html).each(function () {
            const title=$(this).text()
            const address=$(this).attr('href')

    
            specificArticle.push({
                title,
                address:newspaperbase+address,
                source:newspaperId
            })
        })
        res.json(specificArticle)
    }).catch((err)=>console.log(err))
})

app.listen(port,()=> console.log("server running at port 8000"))