<?php
header('Content-Type: application/json');
require_once 'config.php';

try {
    $stmt = $pdo->query('
        SELECT o.*, u.name as customer_name 
        FROM orders o 
        JOIN users u ON o.user_id = u.id 
        ORDER BY o.id DESC
    ');
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Debugging: Log the orders to a file
    file_put_contents('debug_log.txt', print_r($orders, true), FILE_APPEND);

    echo json_encode($orders);
} catch(PDOException $e) {
    // Debugging: Log the error to a file
    file_put_contents('debug_log.txt', $e->getMessage(), FILE_APPEND);

    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>