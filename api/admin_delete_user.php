<?php
header('Content-Type: application/json');
require_once 'config.php';

// Get the JSON data from the request
$data = json_decode(file_get_contents('php://input'), true);

// Validate that we have a user ID
if (!isset($data['id'])) {
    echo json_encode([
        'success' => false,
        'message' => 'User ID is required'
    ]);
    exit;
}

try {
    // First check if the user exists and is not an admin
    $stmt = $pdo->prepare('SELECT role FROM users WHERE id = ?');
    $stmt->execute([$data['id']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode([
            'success' => false,
            'message' => 'User not found'
        ]);
        exit;
    }

    if ($user['role'] === 'admin') {
        echo json_encode([
            'success' => false,
            'message' => 'Cannot delete admin users'
        ]);
        exit;
    }

    // Check if user has any orders
    $stmt = $pdo->prepare('SELECT COUNT(*) FROM orders WHERE user_id = ?');
    $stmt->execute([$data['id']]);
    $orderCount = $stmt->fetchColumn();

    if ($orderCount > 0) {
        echo json_encode([
            'success' => false,
            'message' => 'Cannot delete user with existing orders. Please delete their orders first or contact support.'
        ]);
        exit;
    }

    // Delete the user
    $stmt = $pdo->prepare('DELETE FROM users WHERE id = ?');
    $stmt->execute([$data['id']]);

    echo json_encode([
        'success' => true,
        'message' => 'User deleted successfully'
    ]);
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>