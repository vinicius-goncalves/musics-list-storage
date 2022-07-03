const defaultChars = 
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"

const wrapper = document.querySelector('.wrapper')
const formWrapper = document.querySelector('[data-js="form"]')
const ulWrapper = document.querySelector('.ul-wrapper')
const toggleHeight = document.querySelector('.toggleHeight') 

const musicName = document.querySelector('#music__name')
const artistName = document.querySelector('#artist__name')
const releaseDate = document.querySelector('#release__date')

const searchTerm = document.querySelector('#search__music')
const searchMusicButton = document.querySelector('#search__music__button')

const randomCharactersButton = document.querySelector('#random__characters')

const dropdownOptionsWrapper = document.querySelector('.options-dropdrown-button')

const dropdrownButtonsChildren = [...document.querySelector('.options-dropdrown-buttons').children]
dropdrownButtonsChildren.forEach(item => {
    item.addEventListener('click', () => {
        document.querySelector('.options-dropdrown-buttons').classList.remove('active')
    })
})

const clearHTML = (container) => {
    const containerChildren = [...container.children]
    containerChildren.forEach(item => item.remove())
}

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

    setTimeout(() => {
        document.querySelector('footer').classList.add('active-footer')
    }, 1000)
    
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
        liInsertIntoDOM.insertAdjacentElement('afterend', div)

    }
}

const editTempItem = event => {

    const eventTargetDataset = event.target.dataset

    const { 
        ['edit']: editItemDataset, 
        ['tempEdit']: tempEditDataset } = eventTargetDataset

    document.querySelector(`[data-temp-div="${editItemDataset}"]`).classList.add('temp-edit-details-active')
    
    const musicName = document.querySelector(`[data-temp-li-name="${editItemDataset}"]`)
    const artistName  = document.querySelector(`[data-temp-li-artist="${editItemDataset}"]`)
    const releaseDate = document.querySelector(`[data-temp-li-date="${editItemDataset}"]`)

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
            if(item.id === editItemDataset) {
                item.name = musicName.value
                item.artist = artistName.value
                item['release-date'] = releaseDate.value
                
            }
            return item
        })

        savedMusics = newArray

        localStorage.setItem('savedMusics', JSON.stringify(newArray))

        if(tempEditDataset) {
            document.querySelector(`[data-temp-edit="${editItemDataset}"]`).classList.replace('fa-check', 'fa-pen')
            document.querySelector(`[data-temp-div="${editItemDataset}"]`).remove()
            clearHTML(ulWrapper)

            showItemsOnScreen()

        }
    }
}

ulWrapper.addEventListener('click', event => {
    
    const targetClicked = event.target

    if(targetClicked.dataset.delete) {
        deleteItem(event)
    }

    if(event.target.dataset.edit && !event.target.dataset.tempEdit) {
        editItem(event)
    }else if (event.target.dataset.tempEdit) {
        editTempItem(event)
    }  
})

loadMusicsButton.addEventListener('click', () => {
    if(savedMusics.length !== 0) {
        clearHTML(ulWrapper)
    }

    showItemsOnScreen()

})

searchTerm.addEventListener('input', () => {
    const ulWrapperChildren = [...ulWrapperChildren]
    ulWrapperChildren.forEach(item => {
        const searchTermToLowerCase = searchTerm.value.toLowerCase()
        if(!item.textContent.toLowerCase().includes(searchTermToLowerCase)) {
            item.style.display = 'none'
            return
        }
        item.style.display = 'block'
    })
})

randomCharactersButton.addEventListener('click', () => {
    musicName.value = generateId(8)
    artistName.value = generateId(8)
    releaseDate.value = generateId(4, '0123456789')
})