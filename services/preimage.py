from PIL import Image
from io import BytesIO

def preprocess_image(file_storage):
    # Abrir a imagem usando o Pillow
    image = Image.open(file_storage)

    # Converter para modo RGB se for RGBA (imagem com canal alfa) >>>>>> CASO SEJA CONVERTIDA EM JPEG
    #if image.mode == 'RGBA':
    #    image = image.convert('RGB')

    # Recortar ao centro em um quadrado 1:1
    width, height = image.size
    size = min(width, height)
    left = (width - size) // 2
    top = (height - size) // 2
    right = (width + size) // 2
    bottom = (height + size) // 2
    image = image.crop((left, top, right, bottom))

    # Redimensionar para 256x256
    image = image.resize((256, 256))

    # Salvar a imagem em um buffer
    buffer = BytesIO()
    image.save(buffer, format="PNG")
    buffer.seek(0)

    return buffer
