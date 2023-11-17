from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, validators, EmailField, FileField

class LoginForm(FlaskForm):
    email = EmailField('E-mail', [validators.DataRequired(), validators.Email()])
    password = PasswordField('Senha', [validators.DataRequired()])
    submit = SubmitField('Login')

class RegistrationForm(FlaskForm):

    def validate_profile_picture(form, field):
        if field.data:
            filename = field.data.filename
            allowed_extensions = {'png', 'jpg', 'jpeg'}
            if '.' not in filename or filename.rsplit('.', 1)[1].lower() not in allowed_extensions:
                raise validators.ValidationError('Apenas arquivos de imagem (png, jpg, jpeg) são permitidos.')

    username = StringField('Nome do usuário', [validators.DataRequired()])
    email = EmailField('E-mail', [validators.DataRequired(), validators.Email()])
    password = PasswordField('Senha', [validators.DataRequired(), validators.Length(min=6)])
    confirm_password = PasswordField('Confirmar Senha', [
        validators.DataRequired(),
        validators.EqualTo('password', message='As senhas devem ser iguais.')
    ])
    profile_picture = FileField('Foto de perfil', [validators.DataRequired(), validate_profile_picture])
    submit = SubmitField('Cadastrar')

class EditProfileForm(FlaskForm):
    username = StringField('Nome de usuário', [validators.DataRequired()])
    current_password = PasswordField('Senha atual', [validators.DataRequired()])
    password = PasswordField('Nova senha')
    confirm_password = PasswordField('Confirme a nova senha', [validators.EqualTo('password', message="As senhas devem ser iguais.")])
    profile_picture = FileField('Nova foto de perfil')
    submit = SubmitField('Save Changes')