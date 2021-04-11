import * as bodyParser from 'body-parser'
import * as config from 'config'
import * as express from 'express'
import spawn from 'child_process'
import axios from 'axios'

// Initialize
const app = express()
spawn('Xvfb', [':1', '-screen', '0', '1024x768x24'])

// Configuration
app.disable('x-powered-by')
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }))
app.use(bodyParser.json({ limit: '100mb' }))
app.use(express.static('public'))

let count = 0;
let zoom = null;

// Router
app.post('/', (req, res) => {
  const event = req.body.event
  if(event == "meeting.started") {
    if(zoom) zoom.kill()
    zoom = spawn('zoom', ['zoommtg://zoom.us/join?confno=86911054671&pwd=c3RNWGhUUkZlbkFlV1VTRUVlbE56QT09']);
  } else if(event == "meeting.ended") {
    if(zoom) {
      zoom.kill()
      zoom = null
    }
  } else {
    return res.send("ok")
  }
  return res.send("ok")
})

app.listen(process.env.PORT || config.get('port') || 3000)
