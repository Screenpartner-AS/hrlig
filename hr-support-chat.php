<?php
/**
 * Plugin Name: HR Support Chat
 * Description: A secure chat system for HR advisors and business employees using token-based authentication and modern React frontend.
 * Version: 1.0.0
 * Author: WP Plugin Architect
 * Author URI: https://chatgpt.com/g/g-6cqBCrKTn-wp-plugin-architect
 * Text Domain: hr-support-chat
 * Domain Path: /languages
 */

defined('ABSPATH') || exit;

define('HRSC_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('HRSC_PLUGIN_URL', plugin_dir_url(__FILE__));

// Autoload all includes
require_once HRSC_PLUGIN_DIR . 'includes/class-hrsc-support-case-cpt.php';
require_once HRSC_PLUGIN_DIR . 'includes/class-hrsc-role-setup.php';
require_once HRSC_PLUGIN_DIR . 'includes/class-hrsc-meta-boxes.php';
require_once HRSC_PLUGIN_DIR . 'includes/class-hrsc-settings-page.php';
require_once HRSC_PLUGIN_DIR . 'includes/class-hrsc-rest-api.php';

// Activation/Deactivation
register_activation_hook(__FILE__, ['HRSC_Role_Setup', 'activate']);
register_deactivation_hook(__FILE__, ['HRSC_Role_Setup', 'deactivate']);

// Initialize plugin
add_action('init', ['HRSC_Support_Case_CPT', 'register_post_type']);
add_action('init', ['HRSC_Role_Setup', 'maybe_create_role']);
add_action('add_meta_boxes', ['HRSC_Meta_Boxes', 'register_meta_boxes']);
add_action('save_post_support_case', ['HRSC_Meta_Boxes', 'save_meta_boxes']);
add_action('admin_menu', ['HRSC_Settings_Page', 'register_settings_page']);
add_action('admin_init', ['HRSC_Settings_Page', 'register_settings']);
add_action('rest_api_init', ['HRSC_REST_API', 'register_routes']);

add_action('wp_enqueue_scripts', function () {
    if (is_page_template('hrsc-page-support-chat.php')) {
        wp_enqueue_style(
            'hrsc-chat-styles',
            plugins_url('assets/js/build/index.css', __FILE__),
            [],
            '1.0.0'
        );
        wp_enqueue_script(
            'hrsc-chat-app',
            plugins_url('assets/js/build/index.js', __FILE__),
            ['wp-element'],
            '1.0.0',
            true
        );

        $current_user = wp_get_current_user();

        // Add REST URL + nonce
        wp_localize_script('hrsc-chat-app', 'hrscChatVars', [
            'restUrl' => esc_url_raw(rest_url('hrsc/v1')),
            'nonce' => wp_create_nonce('wp_rest')
        ]);

        // Add this:
        wp_set_script_translations('hrsc-chat-app', 'hr-support-chat', plugin_dir_path(__FILE__) . 'languages');
    }
});

add_action('hrsc_support_case_created_unassigned', 'hrsc_send_notification_email');

function hrsc_send_notification_email($post_id)
{
    $settings = get_option('hrsc_settings');
    if (empty($settings['notification_emails'])) {
        return;
    }

    $emails = array_map('sanitize_email', explode(',', $settings['notification_emails']));

    $subject = __('New Unassigned Support Case Created', 'hr-support-chat');
    $edit_link = admin_url('post.php?post=' . $post_id . '&action=edit');
    $message = sprintf(
        __("A new support case has been created and is currently unassigned.\n\nYou can view and assign it here:\n%s", 'hr-support-chat'),
        $edit_link
    );

    foreach ($emails as $email) {
        if (is_email($email)) {
            wp_mail($email, $subject, $message);
        }
    }
}


add_filter('theme_page_templates', 'hrsc_register_template_in_list');
add_filter('template_include', 'hrsc_load_plugin_template');

function hrsc_register_template_in_list($templates)
{
    $templates['hrsc-page-support-chat.php'] = __('HR Support Chat', 'hr-support-chat');
    return $templates;
}

function hrsc_load_plugin_template($template)
{
    if (is_page()) {
        $page_template = get_page_template_slug(get_queried_object_id());
        if ($page_template === 'hrsc-page-support-chat.php') {
            $plugin_template = HRSC_PLUGIN_DIR . 'templates/page-support-chat.php';
            if (file_exists($plugin_template)) {
                return $plugin_template;
            }
        }
    }
    return $template;
}
