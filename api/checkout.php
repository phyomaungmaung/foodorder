<?php
header('Content-Type: application/json');
require_once 'config.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['userId']) || !isset($data['items']) || empty($data['items'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid order data']);
    exit();
}

try {
    $pdo->beginTransaction();

    // Create order
    $stmt = $pdo->prepare('INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, "pending")');
    $total = array_reduce($data['items'], function($sum, $item) {
        return $sum + ($item['price'] * $item['quantity']);
    }, 0);
    $stmt->execute([$data['userId'], $total]);
    $orderId = $pdo->lastInsertId();

    // Add order items
    $stmt = $pdo->prepare('INSERT INTO order_items (order_id, item_id, quantity, price) VALUES (?, ?, ?, ?)');
    foreach ($data['items'] as $item) {
        $stmt->execute([$orderId, $item['id'], $item['quantity'], $item['price']]);
    }

    $pdo->commit();

    echo json_encode([
        'success' => true,
        'orderId' => $orderId,
        'message' => 'Order placed successfully'
    ]);
} catch(PDOException $e) {
    $pdo->rollBack();
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?> 