

var bufferAll = {}

function pfvSinc(){
    console.log(bufferAll)
    console.log(userAllContent)

    console.log('Sincronizando...')
    document.getElementById('syncBt').classList.add('hideElement')
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
        document.getElementById('syncBt').classList.remove('hideElement')
    })
    .catch(error => {
        console.error('Erro:', error)
        setCloudStatus('ERR', error, false)
        document.getElementById('syncBt').classList.remove('hideElement')
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

setInterval(() => {

    pfvSinc()

}, 10000);

function logout(){
    userAllContent = {}
    saveAll()
    window.location.href = "/logout"
}