from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, validators, EmailField, FileField

class LoginForm(FlaskForm):
    email = EmailField('E-mail', [validators.DataRequired(), validators.Email()])
    password = PasswordField('Senha', [validators.DataRequired()])
    submit = SubmitField('Login')

class RegistrationForm(FlaskForm):
    username = StringField('Nome do usuário', [validators.DataRequired()])
    email = EmailField('E-mail', [validators.DataRequired(), validators.Email()])
    password = PasswordField('Senha', [validators.DataRequired(), validators.Length(min=6)])
    confirm_password = PasswordField('Confirmar Senha', [
        validators.DataRequired(),
        validators.EqualTo('password', message='As senhas devem ser iguais.')
    ])
    profile_picture = FileField('Profile Picture')
    submit = SubmitField('Cadastrar')

class EditProfileForm(FlaskForm):
    username = StringField('Username', [validators.DataRequired()])
    current_password = PasswordField('Senha atual', [validators.DataRequired()])
    password = PasswordField('Nova senha')
    confirm_password = PasswordField('Confirme a nova senha', [validators.EqualTo('password')])
    profile_picture = FileField('Profile Picture')
    submit = SubmitField('Save Changes')