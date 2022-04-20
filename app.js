require('dotenv').config()
const https = require('https')
const express = require('express')
const line = require('@line/bot-sdk')
const fs = require('fs')
const app = express()
const PORT = process.env.PORT || 3000

const client = new line.Client({
  channelAccessToken: process.env.TOKEN,
  channelSecret: process.env.SECRET
})

app.use(express.json())

app.use(
  express.urlencoded({
    extended: true
  })
)

app.get('/', (req, res) => {
  res.sendStatus(200)
})

// rich menu格式
const richmenu = {
  size: {
    width: 2500,
    height: 1686
  },
  selected: true,
  name: 'Nice Rich Menu',
  chatBarText: 'Tap to open',
  areas: [
    {
      bounds: {
        x: 0,
        y: 0,
        width: 2500,
        height: 1686
      },
      action: {
        type: 'postback',
        data: 'action=buy&itemid=123'
      }
    }
  ]
}

// 用來取得richMenuId讓之後的功能來做使用
// let RichMenu_Id
// client
//   .createRichMenu(richmenu)
//   .then((richMenuId) => {
//     RichMenu_Id = richMenuId
//     console.log(RichMenu_Id)
//   })
//   .catch((err) => console.log('Create err'))

// 上傳圖片至rich menu
// client
//   .setRichMenuImage(
//     process.env.RICHMENU_ID,
//     fs.createReadStream('./capoo.jpeg')
//   )
//   .catch((err) => console.error(err))

// 將目前的rich menu設為預設
// client
//   .setDefaultRichMenu(RichMenu_Id)
//   .catch((err) => console.log('Default err \n', err))

// 要傳送的訊息
const message = {
  type: 'text',
  text: 'Hello World!'
}

// 傳送push message >> 主動推播給USER
// client
//   .pushMessage('U523b61b998fbaaaa81ac5aa83de41d11', message)
//   .then(() => {
//     console.log('success')
//   })
//   .catch((err) => {
//     // error handling
//     console.log('err')
//   })

app.post('/webhook', function (req, res) {
  res.send('HTTP POST request sent to the webhook URL!')
  // If the user sends a message to your bot, send a reply message
  if (req.body.events[0].type === 'message') {
    // Message data, must be stringified
    let dataString
    if (req.body.events[0].message.text === 'hello') {
      dataString = JSON.stringify({
        // 每一筆request都不一樣
        replyToken: req.body.events[0].replyToken,
        // 要傳送給USER的訊息類型及內容
        messages: [
          {
            type: 'text',
            text: 'Hello, user'
          },
          {
            type: 'text',
            text: 'May I help you?'
          }
        ]
      })
    } else if (req.body.events[0].message.text === 'capoo') {
      dataString = JSON.stringify({
        // 每一筆request都不一樣
        replyToken: req.body.events[0].replyToken,
        // 要傳送給USER的訊息類型及內容
        messages: [
          {
            type: 'image',
            originalContentUrl:
              'https://static.gnjoy.com.tw/TRO/event/20201103_capoo/img/event_rom_capoo02.png?v2020_1104',
            previewImageUrl:
              'https://static.gnjoy.com.tw/TRO/event/20201103_capoo/img/event_rom_capoo02.png?v2020_1104'
          }
        ]
      })
    } else {
      dataString = JSON.stringify({
        // 每一筆request都不一樣
        replyToken: req.body.events[0].replyToken,
        // 要傳送給USER的訊息類型及內容
        messages: [
          {
            type: 'text',
            text: 'What?'
          },
          {
            type: 'text',
            text: 'Who are you?'
          }
        ]
      })
    }

    // Request header
    const headers = {
      'Content-Type': 'application/json',
      // channel access token
      Authorization: 'Bearer ' + process.env.TOKEN
    }

    // Options to pass into the request
    const webhookOptions = {
      // POST https://api.line.me/v2/bot/message/reply
      hostname: 'api.line.me',
      path: '/v2/bot/message/reply',
      method: 'POST',
      // 設定在上面
      headers: headers,
      body: dataString
    }

    // Define request
    const request = https.request(webhookOptions, (res) => {
      res.on('data', (d) => {
        process.stdout.write(d)
      })
    })

    // Handle error
    request.on('error', (err) => {
      console.error(err)
    })

    // Send data
    request.write(dataString)
    request.end()
  }
})

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}/webhook`)
})
