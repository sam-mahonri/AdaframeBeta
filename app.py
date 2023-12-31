from flask import Flask, render_template, redirect, url_for, session, flash, request, jsonify, send_file
from flask_wtf import CSRFProtect
from forms import LoginForm, RegistrationForm, EditProfileForm
import json
import base64
from services.preimage import preprocess_image
from services.init_redis import redis_client
from services.samenv import get
from services.genkey import gen_newkey
from collections import OrderedDict

app = Flask(__name__)
app.secret_key = get('PHYSALIS_KEY')
csrf = CSRFProtect(app)

# Página inicial
@app.route('/')
def index():
    username = None
    profile_picture = None

    if 'email' in session:
        email = session['email']
        user_data = redis_client.hgetall(email)
        username = user_data.get('username', 'Username não encontrado')
        profile_picture = user_data.get('profile_picture', None)

    return render_template('index.html', username=username, profile_picture=profile_picture)


# Página de login
@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()

    if form.validate_on_submit():
        email = form.email.data
        password = form.password.data

        # Verificar se o e-mail existe no Redis
        user_data = redis_client.hgetall(email)
        if user_data and user_data['password'] == password:
            session['email'] = email
            session['password'] = password
            return redirect(url_for('index'))

        flash('Credenciais inválidas. Tente novamente.', 'danger')

    return render_template('login_wtf.html', form=form)

# Página de cadastro
@app.route('/cadastro', methods=['GET', 'POST'])
def cadastro():
    form = RegistrationForm()

    if form.validate_on_submit():
        username = form.username.data
        email = form.email.data
        password = form.password.data

        # Verificar se o e-mail já existe no Redis
        if redis_client.exists(email):
            flash('E-mail já cadastrado. Escolha outro e-mail.', 'danger')
        else:
            # Lidar com o upload da foto de perfil e realizar o pré-processamento
            profile_picture = None
            if form.profile_picture.data:
                processed_image = preprocess_image(form.profile_picture.data)
                profile_picture = base64.b64encode(processed_image.read()).decode('utf-8')

            # Armazenar campos individuais no hash
            redis_client.hset(email, 'email', email)
            redis_client.hset(email, 'password', password)
            redis_client.hset(email, 'username', username)
            redis_client.hset(email, 'profile_picture', profile_picture)

            flash('Cadastro bem-sucedido! Faça login agora.', 'success')
            return redirect(url_for('login'))
    else:
        if request.method == "POST":
            flash('Hmm, parece que há algo errado neste formulário...', 'danger')

    return render_template('cadastro_wtf.html', form=form)

# Página de logout
@app.route('/logout')
def logout():
    session.pop('email', None)
    session.pop('password', None)
    return redirect(url_for('index'))

# Página de edição de perfil
@app.route('/editar_perfil', methods=['GET', 'POST'])
def editar_perfil():
    form = EditProfileForm()

    if 'email' not in session:
        return redirect(url_for('login'))

    email = session['email']
    user_data = redis_client.hgetall(email)
    
    if form.validate_on_submit():
        # Verificar a senha atual antes de permitir edições
        current_password = form.current_password.data
        if current_password != user_data.get('password'):
            flash('Senha atual incorreta. As alterações não foram salvas.', 'danger')
            return redirect(url_for('editar_perfil'))

        # Atualizar os dados do perfil
        redis_client.hset(email, 'username', form.username.data)

        # Atualizar a senha se uma nova senha foi fornecida
        new_password = form.password.data
        if new_password:
            redis_client.hset(email, 'password', new_password)

        # Lidar com o upload da nova foto de perfil
        if form.profile_picture.data:
            processed_image = preprocess_image(form.profile_picture.data)
            new_profile_picture = base64.b64encode(processed_image.read()).decode('utf-8')
            redis_client.hset(email, 'profile_picture', new_profile_picture)

        flash('Perfil atualizado com sucesso!', 'success')
        return redirect(url_for('editar_perfil'))
    else:
        if request.method == "POST":
            flash('Hmm, parece que há algo errado neste formulário...', 'danger')

    # Preencher o formulário com os dados atuais do perfil
    form.username.data = user_data.get('username', '')

    return render_template('editar_perfil.html', form=form, user_data=user_data)

@app.route('/frames', methods=['GET', 'POST'])
def frames_area():
    username = None
    profile_picture = None
    
    if 'email' in session:
        email = session['email']
        user_data = redis_client.hgetall(email)
        username = user_data.get('username', 'Username não encontrado')
        profile_picture = user_data.get('profile_picture', None)

    return render_template('frames.html', username=username, profile_picture=profile_picture)

@app.route('/sync_server', methods=['GET'])
def sync_server():
    if 'email' not in session:
        return redirect(url_for('login'))

    data_get = request.args.get('data', '')

    if len(data_get) > 12000:
        return jsonify({"ERROR":"Você excedeu o limite de espaço reservado para você!"})

    email = session['email']
    current_password = session.get('password', '')
    user_data = redis_client.hgetall(email)
    
    if current_password == user_data.get('password'):
        data_get = str(data_get)
        data_get = data_get

        redis_client.hset(email, 'spaces', str(data_get))
        return jsonify({"OK":"Sucesso ao enviar para o servidor!"})
    else:
        return jsonify({"ERROR":"Faça login novamente..."})

@app.route('/sync_client', methods=['GET'])
def sync_client():
    if 'email' not in session:
        return redirect(url_for('login'))

    email = session['email']
    current_password = session.get('password', '')
    user_data = redis_client.hgetall(email)

    if current_password == user_data.get('password'):
        saved_data = user_data.get("spaces", "{}")
        return jsonify({"OK": "Sucesso ao receber dados do servidor!", "data": saved_data})
    else:
        return jsonify({"ERROR":"Faça login novamente..."})

@app.route('/favicon.ico', methods=['GET'])
def getfavicon():
    return send_file('static/source/favicon.png')

@app.route('/generate_link/<spcname>', methods=['GET'])
def gen_link(spcname):
    if 'email' not in session:
        return redirect(url_for('login'))

    email = session['email']
    current_password = session.get('password', '')
    user_data = redis_client.hgetall(email)

    if current_password == user_data.get('password'):
        saved_data = user_data.get("spaces", "{}")
        json_space = json.loads(saved_data)
        space_con = json_space.get(spcname, 'ERROR')

        if space_con == 'ERROR':
            return jsonify({"ERROR":"Não há este espaço..."})

        linkassoc = session['email'] + "(&***&)" + spcname

        newkey = gen_newkey()

        redis_client.hset('public', newkey, linkassoc)

        the_link = get('PHYSALIS_URL') + 'space/' + newkey

        return jsonify({"OK": "Espaço obtido", "link":the_link, "key":newkey})
    else:
        return jsonify({"ERROR":"Faça login novamente..."})

@app.route('/space/<key>', methods=['GET'])
def get_public_space(key):
    publicAll = redis_client.hgetall('public')
    allcred = publicAll.get(key, 'ERROR')

    if allcred == "ERROR":
        return render_template('404.html', error="Este link de espaço público não existe..."), 404

    cred = allcred.split('(&***&)')

    emailProp = cred[0]
    spaceProp = cred[1]

    emailData = redis_client.hgetall(emailProp)
    user_data = redis_client.hgetall(emailProp)
    username = user_data.get('username', 'Username não encontrado')
    profile_picture = user_data.get('profile_picture', None)

    saved_data = emailData.get("spaces", "{}")
    json_space = json.loads(saved_data)
    space_con = json_space.get(spaceProp, 'ERROR')

    if space_con == 'ERROR':
        return render_template('404.html', error="O link deste espaço existe, mas parece que o espaço foi excluído..."), 404

    

    prSC = json.dumps(space_con, ensure_ascii=False)
    print(prSC)
    prSC = prSC.replace('\\n', '<br>')
    prSC = prSC.replace("\\'", "\u0027")
    seSC = json.loads(prSC)

    theoutput = OrderedDict()
    theoutput[spaceProp] = seSC

    outputs = json.dumps(theoutput)

    return render_template("frames_public.html", content=outputs, space=spaceProp, username=username, profile_picture=profile_picture)

@app.route('/deletelink/<key>', methods=['GET'])
def remove_link(key):
    if 'email' not in session:
        return jsonify({"ERROR":"Faça login novamente..."})
        #return redirect(url_for('login'))

    email = session['email']
    current_password = session.get('password', '')
    user_data = redis_client.hgetall(email)

    if current_password == user_data.get('password'):

        publicAll = redis_client.hgetall('public')
        allcred = publicAll.get(key, 'ERROR')

        cred = allcred.split('(&***&)')

        emailProp = cred[0]

        if email == emailProp:
            redis_client.hdel('public', str(key))
            return jsonify({"OK":"Chave excluída com êxito!"})
        else:
            return jsonify({"ERROR":"Você não tem permissão para excluir este link!"}), 429
    else:
        return jsonify({"ERROR":"Faça login novamente..."})

@app.errorhandler(404)
def notfound(error):
    return render_template('404.html')


if __name__ == '__main__':
    app.run(debug=True)

