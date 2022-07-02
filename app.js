const defaultChars = 
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"

const wrapper = document.querySelector('.wrapper')
const formWrapper = document.querySelector('[data-js="form"]')
const ulWrapper = document.querySelector('.ul-wrapper')
const toggleHeight = document.querySelector('.toggleHeight') 

const musicName = document.querySelector('#music__name')
const artistName = document.querySelector('#artist__name')
const releaseDate = document.querySelector('#release__date')

const searchMusicButton = document.querySelector('#search__music__button')

const dropdownOptionsWrapper = document.querySelector('.options-dropdrown-button')

const dropdrownButtonsChildren = [...document.querySelector('.options-dropdrown-buttons').children]
dropdrownButtonsChildren.forEach(item => {
    item.addEventListener('click', () => {
        document.querySelector('.options-dropdrown-buttons').classList.remove('active')
    })
})

dropdownOptionsWrapper.addEventListener('click', () => {
    document.querySelector('.options-dropdrown-buttons').classList.toggle('active')
})

searchMusicButton.addEventListener('click', () => {
    document.querySelector('.search-wrapper').classList.toggle('active-search-wrapper')
})

const loadMusicsButton = document.querySelector('#load__musics')

const musicsId = []
let savedMusics = []

const showItemsOnScreen = () => {
    console.log(savedMusics)
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

        savedMusics.filter(item => {
            if(item.id === event.target.dataset.delete) {
                return savedMusics.splice(item.id, 1)
            }
        })

        localStorage.setItem('savedMusics', JSON.stringify(savedMusics))
        showItemsOnScreen()

        if(ulWrapper.firstElementChild === null) {
            const newElement = document.createElement('p')
            newElement.textContent = "Nothing yet"
            newElement.classList.add('musics-not-found')
            ulWrapper.appendChild(newElement)
        }
    }

    if(event.target.dataset.edit) {

        const liInsertIntoDOM = document.querySelector(`[data-li="${event.target.dataset.edit}"]`)
        const musicNameIntoDOM = liInsertIntoDOM.textContent.match(/[^\-]+/gi)[0]
        const artistNameIntoDOM = liInsertIntoDOM.textContent.match(/[^\-]+/gi)[1]
        const releaseDateIntoDOM = liInsertIntoDOM.textContent.match(/[^\-]+/gi)[2]

        const tempLiArtist = document.querySelector(`[data-temp-li-artist="${event.target.dataset.edit}"]`)
        const tempLiName = document.querySelector(`[data-temp-li-name="${event.target.dataset.edit}"]`)
        const tempLiReleaseDate = document.querySelector(`[data-temp-li-date="${event.target.dataset.edit}"]`)

        const div = document.createElement('div')
        div.classList.add('temp-edit-details')
        div.dataset.tempDiv = event.target.dataset.edit

        const musicName = document.createElement('input')
        musicName.setAttribute('type', 'text')
        console.log()
        musicName.placeholder = musicNameIntoDOM
        musicName.classList.add('input-style', 'input-temp-edit-details')
        musicName.dataset.tempLiName = event.target.dataset.edit

        const artistName = document.createElement('input') 
        artistName.placeholder = artistNameIntoDOM
        artistName.dataset.tempLiArtist = event.target.dataset.edit
        artistName.classList.add('input-style', 'input-temp-edit-details')

        const releaseDate = document.createElement('input')
        releaseDate.placeholder = releaseDateIntoDOM
        releaseDate.dataset.tempLiDate = event.target.dataset.edit
        releaseDate.classList.add('input-style', 'input-temp-edit-details')

        div.append(musicName, artistName, releaseDate)

        const dataTemps = [tempLiArtist, tempLiName, tempLiReleaseDate]
        const itemsAreEmpty = dataTemps.every(item => !item) 

        if(itemsAreEmpty) {
            document.querySelector(`[data-edit="${event.target.dataset.edit}"]`).classList.replace('fa-pen', 'fa-check')
            
            document.querySelector(`[data-edit="${event.target.dataset.edit}"]`).setAttribute('data-temp-edit', event.target.dataset.edit)
    
            liInsertIntoDOM.insertAdjacentElement('afterend', div)
            return
            
        }        
    }

    if(event.target.dataset.tempEdit) {

        document.querySelector(`[data-temp-div="${event.target.dataset.edit}"]`).classList.add('temp-edit-details-active')

        const musicName = document.querySelector(`[data-temp-li-name="${event.target.dataset.edit}"]`)
        const artistName  = document.querySelector(`[data-temp-li-artist="${event.target.dataset.edit}"]`)
        const releaseDate = document.querySelector(`[data-temp-li-date="${event.target.dataset.edit}"]`)

        const arrayWithDetails = [musicName, artistName, releaseDate]

        const ItemsCantBeNotEmpty = arrayWithDetails.map(item => {
            if(item.value === '') {
                item.classList.add('incorrect')
            }else {
                item.classList.remove('incorrect')
            }
            return item
        })

        const incorrectsElements = 
            ItemsCantBeNotEmpty.some(item => item.classList.contains('incorrect'))

        if(!incorrectsElements) {
            const savedMusicsFromStorage = JSON.parse(localStorage.getItem('savedMusics'))
            
            const newArray = savedMusicsFromStorage.map(item => {
                if(item.id === event.target.dataset.edit) {
                    item.name = musicName.value
                    item.artist = artistName.value
                    item['release-date'] = releaseDate.value
                    
                }
                return item
            })

            savedMusics = newArray

            localStorage.setItem('savedMusics', JSON.stringify(newArray))

            if(event.target.dataset.tempEdit) {
                document.querySelector(`[data-temp-edit="${event.target.dataset.edit}"]`).classList.replace('fa-check', 'fa-pen')
                document.querySelector(`[data-temp-div="${event.target.dataset.edit}"]`).remove()
                
                Array.from(ulWrapper.children).forEach(item => {
                    item.remove()
                })

                showItemsOnScreen()

            }
        }
    }
})

loadMusicsButton.addEventListener('click', () => {
    if(savedMusics.length !== 0) {
        ulWrapper.innerHTML = ''
    }

    showItemsOnScreen()

})