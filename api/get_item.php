<?php
header('Content-Type: application/json');
require_once 'config.php';

if (!isset($_GET['id'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Item ID is required'
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare('SELECT * FROM menu_items WHERE id = ?');
    $stmt->execute([$_GET['id']]);
    $item = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$item) {
        echo json_encode([
            'success' => false,
            'message' => 'Item not found'
        ]);
        exit;
    }
    
    echo json_encode($item);
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?> 