<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$baseDir = getenv('DATA_PATH') ?: dirname(__DIR__) . '/src/data';
$slug = isset($_GET['slug']) ? $_GET['slug'] : '';

if (empty($slug)) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing slug parameter']);
    exit;
}

$businessesFile = $baseDir . '/businesses/businesses.json';
$categoriesFile = $baseDir . '/categories/categories.json';

if (!file_exists($businessesFile)) {
    http_response_code(500);
    echo json_encode(['error' => 'Data file not found']);
    exit;
}

$businesses = json_decode(file_get_contents($businessesFile), true);
$categories = file_exists($categoriesFile) ? json_decode(file_get_contents($categoriesFile), true) : [];

$business = null;
foreach ($businesses as $b) {
    if ($b['slug'] === $slug) {
        $business = $b;
        break;
    }
}

if (!$business) {
    http_response_code(404);
    echo json_encode(['error' => 'Business not found']);
    exit;
}

$category = null;
foreach ($categories as $c) {
    if ($c['slug'] === $business['category']) {
        $category = $c;
        break;
    }
}

echo json_encode(['business' => $business, 'category' => $category]);
