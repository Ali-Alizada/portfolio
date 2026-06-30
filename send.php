<?php
header("Access-Control-Allow-Origin: https://aliaqa-alizada.de");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=utf-8");

$recipientEmail = "alimhd276@gmail.com";
$senderEmail = "kontakt@aliaqa-alizada.de";

switch ($_SERVER['REQUEST_METHOD']) {

    case 'OPTIONS':
        http_response_code(200);
        exit;

    case 'POST':
        $json = file_get_contents('php://input');
        $params = json_decode($json);

        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Invalid JSON']);
            exit;
        }

        $email = isset($params->email) ? trim($params->email) : '';
        $name = isset($params->name) ? trim($params->name) : '';
        $userMessage = isset($params->message) ? trim($params->message) : '';

        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen(preg_replace('/\s+/', '', $name)) < 3 || strlen(preg_replace('/\s+/', '', $userMessage)) < 5) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Invalid input data']);
            exit;
        }

        $safeName = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
        $safeEmail = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
        $safeMessage = nl2br(htmlspecialchars($userMessage, ENT_QUOTES, 'UTF-8'));

        $recipient = $recipientEmail;
        $subject = 'Website Contact Form';

        $mailBody = "
            <strong>Name:</strong> {$safeName}<br>
            <strong>Email:</strong> {$safeEmail}<br><br>
            <strong>Message:</strong><br>
            {$safeMessage}
        ";

        $replyToEmail = str_replace(["\r", "\n"], '', $email);
        $headers = [];
        $headers[] = 'MIME-Version: 1.0';
        $headers[] = 'Content-type: text/html; charset=utf-8';
        $headers[] = 'From: Website Kontakt <' . $senderEmail . '>';
        $headers[] = 'Reply-To: ' . $replyToEmail;
        $headers[] = 'Return-Path: ' . $senderEmail;

        if (!function_exists('mail')) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Mail function is not available']);
            exit;
        }

        $success = mail(
            $recipient,
            $subject,
            $mailBody,
            implode("\r\n", $headers),
            '-f ' . escapeshellarg($senderEmail)
        );

        if ($success) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Mail delivery failed']);
        }

        break;

    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'error' => 'Method not allowed']);
        exit;
}
