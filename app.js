const defaultChars = 
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"

const wrapper = document.querySelector('.wrapper')
const formWrapper = document.querySelector('[data-js="form"]')
const ulWrapper = document.querySelector('.ul-wrapper')
const toggleHeight = document.querySelector('.toggleHeight') 

const musicName = document.querySelector('#music__name')
const artistName = document.querySelector('#artist__name')
const releaseDate = document.querySelector('#release__date')

const loadMusicsButton = document.querySelector('#load__musics')

const musicsId = []
let savedMusics = []

const showItemsOnScreen = () => {
    savedMusics.forEach(music => {
        const { id, name, artist, 'release-date': releaseDate } = music

        const template = `${name} - ${artist} - ${releaseDate}`
        createElement('li', template, ulWrapper, id)

    })
}

window.onload = () => ulWrapper.classList.toggle('active')
window.addEventListener('load', () => {
    const storageSavedMusics = localStorage.getItem('savedMusics') === null ? [] : localStorage.getItem('savedMusics')
    savedMusics = JSON.parse(storageSavedMusics)
    search__music.focus()
    showItemsOnScreen()
})

toggleHeight.addEventListener('click', () => ulWrapper.classList.toggle('active'))

const generateId = (length, chars = defaultChars) => {
    let result = ""
    const characters = chars
    const charactersLength = characters.length
    for(let i = 0; i < length; i++) {
        result += characters.charAt(Math.random() * charactersLength)
    }
    return result
}

const createElement = (element, value, appendWhere, idGenerated) => {

    const newElement = document.createElement(element)
    newElement.textContent = value
    newElement.dataset.li = idGenerated
    appendWhere.appendChild(newElement)

    newElement.innerHTML += 
    `<i class="fas fa-trash" data-delete="${idGenerated}" style="cursor: pointer; float: right; margin-left: 10px;"></i>
    <i class="fas fa-pen" data-edit="${idGenerated}" style="cursor: pointer; float: right;"></i>`
    
}

formWrapper.addEventListener('submit', event => {

    event.preventDefault()

    if(ulWrapper.firstElementChild.classList.contains('musics-not-found')) {
        ulWrapper.firstElementChild.remove()
    }

    const idGenerated = generateId(16)
    const template = musicName.value + ' - ' + artistName.value + ' - ' + releaseDate.value

    const music = {
        id: idGenerated,
        name: musicName.value,
        artist: artistName.value,
        'release-date': releaseDate.value 
    }

    savedMusics.push(music)

    localStorage.setItem('savedMusics', JSON.stringify(savedMusics))

    createElement('li', template, ulWrapper, idGenerated)
})



ulWrapper.addEventListener('click', event => {

    const targetClicked = event.target

    if(targetClicked.dataset.delete) {

        ulWrapper.innerHTML = ''

        // savedMusics.filter((music, index) => {
        //     if(music.id === targetClicked.dataset.delete) {
        //         return savedMusics.splice(index, 1)
        //     }
        // })

        showItemsOnScreen()

        localStorage.setItem('savedMusics', JSON.stringify(savedMusics))

        if(ulWrapper.firstElementChild === null) {
            const newElement = document.createElement('p')
            newElement.textContent = "Nothing yet"
            newElement.classList.add('musics-not-found')
            ulWrapper.appendChild(newElement)
        }
    }

    if(event.target.dataset.edit) {

        // const savedMusicsFromStorage = JSON.parse(localStorage.getItem('savedMusics'))
        
        const liInsertIntoDOM = document.querySelector(`[data-li="${event.target.dataset.edit}"]`)
        const newElement = document.createElement('input')

        newElement.setAttribute('type', 'text')
        newElement.placeholder = 'Input a new name for the music'
        newElement.classList.add('input-style')
        newElement.dataset.tempLi = event.target.dataset.edit
        
        if(!document.querySelector(`[data-temp-li="${event.target.dataset.edit}"]`)) {
            document.querySelector(`[data-edit=${event.target.dataset.edit}]`).classList.replace('fa-pen', 'fa-check')
            liInsertIntoDOM.insertAdjacentElement('afterend', newElement)
            return
        }
    }
})

loadMusicsButton.addEventListener('click', () => {
    if(savedMusics.length !== 0) {
        ulWrapper.innerHTML = ''
    }

    showItemsOnScreen()

})