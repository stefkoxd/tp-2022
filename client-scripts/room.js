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
    addVideoStream(myVideo, stream, 'me')


    peer.on('call', call => {
      call.answer(stream)

      const video = document.createElement('video')
      call.on('stream', userVideoStream => {
        const userId = getUserId(userVideoStream.id)
        addVideoStream(video, userVideoStream, userId)
      })
    })

    socket.on('user-connected', userId => {
      connectToNewUser(userId, stream)
    })
    socket.emit('ready')
  })

function getUserId(remoteId) {
  return Object.entries(peer.connections)
    .filter(([, [connection]]) => connection?.remoteStream.id === remoteId)
    .map(([key]) => key)
    .find(() => true)
}

function connectToNewUser(userId, stream) {
  const call = peer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream, userId)
  })
}

peer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id, user)
})

function addVideoStream(video, stream, userId = '') {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
    if (!videoGrid.getElementsByClassName(userId).length) {
      video.id = userId
      video.classList.add(userId)
      videoGrid.append(video)
      handleLayout(videoGrid)
    }
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
    muteButton.classList.toggle('background__red')
    muteButton.classList.remove('active')
  } else {
    myVideoStream.getAudioTracks()[0].enabled = true
    muteButton.classList.toggle('background__red')
    muteButton.classList.add('active')
  }
})

stopVideo.addEventListener('click', () => {
  const enabled = myVideoStream.getVideoTracks()[0].enabled
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false
    stopVideo.classList.toggle('background__red')
    stopVideo.classList.remove('active')
  } else {
    myVideoStream.getVideoTracks()[0].enabled = true
    stopVideo.classList.toggle('background__red')
    stopVideo.classList.add('active')
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
    `<div class="message">
        <b><i class="far fa-user-circle"></i> <span> ${userName}</span> </b>
        <span>${message}</span>
    </div>` + messages.innerHTML
})

socket.on('user-disconnected', userId => {
  document.getElementById(userId)?.remove()
  handleLayout(videoGrid)
})

/**
 *
 * @param {number} elements
 * @param {number} width
 * @param {number} height
 */
function calculateLayout(elements, width, height) {
  const portrait = width < height
  const ratio = portrait ? width / height : height / width

  const truncatedRatio = ratio > 0.4 || ratio < 0.6 ? 0.5 : ratio < 0.4 ? 1 - ratio : ratio

  if (elements === 1) {
    return {
      rows: 1,
      cols: 1
    }
  }

  const x = elements * truncatedRatio
  if (portrait) {
    const cols = Math.floor(x)
    const rows = Math.ceil(elements / cols)

    return {
      cols,
      rows
    }
  }

  const rows = Math.floor(x)
  const cols = Math.ceil(elements / rows)

  return {
    cols,
    rows
  }


}

/**
 * @param {HTMLElement} entry
 */
function handleLayout(entry) {
  const height = entry.clientHeight
  const width = entry.clientWidth
  const elements = entry.children.length

  const {rows, cols} = calculateLayout(elements, width, height)

  const elementHeight = height / rows
  const elementWidth = width / cols

  entry.style.setProperty('--rows', rows.toString())
  entry.style.setProperty('--cols', cols.toString())
  entry.style.setProperty('--inner-width', `${elementWidth}px`)
  entry.style.setProperty('--inner-height', `${elementHeight}px`)
}

let videoGridResizeObserver = new ResizeObserver(entries => {

  for (const entry of entries) {
    handleLayout(entry.target)
  }
})

videoGridResizeObserver.observe(document.getElementById('video-grid'))

videoGrid.addEventListener('change', (ev) => {
  handleLayout(ev.target)
})
