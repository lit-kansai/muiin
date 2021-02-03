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
app.use(express.static('public'))

let count = 0;

// Router
app.post('/', (req, res) => {
  const user = req.body.payload.object.participant.user_name
  const event = req.body.event  
  let message = ""

  if(event == "meeting.participant_joined") {
    count += 1
    message = `${user}さんが、もくもく会に参加しました！`
  } else if(event == "meeting.participant_left") {
    count -= 1
    if(count < 0) count = 0;
    message = `${user}さんが、もくもく会から退出しました！`
  } else {
    return res.send("ok")
  }

  const name = count > 0 ? `Muiin - ${count}人が参加中` : 'Muiin'
  
  axios.post(config.get('slack'), {"text": message, "username": name, "icon_url": `${config.get('host')}/icons/${count > 9 ? 10 : count }.png`})
  return res.send("ok")
})

app.listen(process.env.PORT || config.get('port') || 3000)
