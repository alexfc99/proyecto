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
