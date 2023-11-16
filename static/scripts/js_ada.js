var espacoAtual = "Primeiro espaço"
var frameAtual = "Primeiro frame"
var mobile = false
var userAllContent = {
}
function openNewSpacePrompt() {
    document.getElementById('newSpacePromptTitle').classList.remove('hideElement');
    document.getElementById('newSpacePromptTitle').classList.add('openingAnimation')
}
function openNewFramePrompt() {
    document.getElementById('newFramePromptTitle').classList.remove('hideElement');
    document.getElementById('newFramePromptTitle').classList.add('openingAnimation');
}
function openNewPostPrompt(id) {
    currentPostId = id;
    document.getElementById('newPostPromptTitle').classList.remove('hideElement');
    document.getElementById('newPostPromptTitle').classList.add('openingAnimation');
}

var currentPostId = ''

function movePost(postId, toFrame, curFrame) {

    var thePost = document.getElementById(postId)
    var listTo = document.getElementById('SCR_$' + toFrame)
    var title = userAllContent[espacoAtual].frames[curFrame][postId.split("_$")[1]]["newTitle"] ?? postId.split("_$")[1]
    var descr = userAllContent[espacoAtual].frames[curFrame][postId.split("_$")[1]]['contentText']



    currentPostPath = [curFrame, postId.split("_$")[1]]
    currentPostId = "POSTCOMMANDS_" + curFrame + "_$" + postId.split("_$")[1]


    deletePost()

    setTimeout(() => {
        currentPostId = "_$" + toFrame
        novoPost(title, descr)
    }, 500);

    document.getElementById('moveAPost').classList.add('hideElement')

    const elemento = document.getElementById('FRAME_$' + toFrame);

    elemento.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });



}

function deleteSpace() {
    delete userAllContent[espacoAtual]
    var btTo = document.getElementById("SPACES_BUTTON__--__NAMEID_$" + espacoAtual)
    document.getElementById("spaceList").removeChild(btTo)
    if (Object.keys(userAllContent).length > 0) {
        espacoAtual = Object.keys(userAllContent)[0]
        loadFramesFromCurrentSpace()
    } else {
        document.getElementById('welcomeScreen').classList.remove('hideElement')
        document.getElementById('NAVRIGHT_Space').classList.remove('promptLatInfo')
        document.getElementById('NAVRIGHT_Space').classList.add('hideElement')
    }
    document.getElementById('spaceDeleteConfirmation').classList.add('hideElement');
    saveAll()
}

function openMenuMove(selfId) {
    var idCur = selfId.parentNode.parentNode.parentNode.id
    var listPost = document.getElementById('listPost')
    var popMove = document.getElementById('moveAPost')
    var curFrame = idCur.split('_')[1]
    console.log(curFrame)
    listPost.innerHTML = ''

    for (item in userAllContent[espacoAtual].frames) {
        if (item != curFrame) {

            const newSpace = document.createElement('button');

            newSpace.classList.add('pyBt');
            newSpace.classList.add('openingAnimation');
            newSpace.id = "MOVE_TO_FRAME__--__NAMEID_$" + item;
            let tof = item
            newSpace.onclick = function () {
                console.log(tof)
                movePost(idCur, tof, curFrame);

            };

            newSpace.innerHTML = "<i class='fa-solid fa-arrow-right'></i>" + item + "<i class='fa-solid fa-arrows-turn-to-dots'></i>"
            listPost.appendChild(newSpace)
        } else {
            const newSpace = document.createElement('button');
            newSpace.classList.add('disabled');
            newSpace.id = "MOVE_TO_FRAME__--__NAMEID_$" + item;

            newSpace.innerHTML = "<i class='fa-solid fa-flag-checkered'></i>Partindo de: " + item + "</button>"
            listPost.appendChild(newSpace)
        }

    }

    popMove.classList.add('openingAnimation')
    popMove.classList.remove('hideElement')
}

function novoFrame(nomeFrame) {
    if (!userAllContent[espacoAtual].frames.hasOwnProperty(nomeFrame) && !nomeFrame.includes("$") && !nomeFrame.includes("_") && !nomeFrame.includes("<") && !nomeFrame.includes(">") && !nomeFrame.includes("/") && nomeFrame.length < 15) {

        document.getElementById('newFramePromptTitle').classList.add('hideElement');
        document.getElementById('newFrameTitleText').value = '';

        const newFrame = document.createElement('div');
        const newFramePrompt = document.createElement('div');
        const newPostsScroll = document.createElement('div');
        const newFrameTitle = document.createElement('span');
        const newNewPost = document.createElement('button');

        newFrame.classList.add('postArea');
        newFrame.classList.add('openingAnimation')
        newFramePrompt.classList.add('promptPost');
        newFrameTitle.classList.add('frameTitle');
        newFrameTitle.innerHTML = nomeFrame;
        newNewPost.classList.add('pyBt');
        newNewPost.innerHTML = "Novo post <i class='fas fa-plus-circle'></i>"
        newPostsScroll.classList.add('verticalScroll');
        newPostsScroll.classList.add('hideElement');
        newPostsScroll.id = "SCR_$" + nomeFrame;
        newNewPost.id = "FRAME_$" + nomeFrame


        newNewPost.onclick = function () {
            openNewPostPrompt(this.id);
        };

        newFramePrompt.appendChild(newFrameTitle);
        newFramePrompt.appendChild(newNewPost);

        newFrame.appendChild(newFramePrompt);
        newFrame.appendChild(newPostsScroll);

        document.getElementById('framesArea').appendChild(newFrame);
        document.getElementById('theFrames').scrollTo(document.getElementById('theFrames').scrollWidth, 0);

        userAllContent[espacoAtual].frames[nomeFrame] = {}
    } else {

        document.getElementById('newFrameTitleText').classList.add('errorInput');
        setTimeout(() => {
            document.getElementById('newFrameTitleText').classList.remove('errorInput');
        }, 1000);
    }
    saveAll()
}



function loadFramesFromCurrentSpace() {
    document.getElementById('framesArea').innerHTML = "";
    document.getElementById('newFrameBtN').classList.remove('hideElement')
    document.getElementById('NAVRIGHT_Space').classList.remove('hideElement')
    document.getElementById('NAVRIGHT_Space').classList.add('promptLatInfo')

    if (mobile) {
        lateralNavState = [false, false]
        lateralOpen(document.getElementById('navBtLeft'))
        lateralOpen(document.getElementById('navBtRight'))
    }


    var theBt = document.getElementById("SPACES_BUTTON__--__NAMEID_$" + espacoAtual)
    resetActiveBt()
    theBt.classList.add('pyBt')
    theBt.classList.remove('discretBt')

    for (i in userAllContent[espacoAtual].frames) {



        const newFrame = document.createElement('div');
        const newFramePrompt = document.createElement('div');
        const newFrameTitle = document.createElement('span');
        const newPostsScroll = document.createElement('div');
        const newNewPost = document.createElement('button');

        newFrame.classList.add('postArea');
        newFrame.classList.add('openingAnimation')
        newFramePrompt.classList.add('promptPost');
        newFrameTitle.classList.add('frameTitle');
        newFrameTitle.innerHTML = i;
        newNewPost.classList.add('pyBt');
        newNewPost.innerHTML = "Novo post <i class='fas fa-plus-circle'></i>"
        newPostsScroll.classList.add('verticalScroll');
        newPostsScroll.classList.add('hideElement');
        newPostsScroll.id = "SCR_$" + i
        newNewPost.id = "FRAME_$" + i
        newNewPost.onclick = function () {
            openNewPostPrompt(this.id);
        };




        newFramePrompt.appendChild(newFrameTitle);
        newFramePrompt.appendChild(newNewPost);


        newFrame.appendChild(newFramePrompt);
        newFrame.appendChild(newPostsScroll);

        document.getElementById('framesArea').appendChild(newFrame);
        document.getElementById('theFrames').scrollTo(document.getElementById('theFrames').scrollWidth, 0);

        for (j in userAllContent[espacoAtual].frames[i]) {

            newPostsScroll.classList.remove('hideElement');
            var title = j;
            var descr = userAllContent[espacoAtual].frames[i][j]['contentText'];

            if (userAllContent[espacoAtual].frames[i][j].hasOwnProperty("newTitle")) {
                title = userAllContent[espacoAtual].frames[i][j]['newTitle']
            }

            const newPost = document.createElement('div');
            newPost.classList.add('post');
            newPost.classList.add('openingAnimation');
            newPost.id = "POST_" + i + "_$" + j;

            var titleCommands =
                "<div class='postCommands' id='" + "POSTCOMMANDS_" + i + "_$" + j + "'>" +
                "<button class='iconButtons' onclick='" + "openDeletePostConfirmation(this)" + "'title='Excluir post'>" +
                "<i class='fas fa-trash-alt'></i></button>" +
                "<button class='iconButtons' onclick='" + "openEditPost(this)" + "'title='Editar post'>" +
                "<i class='far fa-edit'></i></button>" +
                "<button class='iconButtons' onclick='" + "copyPostToClipboard(this)" + "'title='Copiar conteúdo do post'>" +
                "<i class='far fa-copy'></i></button>" +
                "<button class='iconButtons' onclick='" + "openMenuMove(this)" + "'title='Mover post'>" +
                "<i class='fa-solid fa-arrows-left-right'></i>" +
                "</div>"

            const newPostTitle = document.createElement('div');
            newPostTitle.classList.add('titlePost');
            newPostTitle.id = "POSTTITLE_" + i + "_$" + j;
            newPostTitle.innerHTML = title + titleCommands;



            const newPostContext = document.createElement('div');
            newPostContext.classList.add('text');
            newPostContext.id = "POSTDESCR_" + i + "_$" + j
            newPostContext.innerHTML = descr.replace(/\n/g, '<br>');

            newPost.appendChild(newPostTitle);
            newPost.appendChild(newPostContext);

            document.getElementById('SCR_$' + i).appendChild(newPost);
        }

    };

}

function novoPost(title, descr) {
    var selfName = currentPostId.split('$')[1];
    var err_form = 0;

    if (userAllContent[espacoAtual].frames[selfName].hasOwnProperty(title) || title.includes("$") || title.includes("_") || title.includes("<") || title.includes(">") || title.includes("/") || title.length > 15) {
        err_form++
        document.getElementById('newPostTitleText').classList.add('errorInput');
        setTimeout(() => {
            document.getElementById('newPostTitleText').classList.remove('errorInput');
        }, 1000);
    }

    if (descr.includes('<') || descr.includes('>')) {
        err_form++
        document.getElementById('newPostDescrText').classList.add('errorInput');
        setTimeout(() => {
            document.getElementById('newPostDescrText').classList.remove('errorInput');
        }, 1000);
    }

    if (err_form == 0) {
        const newPost = document.createElement('div');
        newPost.classList.add('post');
        newPost.classList.add('openingAnimation');
        newPost.id = "POST_" + selfName + "_$" + title;

        var titleCommands =
            "<div class='postCommands' id='" + "POSTCOMMANDS_" + selfName + "_$" + title + "'>" +
            "<button class='iconButtons' onclick='" + "openDeletePostConfirmation(this)" + "'title='Excluir post'>" +
            "<i class='fas fa-trash-alt'></i></button>" +
            "<button class='iconButtons' onclick='" + "openEditPost(this)" + "'title='Editar post'>" +
            "<i class='far fa-edit'></i></button>" +
            "<button class='iconButtons' onclick='" + "copyPostToClipboard(this);" + "'title='Copiar conteúdo do post'>" +
            "<i class='far fa-copy'></i></button>" +
            "<button class='iconButtons' onclick='" + "openMenuMove(this)" + "'title='Mover post'>" +
            "<i class='fa-solid fa-arrows-left-right'></i>" +
            "</div>"


        const newPostTitle = document.createElement('div');
        newPostTitle.classList.add('titlePost');
        newPostTitle.id = "POSTTITLE_" + selfName + "_$" + title;
        newPostTitle.innerHTML = title + titleCommands;

        const newPostContext = document.createElement('div');
        newPostContext.classList.add('text');
        newPostContext.id = "POSTDESCR_" + selfName + "_$" + title
        newPostContext.innerHTML = descr.replace(/\n/g, '<br>');

        newPost.appendChild(newPostTitle);
        newPost.appendChild(newPostContext);

        document.getElementById('SCR_$' + selfName).insertBefore(newPost, document.getElementById('SCR_$' + selfName).childNodes[0])
        document.getElementById('SCR_$' + selfName).classList.remove('hideElement');
        userAllContent[espacoAtual].frames[selfName][title] = { "contentText": descr }
        document.getElementById('newPostPromptTitle').classList.add('hideElement');
        document.getElementById('newPostTitleText').value = '';
        document.getElementById('newPostDescrText').value = '';
    }
    saveAll()
}

function selectSpace(selfId) {
    var selfName = selfId.split('$')[1];
    document.getElementById('navBarSpaceTitle').innerHTML = " •   " + selfName;
    espacoAtual = selfName
    loadFramesFromCurrentSpace();
}

function copyPostToClipboard(self) {
    currentPostPath = [self.parentNode.id.split('_')[1], self.parentNode.id.split('$')[1]]
    navigator.clipboard.writeText(userAllContent[espacoAtual].frames[currentPostPath[0]][currentPostPath[1]]['contentText'])
    self.innerHTML = "<i class='fas fa-check-circle'></i>"
    setTimeout(() => {
        self.innerHTML = "<i class='far fa-copy'></i>"
    }, 1000);
}

function novoEspaco(nomeEspaco) {

    if (!userAllContent.hasOwnProperty(nomeEspaco) && !nomeEspaco.includes("$") && !nomeEspaco.includes("_") && !nomeEspaco.includes("<") && !nomeEspaco.includes(">") && !nomeEspaco.includes("/") && nomeEspaco.length < 15) {

        userAllContent[nomeEspaco] = { "frames": {} }
        espacoAtual = nomeEspaco

        document.getElementById('navBarSpaceTitle').innerHTML = " •   " + nomeEspaco;

        const newSpace = document.createElement('button');
        newSpace.classList.add('discretBt');
        newSpace.classList.add('openingAnimation');
        newSpace.id = "SPACES_BUTTON__--__NAMEID_$" + nomeEspaco;
        newSpace.onclick = function () {
            selectSpace(this.id);
        };
        newSpace.innerHTML = nomeEspaco + "<i class='fas fa-calendar-week'></i>"

        document.getElementById('spaceList').insertBefore(newSpace, document.getElementById('spaceList').childNodes[0]);
        document.getElementById('theFrames').classList.remove('hideElement');
        document.getElementById('welcomeScreen').classList.add('hideElement');
        document.getElementById('newSpacePromptTitle').classList.add('hideElement');
        document.getElementById('newSpaceTitleText').value = '';
        loadFramesFromCurrentSpace();
    } else {
        document.getElementById('newSpaceTitleText').classList.add('errorInput');
        setTimeout(() => {
            document.getElementById('newSpaceTitleText').classList.remove('errorInput');
        }, 1000);
    }

    saveAll()

}

var currentPostPath

function openDeletePostConfirmation(self) {
    document.getElementById('postDeleteConfirmation').classList.remove('hideElement');
    document.getElementById('postDeleteConfirmation').classList.add('openingAnimation');
    currentPostPath = [self.parentNode.id.split('_')[1], self.parentNode.id.split('$')[1]]
    currentPostId = self.parentNode.id
}

function openDeleteSpaceConfirmation() {
    document.getElementById('spaceDeleteConfirmation').classList.remove('hideElement');
    document.getElementById('spaceDeleteConfirmation').classList.add('openingAnimation');
}
function openEditPost(self) {
    document.getElementById('editPost').classList.remove('hideElement');
    document.getElementById('editPost').classList.add('openingAnimation');
    currentPostPath = [self.parentNode.id.split('_')[1], self.parentNode.id.split('$')[1]]
    currentPostId = self.parentNode.id

    if (userAllContent[espacoAtual].frames[currentPostPath[0]][currentPostPath[1]].hasOwnProperty('newTitle')) {
        document.getElementById('editPostTitleText').value = userAllContent[espacoAtual].frames[currentPostPath[0]][currentPostPath[1]]['newTitle']
    } else {
        document.getElementById('editPostTitleText').value = (document.getElementById("POSTTITLE_" + currentPostPath[0] + "_$" + currentPostPath[1]).innerHTML).split('<')[0]
    }
    document.getElementById('editPostDescrText').value = userAllContent[espacoAtual].frames[currentPostPath[0]][currentPostPath[1]]['contentText']
    saveAll()
}
function deletePost() {
    delete userAllContent[espacoAtual].frames[currentPostPath[0]][currentPostPath[1]]
    document.getElementById('postDeleteConfirmation').classList.add('hideElement');
    document.getElementById(currentPostId).parentNode.parentNode.classList.add('deleteAnim');
    setTimeout(() => {
        if (Object.keys(userAllContent[espacoAtual].frames[currentPostPath[0]]).length === 0) {
            document.getElementById('SCR_$' + currentPostPath[0]).classList.add('hideElement');
        }
        document.getElementById('SCR_$' + currentPostPath[0]).removeChild(document.getElementById(currentPostId).parentNode.parentNode)
    }, 300);
    saveAll()
}

function editPost(title, text) {
    var err_form = 0
    if (text.includes("<") || text.includes(">")) {
        document.getElementById('editPostDescrText').classList.add('errorInput');
        setTimeout(() => {
            document.getElementById('editPostDescrText').classList.remove('errorInput');
        }, 1000);
        err_form++
    }
    if (title.includes("$") || title.includes("_") || title.includes("<") || title.includes(">") || title.includes("/")) {
        document.getElementById('editPostTitleText').classList.add('errorInput');
        setTimeout(() => {
            document.getElementById('editPostTitleText').classList.remove('errorInput');
        }, 1000);
        err_form++
    }
    if (err_form == 0) {
        userAllContent[espacoAtual].frames[currentPostPath[0]][currentPostPath[1]]['contentText'] = text
        userAllContent[espacoAtual].frames[currentPostPath[0]][currentPostPath[1]]['newTitle'] = title
        document.getElementById('editPost').classList.add('hideElement');
        document.getElementById("POSTTITLE_" + currentPostPath[0] + "_$" + currentPostPath[1]).innerHTML = userAllContent[espacoAtual].frames[currentPostPath[0]][currentPostPath[1]]['newTitle'] +
            "<div class='postCommands' id='" + "POSTCOMMANDS_" + currentPostPath[0] + "_$" + currentPostPath[1] + "'>" +
            "<button class='iconButtons' onclick='" + "openDeletePostConfirmation(this)" + "'title='Excluir post'>" +
            "<i class='fas fa-trash-alt'></i></button>" +
            "<button class='iconButtons' onclick='" + "openEditPost(this)" + "'title='Editar post'>" +
            "<i class='far fa-edit'></i></button>" +
            "<button class='iconButtons' onclick='" + "copyPostToClipboard(this);" + "'title='Copiar conteúdo do post'>" +
            "<i class='far fa-copy'></i></button>" +
            "<button class='iconButtons' onclick='" + "openMenuMove(this)" + "'title='Mover post'>" +
            "<i class='fa-solid fa-arrows-left-right'></i>" +
            "</div>"
        document.getElementById("POSTTITLE_" + currentPostPath[0] + "_$" + currentPostPath[1]).classList.add('changeMood');
        document.getElementById("POSTDESCR_" + currentPostPath[0] + "_$" + currentPostPath[1]).innerHTML = userAllContent[espacoAtual].frames[currentPostPath[0]][currentPostPath[1]]['contentText'].replace(/\n/g, '<br>')
        document.getElementById("POSTDESCR_" + currentPostPath[0] + "_$" + currentPostPath[1]).classList.add('changeMood');
        setTimeout(() => {
            document.getElementById("POSTTITLE_" + currentPostPath[0] + "_$" + currentPostPath[1]).classList.remove('changeMood');
            document.getElementById("POSTDESCR_" + currentPostPath[0] + "_$" + currentPostPath[1]).classList.remove('changeMood');
        }, 1000);
    }
    saveAll()
}
function closeLateral(self) {
    if (self.parentNode.previousElementSibling.id == "lateralLeftNavComp") {
        self.parentNode.classList.add('toLeftAnim');
    } else if (self.parentNode.previousElementSibling.id == "lateralRightNavComp") {
        self.parentNode.classList.add('toRightAnim');
    }

    self.parentNode.previousElementSibling.classList.add('lateralNavUncomp');
}
var lateralNavState = [false, false]
function lateralOpen(self) {
    if (self.id == "navBtLeft") {
        if (lateralNavState[0]) {
            lateralNavState[0] = false;
            self.innerHTML = "<i class='fas fa-chevron-left'></i>" +
                "<i class='fas fa-calendar-alt'></i>"
            document.getElementById('lateralLeftNavComp').classList.remove('lateralNavUncomp');
            document.getElementById('lateralLeftNavComp').nextElementSibling.classList.remove('toLeftAnim');
            document.getElementById('lateralLeftNavComp').nextElementSibling.classList.add('fromLeftAnim');
        } else {
            self.innerHTML = "<i class='fas fa-calendar-alt'></i>" +
                "<i class='fas fa-chevron-right'></i>"
            lateralNavState[0] = true;
            document.getElementById('lateralLeftNavComp').classList.add('lateralNavUncomp');
            document.getElementById('lateralLeftNavComp').nextElementSibling.classList.add('toLeftAnim');
        }
    } else if (self.id == "navBtRight") {
        if (lateralNavState[1]) {
            self.innerHTML = "<i class='fas fa-cog'></i>" +
                "<i class='fas fa-chevron-right'></i>"
            lateralNavState[1] = false;
            document.getElementById('lateralRightNavComp').classList.remove('lateralNavUncomp');
            document.getElementById('lateralRightNavComp').nextElementSibling.classList.remove('toRightAnim');
            document.getElementById('lateralRightNavComp').nextElementSibling.classList.add('fromRightAnim');
        } else {
            self.innerHTML = "<i class='fas fa-chevron-left'></i>" +
                "<i class='fas fa-cog'></i>"
            lateralNavState[1] = true;
            document.getElementById('lateralRightNavComp').classList.add('lateralNavUncomp');
            document.getElementById('lateralRightNavComp').nextElementSibling.classList.add('toRightAnim');
        }
    }
}
function loadAtStartup() {

    if (getAllPrev() == "OK") {
        document.getElementById('mblocal').innerHTML = calcularTamanhoEmMB(JSON.stringify(userAllContent)).toFixed(2) + "/10mb"
        if (Object.keys(userAllContent).length != 0) {
            document.getElementById('theFrames').classList.remove('hideElement');
            document.getElementById('welcomeScreen').classList.add('hideElement');
            document.getElementById('newSpacePromptTitle').classList.add('hideElement');
        }
        for (item in userAllContent) {
            var nomeEspaco = item

            const newSpace = document.createElement('button');
            newSpace.classList.add('discretBt');
            newSpace.classList.add('openingAnimation');
            newSpace.id = "SPACES_BUTTON__--__NAMEID_$" + nomeEspaco;
            newSpace.onclick = function () {
                selectSpace(this.id);
            };
            newSpace.innerHTML = nomeEspaco + "<i class='fas fa-calendar-week'></i>"

            document.getElementById('spaceList').insertBefore(newSpace, document.getElementById('spaceList').childNodes[0]);
        }
    } else {
        setLocalStatus("ERR", "Nada salvo")
    }
}
function resetActiveBt() {
    for (item in userAllContent) {
        var bt = document.getElementById("SPACES_BUTTON__--__NAMEID_$" + item)
        bt.classList.remove('pyBt')
        bt.classList.add('discretBt')
    }
}
function getAllPrev() {
    try {
        const objetoRecuperado = JSON.parse(localStorage.getItem('AdaframeLocal'));
        if (Object.keys(objetoRecuperado).length === 0) {
            setLocalStatus("WARN", "Nada foi salvo")
        }
        userAllContent = objetoRecuperado
        return "OK"
    } catch {
        setLocalStatus("WARN", "Nada salvo")
        return "ERR"
    }
}
function objetoParaString(obj, nivel = 0) {
    const espacos = '  '.repeat(nivel);
    let resultado = '';

    if (Array.isArray(obj)) {
        if (obj.length === 0) {
            return '[]';
        }
        resultado += '[\n';
        for (let i = 0; i < obj.length; i++) {
            resultado += `${espacos}  ${objetoParaString(obj[i], nivel + 1)}`;
            if (i < obj.length - 1) {
                resultado += ',';
            }
            resultado += '\n';
        }
        resultado += `${espacos}]`;
    } else if (typeof obj === 'object') {
        const chaves = Object.keys(obj);
        if (chaves.length === 0) {
            return '{}';
        }
        resultado += '{\n';
        for (let i = 0; i < chaves.length; i++) {
            const chave = chaves[i];
            resultado += `${espacos}  "${chave}": ${objetoParaString(obj[chave], nivel + 1)}`;
            if (i < chaves.length - 1) {
                resultado += ',';
            }
            resultado += '\n';
        }
        resultado += `${espacos}}`;
    } else if (typeof obj === 'string') {
        resultado += `"${obj}"`;
    } else {
        resultado += obj;
    }
    return resultado;
}
function saveAll() {
    localStorage.setItem('AdaframeLocal', JSON.stringify(userAllContent));
    setLocalStatus("OK", "Tudo salvo")
}
function calcularTamanhoEmMB(str) {
    const tamanhoEmBytes = new TextEncoder().encode(str).length;
    const tamanhoEmMB = tamanhoEmBytes / (1024 * 1024);
    return tamanhoEmMB;
}
function setLocalStatus(type, message) {
    var status = document.getElementById('localStatusNAV')
    status.innerHTML = message + '<i class="fa-solid fa-hard-drive"></i>'
    status.classList.remove('okInfo')
    status.classList.remove('warnInfo')
    status.classList.remove('errorInfo')
    if (type == "OK") {
        status.classList.add('okInfo')
    } else if (type == "WARN") {
        status.classList.add('warnInfo')
    } else if (type == "ERR") {
        status.classList.add('errorInfo')
    }
}
function verificarTamanhoDaTela() {
    const larguraDaTela = window.innerWidth;
    const limiteParaDispositivoMovel = 768;
    mobile = larguraDaTela <= limiteParaDispositivoMovel
    if (mobile) {
        lateralNavState = [false, false]
        lateralOpen(document.getElementById('navBtLeft'))
        lateralOpen(document.getElementById('navBtRight'))
    }
}
window.addEventListener('resize', verificarTamanhoDaTela);
verificarTamanhoDaTela();