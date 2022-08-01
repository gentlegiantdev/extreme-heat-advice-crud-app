const express = require('express')
const app = express()
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient
require('dotenv').config()
const PORT = 5000

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'extreme-heat-advice-crud-app'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cors())

app.get('/',(request, response)=>{
    db.collection('extreme-heat-advice').find().sort({likes: -1}).toArray()
    .then(data => {
        response.render('index.ejs', { info: data })
    })
    .catch(error => console.error(error))
})

app.post('/addAdvise', (request, response) => {
    db.collection('extreme-heat-advice').insertOne({advice_text: request.body.advice_text,
    contributor_name: request.body.contributor_name, likes: 0})
    .then(result => {
        console.log('Advice Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

app.put('/addOneLike', (request, response) => {
    db.collection('extreme-heat-advice').updateOne({advice_text: request.body.advice_textS,
    contributor_name: request.body.contributor_nameS, likesS: request.body.likesS},{
        $set: {
            likes:request.body.likeS + 1
          }
    },{
        sort: {_id: -1},
        upsert: true
    })
    .then(result => {
        console.log('Added One Like')
        response.json('Like Added')
    })
    .catch(error => console.error(error))

})

app.delete('/deleteAdvice', (request, response) => {
    db.collection('extreme-heat-advice').deleteOne({advice_text: request.body.advice_textS})
    .then(result => {
        console.log('Advice Deleted')
        response.json('Advice Deleted')
    })
    .catch(error => console.error(error))

})


//PORT = 5000
app.listen(process.env.PORT || PORT, () => {
    console.log(`Server is running on port`)
})