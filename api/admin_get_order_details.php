<?php
header('Content-Type: application/json');
require_once 'config.php';

// Enable error logging but don't display errors
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', 'php_errors.log');

try {
    // Validate input
    $order_id = isset($_GET['id']) ? intval($_GET['id']) : null;
    
    if (!$order_id) {
        throw new Exception('Order ID is required');
    }

    // Get order details with proper error handling
    $order_query = "
        SELECT o.*, u.name as customer_name, u.phone, u.address as delivery_address
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        WHERE o.id = :order_id
    ";
    
    $stmt = $pdo->prepare($order_query);
    if (!$stmt) {
        throw new Exception('Failed to prepare order query: ' . implode(' ', $pdo->errorInfo()));
    }
    
    $stmt->execute(['order_id' => $order_id]);
    $order = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$order) {
        throw new Exception('Order not found');
    }

    // Get order items with proper error handling - updated to use menu_items table
    $items_query = "
        SELECT oi.*, m.name, m.price
        FROM order_items oi
        LEFT JOIN menu_items m ON oi.item_id = m.id
        WHERE oi.order_id = :order_id
    ";
    
    $stmt = $pdo->prepare($items_query);
    if (!$stmt) {
        throw new Exception('Failed to prepare items query: ' . implode(' ', $pdo->errorInfo()));
    }
    
    $stmt->execute(['order_id' => $order_id]);
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Build response
    $response = [
        'success' => true,
        'id' => $order['id'],
        'status' => $order['status'],
        'items' => $items,
        'total_amount' => $order['total_amount'],
        'created_at' => $order['created_at']
    ];

    // Add optional fields if they exist
    if (!empty($order['customer_name'])) {
        $response['customer_name'] = $order['customer_name'];
    }
    if (!empty($order['delivery_address'])) {
        $response['delivery_address'] = $order['delivery_address'];
    }
    if (!empty($order['phone'])) {
        $response['phone'] = $order['phone'];
    }

    // Ensure all values are properly encoded
    $response = array_map(function($value) {
        if (is_string($value)) {
            return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
        }
        return $value;
    }, $response);

    echo json_encode($response);

} catch (Exception $e) {
    error_log("Error in admin_get_order_details.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred while fetching order details: ' . $e->getMessage()
    ]);
}
?>