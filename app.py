from flask import Flask, render_template, redirect, url_for, session, flash
from flask_wtf import CSRFProtect
from forms import LoginForm, RegistrationForm, EditProfileForm

import base64
from services.preimage import preprocess_image
from services.init_redis import redis_client
from services.samenv import get

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

    return render_template('cadastro_wtf.html', form=form)

# Página de logout
@app.route('/logout')
def logout():
    session.pop('email', None)
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

if __name__ == '__main__':
    app.run(debug=True)

