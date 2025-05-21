<?php
header('Content-Type: application/json');
require_once 'config.php';

// Get JSON data from request body
$data = json_decode(file_get_contents('php://input'), true);

// Validate required fields
if (!isset($data['order_id']) || !isset($data['status'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Missing required fields (order_id, status)'
    ]);
    exit;
}

// Validate status value
$allowed_statuses = ['pending', 'processing', 'completed', 'cancelled'];
if (!in_array($data['status'], $allowed_statuses)) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid status value. Allowed values are: ' . implode(', ', $allowed_statuses)
    ]);
    exit;
}

try {
    // First check if the order exists
    $checkStmt = $pdo->prepare('SELECT id FROM orders WHERE id = ?');
    $checkStmt->execute([$data['order_id']]);
    
    if ($checkStmt->rowCount() === 0) {
        echo json_encode([
            'success' => false,
            'message' => 'Order not found'
        ]);
        exit;
    }

    // Update the order status
    $stmt = $pdo->prepare('UPDATE orders SET status = ? WHERE id = ?');
    $success = $stmt->execute([
        $data['status'],
        (int)$data['order_id'] // Ensure order_id is treated as integer
    ]);
    
    if ($success && $stmt->rowCount() > 0) {
        echo json_encode([
            'success' => true,
            'message' => 'Order status updated successfully'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'No changes made to order status'
        ]);
    }
} catch(PDOException $e) {
    error_log("Error in admin_update_order_status.php: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>