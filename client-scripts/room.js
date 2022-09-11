/* eslint-disable no-undef */
const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myVideo = document.createElement('video')
myVideo.muted = true

const user = prompt('Enter your name')
const peer = new Peer(undefined, {
  path: '/peerjs',
  host: 'localhost',
  port: '9000',
})

// eslint-disable-next-line no-unused-vars
let myVideoStream
navigator.mediaDevices
  .getUserMedia({
    audio: true,
    video: true,
  })
  .then(stream => {
    myVideoStream = stream
    addVideoStream(myVideo, stream)

    peer.on('call', call => {
      call.answer(stream)
      const video = document.createElement('video')
      call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
      })
    })

    socket.on('user-connected', userId => {
      connectToNewUser(userId, stream)
    })
    socket.emit('ready')
  })

const connectToNewUser = (userId, stream) => {
  const call = peer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
}

peer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id, user)
})

const addVideoStream = (video, stream) => {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
    videoGrid.append(video)
  })
}

let text = document.querySelector('#chat_message')
let send = document.getElementById('send')
let messages = document.querySelector('.messages')
const inviteButton = document.querySelector('#inviteButton')
const stopVideo = document.querySelector('#stopVideo')
const muteButton = document.querySelector('#muteButton')

muteButton.addEventListener('click', () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false
    html = '<i class="fas fa-microphone-slash"></i>'
    muteButton.classList.toggle('background__red')
    muteButton.innerHTML = html
  } else {
    myVideoStream.getAudioTracks()[0].enabled = true
    html = '<i class="fas fa-microphone"></i>'
    muteButton.classList.toggle('background__red')
    muteButton.innerHTML = html
  }
})

stopVideo.addEventListener('click', () => {
  const enabled = myVideoStream.getVideoTracks()[0].enabled
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false
    html = '<i class="fas fa-video-slash"></i>'
    stopVideo.classList.toggle('background__red')
    stopVideo.innerHTML = html
  } else {
    myVideoStream.getVideoTracks()[0].enabled = true
    html = '<i class="fas fa-video"></i>'
    stopVideo.classList.toggle('background__red')
    stopVideo.innerHTML = html
  }
})

inviteButton.addEventListener('click', () => {
  prompt('Copy this link and send it to students', window.location.href)
})

send.addEventListener('click', () => {
  if (text.value.length !== 0) {
    socket.emit('message', text.value)
    text.value = ''
  }
})

text.addEventListener('keydown', e => {
  if (e.key === 'Enter' && text.value.length !== 0) {
    socket.emit('message', text.value)
    text.value = ''
  }
})

socket.on('createMessage', (message, userName) => {
  messages.innerHTML =
    messages.innerHTML +
    `<div class="message">
        <b><i class="far fa-user-circle"></i> <span> ${userName}</span> </b>
        <span>${message}</span>
    </div>`
})

// TODO: user disconnect
// socket.on('user-disconnected', userId => {
//   // remove video
// })
