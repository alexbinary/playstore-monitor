#!/usr/bin/env node

let duration = require('duration-js')

var email = require('./email')
let config = require('./config')
let playstore = require('./playstore')

let conf = config.get()

let appName = conf.appName
let packageName = conf.packageName
let timeInterval = duration.parse(conf.timeInterval)

let mailAgent = email({
  smtp: conf.smtp,
  from: conf.emailFrom,
  to: conf.emailTo
})

function check () {
  console.log((new Date()) + ' 🔮  Checking if ' + appName + ' (' + packageName + ') is up on the PlayStore...')
  playstore.check(packageName, (err, isUp) => {
    if (!err) {
      if (isUp) {
        mailAgent.send(appName, packageName)
        clearInterval(interval)
      }
    }
  })
}

let interval = setInterval(check, timeInterval.milliseconds())

check()