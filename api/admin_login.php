<?php
header('Content-Type: application/json');
require_once 'config.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['email']) || !isset($data['password'])) {
    echo json_encode(['success' => false, 'message' => 'Email and password are required']);
    exit();
}

try {
    $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ? AND role = "admin"');
    $stmt->execute([$data['email']]);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($admin && password_verify($data['password'], $admin['password'])) {
        unset($admin['password']); // Remove password from response
        echo json_encode([
            'success' => true,
            'admin' => $admin
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Invalid email or password'
        ]);
    }
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>