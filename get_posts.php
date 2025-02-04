<?php
$host = "localhost";
$user = "root";
$password = "";
$database = "red_social";

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
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
