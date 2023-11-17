

var bufferAll = {}

function pfvSinc(){
    console.log(bufferAll)
    console.log(userAllContent)

    console.log('Sincronizando...')
    document.getElementById('syncBt').classList.add('disabled')
    document.getElementById('syncBt').onclick = function oncs(){}
    let parametro = JSON.stringify(userAllContent);
    setCloudStatus('WARN', "Sincronizando...", true)
    fetch(`/sync_server?data=${parametro}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        setCloudStatus('OK', "Sincronizado!", false)
        document.getElementById('syncBt').classList.remove('disabled')
        document.getElementById('syncBt').onclick = function oncs(){pfvSinc()}
    })
    .catch(error => {
        console.error('Erro:', error)
        setCloudStatus('ERR', error, false)
        document.getElementById('syncBt').classList.remove('disabled')
        document.getElementById('syncBt').onclick = function oncs(){pfvSinc()}
    });


}

function pfvSincAqui(){
    console.log(bufferAll)
    console.log(userAllContent)
    console.log('Carregando...')
    document.getElementById('syncBt').classList.add('hideElement')
    let parametro = JSON.stringify(userAllContent);
    setCloudStatus('', "Obtendo...", true)
    fetch('/sync_client', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        userAllContent = JSON.parse(data.data)
        saveAll()
        setCloudStatus('OK', "Pronto!", false)
        document.getElementById('syncBt').classList.remove('hideElement')
        loadAtStartup()
    })
    .catch(error => {
        console.error('Erro:', error)
        setCloudStatus('ERR', error, false)
        document.getElementById('syncBt').classList.remove('hideElement')
    });
}

function generatePublicLink(){
    console.log('Gerando...')
    document.getElementById('genLinkBt').classList.add('disabled')
    document.getElementById('genLinkBt').onclick = function oncs(){}
    document.getElementById('genPublicLinkStatusNAV').classList.remove('hideElement')

    hasKeyArea = document.getElementById('hasGendtKeyArea')
    hasNOKeyArea = document.getElementById('hasNOGendtKeyArea')
    keyInput = document.getElementById('gentdlinkText')


    genLinkStatus('', "Provisionando link...", true)
    fetch('/generate_link/' + espacoAtual, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        userAllContent[espacoAtual]['publiclink'] = data.link
        userAllContent[espacoAtual]['publickey'] = data.key
        genLinkStatus('OK', "Agora este espaço é público!", false)
        document.getElementById('genLinkBt').classList.remove('disabled')
        document.getElementById('genLinkBt').onclick = function oncs(){generatePublicLink()}
        keyInput.value = data.link
        hasKeyArea.classList.remove('hideElement')
        hasNOKeyArea.classList.add('hideElement')
        pfvSinc()
        saveAll()
    })
    .catch(error => {
        console.error('Erro:', error)
        genLinkStatus('ERR', error, false)
        document.getElementById('genLinkBt').classList.remove('disabled')
        document.getElementById('genLinkBt').onclick = function oncs(){generatePublicLink()}
    });
}

function copyPublicLinkToClipboard(){
    document.getElementById('genPublicLinkStatusNAV').classList.remove('hideElement')
    navigator.clipboard.writeText(userAllContent[espacoAtual]['publiclink'])
    genLinkStatus('OK', "Texto copiado para área de transferência!", false)
}

function turnPrivateAgain(){
    console.log('Apagando...')

    

    document.getElementById('genLinkBt').onclick = function oncs(){}
    document.getElementById('genPublicLinkStatusNAV').classList.remove('hideElement')

    hasKeyArea = document.getElementById('hasGendtKeyArea')
    hasNOKeyArea = document.getElementById('hasNOGendtKeyArea')
    keyInput = document.getElementById('gentdlinkText')


    genLinkStatus('', "Excluindo link...", true)
    fetch('/deletelink/' + userAllContent[espacoAtual]['publickey'], {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        delete userAllContent[espacoAtual]['publiclink']
        delete userAllContent[espacoAtual]['publickey']

        genLinkStatus('OK', "Este espaço agora é privado!", false)

        document.getElementById('genLinkBt').classList.remove('disabled')
        document.getElementById('genLinkBt').onclick = function oncs(){generatePublicLink()}
        keyInput.value = data.link
        hasKeyArea.classList.add('hideElement')
        hasNOKeyArea.classList.remove('hideElement')
        pfvSinc()
        saveAll()
    })
    .catch(error => {
        console.error('Erro:', error)
        genLinkStatus('ERR', error, false)
        document.getElementById('genLinkBt').classList.remove('disabled')
        document.getElementById('genLinkBt').onclick = function oncs(){generatePublicLink()}
    });
}

function logout(){
    userAllContent = {}
    saveAll()
    window.location.href = "/logout"
}