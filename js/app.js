import { removeClass } from './utils.js'

const defaultChars = 
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"

const formWrapper = document.querySelector('[data-js="form"]')
const ulWrapper = document.querySelector('.ul-wrapper')
const searchWrapper = document.querySelector('.search-wrapper')

const musicName = document.querySelector('#music__name')
const artistName = document.querySelector('#artist__name')
const releaseDate = document.querySelector('#release__date')

const searchTerm = document.querySelector('#search__music')

const randomCharactersButton = document.querySelector('#random__characters')

const dropdownOptionsWrapper = document.querySelector('.options-dropdown-button')
const dropdownButtons = document.querySelector('.options-dropdown-buttons')

let savedMusics = localStorage.getItem('savedMusics') === null ? [] : JSON.parse(localStorage.getItem('savedMusics'))

const clearHTML = (container) => {
    const containerChildren = [...container.children]
    containerChildren.forEach(item => item.remove())
}

window.addEventListener('load', () => {
    ulWrapper.classList.toggle('show-musics-added')
    showItemsOnScreen()

    setTimeout(() => {
        document.querySelector('footer').classList.add('active-footer')
    }, 1000)
})

const dropdownButtonsChildren = [...dropdownButtons.children]

dropdownButtonsChildren.forEach(item => {
    item.addEventListener('click', () => {
        removeClass('.options-dropdown-buttons', 'active')
        removeClass('.temp-wrapper', 'active-temp-wrapper')

    })
})

const extractProperties = (obj) => {
    const objExtract = Object.entries(obj)
    const finalResult = objExtract.reduce((acc, item) => {
        const [ property, value ] = item
        acc += `${property}: ${value}; `
        return acc
    }, '')
    
    return finalResult
}


dropdownOptionsWrapper.addEventListener('click', event => {
    const { clientX, clientY } = event
    document.querySelector('.temp-wrapper').classList.add('active-temp-wrapper')
    dropdownButtons.setAttribute(
        'style', 
        extractProperties({ 
            left: `${clientX}px`, 
            top: `${clientY}px`}))

    dropdownButtons.classList.toggle('active')
})

document.querySelector('.temp-wrapper').addEventListener('click', () => {
    removeClass('.options-dropdown-buttons', 'active')
    removeClass('.temp-wrapper', 'active-temp-wrapper')
})


const currentDate = () => 
    new Date()
    .toLocaleDateString(navigator.language, { hour: 'numeric', minute: 'numeric'})
    .replace(/.+[,]\s/g, '')

const downloadFile = () => {
    const savedMusics = JSON.stringify(JSON.parse(localStorage.getItem('savedMusics')), null, 2)
    blobWithMusics = new Blob([savedMusics])
    
    const aElement = document.createElement('a')
    const itemURL = URL.createObjectURL(blobWithMusics)

    aElement.href = itemURL
    aElement.download = `musics-${generateId(4)}-${currentDate()}.json`
    aElement.type = 'application/json'
    aElement.click()
    aElement.remove()
}

dropdownButtons.addEventListener('click', event => {

    const targetIdClicked = event.target.id
    
    switch(targetIdClicked) {
        case 'load__musics':
            clearHTML(ulWrapper)
            showItemsOnScreen()
            break
        case 'show__musics__added':
            ulWrapper.classList.toggle('show-musics-added')
            break
        case 'search__music__button':
            searchWrapper.classList.toggle('show-search-wrapper')
            break
        case 'download__files':
            downloadFile()
            break   
    }
})

const createElement = (element, value, appendWhere, idGenerated) => {

    const newElement = document.createElement(element)
    newElement.textContent = value
    newElement.dataset.li = idGenerated
    appendWhere.appendChild(newElement)

    newElement.innerHTML += 
    `<i class="fas fa-trash" data-delete="${idGenerated}" style="cursor: pointer; float: right; margin-left: 10px;"></i>
    <i class="fas fa-pen" data-edit="${idGenerated}" style="cursor: pointer; float: right;"></i>`
    
}

const showItemsOnScreen = () => {

    savedMusics.forEach(music => {
        const { id, name, artist, ['release-date']: releaseDate } = music

        const template = `${name} - ${artist} - ${releaseDate}`
        createElement('li', template, ulWrapper, id)
        
    })
}

const generateId = (length, chars = defaultChars) => {
    let result = ""
    const characters = chars
    const charactersLength = characters.length
    for(let i = 0; i < length; i++) {
        result += characters.charAt(Math.random() * charactersLength)
    }
    return result
}

formWrapper.addEventListener('submit', event => {

    event.preventDefault()

    const idGenerated = generateId(16)
    
    const music = {
        id: idGenerated,
        name: musicName.value,
        artist: artistName.value,
        'release-date': releaseDate.value 
    }

    savedMusics.push(music)
    localStorage.setItem('savedMusics', JSON.stringify(savedMusics))

    clearHTML(ulWrapper)
    showItemsOnScreen()

})

const deleteItem = event => {
    
    const eventTargetDataset = event.target.dataset
    const { ['delete']: deleteItemDataset } = eventTargetDataset

    clearHTML(ulWrapper)

    savedMusics.filter((item, index) => {
        if(item.id === deleteItemDataset) {
            return savedMusics.splice(index, 1)
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

const editItem = (event) => {
    
    const eventTargetDataset = event.target.dataset
    const { ['edit']: editItemDataset } = eventTargetDataset

    const liInsertIntoDOM = document.querySelector(`[data-li="${editItemDataset}"]`)

    const getMusicDetailsMatch = element => index => element.textContent.match(/[^\-]+/gi)[index]
    const musicNameIntoDOM = getMusicDetailsMatch(liInsertIntoDOM)(0)
    const artistNameIntoDOM = getMusicDetailsMatch(liInsertIntoDOM)(1)
    const releaseDateIntoDOM = getMusicDetailsMatch(liInsertIntoDOM)(2)

    const tempLiArtist = document.querySelector(`[data-temp-li-artist="${editItemDataset}"]`)
    const tempLiName = document.querySelector(`[data-temp-li-name="${editItemDataset}"]`)
    const tempLiReleaseDate = document.querySelector(`[data-temp-li-date="${editItemDataset}"]`)

    const div = document.createElement('div')
    div.classList.add('temp-edit-details')
    div.dataset.tempDiv = editItemDataset

    const musicName = document.createElement('input')
    musicName.setAttribute('type', 'text')
    console.log()
    musicName.placeholder = musicNameIntoDOM
    musicName.classList.add('input-style', 'input-temp-edit-details')
    musicName.dataset.tempLiName = editItemDataset
    musicName.value = generateId(8)

    const artistName = document.createElement('input') 
    artistName.placeholder = artistNameIntoDOM
    artistName.dataset.tempLiArtist = editItemDataset
    artistName.classList.add('input-style', 'input-temp-edit-details')
    artistName.value = generateId(8)

    const releaseDate = document.createElement('input')
    releaseDate.placeholder = releaseDateIntoDOM
    releaseDate.dataset.tempLiDate = editItemDataset
    releaseDate.classList.add('input-style', 'input-temp-edit-details')
    releaseDate.value = generateId(8)

    div.append(musicName, artistName, releaseDate)

    const dataTemps = [tempLiArtist, tempLiName, tempLiReleaseDate]
    const itemsAreEmpty = dataTemps.every(item => !item)

    const dataEdit = document.querySelector(`[data-edit="${editItemDataset}"]`)

    if(itemsAreEmpty) {
        dataEdit.classList.replace('fa-pen', 'fa-check')
        dataEdit.setAttribute('data-temp-edit', editItemDataset)
        dataEdit.removeAttribute('data-edit', editItemDataset)
        liInsertIntoDOM.insertAdjacentElement('afterend', div)

    }
}

const editTempItem = event => {

    const eventTargetDataset = event.target.dataset

    const { ['tempEdit']: tempEditDataset } = eventTargetDataset

    document.querySelector(`[data-temp-div="${tempEditDataset}"]`).classList.add('temp-edit-details-active')
    
    const musicNameFromDOM = document.querySelector(`[data-temp-li-name="${tempEditDataset}"]`)
    const artistNameFromDOM  = document.querySelector(`[data-temp-li-artist="${tempEditDataset}"]`)
    const releaseDateFromDOM = document.querySelector(`[data-temp-li-date="${tempEditDataset}"]`)

    const arrayWithDetails = [musicNameFromDOM, artistNameFromDOM, releaseDateFromDOM]
    
    const itemsCantBeNotEmpty = arrayWithDetails.map(item => {
        if(item.value === '') {
            item.classList.add('incorrect')
        } else {
            item.classList.remove('incorrect')
        }
        return item
    })

    const incorrectsElements = 
        itemsCantBeNotEmpty.some(item => item.classList.contains('incorrect'))

    if(!incorrectsElements) {
        const savedMusicsFromStorage = JSON.parse(localStorage.getItem('savedMusics'))
        
        const newArray = savedMusicsFromStorage.map(item => {
            if(item.id === tempEditDataset) {
                item.name = musicNameFromDOM.value
                item.artist = artistNameFromDOM.value
                item['release-date'] = releaseDateFromDOM.value
            }
            return item
        })

        savedMusics.splice(0, savedMusics.length)
        savedMusics.push(...newArray)

        localStorage.setItem('savedMusics', JSON.stringify(savedMusics))

        if(tempEditDataset) {
            document.querySelector(`[data-temp-edit="${tempEditDataset}"]`).classList.replace('fa-check', 'fa-pen')
            document.querySelector(`[data-temp-div="${tempEditDataset}"]`).remove()
            clearHTML(ulWrapper)

            showItemsOnScreen()

        }
    }
}

ulWrapper.addEventListener('click', event => {
    
    const targetClicked = event.target
    const targetDatasetClicked = targetClicked.dataset

    const valuesFromTargetDatasetClicked = Object.keys(targetDatasetClicked).toString()

    switch(valuesFromTargetDatasetClicked) {
        case 'edit':
            editItem(event)
            break
        case 'tempEdit':
            editTempItem(event)
            break
        case 'delete':
            deleteItem(event)
            break
    }
})

const includesTerm = (searchTerm, ...items) => { 
    return items.some(item => item.includes(searchTerm))
}

searchTerm.addEventListener('input', () => {
 
    const savedMusicsFromStorage = JSON.parse(localStorage.getItem('savedMusics'))
    clearHTML(ulWrapper)

    savedMusicsFromStorage.map(item => { 

        console.log(item)

        if(includesTerm(searchTerm.value.toLowerCase(), item.name.toLowerCase(), item.artist.toLowerCase(), item['release-date'])) {
            const template = `${item.name} - ${item.artist} - ${item['release-date']}`
            createElement('li', template, ulWrapper, item.id)
            
        }
    })  
})

randomCharactersButton.addEventListener('click', () => {
    musicName.value = generateId(8)
    artistName.value = generateId(8)
    releaseDate.value = generateId(4, '0123456789')
})