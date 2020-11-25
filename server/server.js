import CONFIG from './../config'
import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import Template from './../template.js'

const app = express();

app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))
app.use(bodyParser.json({limit: '10mb', extended: true}))

const CURRENT_WORKING_DIR = process.cwd();

app.use(express.static(path.join(CURRENT_WORKING_DIR, 'public')));

//comment out before building for production
import devBundle from './devBundle'
//comment out before building for production
devBundle.compile(app);

app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')))

app.get('*', (req, res)=>{
  res.send(Template());
})

app.listen(CONFIG.port, (err)=> {
  if (err) {
    console.log(err)
  }
  console.info('Server started on port %s.', CONFIG.port)
})
