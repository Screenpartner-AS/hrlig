<?php
// File: includes/class-hrsc-role-setup.php

defined('ABSPATH') || exit;

class HRSC_Role_Setup
{

    public static function activate()
    {
        add_role(
            'hr_advisor',
            __('HR Advisor', 'hr-support-chat'),
            [
                'read' => true,
                'edit_support_case' => true,
                'read_support_case' => true,
                'delete_support_case' => true,
                'edit_support_cases' => true,
                'edit_others_support_cases' => true,
                'publish_support_cases' => true,
                'read_private_support_cases' => true,
                'delete_support_cases' => true,
                'delete_others_support_cases' => true,
                'delete_private_support_cases' => true,
                'delete_published_support_cases' => true,
                'edit_private_support_cases' => true,
                'edit_published_support_cases' => true,
                'upload_files' => true
            ]
        );

        // Also add capabilities to administrator
        $admin = get_role('administrator');
        if ($admin) {
            $caps = [
                'edit_support_case',
                'read_support_case',
                'delete_support_case',
                'edit_support_cases',
                'edit_others_support_cases',
                'publish_support_cases',
                'read_private_support_cases',
                'delete_support_cases',
                'delete_others_support_cases',
                'delete_private_support_cases',
                'delete_published_support_cases',
                'edit_private_support_cases',
                'edit_published_support_cases',
            ];

            foreach ($caps as $cap) {
                $admin->add_cap($cap);
            }
        }

        flush_rewrite_rules();
    }

    public static function deactivate()
    {
        remove_role('hr_advisor');
        flush_rewrite_rules();
    }

    public static function maybe_create_role()
    {
        if (!get_role('hr_advisor')) {
            self::activate();
        }
    }
}
