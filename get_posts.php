<?php
$host = "localhost";
$user = "root";
$password = "";
$database = "red_social";

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}
$posts = [
    [
        'id' => 1,
        'title' => 'Primer Post',
        'content' => 'Este es un post de flores .',
        'image' => 'uploads/flores.jpg',
        'created_at' => '2025-02-04 10:00:00'
    ],
    [
        'id' => 2,
        'title' => 'Segundo Post',
        'content' => 'Post de gato.',
        'image' => 'uploads/gato.jpg',
        'created_at' => '2025-02-04 12:00:00'
    ],
    [
    'id' => 3,
    'title' => 'Tercer Post',
    'content' => 'Post de perro.',
    'image' => 'uploads/perro.jpg',
    'created_at' => '2025-02-04 17:00:00'
    ],
    [
        'id' => 4,
        'title' => 'Cuarto Post',
        'content' => 'Post de paisaje.',
        'image' => 'uploads/paisaje.jpg',
        'created_at' => '2025-02-04 19:00:00'
    ]
];

foreach ($posts as $post) {
    echo '
        <div class="post" data-id="' . $post['id'] . '">
            <h3>' . htmlspecialchars($post['title']) . '</h3>
            <p class="content">' . htmlspecialchars($post['content']) . '</p>';

    if ($post['image']) {
        echo '<img src="' . htmlspecialchars($post['image']) . '" class="post-image" alt="Imagen de la publicación">';
    }
    echo '
           <br><br> <button class="edit-btn" class="animated-button"><span>Editar Post</span><span></span></button> <button class="delete-btn" class="animated-button"><span>Borrar Post</span><span></span></button> <p>'. htmlspecialchars($post['created_at']) . '</p>
        </div>';
}

$sql = "SELECT * FROM posts ORDER BY created_at DESC";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        echo '
        <div class="post" data-id="' . $row['id'] . '">
            <h3>' . htmlspecialchars($row['title']) . '</h3>
            <p class="content">' . htmlspecialchars($row['content']) . '</p>';

        if ($row['image']) {
            echo '<img src="uploads/' . htmlspecialchars($row['image']) . '" class="post-image" alt="Imagen de la publicación">';
        }
        echo '
           <br><br> <button class="edit-btn" class="animated-button"><span>Editar Post</span><span></span></button> <button class="delete-btn" class="animated-button"><span>Borrar Post</span><span></span></button> <p>'. htmlspecialchars($row['created_at']) . '</p>
        </div>';
    }
} else {
    echo '<p>No hay publicaciones aún.</p>';
}

$conn->close();
?>
