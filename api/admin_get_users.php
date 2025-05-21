<?php
header('Content-Type: application/json');
require_once 'config.php';

try {
    $stmt = $pdo->query('SELECT id, name, email, role FROM users WHERE role != "admin" ORDER BY name');
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($users);
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?> 