<?php
header('Content-Type: application/json');
require_once 'config.php';

// Get JSON data from request body
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id']) || !isset($data['name'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Missing required fields'
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare('UPDATE users SET name = ?, phone = ? WHERE id = ?');
    $result = $stmt->execute([
        $data['name'],
        $data['phone'] ?? null,
        $data['id']
    ]);
    
    if ($result) {
        echo json_encode([
            'success' => true,
            'message' => 'Profile updated successfully'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to update profile'
        ]);
    }
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>