<?php
header('Content-Type: application/json');
require_once 'config.php';

// Get JSON data from request body
$data = json_decode(file_get_contents('php://input'), true);

// Validate required fields
if (!isset($data['id']) || !isset($data['name']) || !isset($data['price']) || !isset($data['category'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Missing required fields (id, name, price)'
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
            'message' => 'Menu item not found'
        ]);
        exit;
    }

    // Then update the product
    $stmt = $pdo->prepare('UPDATE menu_items SET 
        name = ?, 
        description = ?, 
        price = ?, 
        category = ?,
        image = ? 
        WHERE id = ?');
    
    $success = $stmt->execute([
        $data['name'],
        $data['description'] ?? null,
        (float)$data['price'],
        $data['category'] ?? null,
        $data['image'] ?? null,
        (int)$data['id'] // Ensure ID is treated as integer
    ]);
    
    if ($success && $stmt->rowCount() > 0) {
        echo json_encode([
            'success' => true,
            'message' => 'Menu item updated successfully'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'No changes made to menu item'
        ]);
    }
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>