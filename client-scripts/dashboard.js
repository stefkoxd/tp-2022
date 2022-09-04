const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

let date = new Date()
let monday = getFirstDayOfWeek(date)
let sunday = getLastDayOfWeek(date)
const data = computeData()
const cells = initializeMeetingContainers()
const meetingElements = initializeMeetingElements(data)

updateMeetings(meetingElements)
updateDateInHtml(monday, sunday)
attachEvents()

function update(newDate) {
  const [monday, sunday] = updateWeekDays(newDate)
  updateDate(newDate)
  updateDateInHtml(monday, sunday)
  updateCells(monday)
  cleanUpMeetingElements()
  updateMeetings(meetingElements)
}

function attachEvents() {
  document.getElementById('prev-week').addEventListener('click', () => {
    const newDate = subtractDays(date, 7)
    update(newDate)
  })

  document.getElementById('next-week').addEventListener('click', () => {
    const newDate = addDays(date, 7)
    update(newDate)
  })
}

function computeData() {
  return Object.values(
    document.getElementById('data')?.content?.firstElementChild?.children ?? {}
  )?.map(child => ({
    id: child.id,
    name: child?.getElementsByClassName?.('name')?.[0]?.innerText,
    date: new Date(child?.getElementsByClassName?.('date')?.[0]?.innerText),
  }))
}

function initializeMeetingContainers() {
  return Object.values(document.getElementById('timetable').children)
    .map((child, i) => {
      return rangeTo(24)
        .map(hour => {
          if (!i) {
            child.appendChild(createTimeElement(hour.toString()))
            return [null, null, null]
          }

          const day = addDays(monday, i - 1)
          const element = createDateElement(day, hour.toString())
          child.appendChild(element)

          return [i - 1, hour, element]
        })
        .reduce(
          ([_, prev], [day, hour, element]) => [
            day,
            {
              ...prev,
              [hour]: element,
            },
          ],
          [0, {}]
        )
    })
    .slice(1)
    .reduce(
      (prev, [day, elements]) => [
        ...prev.slice(0, day),
        elements,
        ...prev.slice(day + 1),
      ],
      []
    )
}

function initializeMeetingElements(data) {
  return data
    .map(meeting => [
      formatIsoDate(meeting.date, meeting.date.getHours().toString()),
      createMeetingElement(meeting),
    ])
    .reduce(
      (prev, [key, value]) => ({
        ...prev,
        [key]: value,
      }),
      {}
    )
}

function updateCells(monday) {
  rangeTo(7).forEach(numDay => {
    const day = addDays(monday, numDay)
    Object.entries(cells[numDay]).forEach(([hour, cell]) => {
      cell.id = formatIsoDate(day, hour)
    })
  })
}

/**
 * update a field in the ui based on interaction.
 * @param {Date} monday
 * @param {Date} sunday
 */
function updateDateInHtml(monday, sunday) {
  const text = `${formatDate(monday)} - ${formatDate(sunday)}`
  const textNode = document.createTextNode(text)
  document.getElementById('week').replaceChildren(textNode)
}

function cleanUpMeetingElements() {
  Object.values(meetingElements).forEach(meeting => meeting.remove())
}

function handleMeetingClick(e, meeting) {
  //prettier-ignore
  const confirmText = `This will take you to the meeting room of '${meeting.name}'\n scheduled at '${formatDateTime(meeting.date)}',\n are you sure you wan't to proceed?`
  const isConfirmed = confirm(confirmText)

  if (!isConfirmed) {
    e.preventDefault()
  }
}

/**
 * Get the last day of the current week (sunday)
 *
 * @param {Date} date
 * @returns date of monday
 */
function getFirstDayOfWeek(date) {
  const newDate = new Date(date)
  const day = newDate.getDay() || 7
  if (day !== 1) {
    newDate.setHours(-24 * (day - 1))
  }
  return newDate
}

/**
 * Get the first day of the current week (monday)
 *
 * @param {Date} date
 * @returns date of sunday
 */
function getLastDayOfWeek(date) {
  const newDate = new Date(date)
  const day = newDate.getDay() || 7
  if (day !== 7) {
    newDate.setHours(24 * (7 - day))
  }
  return newDate
}

/**
 * update the date property.
 *
 * @param {Date} newDate
 */
function updateDate(newDate) {
  date = newDate
}

/**
 * update the weekday params.
 *
 * @param {Date} date
 */
function updateWeekDays(date) {
  monday = getFirstDayOfWeek(date)
  sunday = getLastDayOfWeek(date)
  return [monday, sunday]
}

/**
 * create new array with item from 0 to n
 *
 * @param {number} n
 * @returns a range from 0 to n
 */
function rangeTo(n) {
  return [...Array(n).keys()]
}

/**
 * format a date.
 *
 * @param {Date} date
 * @returns formatted date
 */
function formatDate(date) {
  const day = date.getDate()
  const month = monthNames[date.getMonth()]
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

/**
 *
 * @param {Date} date
 * @returns
 */
function formatDateTime(date) {
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  return `${hours}:${minutes} ${formatDate(date)}`
}

/**
 *
 * @param {Date} date
 * @param {string} hour
 * @returns
 */
function formatIsoDate(date, hour) {
  const year = date.getFullYear()
  const month = date.getMonth().toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = hour.padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:00`
}

/**
 * Increment the number of days by the amount provided.
 *
 * @param {Date} date
 * @param {number} days
 */
function addDays(date, days) {
  const newDate = new Date(date)
  newDate.setDate(date.getDate() + days)

  return newDate
}

/**
 * Decrement the number of days by the amount provided.
 *
 * @param {Date} date
 * @param {number} days
 */
function subtractDays(date, days) {
  const newDate = new Date(date)

  newDate.setDate(newDate.getDate() - days)
  return newDate
}

/**
 * create an html element of type
 *
 * @param {string} id the id of the html element
 * @param {string} type the type of element
 * @returns
 */
function createElement(id, type = 'div') {
  const element = document.createElement(type)

  element.id = id

  return element
}

/**
 *
 * @param {Date} date
 * @param {string} hour
 * @returns
 */
function createDateElement(date, hour, type = 'div') {
  const id = formatIsoDate(date, hour)
  return createElement(id, type)
}

/**
 *
 * @param {Date} date
 * @param {string} hour
 * @returns
 */
function createTimeElement(hour, type = 'div') {
  const id = `${hour.padStart(2, '0')}:00`
  const element = createElement(id, type)
  const textNode = document.createTextNode(id)
  element.appendChild(textNode)
  return element
}

/**
 * Create a link pointing to the meeting room.
 * @param {string} id
 * @param
 */
function createLink(id, href, element) {
  const link = document.createElement('a')
  link.href = href
  link.id = id
  link.appendChild(element)
  return link
}

function createMeetingElement(meeting) {
  const link = `/room/${meeting.id}`
  const meetingElement = createElement(meeting.id, 'a')
  const meetingText = document.createTextNode(meeting.name)
  const linkText = document.createTextNode('Join')
  const meetingLink = createLink(`link-${meeting.id}`, link, linkText)

  meetingElement.href = link
  meetingElement.classList.add('meeting-chip')
  meetingElement.append(meetingText, ' ', meetingLink)

  meetingElement.addEventListener('click', e => handleMeetingClick(e, meeting))

  return meetingElement
}

function updateMeetings(meetingElements) {
  Object.entries(meetingElements).forEach(([id, meeting]) =>
    document.getElementById(id)?.appendChild(meeting)
  )
}
