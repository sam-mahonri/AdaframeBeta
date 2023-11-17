import string
import random

def gen_newkey(tamanho=10):
    caracteres_permitidos = string.ascii_letters + string.digits
    return ''.join(random.choice(caracteres_permitidos) for _ in range(tamanho))
