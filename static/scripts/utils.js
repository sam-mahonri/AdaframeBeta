document.getElementById('fileInput').addEventListener('change', function (e) {
    var allowedExtensions = ['png', 'jpg', 'jpeg'];
    var fileInput = e.target;
    var fileName = fileInput.files[0].name;
    var fileExtension = fileName.split('.').pop().toLowerCase();

    if (allowedExtensions.indexOf(fileExtension) === -1) {
        alert('Apenas arquivos de imagem (png, jpg, jpeg) são permitidos.');
        // Limpa o campo de arquivo para evitar o envio de arquivos não permitidos
        fileInput.value = '';
        return;
    }

    document.getElementById('fileName').textContent = fileName;

    var previewImage = document.getElementById('previewImage');
    var file = fileInput.files[0];

    if (file) {
        previewImage.classList.remove('hideElement');
        var reader = new FileReader();

        reader.onload = function (e) {
            previewImage.src = e.target.result;
        };

        reader.readAsDataURL(file);
    } else {
        previewImage.classList.add('hideElement');
        previewImage.src = ""; // Limpa a visualização se nenhum arquivo for selecionado
    }
});