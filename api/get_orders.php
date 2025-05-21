<?php
header('Content-Type: application/json');
require_once 'config.php';

if (!isset($_GET['userId'])) {
    echo json_encode([
        'success' => false,
        'message' => 'User ID is required'
    ]);
    exit;
}

try {
    // Get orders with their items
    $stmt = $pdo->prepare('
        SELECT o.*, 
               JSON_ARRAYAGG(
                   JSON_OBJECT(
                       "id", oi.id,
                       "name", m.name,
                       "price", oi.price,
                       "quantity", oi.quantity,
                       "category", m.category
                   )
               ) as items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN menu_items m ON oi.item_id = m.id -- Updated column name
        WHERE o.user_id = ?
        GROUP BY o.id
        ORDER BY o.created_at DESC
    ');
    $stmt->execute([$_GET['userId']]);
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Process the orders to parse the JSON items
    foreach ($orders as &$order) {
        $order['items'] = json_decode($order['items'], true);
        // Calculate total if not already set
        if (!isset($order['total'])) {
            $order['total'] = array_reduce($order['items'], function($sum, $item) {
                return $sum + ($item['price'] * $item['quantity']);
            }, 0);
        }
    }
    
    echo json_encode($orders);
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>