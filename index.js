const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const cors = require('cors')
const app = express()
const server = http.createServer(app)
const io = socketio(server)
// Parses the data as json
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const lats = [21.14353917690583, 24.865123447867372, 26.805673257015762, 14.738247166410236, 10.177805060039967, 16.927731534423504, 18.07016175270257, 12.86066967361287, 11.99108602459678]
const longs = [79.05215669638855, 81.42380232778993, 80.9446470589452, 78.3092930802991, 77.23119372539844, 75.67393910165303, 82.02274641384585, 77.743445136119, 76.8658987928008]

io.on('connection', (socket) => {
    console.log(socket.id + " connected")

    socket.on('receive', (location, callback) => {
        console.log("RECEIVED LOCATION", location)
        console.log("Latitude",location.latitude)
        console.log("Longitude",location.longitude)
        callback("received")
    })

    socket.on('send', (callback) => {
        const random = Math.floor(Math.random() * lats.length)
        const location = {
            latitude: lats[random],
            longitude: longs[random]
        }
        console.log("SENDING LOCATION", location)
        callback(location.latitude, location.longitude)
    })

    socket.on('disconnect', (reason) => {
        console.log(socket.id + " disconnected")
    })
})



app.post('/login', (req, res) => {
    console.log(req.body)
    const {phoneNumber, otp} = req.body
    if(!phoneNumber || !otp) return res.status(400).send({"error": "Phone Number or OTP not found"})
    if(phoneNumber === "7777777777" && otp === "888888"){
        res.send({validUser: true})
    } else {
        res.send({validUser: false})
    }
})


const port = process.env.PORT || 3001
server.listen(port, () => {
    console.log(`Server is up and running on ${port}!`)
})
