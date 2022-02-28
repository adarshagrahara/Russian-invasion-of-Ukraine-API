const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const newspapers = [
    {
        name: 'nbcnews',
        address: 'https://www.nbcnews.com/news/world/live-blog/russia-ukraine-news-live-updates-n1290145',
        base: ''
    }
    ,
    {
        name: 'cfr',
        address: 'https://www.cfr.org/global-conflict-tracker/conflict/conflict-ukraine',
        base: ''
    },
    {
        name: 'bbc',
        address: 'https://www.bbc.com/news/world-europe-60549023',
        base: '',
    },
    {
        name: 'cnn',
        address: 'https://www.cnn.com/2022/02/24/europe/ukraine-russia-conflict-explainer-2-cmd-intl/index.html',
        base: '',
    },
    {
        name: 'politico',
        address: 'https://www.politico.com/latest-news-updates/2022/02/russia-ukraine-conflict-2022-202202',
        base: '',
    },
    {
        name: 'vox',
        address: 'https://www.vox.com/22917719/russia-ukraine-invasion-border-crisis-nato-explained',
        base: '',
    },
    {
        name: 'wsj',
        address: 'https://www.wsj.com/articles/children-and-belongings-in-tow-ukrainians-throng-borders-fleeing-russian-invasion-11645828606',
        base: '',
    },
    {
        name: 'cnbc',
        address: 'https://www.cnbc.com/2022/02/23/russia-why-is-there-conflict-in-east-ukraine-and-what-is-putin-endgame.html',
        base: '',
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/world/2022/feb/25/russias-war-in-ukraine-complete-guide-in-maps-video-and-pictures',
        base: '',
    },
    {
        name: 'statista',
        address: 'https://www.statista.com/topics/8922/russia-ukraine-crisis-2021-2022/',
        base: 'https://www.statista.com'
    }
]

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("Ukraine")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })
            $('a:contains("Russia")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })

        })
})

app.get('/', (req, res) => {
    res.json('Russia Ukraine War API')
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base


    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("Ukraine")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            $('a:contains("Russia")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})
app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))
