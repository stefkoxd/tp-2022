/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
let myVideoStream

const socket = io('/')

const peer = new Peer(undefined, {
  path: '/peerjs',
  host: 'localhost',
  port: '9000',
})

const videoGrid = document.getElementById('video-grid')
const myVideo = document.createElement('video')
myVideo.muted = true

navigator.mediaDevices
  .getUserMedia({
    audio: true,
    video: true,
  })
  .then((stream) => {
    myVideoStream = stream
    addVideoStream(myVideo, stream)

    peer.on('call', (call) => {
      call.answer(stream)
      const video = document.createElement('video')
      call.on('stream', (userVideoStream) => {
        addVideoStream(video, userVideoStream)
      })
    })

    socket.on('user-connected', (userId) => {
      console.log('connected')
      connectToNewUser(userId, stream)
    })
  })

const connectToNewUser = (userId, stream) => {
  const call = peer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', (userVideoStream) => {
    addVideoStream(video, userVideoStream)
  })
}

const addVideoStream = (video, stream) => {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
    videoGrid.append(video)
  })
}

// TODO: fix random user
const user = `user-${Math.floor(Math.random() * 100)}`

peer.on('open', (id) => {
  console.log('peer open')
  socket.emit('join-room', ROOM_ID, id, user)
})
