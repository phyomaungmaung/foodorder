<?php
header('Content-Type: application/json');
require_once 'config.php';

try {
    $stmt = $pdo->query('SELECT * FROM menu_items ORDER BY name');
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($items);
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?> 