<?php
header('Content-Type: application/json');
require_once 'config.php';

if (!isset($_GET['orderId'])) {
    echo json_encode(['success' => false, 'message' => 'Order ID is required']);
    exit();
}

try {
    // Get order details
    $stmt = $pdo->prepare('
        SELECT o.*, u.name as customer_name 
        FROM orders o 
        JOIN users u ON o.user_id = u.id 
        WHERE o.id = ?
    ');
    $stmt->execute([$_GET['orderId']]);
    $order = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$order) {
        echo json_encode(['success' => false, 'message' => 'Order not found']);
        exit();
    }

    // Get order items
    $stmt = $pdo->prepare('
        SELECT oi.*, m.name, m.image 
        FROM order_items oi 
        JOIN menu_items m ON oi.item_id = m.id 
        WHERE oi.order_id = ?
    ');
    $stmt->execute([$_GET['orderId']]);
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $order['items'] = $items;

    echo json_encode([
        'success' => true,
        'order' => $order
    ]);
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?> 