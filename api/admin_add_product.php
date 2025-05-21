<?php
header('Content-Type: application/json');
require_once 'config.php';

$data = json_decode(file_get_contents('php://input'), associative: true);

if (!isset($data['name']) || !isset($data['description']) || !isset($data['price']) || !isset($data['category']) || !isset($data['image'])) {
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit();
}

try {
    $stmt = $pdo->prepare('INSERT INTO menu_items (name, description, price, category, image) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute(params: [$data['name'], $data['description'], $data['price'], $data['category'], $data['image']]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Product added successfully'
    ]);
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>