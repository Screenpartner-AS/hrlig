<?php
// File: includes/class-hrsc-settings-page.php

defined('ABSPATH') || exit;

class HRSC_Settings_Page
{

    public static function register_settings_page()
    {
        add_options_page(
            __('HR Support Chat Settings', 'hr-support-chat'),
            __('HR Support Chat', 'hr-support-chat'),
            'manage_options',
            'hrsc-settings',
            [self::class, 'render_settings_page']
        );
    }

    public static function render_settings_page()
    {
        ?>
        <div class="wrap">
            <h1><?php esc_html_e('HR Support Chat Settings', 'hr-support-chat'); ?></h1>
            <form action="options.php" method="post">
                <?php
                settings_fields('hrsc_settings_group');
                do_settings_sections('hrsc-settings');
                submit_button(__('Save Settings', 'hr-support-chat'));
                ?>
            </form>
        </div>
        <?php
    }

    public static function register_settings()
    {
        register_setting('hrsc_settings_group', 'hrsc_settings', [
            'sanitize_callback' => [self::class, 'sanitize_settings'],
        ]);

        add_settings_section(
            'hrsc_general_section',
            __('General Settings', 'hr-support-chat'),
            null,
            'hrsc-settings'
        );

        add_settings_field(
            'notification_emails',
            __('Notification Emails', 'hr-support-chat'),
            [self::class, 'notification_emails_field'],
            'hrsc-settings',
            'hrsc_general_section'
        );

        add_settings_field(
            'rate_limit',
            __('Rate Limit (messages per minute)', 'hr-support-chat'),
            [self::class, 'rate_limit_field'],
            'hrsc-settings',
            'hrsc_general_section'
        );

        add_settings_field(
            'honeypot_field',
            __('Honeypot Field Name', 'hr-support-chat'),
            [self::class, 'honeypot_field_field'],
            'hrsc-settings',
            'hrsc_general_section'
        );
    }

    public static function sanitize_settings($input)
    {
        return [
            'notification_emails' => sanitize_text_field($input['notification_emails'] ?? ''),
            'rate_limit' => intval($input['rate_limit'] ?? 5),
            'honeypot_field' => sanitize_text_field($input['honeypot_field'] ?? 'website'),
        ];
    }

    public static function notification_emails_field()
    {
        $options = get_option('hrsc_settings');
        ?>
        <input type="text" name="hrsc_settings[notification_emails]"
            value="<?php echo esc_attr($options['notification_emails'] ?? ''); ?>" style="width:400px;">
        <p class="description"><?php esc_html_e('Comma-separated list of emails.', 'hr-support-chat'); ?></p>
        <?php
    }

    public static function rate_limit_field()
    {
        $options = get_option('hrsc_settings');
        ?>
        <input type="number" name="hrsc_settings[rate_limit]" value="<?php echo esc_attr($options['rate_limit'] ?? 5); ?>"
            min="1">
        <p class="description"><?php esc_html_e('Maximum number of messages allowed per minute.', 'hr-support-chat'); ?></p>
        <?php
    }

    public static function honeypot_field_field()
    {
        $options = get_option('hrsc_settings');
        ?>
        <input type="text" name="hrsc_settings[honeypot_field]"
            value="<?php echo esc_attr($options['honeypot_field'] ?? 'website'); ?>">
        <p class="description"><?php esc_html_e('Hidden field name to trap bots.', 'hr-support-chat'); ?></p>
        <?php
    }
}
