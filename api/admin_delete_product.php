<?php
header('Content-Type: application/json');
require_once 'config.php';

// Get JSON data from request body
$data = json_decode(file_get_contents('php://input'), true);

// Validate required fields
if (!isset($data['id'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Product ID is required'
    ]);
    exit;
}

try {
    // First check if the product exists
    $checkStmt = $pdo->prepare('SELECT id FROM menu_items WHERE id = ?');
    $checkStmt->execute([$data['id']]);
    
    if ($checkStmt->rowCount() === 0) {
        echo json_encode([
            'success' => false,
            'message' => 'Product not found'
        ]);
        exit;
    }

    // Delete the product
    $stmt = $pdo->prepare('DELETE FROM menu_items WHERE id = ?');
    $success = $stmt->execute([(int)$data['id']]);
    
    if ($success) {
        echo json_encode([
            'success' => true,
            'message' => 'Product deleted successfully'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to delete product'
        ]);
    }
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>