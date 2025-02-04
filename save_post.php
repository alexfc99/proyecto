<?php
$host = "localhost";
$user = "root";
$password = "";
$database = "red_social";

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $_POST['title'];
    $content = $_POST['content'];
    $postId = isset($_POST['post_id']) ? $_POST['post_id'] : null;
    $image = null;

    if (!empty($_FILES['image']['name'])) {
        $uploadDir = 'uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $imageName = time() . '_' . basename($_FILES['image']['name']);
        $imagePath = $uploadDir . $imageName;

        if (move_uploaded_file($_FILES['image']['tmp_name'], $imagePath)) {
            $image = $imageName;
        } else {
            echo json_encode(["status" => "error", "message" => "Error al subir la imagen."]);
            exit;
        }
    }

    if ($postId) {
        $query = "UPDATE posts SET title = ?, content = ?, image = ? WHERE id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("sssi", $title, $content, $image, $postId);
    } else {
        $query = "INSERT INTO posts (title, content, image) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("sss", $title, $content, $image);
    }

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Publicación guardada correctamente."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error al guardar la publicación."]);
    }

    $stmt->close();
}

$conn->close();
?>
