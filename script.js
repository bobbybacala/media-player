
// Global Variable

// we create a current song, so that only 1 audio can played at a time
// while a song is playing, and the user clicks on different song, the currentSong gets updated and its starts playing
let currentSong = new Audio()

// array of songs in an album
let songs

// html of unordered list for songs, contains list items for songs
let songsUL

// create a fillbar, which later becomes child of seekbar, which gets filled with white color as the song goes on
const seekbar = document.querySelector('.seekbar');
const fillbar = document.createElement('div')
fillbar.classList.add('fill-bar')
seekbar.appendChild(fillbar)

// create a variable for circle
let circle = document.querySelector('.circle')

// ________________________________________________________________________________________________________________

// function that formats the time, from seconds to 'minutes:seconds' format
function formatTime(seconds) {
    // Use Math.floor to round down the seconds to whole numbers
    seconds = Math.floor(seconds);

    // Calculate minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Pad minutes and seconds to always show two digits
    const minutesString = String(minutes).padStart(2, '0');
    const secondsString = String(remainingSeconds).padStart(2, '0');

    // Return formatted time
    return `${minutesString}:${secondsString}`;
}

// function that updates the circle in the seekbar in the playbar
// fills the seekbar with white color as songs goes on
function updateSeekbar(songPercent) {

    // to update the movement of the circle
    circle.style.left = `${songPercent}%`

    // to fill the seekbar, uptill how much the circle has travelled
    fillbar.style.width = `${songPercent}%`
}


console.log('Writing some script for Spotify')


// get the songs from the folder(folder is the album)
async function getSongs(folder) {

    // fetch the list the songs and print it
    let a = await fetch(`http://127.0.0.1:5500/songs/${folder}`)
    let response = await a.text();

    // console.log(response)

    // create a div for this response and get the songs from there
    let div = document.createElement('div')
    div.innerHTML = response

    // create an empty array for songs
    let songs = []

    // get all the <a>, anchor tag ElementInternals, since the links to the songs are there
    let all_a_s = div.getElementsByTagName('a')

    // run a for loop to check if the anchors tags are linked to the songs, if yes add the links to the song array
    for (let index = 0; index < all_a_s.length; index++) {
        const element = all_a_s[index]
        if (element.href.endsWith('.mp3')) {
            songs.push(element.href)
        }
    }

    return songs
}


// function to get the songs list in the my library section
async function getSonglist(songs) {
    // create a li for each song and display the songs in your library
    let songUL = document.getElementById('songlist')
    for (const song of songs) {
        // create an li for each songs
        // let songinlib = document.createElement('li')

        // get the song name, and clean by replacing %20
        let songfullName = song.substring(song.lastIndexOf('/') + 1, song.lastIndexOf('.mp3'))
        songfullName = songfullName.replaceAll("%20", " ")

        // to get the song name, split the name at '-'
        // everything after '-' is the song name, before is the song artist
        songfullName = songfullName.split('-')

        songName = songfullName[1].trim()
        songArtist = songfullName[0].trim()

        // we want to add songs to list
        songUL.innerHTML = songUL.innerHTML +
            `<li>
                            <img class="music-logo invert" src="music.svg" alt="">

                            <div class="info">
                                <div id="songname">${songName}</div>
                                <div id="songartist">${songArtist}</div>
                            </div>

                            <div class="playnow">
                                Play Now
                                <img class="invert" src="play.svg" alt="">
                            </div>
                        </li>`
    }

    return songUL
}

// function that constructs the song name, which takes a single list item as parameter
function constructName(songli) {
    let songname = songli.querySelector('#songname').innerHTML
    let songartist = songli.querySelector('#songartist').innerHTML
    let track = songartist + ' - ' + songname + '.mp3'

    return track
}

// function that plays the tracks
// play the initial song when no track is being played, and when user presses the play button
const playMusic = (track, folder, pause = false) => {
    // create an object of the audio class
    // let audio = new Audio(`/songs/` + track)

    // this ensures that the song gets updated, whenever the user clicks on a different song
    currentSong.src = `/songs/${folder}/` + track

    // when the song is played, the play svg changes to pause svg, and song name and song duration is displayed
    currentSong.play()
    play.src = 'pause.svg'

    // only want track name and artist name to be displayed on the playbar, chop of the '.mp3' part
    document.querySelector('.song-info').innerHTML = track.substring(0, track.length - 4)
    // document.querySelector('.song-time').innerHTML = '00:00 / 00:00'
}

// function to get the albums
async function getAlbums() {
    // get albums from the songs using fetch() API
    let b = await fetch('http://127.0.0.1:5500/songs/')
    let response_albums = await b.text()

    // create a div for this response and get the songs from there
    let div = document.createElement('div')
    div.innerHTML = response_albums
    // console.log(div)

    // create an array to return of all the albums
    albums = []

    // get all the anchor tags, as the album folders are linked by the anchor tag
    let ul_albums_a_s = div.getElementsByTagName('ul')
    let album_a_s
    Array.from(ul_albums_a_s).forEach(element => {
        album_a_s = element.getElementsByTagName('a')

    })

    // get all the href of the albums
    // console.log(album_a_s)
    Array.from(album_a_s).forEach(element => {
        // console.log(element.href)
        // if the end of href link is not with '/' than it is an Album, पुश it to albums array
        if (!(element.href.endsWith('/'))) {
            // extract just the name of the album and push it in the albums array
            albums.push(element.href.split('/').pop())
        }
    })

    // return the array of albums
    return albums
}

// function to build playlistcard and put in cardcontainer
async function getPlaylists(albums) {

    // get the card container and run a loop on all the albums in the albums array
    let cards = document.querySelector('.cardContainer')
    for (const album of albums) {

        // get the name of the album clean it and also trim it
        let albumName = album

        // also fetch the description and cover pic regarding the specific album
        let c = await fetch(`http://127.0.0.1:5500/songs/${album}/info.json`)
        c_response = await c.json()

        // album description ana album cover pic
        let album_desc = c_response.description
        let album_cover = c_response.cover

        albumName = albumName.replaceAll("%20", " ")


        // create cards for all the albums
        cards.innerHTML = cards.innerHTML + `<!-- a single playlist card -->
                    <div data-album="${albumName}" class="playListcard ">
                        <div class="card-img">
                            <img src="http://127.0.0.1:5500/songs/${album}/${album_cover}" alt="">
                            <div class="play">
                                <svg id="playlistPlay" role="img" aria-hidden="true" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="12" fill="#1ed760"></circle>
                                    <path
                                        d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"
                                        fill="black" transform="scale(0.6) translate(8, 8)"></path>
                                </svg>
                            </div>
                        </div>
                        <h3>${albumName}</h3>
                        <p>${album_desc}</p>
                    </div>`
    }

    // return the card Container div
    return cards
}


async function main() {
    // folder of the current album
    let folder

    // defining a track, initially is null, since no track is being played
    let track = ``

    let albums = await getAlbums()
    // console.log(albums)

    let albumsDiv = await getPlaylists(albums)
    // console.log(albumsDiv)

    // add an eventLIstener to each Spotify Playlist card
    let playlistCard = document.querySelector('.cardContainer')
    // console.log(playlistCard.children)
    Array.from(playlistCard.children).forEach(element => {
        element.addEventListener('click', async () => {
            folder = element.getAttribute('data-album')

            // console.log(`${folder} PLaylist Card clicked`)

            // clear the previous song list, if any album was selected
            songsUL = document.getElementById('songlist');
            songsUL.innerHTML = ''

            // once the folder is selected fetch the songs
            await fetchSongs()
        })
    })


    // function to fetch songs
    async function fetchSongs() {
        // if folder is selected, get the songs
        if (folder) {
            // console.log(folder)

            // get the songs
            songs = await getSongs(folder)
            // console.log(songs)

            // create the list of ths songs in the Your Library section
            songsUL = await getSonglist(songs)

            // and add event listeners on the song buttons (play, previous, next)
            play.addEventListener('click', () => {

                // base case: check whether a song is being played, if not play the first song in the album
                if (!(currentSong.src)) {
                    // get the first list item in the album, by using query selector, then construct the song name and play the music
                    const firstAlbumSong = document.querySelector('#songlist li')
                    track = constructName(firstAlbumSong)
                    playMusic(track, folder)

                } else {
                    // if the current song is paused, play it
                    // else pause it
                    if (currentSong.paused) {
                        // play the song and change the button to pause button
                        currentSong.play()
                        play.src = 'pause.svg'
                    } else {
                        currentSong.pause()
                        play.src = 'play.svg'
                    }
                }
            })

            // construct the songname, add event listeners to each list items, by running a for each loop on the 'ul' element children, 
            // play the song
            Array.from(songsUL.getElementsByTagName('li')).forEach(element => {
                // add an eventlistener to each song(list item) in the library
                element.addEventListener('click', () => {
                    console.log('clicked on a song')

                    // get the name of the song
                    track = constructName(element)

                    // play the music
                    playMusic(track, folder)
                })
            })
        } else {
            console.log('No Album Selected')
        }
    }


    // add an eventlistener to update the time of the song
    currentSong.addEventListener('timeupdate', () => {
        // just print the current songs, duration and currentTime, we need these 2 variables to calculate the distance travelled by the seekbar circle
        // console.log(currentSong.duration, currentSong.currentTime)

        // print how much percent the circle in the seekbar should as song is being played
        let songPercent = (currentSong.currentTime / currentSong.duration) * 100
        // console.log(currentSong.duration, currentSong.currentTime, songPercent)

        // update the position of the circle in the seekbar
        updateSeekbar(songPercent)

        // update the songtime in the playbar
        document.querySelector('.song-time').innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`

        // check if the song is finished or not, if yes, set the play svg again, as the song is finished and now paused
        // song will be finished when currenttime becomes the song duration
        if (currentSong.currentTime == currentSong.duration) {
            play.src = 'play.svg'
        }
    })

    // add an event listener for the seekbar, so that when user presses anywhere on the seekbar, the song would be skipped to that
    seekbar.addEventListener('click', ele => {
        // obj.getBoundingClientRect(): returns a DOMRect object providing information about the size of an element and its position relative to the viewport.
        // get the point of the seekbar where the user has clicked

        // formula to calculate at point where the click was made:
        // 1. get the object of bounding the seekbar
        // 2. remove the left attribute of bounding object from the X client of the ele we are working on, which is (seekbar)
        // 3. now we have the distance at which the click was made from the start of the seekbar, divide it by total length of the seekbar (its width)
        // mutiply by it 100 
        const rect = seekbar.getBoundingClientRect();
        console.log(rect)

        // Calculate the position where the click was made relative to the seekbar
        const clickX = ele.clientX - rect.left;

        // Calculate the percentage of where the click happened
        const clickPercent = (clickX / rect.width) * 100;

        // when the user clicks anywhere on the seekbar, the song jumps to that part
        currentSong.currentTime = (clickPercent / 100) * currentSong.duration

        // update the status of the seek ba
        updateSeekbar(clickPercent)
    })

    // add event listener to hamburger for responsiveness on small devices
    let hamb = document.querySelector('.hamburger')
    let left = document.querySelector('.left')
    hamb.addEventListener('click', () => {
        // make the left part appear on the screen, ie make its left position attribute 0
        left.style.left = 0
    })

    // similarly add an event listener to the cross on the left when it appears on small devices to close the left part
    let leftclose = document.querySelector('.close-left')
    leftclose.addEventListener('click', () => {
        // when clicked, again hide the left
        left.style.left = `-110%`
    })

    // add event listeners to preious button
    let currentSongIndex
    previous.addEventListener('click', () => {
        // logic to play the previous song:
        // 0. get the index of the current playing song
        // play the previous song logic:
        // 1. get the list item of the previous song, element.children, returns an HTML Collection (array)of all the children inside an element
        // 2. construct the song name
        // 3. Play the music

        currentSongIndex = songs.lastIndexOf(currentSong.src)

        // check if its the first song in the playlist, if yes, play the last song in the playlist, else decrement to the previous index and play that song
        if (currentSongIndex === 0) {
            currentSongIndex = songs.length - 1
        } else {
            currentSongIndex--
        }

        let prevSongli = songsUL.children[currentSongIndex]
        track = constructName(prevSongli)
        playMusic(track, folder)
    })

    // add event listeners to next button
    next.addEventListener('click', () => {
        // similar logic to previous button click, just play the next song

        // logic to play the next song:
        // 0. get the index of the current playing song
        // play the next song logic:
        // 1. get the list item of the next song, element.children, returns an HTML Collection (array)of all the children inside an element
        // 2. construct the song name
        // 3. Play the music

        currentSongIndex = songs.lastIndexOf(currentSong.src)

        // check if its the last song in the playlist, if yes, play the first song in the playlist, else increment to the next index and play that song
        if (currentSongIndex === songs.length - 1) {
            currentSongIndex = 0
        } else {
            currentSongIndex++
        }

        let nextSongli = songsUL.children[currentSongIndex]
        track = constructName(nextSongli)
        playMusic(track, folder)
    })

    // add an eventlistener to volume range
    volume.addEventListener('change', (ele) => {
        // console.log(ele.target, ele.target.value)
        currentSong.volume = parseInt(ele.target.value) / 100
    })

    // add an event listener to playlist play button
    // let playlistPlay = document.querySelectorAll('#playlistPlay')
    // // console.log(playlistPlay)
    // Array.from(playlistPlay).forEach(element => {
    //     element.addEventListener('click', async () => {
    //         console.log('Playlist Play button pressed')

    //         // get the folder name
    //         folder = element.getAttribute('data-album')

    //         // get the first song construct its name and start playing
    //         firstSongLi = songsUL.querySelector('li');

    //         // Construct the track name from the first song list item
    //         track = constructName(firstSongLi);

    //         // Play the first song
    //         playMusic(track, folder)
    //     })
    // })
}
// run the main function
main()
