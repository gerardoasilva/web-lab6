function displayComments() {
    $.ajax({
        type: "GET",
        url: "/blog-api/comentarios",
        dataType: "json",
        success: (response) => {
            $('#listaComentarios').empty();
            response.forEach(elemento => {

                $('#listaComentarios').append(`
                    <div class="card mb-2 rounded-lg border border-secondary">
                        <h3 class="card-header"> ${elemento.autor} </h3>
                        <div class="card-body">
                            <h5 class="card-title">${elemento.titulo}</h5>
                            <p class="card-text">${elemento.contenido}</p>
                            <p class="card-text text-right">Publicado el: ${elemento.fecha}</p>
                            <small class="text-muted">ID: ${elemento.id} </small>
                        </div>
                    </div>
                `);
            });
        },
        error: (err) => {
            console.log(err);
        }
    });
}

function watchFormAgregar() {
    $('#formAgregar').submit( (e) => { 
        e.preventDefault();
        
    });


}

function init() {
    displayComments();
}

init();