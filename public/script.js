/* 
-   samvad version-(1.0.0)
-   File: /public/script.js
*/

try {

    console.log('script is active')

    let login = document.getElementById('login')

    let member_list = document.getElementById('member_list')
    
    let reciever = document.getElementById('reciever')
    
    let main = document.getElementById('root')

    let logout = document.getElementById('logout')

    /* Socket.io */

    const SOCKET = io()
    
    let client = {}
    
    let members = []

    window.addEventListener("load", function () {

        let isExist = localStorage.getItem(`client-${client.name}`)

        if (isExist) {

            client = JSON.parse(isExist)

            login.style.display = 'none'
            main.style.display = 'grid'
            
            logout.innerText = client.room
            
            SOCKET.emit('login', client)   
        }
    })

    /* login */
    
    let username_field = document.getElementById('name_field')
    let userroom_field = document.getElementById('room_field')

    document.getElementById('login_btn').onclick = function () {

        if (username_field.value.trim() == '' || /\s/.test(username_field.value.trim())) {
            console.log('~ online name required unique or without space!')
            return
        }
        client.name = username_field.value.trim()

        if (userroom_field.value.trim() == '') 
        {
            client.room = 'public'
        } 
        else 
        {
            client.room = userroom_field.value.trim() 
        }
        localStorage.setItem(`client-${client.name}`, client)

        login.style.display = 'none'
        main.style.display = 'grid'
        
        logout.innerText = client.room
        
        SOCKET.emit('login', client)
    }

    /* logout */

    logout.onclick = function () {

        SOCKET.emit("logout", client.name)

        client = {}

        logout.innerText = 'LOGOUT'

        login.style.display = 'block'
        main.style.display = 'none'
        reciever.innerHTML = ''
        member_list.innerHTML = ''

        localStorage.removeItem(`client-${client.name}`)
    }

    /* clock */

    let clock = document.getElementById('current_clock')

    function timeStamp(full=false) {

        return (full)? Date() : Date().slice(0,24)
    }

    setInterval(() => {
        
        clock.innerHTML = timeStamp(true)
        
    }, 1000);

    /* network status */

    let network = document.getElementById('network')

    
    if (navigator.onLine) {
        network.innerText = `[ONLINE]`
        network.style.color = 'var(--green3)'
    }

    window.addEventListener('offline', () => {
        
        network.innerText = '[OFFLINE]'
        network.style.color = 'var(--red3)'
    })

    window.addEventListener('online', () => {

        network.innerText = '[ONLINE]'
        network.style.color = 'var(--green3)'
    })

    /* recieve function : handle response */

    function recieve(response) {

        let element = document.createElement('div')

        element.innerHTML = `$ <span> ${response.sender} </span> | <time> (${timeStamp()}) </time> <p> ${response.msg || response.data} <p>`

        if (client.name === response.sender) {
            
            element.classList.add('message')
            
        } else {
            
            let theme = 'theme' + (Math.floor(Math.random() * 4) + 1).toString()
            
            element.classList.add('message', theme)
        }
        reciever.appendChild(element)
    }

    /* beforeChat */

    SOCKET.on("beforeChat", (response) => {

        response.forEach((chat) => recieve(chat))
    })
    
    /* response */

    SOCKET.on("message", (response) => recieve(response))

    /* request */

    let request_field = document.getElementById('request_field')

    document.getElementById('send_btn').addEventListener('click', function (element) {

        if (request_field.value) {

            SOCKET.emit("message", {
                sender : client.name,
                msg : request_field.value
            })
            request_field.value = ''
        }
    })

    document.getElementsByClassName('member').forEach((element) => {

        console.log(element)
    })

    /* members */

    SOCKET.on("members", (response) => {

        members = response
        
        console.log(members)

        member_list.innerHTML = ''
        
        response.forEach((member) => {
            
            let element = document.createElement('a')

            element.innerHTML = `<span class="status">${member.isOnline? '+' : '-'}</span> ${member.name}`

            element.classList.add('member')

            member_list.append(element)
        })
    })

    /* connection */

    SOCKET.on("connect", () => {

        // success if connected

        let element = document.createElement('div')

        element.innerHTML = `~ connect Socket.io id is ${SOCKET.id}`

        element.classList.add('message')

        reciever.append(element)

        console.log(`connect SOCKET.io id is ${SOCKET.id}`)
    })

} catch (err)  {

    console.log(err)
}
/* Developed by Mayank | ( https://github.com/MayankDevil/ ) */