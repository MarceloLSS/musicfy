document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault() // Evita o envio padrão do formulário

    const loginEmail = document.getElementById('loginEmail').value
    const loginSenha = document.getElementById('loginSenha').value

    const usuario = {
        emailUsuario: loginEmail,
        senhaUsuario: loginSenha
    }

    fetch('http://localhost:3000/usuarios/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuario)
    })
    .then(response => response.text())
    .then(message => {
        document.getElementById('loginMensagem').innerText = message
    })
})

//
