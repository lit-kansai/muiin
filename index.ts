import * as bodyParser from 'body-parser'
import * as config from 'config'
import * as express from 'express'
import axios from 'axios'

// Initialize
const app = express()

// Configuration
app.disable('x-powered-by')
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }))
app.use(bodyParser.json({ limit: '100mb' }))

// Router
app.post('/', (req, res) => {
  const user = req.body.payload.object.participant.user_name
  const event = req.body.event
  
  axios.post(config.get('slack'), {"text": event == "meeting.participant_joined" ? `${user}さんが、もくもく会に参加しました！` : `${user}さんが、もくもく会から退出しました！`})
  return res.send("ok")
})

app.listen(process.env.PORT || config.get('port') || 3000)
