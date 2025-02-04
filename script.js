$(document).ready(function () {
    const newPostButton = $('#new_post');
    const formContainer = $('#formContainer');
    const postsForm = $('#postForm');
    const postsTitle = $('#postTitle');
    const postsContent = $('#postContent');
    const postsList = $('#postsList');
    const submitBtn = $('#submitBtn');

    let isEditing = false;
    let currentPost = null;

    const posts = [
        {
            id: 1,
            title: 'Primer Post',
            content: 'Este es un post de flores.',
            image: 'uploads/flores.jpg',
            created_at: '2025-02-04 10:00:00'
        },
        {
            id: 2,
            title: 'Segundo Post',
            content: 'Post de gato.',
            image: 'uploads/gato.jpg',
            created_at: '2025-02-04 12:00:00'
        },
        {
            id: 3,
            title: 'Tercer Post',
            content: 'Post de perro.',
            image: 'uploads/perro.jpg',
            created_at: '2025-02-04 17:00:00'
        },
        {
            id: 4,
            title: 'Cuarto Post',
            content: 'Post de paisaje.',
            image: 'uploads/paisaje.jpg',
            created_at: '2025-02-04 19:00:00'
        }
    ];

    initEventListeners();
    loadPosts();
    initDialogs();

    function initEventListeners() {
        newPostButton.on('click', toggleForm);
        postsForm.on('submit', handleFormSubmit);
        $('#searchInput').on('input', searchPosts);
    }

    function toggleForm() {
        if (formContainer.is(':visible')) {
            formContainer.slideUp(500);
        } else {
            formContainer.slideDown(500);
            resetForm();
        }
    }

    function resetForm() {
        postsForm.trigger('reset');
        $('#postId').val('');
        submitBtn.text('Crear Publicación');
        isEditing = false;
        currentPost = null;
    }

    function initDialogs() {
        $("#dialog").dialog( { autoOpen: false, modal: true, show: { effect: "blind", duration: 500 }, hide: { effect: "blind", duration: 500 } });
    }

    function showDialog(message) {
        $('#dialogMessage').text(message);
        $('#dialog').dialog('open');
    }

    function showDeleteDialog(postId) {
        $("#dialog-confirm").dialog({
            resizable: false,
            height: "auto",
            width: 400,
            modal: true,
            buttons: {
                "Eliminar publicación": function () {
                    $(this).dialog("close");
                    deletePost(postId);
                },
                "Cancelar": function () {
                    $(this).dialog("close");
                }
            }
        });
    }

    function loadPosts() {
        $.ajax({
            url: 'get_posts.php',
            method: 'GET',
            success: function (data) {
                postsList.html(data).hide().fadeIn(1000);
                attachPostEvents();
            },
            error: function () {
                showDialog('Error al cargar las publicaciones.');
            }
        });
        postsList.empty();
        posts.forEach(post => {
            const postHtml = `
                <div class="post" data-id="${post.id}">
                    <h3>${post.title}</h3>
                    <p class="content">${post.content}</p>
                    ${post.image ? `<img src="${post.image}" class="post-image" alt="Imagen de la publicación">` : ''}
                    <br><br> <button class="edit-btn" class="animated-button"><span>Editar Post</span></button> 
                    <button class="delete-btn" class="animated-button"><span>Borrar Post</span></button> 
                    <p>${post.created_at}</p>
                </div>`;
            postsList.append(postHtml);
        });
    }

    function attachPostEvents() {
        postsList.off('click', '.edit-btn').on('click', '.edit-btn', function () {
            formContainer.slideDown(500);
            editPost($(this).closest('.post'));
        });

        postsList.off('click', '.delete-btn').on('click', '.delete-btn', function () {
            showDeleteDialog($(this).closest('.post').data('id'));
        });

        $('.post img').on('click', function () {
            $.fancybox.open({ src: $(this).attr('src'), type: 'image' });
        });
    }

    function editPost($postDiv) {
        isEditing = true;
        currentPost = $postDiv;
        postsTitle.val($postDiv.find('h3').text());
        postsContent.val($postDiv.find('.content').text());
        $('#postId').val($postDiv.data('id'));
        submitBtn.text('Actualizar Publicación');
    }

    function deletePost(postId) {
        $.ajax({
            url: 'delete_post.php',
            method: 'POST',
            data: { post_id: postId },
            success: function (response) {
                const data = JSON.parse(response);
                if (data.status === "success") {
                    showDialog("Publicación eliminada correctamente.");
                    loadPosts();
                } else {
                    showDialog("Error al eliminar la publicación.");
                }
            },
            error: function () {
                showDialog('Error al eliminar la publicación.');
            }
        });
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        const formData = new FormData(this);
        formData.append('post_id', $('#postId').val());

        $.ajax({
            url: 'save_post.php',
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                const data = JSON.parse(response);
                if (data.status === "success") {
                    showDialog("Publicación creada correctamente.");
                    resetForm();
                    loadPosts();
                } else {
                    showDialog("Error: " + data.message);
                }
            },
            error: function () {
                showDialog('Error al guardar la publicación.');
            }
        });
    }

    function searchPosts() {
        const searchTerm = $('#searchInput').val().toLowerCase();
        $('#postsList .post').each(function () {
            const title = $(this).find('h3').text().toLowerCase();
            $(this).toggle(title.includes(searchTerm));
        });
    }
});
