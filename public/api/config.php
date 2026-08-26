<?php
/**
 * Lone Wolf Dumpsters LLC - Server-Side Configuration
 * Namecheap cPanel Shared Hosting
 * 
 * IMPORTANT: This file is protected from public browser access by .htaccess.
 */

return [
    // Recipient email for lead notifications
    'notification_email' => 'lonewolfdumpsters@gmail.com',
    'from_email' => 'noreply@lonewolfdumpsters.com',
    'from_name' => 'Lone Wolf Dumpsters Website',

    // SMS Notifications Settings
    // Sends an instant text message to Wayne's cell phone for every new quote request
    'sms_notifications' => [
        'enabled' => true,
        // Wayne's phone carrier email-to-sms gateway (defaulting to AT&T/Verizon/T-Mobile gateways or custom SMS webhook)
        // Common examples: 2148760321@txt.att.net, 2148760321@vtext.com, 2148760321@tmomail.net
        'phone_number' => '2148760321',
        'sms_gateways' => [
            '2148760321@txt.att.net',
            '2148760321@vtext.com',
            '2148760321@tmomail.net',
        ],
        // Optional: Twilio / Plivo Webhook URL (if using external SMS provider)
        'webhook_url' => '',
    ],

    // Password to access the Intake Admin Panel (/admin/)
    // Change this to whatever password Wayne prefers
    'admin_password' => 'LoneWolf2026!',

    // Optional: SMTP Configuration (Leave use_smtp = false to use native cPanel PHP mail)
    'smtp' => [
        'use_smtp' => false,
        'host' => 'mail.lonewolfdumpsters.com',
        'port' => 465,
        'secure' => 'ssl', // 'ssl' or 'tls'
        'username' => '',
        'password' => '',
    ],

    // Optional: MySQL / MariaDB Database Storage (cPanel MySQL Database)
    // Leave enabled = false for initial launch (emails + file log will handle leads)
    'database' => [
        'enabled' => false,
        'host' => 'localhost',
        'dbname' => 'lonewolf_leads',
        'username' => '',
        'password' => '',
        'table' => 'quote_requests',
    ],
];
